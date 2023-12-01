const invModel = require('../models/inventory-model');
const Util = {};

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
   let data = await invModel.getClassifications();
   let list = '<ul>';
   list += '<li><a href="/" title="Home page">Home</a></li>';
   data.rows.forEach((row) => {
      list += '<li>';
      list +=
         '<a href="/inv/type/' +
         row.classification_id +
         '" title="See our inventory of ' +
         row.classification_name +
         ' vehicles">' +
         row.classification_name +
         '</a>';
      list += '</li>';
   });
   list += '</ul>';
   return list;
};

/* **************************************
 * Build the classification view HTML
 * ************************************ */
Util.buildClassificationGrid = async function (data) {
   let grid;
   if (data.length > 0) {
      grid = '<ul id="inv-display">';
      data.forEach((vehicle) => {
         grid += '<li>';
         grid +=
            '<a href="../../inv/detail/' +
            vehicle.inv_id +
            '" title="View ' +
            vehicle.inv_make +
            ' ' +
            vehicle.inv_model +
            'details"><img src="' +
            vehicle.inv_thumbnail +
            '" alt="Image of ' +
            vehicle.inv_make +
            ' ' +
            vehicle.inv_model +
            ' on CSE Motors" /></a>';
         grid += '<div class="namePrice">';
         grid += '<hr />';
         grid += '<h2>';
         grid +=
            '<a href="../../inv/detail/' +
            vehicle.inv_id +
            '" title="View ' +
            vehicle.inv_make +
            ' ' +
            vehicle.inv_model +
            ' details">' +
            vehicle.inv_make +
            ' ' +
            vehicle.inv_model +
            '</a>';
         grid += '</h2>';
         grid +=
            '<span>$' +
            new Intl.NumberFormat('en-US').format(vehicle.inv_price) +
            '</span>';
         grid += '</div>';
         grid += '</li>';
      });
      grid += '</ul>';
   } else {
      grid +=
         '<p class="notice">Sorry, no matching vehicles could be found.</p>';
   }
   return grid;
};

/* **************************************
 * Build the details view HTML
 * ************************************ */
Util.buildItemGrid = async function (data) {
   const vehicle = data[0];
   let grid;
   if (vehicle) {
      grid = '<div id="details-display">';
      grid +=
         '<img src="' +
         vehicle.inv_image +
         '" alt="Image of ' +
         vehicle.inv_make +
         ' ' +
         vehicle.inv_model +
         ' on CSE Motors" >';
      grid += '<div class="details">';
      grid += '<div class="info">';
      grid += '<hr>';
      grid += '<h2>';
      grid +=
         '<span>$' +
         new Intl.NumberFormat('en-US').format(vehicle.inv_price) +
         '</span>';
      grid += '</h2>';

      grid += '<p><strong>Mileage:</strong> ' + vehicle.inv_miles + '</p>';
      grid += '<p><strong>Color:</strong> ' + vehicle.inv_color + '</p>';
      grid += '<p>' + vehicle.inv_description + '</p>';
      grid += '</div>';
      grid += '<div class="buttons">';
      grid += '<button class="btn-main"> Start my Purchase </button>';
      grid += '<button class="btn-secondary"> Contact Us </button>';
      grid += '<button class="btn-secondary"> Schedule a test Drive </button>';
      grid += '<button class="btn-secondary"> Apply for Financing </button>';
      grid += '</div>';
      grid += '</div>';
      grid += '</div>';
   } else {
      grid =
         '<p class="notice">Sorry, that car doesn\'t exsist. Try searching again.</p>';
   }
   return grid;
};

/* ****************************************
 * Middleware for new class
 **************************************** */
Util.validateNewClass = function (data) {
   if (data.classname) {
      return true;
   } else {
      false;
   }
};

/* **************************************
 * Build the new vehicle view HTML
 * ************************************ */
Util.buildNewVehicleForm = async function (data) {
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
   } = data;

   let classes = await invModel.getClassifications();
   let form = '<div class="form">';

   form += '<form action="/inv/add-vehicle" method="POST">';
   form += '<h3>* All fields are required</h3>';
   form += '<div><label for="make">Vehicle Make</label>';
   form += `<input type="text" id="make" value="${
      inv_make || ''
   }" name="inv_make" required/></div>`;

   form += '<div><label for="model">Vehicle Model</label>';
   form += `<input type="text" id="model" value="${
      inv_model || ''
   }"  name="inv_model" required/></div>`;

   form += '<div><label for="year">Vehicle Year</label>';
   form += `<input type="number" id="year" min="1800" max="2023" step="1" 
      value="${
         inv_year || 2023
      }" placeholder="2023" name="inv_year required"/></div>`;

   form += '<div><label for="description">Vehicle Description</label>';
   form += `<textarea id="description" value="${
      inv_description || ''
   }" name="inv_description" rows="4" cols="50" required></textarea></div>`;

   form += '<div><label for="image">Vehicle Image</label>';
   form += `<input type="text" id="image" value="${
      inv_image || '/images/vehicles/no-image.png'
   }"   name="inv_image" required/></div>`;

   form += '<div><label for="thumbnail">Vehicle Thumbnail</label>';
   form += `<input type="text" id="thumbnail" value="${
      inv_thumbnail || '/images/vehicles/no-image-tn.png'
   }"  name="inv_thumbnail" required/></div>`;

   form +=
      '<div class="flex-row"><div ><label for="price">Vehicle Price</label>';
   form += `<input type="number" id="price" placeholder="20000" value="${
      inv_price || 10000
   }"  name="inv_price" required/></div>`;

   form += '<div><label for="miles">Vehicle Miles</label>';
   form += `<input type="number" id="miles" placeholder="50000" value="${
      inv_miles || 10000
   }"  name="inv_miles" required/></div></div>`;

   form += '<div><label for="color">Vehicle Color</label>';
   form += `<input type="text" id="color" value="${
      inv_color || ''
   }"  name="inv_color" required/></div>`;

   form += '<div><label for="classification">Classification</label>';
   form += `<select id="classification" value="${
      classification_id || 'custom'
   }"  name="classification_id" required>`;
   classes.rows.forEach((row) => {
      form +=
         '<option value="' +
         row.classification_id +
         '">' +
         row.classification_name +
         '</option>';
   });
   form += '</select></div>';

   form += '<input type="submit" class="btn-main" value="Submit">';
   form += '</form></div>';
   return form;
};

/* ****************************************
 * Middleware for new vehicle
 **************************************** */
Util.validateNewVehicle = function (data) {
   if (Object.values(data).includes('')) {
      let arr = [];
      Object.entries(data).map(([key, value], i) => {
         if (!value) arr.push(key);
      });
      return arr;
   } else {
      return null;
   }
};

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for
 * General Error Handling
 **************************************** */
Util.handleErrors = (fn) => (req, res, next) =>
   Promise.resolve(fn(req, res, next)).catch(next);

module.exports = Util;
