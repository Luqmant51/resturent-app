const express = require("express");
const router = express.Router();
const authcontroller = require("../controllers/auth.controller");

router
  .route('/register')
  .get(authcontroller.getsignup)
  .post(authcontroller.adduser);


router.route("/login").get(authcontroller.getlogin).post(authcontroller.login);
router.route("/logout").get(authcontroller.logout);

module.exports = router;
