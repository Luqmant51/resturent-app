const express = require('express');
const { menu } = require('../controllers/menu.controller');
const router = express.Router();

router.route('/').get(menu);

module.exports = router;
