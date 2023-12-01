const pool = require("../database/")

/* *****************************
*   Register new account
* *************************** */
async function registerAccount(account_firstname, account_lastname, account_email, account_password){
   try {
     const sql = "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *"
     return await pool.query(sql, [account_firstname, account_lastname, account_email, account_password])
   } catch (error) {
     return error.message
   }
 }

/* *****************************
* Return account data using email address
* ***************************** */
async function getAccountByEmail (account_email) {
  try {
    console.log('account model ln 20')
    const result = await pool.query(
      'SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_email = $1',
      [account_email])
      console.log(result)
    return result.rows[0]
  } catch (error) {
    return new Error("No matching email found")
  }
}

async function emailNotInUse (account_email) {
  try {
    await pool.query(
      'SELECT account_email FROM account WHERE account_email = $1',
      [account_email])
    return false
  } catch (error) {
    return true
  }
}

 module.exports = {registerAccount, getAccountByEmail, emailNotInUse};