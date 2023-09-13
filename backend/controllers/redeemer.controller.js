const AWS = require("aws-sdk");
var request = require("request");
const { PrismaClient } = require("@prisma/client");
const { getUserObjectHelper } = require("./user.controller");
const prisma = new PrismaClient();
const { v4: uuidv4 } = require("uuid");
const { tryCatch } = require("../utils/tryCatch");

const getAllRedeemers = tryCatch(async (req, res) => {
  let userObject = await getUserObjectHelper(req.auth.payload.sub);
  const redeemers = await prisma.redeemer.findMany({
    where: {
      orginizationId: userObject.orginizationId,
    },
  });
  res.send(redeemers);
});

const getAllRedeemersPublic = tryCatch(async (req, res) => {
  const { memberID } = req.params;

  //get user whos portal is being used
  const member = await prisma.member.findUnique({
    where: {
      id: memberID,
    },
  });
  const redeemers = await prisma.redeemer.findMany({
    where: {
      orginizationId: member.orginizationId,
    },
    select: {
      name: true,
      id: true,
      pointValue: true,
    },
  });

  res.send(redeemers);
});

const addRedeemerTransactionPublic = tryCatch(async (req, res) => {
  const { code, member_id, redeemer_id } = req.body;

  //First get the redeemer using selected ID
  let redeemer = await prisma.redeemer.findUnique({
    where: {
      id: redeemer_id,
    },
  });

  //get member from member id
  let member = await prisma.member.findUnique({
    where: {
      id: member_id,
    },
  });

  //try to get partner using the code provided
  let partner = null;

  //Check that code entered equals generator code
  partner = await prisma.partner.findUnique({
    where: {
      code: code,
    },
  });

  //get partner from ID to validated code
  if (!partner) throw Error("invalid_code");

  //Ensure the member has sufficient funds
  if (redeemer.pointValue > member.accountBalance)
    throw Error("insufficient_funds");
  //If the entered code matches partner code add a transaction for this member
  let newTransaction = await prisma.Transaction.create({
    data: {
      pointValue: redeemer.pointValue,
      redeemerId: redeemer.id,
      memberId: member.id,
      partnerId: partner.id,
      transactionTypeId: "d5cc64d6-a7ff-495b-aaa9-b5f77ed73bfe",
    },
  });

  //update user account balance
  const updateMember = await prisma.member.update({
    where: {
      id: member_id,
    },
    data: {
      accountBalance: member.accountBalance - newTransaction.pointValue,
    },
  });

  res.status(200).json(newTransaction);
});

const addRedeemer = tryCatch(async (req, res) => {
  let userObject = await getUserObjectHelper(req.auth.payload.sub);
  var body = req.body;
  const { name, pointValue } = req.body;

  const newRedeemer = await prisma.redeemer.create({
    data: {
      name: name,
      pointValue: body.pointValue,
      orginizationId: userObject.orginizationId,
    },
  });
  res.status(200).json(newRedeemer);
});

module.exports = {
  getAllRedeemers,
  addRedeemerTransactionPublic,
  getAllRedeemersPublic,
  addRedeemer,
};
