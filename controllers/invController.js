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
   let loggedin = false;
   if (res.locals.loggedin) {
      loggedin = true;
   }
   res.render('./inventory/classification', {
      title: className + ' vehicles',
      nav,
      grid,
      loggedin,
      account: res.locals.accountData,
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
   let loggedin = false;
   if (res.locals.loggedin) {
      loggedin = true;
   }
   res.render('./inventory/details', {
      title,
      nav,
      grid,
      loggedin,
      account: res.locals.accountData,
   });
});

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
   const classification_id = parseInt(req.params.classification_id);
   const invData = await invModel.getInventoryByClassificationId(
      classification_id
   );
   if (invData[0].inv_id) {
      return res.json(invData);
   } else {
      next(new Error('No data returned'));
   }
};

/* ***************************
 *  Build edit inventory view
 * ************************** */
invCont.buildEditVehicle = async function (req, res, next) {
   const inv_id = parseInt(req.params.inv_id);
   let classes = await invModel.getClassifications();
   let nav = await utilities.getNav();
   const itemData = await invModel.getItemByInventoryId(inv_id);
   const itemName = `${itemData[0].inv_make} ${itemData[0].inv_model}`;
   let loggedin = false;
   if (res.locals.loggedin) {
      loggedin = true;
   }
   res.render('./inventory/edit-inventory', {
      title: 'Edit ' + itemName,
      nav,
      classes,
      loggedin,
      account: res.locals.accountData,
      errors: null,
      inv_id: itemData[0].inv_id,
      inv_make: itemData[0].inv_make,
      inv_model: itemData[0].inv_model,
      inv_year: itemData[0].inv_year,
      inv_description: itemData[0].inv_description,
      inv_image: itemData[0].inv_image,
      inv_thumbnail: itemData[0].inv_thumbnail,
      inv_price: itemData[0].inv_price,
      inv_miles: itemData[0].inv_miles,
      inv_color: itemData[0].inv_color,
      classification_id: itemData[0].classification_id,
   });
};

/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
   let nav = await utilities.getNav();
   const {
      inv_id,
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      classification_id,
   } = req.body;
   const updateResult = await invModel.updateInventory(
      inv_id,
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      classification_id
   );

   if (updateResult) {
      const itemName = updateResult.inv_make + ' ' + updateResult.inv_model;
      req.flash('notice', `The ${itemName} was successfully updated.`);
      res.redirect('/inv/');
   } else {
      const classificationSelect = await utilities.buildClassificationList(
         classification_id
      );
      const itemName = `${inv_make} ${inv_model}`;
      let loggedin = false;
      if (res.locals.loggedin) {
         loggedin = true;
      }
      req.flash('notice', 'Sorry, the insert failed.');
      res.status(501).render('inventory/edit-inventory', {
         title: 'Edit ' + itemName,
         nav,
         loggedin,
         account: res.locals.accountData,
         classificationSelect: classificationSelect,
         errors: null,
         inv_id,
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
      });
   }
};

/* ***************************
 *  Build delete confirmation view
 * ************************** */
invCont.buildDeleteInventory = async function (req, res, next) {
   const inv_id = parseInt(req.params.inv_id);
   let nav = await utilities.getNav();
   const itemData = await invModel.getItemByInventoryId(inv_id);
   const itemName = `${itemData[0].inv_make} ${itemData[0].inv_model}`;
   let loggedin = false;
      if (res.locals.loggedin) {
         loggedin = true;
      }
   res.render('./inventory/delete', {
      title: 'Delete ' + itemName,
      nav,
      loggedin,
      account: res.locals.accountData,
      errors: null,
      inv_id: itemData[0].inv_id,
      inv_make: itemData[0].inv_make,
      inv_model: itemData[0].inv_model,
      inv_year: itemData[0].inv_year,
      inv_price: itemData[0].inv_price,
      classification_id: itemData[0].classification_id,
   });
};

/* ***************************
 *  Delete Inventory Data process
 * ************************** */
invCont.deleteInventory = async function (req, res, next) {
   let nav = await utilities.getNav();
   const { inv_id, inv_make, inv_model, inv_year } = req.body;
   const deleteResult = await invModel.deleteInventory(inv_id);
   let classes = await invModel.getClassifications();
   if (deleteResult) {
      const itemName = inv_make + ' ' + inv_model;
      req.flash(
         'notice',
         `The ${inv_year} ${itemName} was successfully deleted.`
      );
      res.render('management/management', {
         title: 'Vehicle Management',
         nav,
         classes,
         errors: null,
      });
   } else {
      const itemName = `${inv_make} ${inv_model}`;
      req.flash('notice', 'Sorry, the delete failed.');
      res.status(501).render('inventory/delete-confirm', {
         title: 'Delete ' + itemName,
         nav,
         classificationSelect: null,
         errors: null,
         inv_id,
         inv_make,
         inv_model,
         inv_year,
         inv_price,
      });
   }
};

module.exports = invCont;
