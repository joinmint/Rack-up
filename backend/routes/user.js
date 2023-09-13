const router = require("express").Router();
const { registerUser } = require("../controllers/user.controller");

router.route("/register-user").post(registerUser);
module.exports = router;
