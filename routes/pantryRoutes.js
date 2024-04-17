const express = require('express');
const router = express.Router();
const controller = require('../controllers/pantryController.js');
const { login } = require('../auth/auth.js');
const { verifyUser } = require('../auth/auth.js');
const { verifyPantry } = require('../auth/auth.js');
const { verifyAdmin } = require('../auth/auth.js');
const { logout } = require('../auth/auth.js');

// Get Requests
router.get('/', controller.show_home);
router.get('/login', controller.show_login);
router.get('/register', controller.show_register);
router.get('/home', verifyUser, controller.user_home);
router.get('/about', controller.show_about);
router.get('/contact', controller.show_contact);
router.get('/locations', controller.show_locations);
router.get('/donate', verifyUser, controller.show_donate);
router.get('/history', verifyUser, controller.show_user_history);
router.get('/pantryhome', verifyUser, controller.show_pantry_home);
router.get('/pantryrequests', verifyPantry, controller.show_pantry_requests);
router.get('/pantrydeliveries', verifyPantry, controller.show_pantry_deliveries);
router.get('/pantryhistory', verifyPantry, controller.show_pantry_history);
router.get('/pantryMarket', verifyPantry, controller.show_pantry_market);
router.get('/adminpantries', verifyAdmin, controller.show_admin_pantries);
router.get('/adminaddpantry', verifyAdmin, controller.show_add_pantry);
router.get('/logout', logout, controller.handle_user_logout);
router.get('/adminuser', verifyAdmin, controller.show_admin_users);
router.get('/admintypes', verifyAdmin, controller.show_admin_types)
router.get('/adminaddtype', verifyAdmin, controller.show_add_type);

// Post Routes
router.post('/register', controller.handle_register);
router.post('/login', login, controller.handle_login);
router.post('/donate', verifyUser, controller.handle_donate);
router.post('/reqStatus', verifyPantry, controller.handle_request_status);
router.post('/confirmDelivery', verifyPantry, controller.handle_delivery_status);
router.post('/acceptMarketItem', verifyPantry, controller.handle_market_accept);
router.post('/addPantry', verifyAdmin, controller.handle_add_pantry);
router.post('/deleteUser', verifyAdmin, controller.handle_delete_user);
router.post('/addType', verifyAdmin, controller.handle_add_type);
router.post('/deleteType', verifyAdmin, controller.handle_delete_type);

module.exports = router;