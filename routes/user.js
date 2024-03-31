const express = require("express");
const router = express.Router({mergeParams: true});
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const userController = require('../controllers/users')

router
    .route('/signup')
    .get((req, res) => {
        res.render('users/signup.ejs');
    })
    .post(wrapAsync(userController.renderSignup));

// const routeCallback = () => {
//     console.log('Route file has been executed');
// };

router
    .route('/login')
    .get(userController.renderLogin)
    .post(passport.authenticate('local', {
        failureRedirect: '/login',
        failureFlash: true}),
        userController.login)

router.get("/logout", userController.logout)
  
module.exports = router;
