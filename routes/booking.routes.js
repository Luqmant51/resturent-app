const express = require('express');
const { book } = require('../controllers/booking.controller');
const router = express.Router();

router.route('/').get(book);

module.exports = router;
