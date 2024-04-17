const express = require('express');
const router = express.Router();
const controller = require('../controllers/pantryController.js');
const { login } = require('../auth/auth.js');
const { verify } = require('../auth/auth.js');
const { logout } = require('../auth/auth.js');

// Get Requests
router.get('/', controller.show_home);
router.get('/login', controller.show_login);
router.get('/register', controller.show_register);
router.get('/home', verify, controller.user_home);
router.get('/about', controller.show_about);
router.get('/contact', controller.show_contact);
router.get('/locations', controller.show_locations);
router.get('/donate', verify, controller.show_donate);
router.get('/history', verify, controller.show_user_history);
router.get('/pantryhome', verify, controller.show_pantry_home);
router.get('/pantryrequests', verify, controller.show_pantry_requests);
router.get('/pantrydeliveries', verify, controller.show_pantry_deliveries);
router.get('/pantryhistory', verify, controller.show_pantry_history);
router.get('/pantryMarket', verify, controller.show_pantry_market);
router.get('/adminpantries', verify, controller.show_admin_pantries);
router.get('/adminaddpantry', verify, controller.show_add_pantry);
router.get('/logout', logout, controller.handle_user_logout);
router.get('/adminuser', verify, controller.show_admin_users);
router.get('/admintypes', verify, controller.show_admin_types)
router.get('/adminaddtype', verify, controller.show_add_type);

// Post Routes
router.post('/register', controller.handle_register);
router.post('/login', login, controller.handle_login);
router.post('/donate', verify, controller.handle_donate);
router.post('/reqStatus', verify, controller.handle_request_status);
router.post('/confirmDelivery', verify, controller.handle_delivery_status);
router.post('/acceptMarketItem', verify, controller.handle_market_accept);
router.post('/addPantry', verify, controller.handle_add_pantry);
router.post('/deleteUser', verify, controller.handle_delete_user);
router.post('/addType', verify, controller.handle_add_type);
router.post('/deleteType', verify, controller.handle_delete_type);
module.exports = router;