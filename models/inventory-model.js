const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
   try {
     const data = await pool.query(
       `SELECT * FROM public.inventory AS i 
       JOIN public.classification AS c 
       ON i.classification_id = c.classification_id 
       WHERE i.classification_id = $1`,
       [classification_id]
     )
     return data.rows
   } catch (error) {
     console.error("getclassificationsbyid error " + error)
   }
 }

 /* ***************************
 *  Get specific inventory items by inv_id
 * ************************** */
async function getItemByInventoryId(inventory_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory 
      WHERE inv_id = $1`,
      [inventory_id]
    )
    return data.rows
  } catch (error) {
    console.error("getitembyid error " + error)
  }
}

 /* ***************************
 *  Post New Classification 
 * ************************** */
 async function createClass(className) {
  try {
    const data = await pool.query(
      `INSERT INTO public.classification (classification_name) VALUES ($1)`,
      [className]
    )
    return data.rows
  } catch (error) {
    console.error("CreateClass error " + error)
  }
}

 /* ***************************
 *  Get specific inventory items by inv_id
 * ************************** */
 async function createVehicle(data) {
  const { inv_make, inv_model, inv_year, inv_description,inv_image, inv_thumbnail, inv_price,inv_miles,inv_color, classification_id} = data;
  try {
    const data = await pool.query(
      `INSERT INTO public.inventory(inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
      [inv_make, inv_model, inv_year, inv_description,inv_image, inv_thumbnail, inv_price,inv_miles,inv_color, classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("CreateVehicle error " + error)
  }
}

module.exports = {getClassifications, getInventoryByClassificationId, getItemByInventoryId, createClass, createVehicle};
