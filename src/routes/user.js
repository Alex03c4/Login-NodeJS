const express = require('express')
const router = express.Router()
const multer = require("multer")
const UserController = require('../controllers/user')

router.post('/register', UserController.register)

module.exports = router