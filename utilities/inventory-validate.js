const utilities = require(".")
const { body, validationResult } = require("express-validator")
const invModel = require("../models/inventory-model")
const validate = {}
 
/*  **********************************
 * Classification Validation Rules
 * ********************************* */
validate.classificationRules = () => {
  return [
    // only alphabetic allowed
    body("classification_name")
      .trim()
      .isLength({min: 1, max: 8})
      .isAlpha()
      .withMessage("Classification does not meet requirements - 1-8 alphabetic characters.")
      .custom(async (classification_name) => {
        const classificationExists = await invModel.checkExistingClassification(classification_name)
        if (classificationExists){
          throw new Error("Classification exists. Please use a different classification")
        }
      }),
  ]
}

  /* ******************************
 * Check classification data and return errors
 * ***************************** */
  validate.checkClassificationData = async (req, res, next) => {
    const {classification_name } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      
      res.render("inventory/add-classification", {
        errors,
        title: "Add New Classification",
        nav,
        classification_name,
      })
      return
    }
    next()
  }
  
  validate.vehicleRules = () => {
    return [
      // only alphabetic allowed
      body("classification_id")
        .trim()
        .isLength({min: 1, max: 3})
        .isNumeric()
        .withMessage("Classification incorrect - Please enable client-side validation and use application for entry"),
      body("inv_make")
        .trim()
        .isLength({min: 1, max: 30})
        .withMessage("Make incorrect - Please enable client-side validation and use application for entry"),      
      body("inv_model")
        .trim()
        .isLength({min: 1, max: 30})
        .withMessage("Model incorrect - Please enable client-side validation and use application for entry"),
      body("inv_description")
        .trim()
        .isLength({min: 1, max: 255})
        .withMessage("Description incorrect - Please enable client-side validation and use application for entry"),
      body("inv_image")
        .trim()
        .isLength({min: 1, max: 50})
        .withMessage("Image Path incorrect - Please enable client-side validation and use application for entry"),
      body("inv_thumbnail")
        .trim()
        .isLength({min: 1, max: 50})
        .withMessage("Thumbnail Path incorrect - Please enable client-side validation and use application for entry"),
      body("inv_price")
        .trim()
        .isNumeric()
        .isLength({min: 1, max: 100000000 })
        .withMessage("Inventory Price incorrect - Please enable client-side validation and use application for entry")
    ]
  }
  
    /* ******************************
   * Check vehicle data and return errors
   * ***************************** */
    validate.checkVehicleData = async (req, res, next) => {
      const {classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color} = req.body
      let errors = []
      errors = validationResult(req)
      if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        let invSelect = await utilities.buildClassificationList(classification_id);

        res.render("inventory/add-inventory", {
          errors,
          invSelect,
          title: "Add New Vehicle",
          nav,
          classification_id, 
          inv_make, 
          inv_model, 
          inv_description, 
          inv_image, 
          inv_thumbnail, 
          inv_price, 
          inv_year, 
          inv_miles, 
          inv_color        })
        return
      }
      next()
    }

    /* ******************************
   * Check Update data and return errors to edit view
   * ***************************** */
    validate.checkUpdateData = async (req, res, next) => {
      const {classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color, inv_id} = req.body
      let errors = []
      errors = validationResult(req)
      if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        let invSelect = await utilities.buildClassificationList();

        res.render("inventory/edit-inventory", {
          errors,
          invSelect,
          title: "Edit " + inv_make + " " + inv_model,
          nav,
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
          inv_id        })
        return
      }
      next()
    }


module.exports = validate