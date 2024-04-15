const express = require('express');
const router = express.Router();
const controller = require('../controllers/pantryController.js');

// Get Requests
router.get('/', controller.show_home);


module.exports = router;