const express = require("express");
const router = express.Router();
// const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
// require usersController
const userController = require("../controllers/users.js");


router.route("/signup")
    .get(userController.renderSignupForm)   //get router request for signup form (render)
    .post( wrapAsync(userController.signup));     //post router for signup


//get for login from ( render )
router.route("/login")
    .get(userController.renderLoginForm)    //get for login from ( render )
    .post(saveRedirectUrl,  passport.authenticate("local", {failureRedirect: "/login", failureFlash: true}), userController.login);   //post for login



//Logout User

router.get("/logout", userController.logout);



module.exports = router;