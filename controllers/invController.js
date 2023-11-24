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
 *  Build inventory management view
 * ************************** */
invCont.buildInventoryManagement = utilities.handleErrors(async function (
   req,
   res,
   next
) {
   const menu = await utilities.buildManagementMenu('', false);
   const nav = await utilities.getNav();
   const title = 'Vehicle Management';
   res.render('./inventory/management', {
      title,
      nav,
      menu,
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
invCont.postNewClass = utilities.handleErrors(async function (req, res, next) {
   const nav = await utilities.getNav();
   if (utilities.validateNewClass(req.query)) {
      invModel.createClass(req.query.classname);
      const menu = await utilities.buildManagementMenu(req.query.classname, true);
      const title = 'Vehicle Management';
      res.render('./inventory/management', {
         title,
         nav,
         menu,
      });
   } else {
      const form = await utilities.buildNewClassForm(
         req.query.classname,
         'Provide a correct classification name.'
      );
      const title = 'Add New Classification';
      res.render('./inventory/add-classification', {
         title,
         nav,
         form,
      });
   }
});

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
         console.log(error);
         errorString += error.replace('inv_', '') + ', ';
      });
      console.log(errorString);
      const form = await utilities.buildNewVehicleForm(
         req.query,
         errorString + 'cannot be blank'
      );
      const nav = await utilities.getNav();
      const title = 'Add New Vehicle';
      res.render('./inventory/add-inventory', {
         title,
         nav,
         form,
      });
   }
});

module.exports = invCont;
