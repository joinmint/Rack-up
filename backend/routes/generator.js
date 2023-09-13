const router = require("express").Router();
const {
  getAllGenerators,
  addGenerator,
  getAllGeneratorsPublic,
  addGeneratorTransactionPublic,
} = require("../controllers/generator.controller");
const checkJwt = require("../middleware/checkJwt");

router.route("/get-all-generators").get(checkJwt, getAllGenerators);
router
  .route("/get-all-generators-public/:memberID")
  .get(getAllGeneratorsPublic);
router
  .route("/add-generator-transaction-public")
  .post(addGeneratorTransactionPublic);
router.route("/add-generator").post(checkJwt, addGenerator);

module.exports = router;
