const router = require("express").Router();
const member = require("./member");
const generator = require("./generator");
const redeemer = require("./redeemer");
const partner = require("./partner");
const user = require("./user");

router.use("/member", member);
router.use("/generator", generator);
router.use("/redeemer", redeemer);
router.use("/partner", partner);
router.use("/user", user);
module.exports = router;
