const express = require('express');
const router = express.Router();
const controller = require('../controllers/pantryController.js');
const { login } = require('../auth/auth.js');
const { verify } = require('jsonwebtoken');

// Get Requests
router.get('/', controller.show_home);
router.get('/login', controller.show_login);
router.get('/register', controller.show_register);
router.get('/home', verify, controller.user_home);

// Post Routes
router.post('/register', controller.handle_register);
router.post('/login', login, controller.handle_login)
module.exports = router;