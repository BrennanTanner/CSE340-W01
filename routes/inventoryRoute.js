// Needed Resources
const express = require('express');
const router = new express.Router();
const invController = require('../controllers/invController');
const managementController = require('../controllers/managmentController');
const utilities = require('../utilities/index');
const managementValidate = require('../utilities/management-validation');

// Route to build inventory management view
router.get('/', utilities.handleErrors(managementController.buildInventoryManagement));

// Route to build new class view
router.get(
   '/new-class',
   utilities.handleErrors(managementController.buildNewClass)
);
// Process the new class data
router.post(
   '/new-class',
   managementValidate.classRules(),
   managementValidate.checkClassData,
   utilities.handleErrors(managementController.addClass)
);

// Route to build new vehicle view
router.get(
   '/new-vehicle',
   utilities.handleErrors(managementController.buildNewVehicle)
);
// Process the new class data
router.post(
   '/new-vehicle',
   managementValidate.vehicleRules(),
   managementValidate.checkVehicleData,
   utilities.handleErrors(managementController.addVehicle)
);

// Route to build inventory by classification view
router.get(
   '/type/:classificationId',
   utilities.handleErrors(invController.buildByClassificationId)
);

// Route to build details page
router.get(
   '/detail/:invId',
   utilities.handleErrors(invController.buildByInventoryId)
);

module.exports = router;
