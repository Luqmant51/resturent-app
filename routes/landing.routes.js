const express = require('express');
const { landing } = require('../controllers/landing.controller');
const router = express.Router();

router.route('/').get(landing);

module.exports = router;
