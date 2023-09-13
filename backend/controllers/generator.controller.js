const AWS = require("aws-sdk");
var request = require("request");
const { PrismaClient } = require("@prisma/client");
const { getUserObjectHelper } = require("./user.controller");
const prisma = new PrismaClient();
const { tryCatch } = require("../utils/tryCatch");
const { v4: uuidv4 } = require("uuid");

//dynamo client instantiation
//Note temp using a local only setup
//access and secret keys still need "Applied"
//but they can be nonsense
const client = new AWS.DynamoDB.DocumentClient({
  endpoint: process.env.DYNAMO_DB_ENDPOINT,
  region: process.env.DYNAMO_DB_REGION,
  accessKeyId: process.env.DYNAMO_DB_ACCESS_KEY,
  secretAccessKey: process.env.DYNAMO_DB_SECRET_ACCESS_KEY,
});

const getAllGenerators = tryCatch(async (req, res) => {
  let userObject = await getUserObjectHelper(req.auth.payload.sub);
  const generators = await prisma.Generator.findMany({
    where: {
      orginizationId: userObject.orginizationId,
    },
  });

  res.send(generators);
});

const getAllGeneratorsPublic = tryCatch(async (req, res) => {
  const { memberID } = req.params;

  //get user whos portal is being used
  const member = await prisma.member.findUnique({
    where: {
      id: memberID,
    },
  });
  const generators = await prisma.generator.findMany({
    where: {
      orginizationId: member.orginizationId,
    },
    select: {
      name: true,
      id: true,
      pointValue: true,
    },
  });

  res.send(generators);
});

const addGeneratorTransactionPublic = tryCatch(async (req, res) => {
  const { code, member_id, generator_id } = req.body;

  //First get the generator using selected ID
  let generator = await prisma.generator.findUnique({
    where: {
      id: generator_id,
    },
  });

  //get member from member id
  const member = await prisma.member.findUnique({
    where: {
      id: member_id,
    },
  });

  //try to get partner using the code provided
  let partner = await prisma.partner.findUnique({
    where: {
      code: code,
    },
  });
  if (!partner) throw Error("Partner not found with code: " + code);

  //If the entered code matches partner code add a transaction for this member
  let newTransaction = await prisma.Transaction.create({
    data: {
      pointValue: generator.pointValue,
      generatorId: generator.id,
      memberId: member.id,
      partnerId: partner.id,
      transactionTypeId: "950c8df8-401b-43b7-8f99-6ef6099d7ca2",
    },
  });

  //update user account balance
  const updateMember = await prisma.member.update({
    where: {
      id: member_id,
    },
    data: {
      accountBalance: member.accountBalance + newTransaction.pointValue,
    },
  });

  res.status(200).json(newTransaction);
});

const addGenerator = tryCatch(async (req, res) => {
  let userObject = await getUserObjectHelper(req.auth.payload.sub);
  var body = req.body;
  const { name, pointValue } = req.body;

  const newGenerator = await prisma.generator.create({
    data: {
      name: name,
      pointValue: body.pointValue,
      orginizationId: userObject.orginizationId,
    },
  });
  res.status(200).json(newGenerator);
});

module.exports = {
  getAllGenerators,
  getAllGeneratorsPublic,
  addGeneratorTransactionPublic,
  addGenerator,
};
