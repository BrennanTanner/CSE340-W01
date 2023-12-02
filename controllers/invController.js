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
 *  Build management view
 * ************************** */
invCont.buildManagement = async function (req, res, next) {
   let nav = await utilities.getNav()
   const classificationSelect = await utilities.buildClassificationList()
   res.render("./inventory/management", {
   title: "Vehicle Management",
   nav,
   classificationSelect,
   errors: null,
 })
 }

/* **********************************
 *  Build Add New Classification view
 * ******************************** */
invCont.buildAddClass = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/add-classification", {
    title: "Add New Classification",
    nav,
    errors: null,
  })
}

/* ***************************
 *  Post new Classification
 * ************************** */
invCont.addClassification = async function (req, res) {
   let nav = await utilities.getNav()
   const {classification_name} = req.body
   const addClassificationResult = await invModel.addClassification(classification_name)
   
   if (addClassificationResult.rows[0].classification_name == classification_name) {
     nav = await utilities.getNav()
     const classificationSelect = await utilities.buildClassificationList(addClassificationResult.classification_id)
     req.flash(
       "notice",
       `Congratulations, you\'ve added a new classification ${classification_name} and it's been included in the navigation bar`
     )
     res.status(201).render("./inventory/management", {
       title: "Vehicle Management",
       classificationSelect,
       nav,
       errors: null,
     })
   } else {
     req.flash(
       "notice",
       `There was an error adding new classification ${classification_name}`
     )
     res.status(501).render("./inventory/add-Classification", {
       title: "Add New Classification",
       nav,
       errors: null,
     })
   }
 }
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

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
   const classification_id = parseInt(req.params.classification_id)
   const invData = await invModel.getInventoryByClassificationId(classification_id)
   if (invData[0].inv_id) {
      console.log(invData[0])
     return res.json(invData)
   } else {
     next(new Error("No data returned"))
   }
 }

module.exports = invCont;
