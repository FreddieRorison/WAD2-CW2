const express = require('express');
const router = express.Router();
const controller = require('../controllers/pantryController.js');
const { login } = require('../auth/auth.js');
const { verify } = require('../auth/auth.js');

// Get Requests
router.get('/', controller.show_home);
router.get('/login', controller.show_login);
router.get('/register', controller.show_register);
router.get('/home', verify, controller.user_home);
router.get('/about', controller.show_about);
router.get('/contact', controller.show_contact);
router.get('/locations', controller.show_locations);
router.get('/donate', controller.show_donate)

// Post Routes
router.post('/register', controller.handle_register);
router.post('/login', login, controller.handle_login)
module.exports = router;