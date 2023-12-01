const invModel = require('../models/inventory-model');
const utilities = require('../utilities/');

const invCont = {};

/* ***************************
 *  Build inventory by classification view
 * ************************** */

invCont.buildByClassificationId = utilities.handleErrors(async function (
   req,
   res,
   next
) {
   const classification_id = req.params.classificationId;
   const data = await invModel.getInventoryByClassificationId(
      classification_id
   );

   if (!data.length) {
      next({
         status: 500,
         message: "Sorry, that category doesn't exsist yet!",
      });
   }

   const grid = await utilities.buildClassificationGrid(data);
   let nav = await utilities.getNav();
   const className = data[0].classification_name;
   res.render('./inventory/classification', {
      title: className + ' vehicles',
      nav,
      grid,
   });
});

/* ***************************
 *  Build inventory by inventory view
 * ************************** */
invCont.buildByInventoryId = utilities.handleErrors(async function (
   req,
   res,
   next
) {
   const inventory_id = req.params.invId;
   const data = await invModel.getItemByInventoryId(inventory_id);
   const grid = await utilities.buildItemGrid(data);
   let nav = await utilities.getNav();
   let title = 'Car not found';
   if (data.length) {
      title = data[0].inv_make + ' ' + data[0].inv_model;
   }
   res.render('./inventory/details', {
      title,
      nav,
      grid,
   });
});



/* ***************************
 *  Build Add Classification view
 * ************************** */
invCont.buildAddClass = utilities.handleErrors(async function (req, res, next) {
   const form = await utilities.buildNewClassForm(req.query.classname, '');
   const nav = await utilities.getNav();
   const title = 'Add New Classification';
   res.render('./inventory/add-classification', {
      title,
      nav,
      form,
   });
});

/* ***************************
 *  Post new Classification
 * ************************** */

/* ***************************
 *  Build Add Vehicle view
 * ************************** */
invCont.buildAddVehicle = utilities.handleErrors(async function (
   req,
   res,
   next
) {
   const form = await utilities.buildNewVehicleForm(req.query);
   const nav = await utilities.getNav();
   const title = 'Add New Vehicle';
   res.render('./inventory/add-inventory', {
      title,
      nav,
      form,
   });
});

/* ***************************
 *  Post new Vehicle
 * ************************** */
invCont.postNewVehicle = utilities.handleErrors(async function (
   req,
   res,
   next
) {
   const nav = await utilities.getNav();
   const errors = utilities.validateNewVehicle(req.query);
   if (!errors) {
      invModel.createVehicle(req.query);
      const menu = await utilities.buildManagementMenu(req.query.inv_make + ' ' + req.query.inv_model, true);
      const title = 'Vehicle Management';
      res.render('./inventory/management', {
         title,
         nav,
         menu,
      });
   } else {
      let errorString = 'Vehicle ';
      errors.map((error) => {
         errorString += error.replace('inv_', '') + ', ';
      });

      const form = await utilities.buildNewVehicleForm(
         req.query,
         errorString + 'cannot be blank'
      );
      const nav = await utilities.getNav();
      const title = 'Add New Vehicle';
      req.flash(
         "notice",
         errorString + 'cannot be blank'
       )
      res.render('./inventory/add-inventory', {
         title,
         nav,
         form,
      });
   }
});

// /* ****************************************
// *  Deliver login view
// * *************************************** */
// invCont.postNewVehicle = async function (req, res, next) {
//    const nav = await utilities.getNav();
//    const errors = utilities.validateNewVehicle(req.query);
//    if (!errors) {
//       invModel.createVehicle(req.query);
//       const menu = await utilities.buildManagementMenu(req.query.inv_make + ' ' + req.query.inv_model, true);
//       const title = 'Vehicle Management';
//       res.render('./inventory/management', {
//          title,
//          nav,
//          menu,
//       });
//    } else {
//       let errorString = 'Vehicle ';
//       errors.map((error) => {
//          console.log(error);
//          errorString += error.replace('inv_', '') + ', ';
//       });
//       console.log(errorString);
//       const form = await utilities.buildNewVehicleForm(
//          req.query,
//          errorString + 'cannot be blank'
//       );
//       const nav = await utilities.getNav();
//       const title = 'Add New Vehicle';
//       res.render('./inventory/add-inventory', {
//          title,
//          nav,
//          form,
//       });
//    }
// };
 
//  /* ****************************************
// *  Deliver registration view
// * *************************************** */
// async function buildRegister(req, res, next) {
//    let nav = await utilities.getNav()
//    res.render("account/register", {
//      title: "Register",
//      nav,
//      errors: null,
//    })
//  }
 
//  /* ****************************************
// *  Process Registration
// * *************************************** */
// async function registerAccount(req, res) {
//    let nav = await utilities.getNav()
//    const { account_firstname, account_lastname, account_email, account_password } = req.body
 
//    const regResult = await accountModel.registerAccount(
//      account_firstname,
//      account_lastname,
//      account_email,
//      account_password
//    )
 
//    if (regResult) {
//      req.flash(
//        "notice",
//        `Congratulations, you\'re registered ${account_firstname}. Please log in.`
//      )
//      res.status(201).render("account/login", {
//        title: "Login",
//        nav,
//      })
//    } else {
//      req.flash("notice", "Sorry, the registration failed.")
//      res.status(501).render("account/register", {
//        title: "Registration",
//        nav,
//      })
//    }
//  }

module.exports = invCont;
