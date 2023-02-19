const express = require('express')
const router = express.Router()
const multer = require("multer")
const UserController = require('../controllers/user')

router.post('/register', UserController.register)
router.post("/login", UserController.login)
router.get("/profile/:id",UserController.profile)
router.get("/list/:page?", UserController.list)
module.exports = router