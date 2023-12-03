const utilities = require("../utilities/")
const baseController = {}

baseController.buildHome = async function(req, res){
  const nav = await utilities.getNav()
  
  let loggedin = false;
  if(res.locals.loggedin){
    loggedin = true;
  }
console.log()
  res.render("index", {title: "Home", nav, loggedin, account: res.locals.accountData})
}

module.exports = baseController