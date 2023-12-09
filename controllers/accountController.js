const utilities = require('../utilities/');
const accountModel = require('../models/account-model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

/* ****************************************
 *  Deliver login view
 * *************************************** */
async function buildAccountManagment(req, res, next) {
   let nav = await utilities.getNav();

   if (res.locals.loggedin) {
      loggedin = true;
   }
   res.render('account/account-management', {
      title: 'Account',
      nav,
      errors: null,
      account: res.locals.accountData,
      loggedin
   });
}

/* ****************************************
 *  Deliver login view
 * *************************************** */
async function buildLogin(req, res, next) {
   let nav = await utilities.getNav();
   let loggedin = false;
   if (res.locals.loggedin) {
      loggedin = true;
   }
   res.render('account/login', {
      title: 'Login',
      nav,
      errors: null,
      loggedin,
      account: res.locals.accountData,
   });
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
   let nav = await utilities.getNav();
   const { account_email, account_password } = req.body;
   const accountData = await accountModel.getAccountByEmail(account_email);
   let loggedin = false;
   if (res.locals.loggedin) {
      loggedin = true;
   }
   if (!accountData) {
      req.flash('notice', 'Please check your credentials and try again.');
      res.status(400).render('account/login', {
         title: 'Login',
         nav,
         errors: null,
         loggedin,
      account: res.locals.accountData,
         account_email,
      });
      return;
   }
   try {
      const isSame = await bcrypt.compare(
         account_password,
         accountData.account_password
      );
      if (isSame) {
         delete accountData.account_password;
         const accessToken = jwt.sign(
            accountData,
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: 3600 * 1000 }
         );
         res.cookie('jwt', accessToken, {
            httpOnly: true,
            maxAge: 3600 * 1000,
         });
         return res.redirect('/account/');
      }
   } catch (error) {
      return new Error('Access Forbidden');
   }
}

/* ****************************************
 *  Deliver registration view
 * *************************************** */
async function buildRegister(req, res, next) {
   let nav = await utilities.getNav();
   let loggedin = false;
   if (res.locals.loggedin) {
      loggedin = true;
   }
   res.render('account/register', {
      title: 'Register',
      nav,
      errors: null,
      loggedin,
       account: res.locals.accountData,
   });
}

/* ****************************************
 *  Process Registration
 * *************************************** */
async function registerAccount(req, res) {
   let nav = await utilities.getNav();
   const {
      account_firstname,
      account_lastname,
      account_email,
      account_password,
   } = req.body;

   // Hash the password before storing
   let hashedPassword;
   try {
      // regular password and cost (salt is generated automatically)
      hashedPassword = await bcrypt.hashSync(account_password, 10);
   } catch (error) {
      req.flash(
         'notice',
         'Sorry, there was an error processing the registration.'
      );
      let loggedin = false;
      if (res.locals.loggedin) {
         loggedin = true;
      }
      res.status(500).render('account/register', {
         title: 'Registration',
         nav,
         errors: null,
         loggedin,
         account: res.locals.accountData,
      });
   }

   const regResult = await accountModel.registerAccount(
      account_firstname,
      account_lastname,
      account_email,
      hashedPassword
   );
   let loggedin = false;
   if (res.locals.loggedin) {
      loggedin = true;
   }
   if (regResult) {
      req.flash(
         'notice',
         `Congratulations, you\'re registered ${account_firstname}. Please log in.`
      );
      res.status(201).render('account/login', {
         title: 'Login',
         nav,
         errors: null,
         loggedin,
         account: res.locals.accountData,
      });
   } else {
      req.flash('notice', 'Sorry, the registration failed.');
      res.status(501).render('account/registration', {
         title: 'Registration',
         nav,
         errors: null,
         loggedin,
         account: res.locals.accountData,
      });
   }
}

/* ****************************************
 *  Deliver Update view
 * *************************************** */
async function buildUpdate(req, res, next) {
   let nav = await utilities.getNav();
   let loggedin = false;
   if (res.locals.loggedin) {
      loggedin = true;
   }
   res.render('account/update-account', {
      title: 'Update Account',
      nav,
      errors: null,
      loggedin,
      account: res.locals.accountData
   });
}

/* ****************************************
 *  Process Update
 * *************************************** */
async function updateAccount(req, res) {
   let nav = await utilities.getNav();
   const {
      account_firstname,
      account_lastname,
      account_email,
      account_id,
   } = req.body;

   let loggedin = false;
   if (res.locals.loggedin) {
      loggedin = true;
   }
   const regResult = await accountModel.updateAccount(
      account_firstname,
      account_lastname,
      account_email,
      account_id
   );

   if (regResult) {
      req.flash('notice', `Account Updated`);
      res.status(201).render('account/account-management', {
         title: 'Account',
         nav,
         errors: null,
         account: res.locals.accountData,
         loggedin
      });
   } else {
      req.flash('notice', 'Sorry, the update failed.');
      res.status(501).render('account/update-account', {
         title: 'Update Account',
         nav,
         errors: null,
         loggedin,
         account: res.locals.accountData
      });
   }
}

/* ****************************************
 *  Process change password
 * *************************************** */
async function changePassword(req, res) {
   let nav = await utilities.getNav();
   const {
      account_password,
      account_id
   } = req.body;

   // Hash the password before storing
   let loggedin = false;
   if (res.locals.loggedin) {
      loggedin = true;
   }
   let hashedPassword;
   try {
      // regular password and cost (salt is generated automatically)
      hashedPassword = await bcrypt.hashSync(account_password, 10);
   } catch (error) {
      req.flash('notice', 'Sorry, there was an error processing the update.');
      res.status(500).render('account/update-account', {
         title: 'Update Account',
         nav,
         errors: null,
         loggedin,
         account: res.locals.accountData
      });
   }

   const regResult = await accountModel.updatePassword(
      hashedPassword
   );

   if (regResult) {
      req.flash('notice', `Account Updated`);
      res.status(201).render('account/account-management', {
         title: 'Account',
         nav,
         errors: null,
         loggedin,
         account: res.locals.accountData
      });
   } else {
      req.flash('notice', 'Sorry, the update failed.');
      res.status(501).render('account/update-account', {
         title: 'Update Account',
         nav,
         errors: null,
         account: res.locals.accountData
      });
   }
}

module.exports = {
   buildLogin,
   buildRegister,
   registerAccount,
   accountLogin,
   buildAccountManagment,
   buildUpdate,
   updateAccount,
};
