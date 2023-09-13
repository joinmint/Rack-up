const AWS = require("aws-sdk");
var request = require("request");
const { PrismaClient } = require("@prisma/client");
const { getUserObjectHelper } = require("./user.controller");
const { tryCatch } = require("../utils/tryCatch");
const prisma = new PrismaClient();
const { v4: uuidv4 } = require("uuid");

const getAllParnters = tryCatch(async (req, res) => {
  let userObject = await getUserObjectHelper(req.auth.payload.sub);
  const partners = await prisma.partner.findMany({
    where: {
      orginizationId: userObject.orginizationId,
    },
  });
  res.send(partners);
});

const addPartner = tryCatch(async (req, res) => {
  let userObject = await getUserObjectHelper(req.auth.payload.sub);
  var body = req.body;
  const { name, email, code } = req.body;

  const newPartner = await prisma.partner.create({
    data: {
      name: name,
      email: email,
      code: code,
      orginizationId: userObject.orginizationId,
    },
  });
  res.status(200).json(newPartner);
});

module.exports = {
  getAllParnters,
  addPartner,
};
