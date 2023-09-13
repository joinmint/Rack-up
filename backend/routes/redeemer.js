const router = require("express").Router();
const {
  getAllRedeemers,
  getAllRedeemersPublic,
  addRedeemerTransactionPublic,
  addRedeemer,
} = require("../controllers/redeemer.controller");
const checkJwt = require("../middleware/checkJwt");
router.route("/get-all-redeemers").get(checkJwt, getAllRedeemers);
router.route("/get-all-redeemers-public/:memberID").get(getAllRedeemersPublic);
router
  .route("/add-redeemer-transaction-public")
  .post(addRedeemerTransactionPublic);
router.route("/add-redeemer").post(checkJwt, addRedeemer);

module.exports = router;
