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
 *  Update Inventory Data
 * ************************** */
async function updateInventory(
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
) {
  try {
    const sql =
      "UPDATE public.inventory SET inv_make = $1, inv_model = $2, inv_description = $3, inv_image = $4, inv_thumbnail = $5, inv_price = $6, inv_year = $7, inv_miles = $8, inv_color = $9, classification_id = $10 WHERE inv_id = $11 RETURNING *"
    const data = await pool.query(sql, [
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
      inv_id
    ])
    return data.rows[0]
  } catch (error) {
    console.error("model error: " + error)
  }
}

/* ***************************
 *  Delete Inventory Data
 * ************************** */
async function deleteInventory(inv_id) {
  try {
    const sql =
      "DELETE FROM public.inventory WHERE inv_id = $1";
    const data = await pool.query(sql, [inv_id])
    return data
  } catch (error) {
    console.error("model error: " + error)
  }
}

/* ***************************
 *  Post Comment Data
 * ************************** */
async function createComment(data) {
  const {
     comment_body,
     inv_id,
     commenter_id,
     commenter
  } = data;

  const comment_date = new Date().toLocaleString();
  try {
     const data = await pool.query(
        `INSERT INTO public.comments(comment_body, inv_id, commenter, commenter_id, comment_date) VALUES ($1,$2,$3,$4,$5)`,
        [
          comment_body,
          inv_id,
          commenter,
          commenter_id,
          comment_date
        ]
     );
     return data.rows;
  } catch (error) {
     console.error('createComment error ' + error);
  }
}

/* ***************************
 *  Get all comments by inv_id
 * ************************** */
async function getCommentsByInvId(inv_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.comments 
      WHERE inv_id = $1`,
      [inv_id]
    )
    return data.rows
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
  }
}
module.exports = {getClassifications, getInventoryByClassificationId, getItemByInventoryId, updateInventory, deleteInventory, createComment, getCommentsByInvId};
