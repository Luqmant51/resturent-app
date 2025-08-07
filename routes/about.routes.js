const express = require('express');
const { about } = require('../controllers/about.controller');
const router = express.Router();

router.route('/').get(about);

module.exports = router;
