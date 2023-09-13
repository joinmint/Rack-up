const AWS = require("aws-sdk");
const QRCode = require("qrcode");
var request = require("request");
const Joi = require("joi");

const { PrismaClient } = require("@prisma/client");
const { getUserObjectHelper } = require("./user.controller");
const prisma = new PrismaClient();
const { tryCatch } = require("../utils/tryCatch");
const { v4: uuidv4 } = require("uuid");

AWS.config = new AWS.Config({
  accessKeyId: process.env.S3_ACCESS_KEY,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  region: "us-east-1",
  signatureVersion: "v4",
});
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

//s3 client instantiation
var s3 = new AWS.S3({
  accessKeyId: process.env.S3_ACCESS_KEY,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  Bucket: process.env.S3_BUCKET,
});

const getAllMembers = tryCatch(async (req, res, next) => {
  let userObject = await getUserObjectHelper(req.auth.payload.sub);

  const members = await prisma.Member.findMany({
    where: {
      orginizationId: userObject.orginizationId,
    },
  });
  res.send(members);
});

const schema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  dob: Joi.string().required(),
  email: Joi.string().required(),
  address: Joi.string().required(),
});

const addMember = tryCatch(async (req, res) => {
  let userObject = await getUserObjectHelper(req.auth.payload.sub);
  const { firstName, lastName, dob, address, email } = req.body;
  const { error, value } = schema.validate(req.body);
  if (error) throw error;

  const newMember = await prisma.member.create({
    data: {
      firstName: firstName,
      lastName: lastName,
      dob: dob,
      address: address,
      email: email,
      accountBalance: 0,
      orginizationId: userObject.orginizationId,
    },
  });
  res.status(200).json(newMember);
});

const getMemberInfo = tryCatch(async (req, res) => {
  const { memberID } = req.params;

  let member = await prisma.member.findUnique({
    where: {
      id: memberID,
    },
  });
  if (!member)
    throw Error("Member not found on public portal with id " + memberID);

  //Now that we have member genrated a presigned GET url for their member photo
  //to show on profile page
  const s3 = new AWS.S3();
  const friendlyQRString = memberID.replace(/-/g, "");
  var params = {
    Bucket: "cardmapper",
    Key: "member_info/" + friendlyQRString + "/member_photo.png",
  };
  s3.getSignedUrl("getObject", params, function (err, url) {
    if (err) throw Error(err);
    member.profileImage = url;
    res.status(200).json(member);
  });
});

const lookupMemberInfoPublic = tryCatch(async (req, res) => {
  const { lookupType, dob, lastName, code } = req.body;
  let member = null;

  //if lookup type is code and the code provided is not 8 characters throw an error
  if (lookupType === "code" && code.length !== 8)
    throw Error("Code incorrect length");
  //Check if user is lookuping up with member lookup code or dob/lastname
  if (lookupType === "code") {
    member = await prisma.member.findFirst({
      where: {
        id: {
          startsWith: code,
        },
      },
    });
  }
  if (lookupType === "combo") {
    member = await prisma.member.findFirst({
      where: {
        AND: [
          {
            dob: {
              equals: dob,
            },
          },
          {
            lastName: {
              equals: lastName,
              mode: "insensitive",
            },
          },
        ],
      },
    });
  }
  if (!member) throw Error("MEMBER NOT FOUND");
  res.status(200).json(member);
});

const getMemberTransactionHistory = tryCatch(async (req, res) => {
  let userObject = await getUserObjectHelper(req.auth.payload.sub);
  const { memberID } = req.params;

  let transactions = await prisma.transaction.findMany({
    where: {
      memberId: memberID,
    },
    include: {
      generatorObject: true,
      redeemerObject: true,
      transactionTypeObject: true,
    },
  });
  res.status(200).json(transactions);
});

const getMemberTransactionHistoryPublic = tryCatch(async (req, res) => {
  const { memberID } = req.params;

  let transactions = await prisma.transaction.findMany({
    take: 5,
    where: {
      memberId: memberID,
    },
    include: {
      generatorObject: {
        select: {
          name: true,
          pointValue: true,
        },
      },
      redeemerObject: true,
      transactionTypeObject: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  res.status(200).json(transactions);
});

const editMember = async (req, res) => {
  const body = req.body;
  const { memberID } = req.params;
  res.json("works");
};

const deleteMember = async (req, res) => {
  const { memberID } = req.params;

  res.json("works");
};

const generateMemberPhotoS3URL = async (req, res) => {
  const { memberID } = req.params;
  const body = req.body;
  const friendlyQRString = memberID.replace(/-/g, "");

  const s3 = new AWS.S3();
  var params = {
    Bucket: "cardmapper",
    Key: "member_info/" + friendlyQRString + "/member_photo.png",
    ContentType: "image/png",
  };
  s3.getSignedUrl("putObject", params, function (err, url) {
    res.send({ image_url: url });
  });
};

const generateMembershipCard = tryCatch(async (req, res) => {
  let userObject = await getUserObjectHelper(req.auth.payload.sub);
  const { memberID } = req.params;
  let member = await prisma.member.findUnique({
    where: {
      id: memberID,
    },
  });

  //now we need to generate QR code and upload to s3
  uploadToS3(memberID).then((r) => {
    //I want hyphens out of the member id for saving in s3
    const friendlyQRString = memberID.replace(/-/g, "");
    //Now invoke the card mapper lambda URL
    request.post(
      {
        headers: { "content-type": "application/json" },
        url: process.env.MAPPER_LAMBDA_URL,
        body: JSON.stringify({
          bucket: "cardmapper",
          qr_key: r,
          member_qr_id: friendlyQRString,
          friendly_qr_id: member.id.replace(/-/g, "").slice(0, 8),
          name: member.firstName + " " + member.lastName,
          template_key: "templates/mint_template.png",
        }),
      },
      function (error, response, body) {
        parsedBody = JSON.parse(body);
        presignedURL = parsedBody.url;
        res.send({ image_url: presignedURL });
      }
    );
  });
});

const uploadToS3 = (qrString) => {
  //freidnly qr is the uuid without dashes
  const friendlyQRString = qrString.replace(/-/g, "");
  const s3Key = "member_info/" + friendlyQRString + "/qr_code.png";
  const qrStringFinal =
    process.env.REACT_APP_PUBLIC_URL + "?memberID=" + qrString;
  return new Promise((resolve, reject) => {
    var qrOpts = {
      type: "image/png",
      width: 350,
    };

    QRCode.toDataURL(qrStringFinal, qrOpts, function (err, base64) {
      const base64Data = new Buffer.from(
        base64.replace(/^data:image\/\w+;base64,/, ""),
        "base64"
      );
      const params = {
        Bucket: "cardmapper",
        Key: s3Key,
        Body: base64Data,
        ContentEncoding: "base64",
      };
      s3.upload(params, function (err, data) {
        if (err) {
          throw err;
        }
        console.log(`File uploaded Successfully .${data.Location}`);
        resolve(s3Key);
      });

      console.log(base64);
    });
  });
};

module.exports = {
  getAllMembers,
  getMemberInfo,
  lookupMemberInfoPublic,
  addMember,
  editMember,
  deleteMember,
  generateMembershipCard,
  generateMemberPhotoS3URL,
  getMemberTransactionHistory,
  getMemberTransactionHistoryPublic,
};
