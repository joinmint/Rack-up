const router = require("express").Router();
const {
  getAllParnters,
  addPartner,
} = require("../controllers/partner.controller");
const checkJwt = require("../middleware/checkJwt");

router.route("/get-all-partners").get(checkJwt, getAllParnters);
router.route("/add-partner").post(checkJwt, addPartner);
module.exports = router;
