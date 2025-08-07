const express = require('express')
const router = express.Router()
const userController = require('../controllers/user.controller')

router
    .route('/')
    .get(userController.getalluser)
router
    .route('/:id')
    .get(userController.getuserbyid)

router
    .route('/:id/make-admin')
    .post(userController.toggleAdmin);

module.exports = router