const utilities = require('../utilities/');
const manModel = require('../models/management-model');

const manController = {};

/* ****************************************
 *  Deliver Management view
 * *************************************** */
manController.buildInventoryManagement = async function (req, res, next) {
   const nav = await utilities.getNav();
   const title = 'Vehicle Management';
   res.render('management/management', {
      title,
      nav,
      errors: null,
   });
};

/* ****************************************
 *  Deliver new class view
 * *************************************** */
manController.buildNewClass = async function (req, res, next) {
   let nav = await utilities.getNav();
   res.render('management/add-classification', {
      title: 'Create a new Class',
      nav,
      errors: null,
      name: null
   });
};

/* ****************************************
 *  Deliver new vehicle view
 * *************************************** */
manController.buildRegister = async function (req, res, next) {
   let nav = await utilities.getNav();
   res.render('management/add-inventory', {
      title: 'Create a new vehicle',
      nav,
      errors: null,
   });
};

// invCont.postNewClass = utilities.handleErrors(async function (req, res, next) {
//    const nav = await utilities.getNav();
//    const form = await utilities.buildNewClassForm(req.query);
//    if (utilities.validateNewClass(req.query)) {
//       const result = invModel.createClass(req.query.classname);
//       if (result) {
//          req.flash('Success', `Added ${req.query.classname} to database`);
//          res.status(201).render('./inventory/add-classification', {
//             title: 'Add New Class',
//             nav,
//             form,
//          });
//       } else {
//          req.flash(
//             'notice',
//             `Couldn't post ${req.query.classname} to Database`
//          );
//          res.status(201).render('./inventory/add-classification', {
//             title: 'Add New Class',
//             nav,
//             form,
//          });
//       }
//    } else {
//       req.flash('notice', 'Provide a correct class name.');
//       res.status(201).render('./inventory/add-classification', {
//          title: 'Add New Class',
//          nav,
//          form,
//       });
//    }
// });

/* ****************************************
 *  Process new class
 * *************************************** */
manController.addClass = async function (req, res) {
   let nav = await utilities.getNav();
   const { classification_name } = req.body;

   const Result = await manModel.createClass(classification_name);

   if (Result) {
      req.flash(
         'notice',
         `The ${classification_name} class was created`
      );
      res.status(201).render('management/management', {
         title: 'Vehicle Management',
         nav,
      });
   } else {
      req.flash('notice', 'Sorry, failed to create class.');
      res.status(501).render('management/add-classification', {
         title: 'Create a new Class',
         nav,
         name: classification_name
      });
   }
};

/* ****************************************
 *  Process new vehicle
 * *************************************** */
manController.addVehicle = async function (req, res) {
   let nav = await utilities.getNav();
   const {
      account_firstname,
      account_lastname,
      account_email,
      account_password,
   } = req.body;

   const regResult = await manModel.createVehicle(
      account_firstname,
      account_lastname,
      account_email,
      account_password
   );

   if (regResult) {
      req.flash(
         'notice',
         `Congratulations, you\'re registered ${account_firstname}. Please log in.`
      );
      res.status(201).render('account/login', {
         title: 'Login',
         nav,
      });
   } else {
      req.flash('notice', 'Sorry, the registration failed.');
      res.status(501).render('account/register', {
         title: 'Registration',
         nav,
      });
   }
};
module.exports = manController;
