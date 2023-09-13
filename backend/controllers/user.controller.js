const AWS = require("aws-sdk");
var request = require("request");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const { v4: uuidv4 } = require("uuid");

const registerUser = async (req, res) => {
  const { userInfo } = req.body;
  console.log(userInfo.authCode);
  try {
    const newUser = await prisma.user.create({
      data: {
        email: userInfo.email,
        authId: userInfo.authId,
      },
    });

    //eventually we can look an invite that will be associated to an Org
    //and assign it to user here. For now we can manually assign the org
    res.status(200).json(newUser);
  } catch (e) {
    console.log(e);
    res.status(400).json("error");
  }
};

const getUserObjectHelper = async (authId) => {
  user = await prisma.user.findUnique({
    where: {
      authId: authId,
    },
  });
  if (!user) throw new Error("No user found in DB with authId " + authId);
  return user;
};

module.exports = {
  registerUser,
  getUserObjectHelper,
};
