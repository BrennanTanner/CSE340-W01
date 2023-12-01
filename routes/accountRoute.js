// Needed Resources 
const express = require("express")
const router = new express.Router() 
const accountController = require("../controllers/accountController")
const utilities = require("../utilities/index")
const regValidate = require('../utilities/account-validation')

// Route to build account managment view
router.get("/", utilities.checkLogin,  utilities.handleErrors(accountController.buildAccountManagment));

// Route to build login view
router.get("/login", utilities.handleErrors(accountController.buildLogin));

// Route to build register view
router.get("/register", utilities.handleErrors(accountController.buildRegister));

// Process the login request
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)

// Process the registration data
router.post(
   "/register",
   regValidate.registationRules(),
   regValidate.checkRegData,
   utilities.handleErrors(accountController.registerAccount)
 )
 

module.exports = router;