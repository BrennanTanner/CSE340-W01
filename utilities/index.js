const invModel = require('../models/inventory-model');
const Util = {};
const jwt = require('jsonwebtoken');
require('dotenv').config();

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

/* **************************************
 * Build the comments view HTML
 * ************************************ */
Util.buildCommentList = async function (commentArray) {
   let list;
   list = '<div id="comments-display">';
   if (commentArray.length) {
      commentArray.forEach((comment) => {
         list += '<div class="comment">';
         list += '<div class="comment-title">';

         list += '<h4>' + comment.commenter + '</h4>';
         list += '<h5>' + comment.comment_date + '</h5>';
         list += '</div>';
         list += '<p>' + comment.comment_body + '</p>';
         
         list += '</div>';
      });
   } else {
      list += '<p class="notice">No comments yet</p>';
   }
   list += '</div>';
   return list;
};

/* **************************************
 * Build the new comment form HTML
 * ************************************ */
Util.buildCommentForm = async function (inv_id) {
   let form;

   form = '<div class="comment-form">';
   form += `<form action="/inv/new-comment/${inv_id}" method="post">`;

   form += '<label for="comment_body">New Comment</label>';
   form +=
      '<textarea id="comment_body"  name="comment_body" rows="4" cols="50" required ></textarea>';
   form += '<input type="submit" class="btn-main" value="Comment" />';
   form += '</form>';

   return form;
};

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for
 * General Error Handling
 **************************************** */
Util.handleErrors = (fn) => (req, res, next) =>
   Promise.resolve(fn(req, res, next)).catch(next);

/* ****************************************
 *  Check Login for homepage
 * ************************************ */
Util.checkAdmin = (req, res, next) => {
   if (res.locals.accountData.account_type == 'Client') {
      req.flash(
         'notice',
         "You don't have access to this page, try logging in with a different account."
      );
      return res.redirect('/account/');
   }
   next();
};

/* ****************************************
 *  Check Login
 * ************************************ */
Util.checkLogin = (req, res, next) => {
   if (res.locals.loggedin) {
      next();
   } else {
      req.flash('notice', 'Please log in.');
      return res.redirect('/account/login');
   }
};

/* ****************************************
 *  Log outa
 * ************************************ */
Util.logout = (req, res, next) => {
   res.clearCookie('jwt');
   return res.redirect('/');
};

/* ****************************************
 * Middleware to check token validity
 **************************************** */
Util.checkJWTToken = (req, res, next) => {
   if (req.cookies.jwt) {
      jwt.verify(
         req.cookies.jwt,
         process.env.ACCESS_TOKEN_SECRET,
         function (err, accountData) {
            if (err) {
               req.flash('Please log in');
               res.clearCookie('jwt');
               return res.redirect('/account/login');
            }
            res.locals.accountData = accountData;
            res.locals.loggedin = 1;
            next();
         }
      );
   } else {
      next();
   }
};

module.exports = Util;
