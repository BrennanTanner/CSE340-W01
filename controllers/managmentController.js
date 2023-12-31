const utilities = require('../utilities/');
const manModel = require('../models/management-model');
const inventoryModel = require('../models/inventory-model');
const managementModel = require('../models/management-model')

const manController = {};

/* ****************************************
 *  Deliver Management view
 * *************************************** */
manController.buildInventoryManagement = async function (req, res, next) {
   const nav = await utilities.getNav();
   let classes = await inventoryModel.getClassifications();

   let loggedin = false;
   if(res.locals.loggedin){
     loggedin = true;
   }

   const title = 'Vehicle Management';
   res.render('management/management', {
      title,
      nav,
      classes,
      errors: null,
      loggedin,
      account: res.locals.accountData
   });
};

/* ****************************************
 *  Deliver new class view
 * *************************************** */
manController.buildNewClass = async function (req, res, next) {
   let nav = await utilities.getNav();
   let loggedin = false;
   if (res.locals.loggedin) {
      loggedin = true;
   }
   res.render('management/add-classification', {
      title: 'Create a new Class',
      nav,
      loggedin,
      account: res.locals.accountData,
      errors: null,
      name: null,
   });
};

/* ****************************************
 *  Deliver new vehicle view
 * *************************************** */
manController.buildRegister = async function (req, res, next) {
   let nav = await utilities.getNav();
   let loggedin = false;
   if (res.locals.loggedin) {
      loggedin = true;
   }
   res.render('management/add-inventory', {
      title: 'Create a new vehicle',
      nav,
      loggedin,
      account: res.locals.accountData,
      errors: null,
   });
};

/* **********************************
 *  Build New Vehicle view
 * ******************************** */
manController.buildNewVehicle = async function (req, res, next) {
   let classes = await inventoryModel.getClassifications();
   let nav = await utilities.getNav();
   let loggedin = false;
      if (res.locals.loggedin) {
         loggedin = true;
      }
   res.render('./management/add-inventory', {
      title: 'Create a new vehicle',
      classes,
      nav,
      loggedin,
      account: res.locals.accountData,
      classification_id: null,
      inv_make: null,
      inv_model: null,
      inv_description: null,
      inv_image: null,
      inv_thumbnail: null,
      inv_price: null,
      inv_year: null,
      inv_miles: null,
      inv_color: null,
      errors: null,
   });
};

/* ****************************************
 *  Process new class
 * *************************************** */
manController.addClass = async function (req, res) {
   let nav = await utilities.getNav();
   const { classification_name } = req.body;

   const Result = await manModel.createClass(classification_name);

   if (Result) {
      req.flash('notice', `The ${classification_name} class was created`);
      let loggedin = false;
      if (res.locals.loggedin) {
         loggedin = true;
      }
      res.status(201).render('management/management', {
         title: 'Vehicle Management',
         nav,
         loggedin,
         account: res.locals.accountData,
      });
   } else {
      req.flash('notice', 'Sorry, failed to create class.');
      let loggedin = false;
      if (res.locals.loggedin) {
         loggedin = true;
      }
      res.status(501).render('management/add-classification', {
         title: 'Create a new Class',
         nav,
         loggedin,
         account: res.locals.accountData,
         name: classification_name,
      });
   }
};

/* ****************************************
 *  Process new vehicle
 * *************************************** */
manController.addVehicle = async function (req, res) {
   const {
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id,
   } = req.body;
   let nav = await utilities.getNav();
   let classes = await inventoryModel.getClassifications();

   const regResult = await managementModel.createVehicle(
      req.body
   );

   if (regResult) {
      req.flash(
         'notice',
         `Congratulations, you\'ve added ${inv_year} ${inv_make} ${inv_model} to the inventory!`
      );
      res.redirect('/inv/');
   } else {
      let loggedin = false;
      if (res.locals.loggedin) {
         loggedin = true;
      }
      req.flash('notice', 'Sorry, there was an error adding that vehicle.');
      res.render('./inventory/add-inventory', {
         title: 'Add New Vehicle',
         nav,
         loggedin,
         account: res.locals.accountData,
         classes,
         classification_id,
         inv_make,
         inv_model,
         inv_description,
         inv_image,
         inv_thumbnail,
         inv_price,
         inv_year,
         inv_miles,
         inv_color,
         errors: null,
      });
   }
};

module.exports = manController;
