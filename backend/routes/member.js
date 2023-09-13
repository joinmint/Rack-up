const router = require("express").Router();
const {
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
} = require("../controllers/member.controller");
const checkJwt = require("../middleware/checkJwt");

router.route("/get-all-members").get(checkJwt, getAllMembers);
router.route("/add-member").post(checkJwt, addMember);
router
  .route("/generate-member-card/:memberID")
  .post(checkJwt, generateMembershipCard);
router
  .route("/generate-member-photo-s3-url/:memberID")
  .post(checkJwt, generateMemberPhotoS3URL);
router.route("/get-member-info/:memberID").get(getMemberInfo);
router.route("/lookup-member-info-public").post(lookupMemberInfoPublic);
router
  .route("/get-member-transaction-history-public/:memberID")
  .get(getMemberTransactionHistoryPublic);
router
  .route("/get-member-transaction-history/:memberID")
  .get(checkJwt, getMemberTransactionHistory);
router.route("/edit-member/:memberID").put(checkJwt, editMember);
router.route("/delete-member/:memberID").delete(checkJwt, deleteMember);
module.exports = router;
