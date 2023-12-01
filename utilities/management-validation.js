const utilities = require('.');
const { body, validationResult } = require('express-validator');
const validate = {};

/*  **********************************
 * Class Data Validation Rules
 * ********************************* */
validate.classRules = () => {
   return [
      // class is required and must be string
      body('classification_name')
         .trim()
         .notEmpty()
         .withMessage('Please provide a class name'), // on error this message is sent.

      // no special characters
      body('classification_name')
         .trim()
         .matches('[a-zA-Z0-9]+')
         .withMessage('No special characters allowed'), // on error this message is sent.
   ];
};

/*  **********************************
 * Class Data Validation Rules
 * ********************************* */
validate.vehicleRules = () => {
   return [
      // class is required and must be string
      body('classification_name')
         .trim()
         .isLength({ min: 1 })
         .withMessage('Please provide a class name'), // on error this message is sent.
   ];
};

/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkClassData = async (req, res, next) => {
   const { classification_name } = req.body;
   let errors = [];
   errors = validationResult(req);
   if (!errors.isEmpty()) {
      let nav = await utilities.getNav();
      res.render('management/add-classification', {
         errors,
         title: 'Create a new Class',
         nav,
         name: classification_name,
      });
      return;
   }
   next();
};

/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkVehicleData = async (req, res, next) => {
   const { classification_name } = req.body;
   let errors = [];
   errors = validationResult(req);
   if (!errors.isEmpty()) {
      let nav = await utilities.getNav();
      res.render('management/add-classification', {
         errors,
         title: 'Create a new Class',
         nav,
         classification_name,
      });
      return;
   }
   next();
};

module.exports = validate;
