// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")

// Route to build inventory management view
router.get("/", invController.buildInventoryManagement);

// Route to build add classification view
router.get("/add-class", invController.buildAddClass);

router.get("/new-class", invController.postNewClass);

// Route to build add vehicle view
router.get("/add-vehicle", invController.buildAddVehicle);

router.get("/new-vehicle", invController.postNewVehicle);

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route to build details page
router.get("/detail/:invId", invController.buildByInventoryId);

module.exports = router;