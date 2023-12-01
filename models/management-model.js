const pool = require('../database/');

/* ***************************
 *  Post New Classification
 * ************************** */
async function createClass(classification_name) {
   try {
      const data = await pool.query(
         `INSERT INTO public.classification (classification_name) VALUES ($1)`,
         [classification_name]
      );
      return data.rows;
   } catch (error) {
      console.error('CreateClass error ' + error);
   }
}

/* ***************************
 * Post new Vehicle
 * ************************** */
async function createVehicle(data) {
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
   try {
      const data = await pool.query(
         `INSERT INTO public.inventory(inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
         [
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
         ]
      );
      return data.rows;
   } catch (error) {
      console.error('CreateVehicle error ' + error);
   }
}

module.exports = { createClass, createVehicle };
