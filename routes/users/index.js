const express = require('express')
const router = express.Router()
const usersController = require('../../controllers/users')
const guard = require('../../helper/guard')

router.post('/register', usersController.reg)
router.post('/login', usersController.login)
router.post('/logout', guard, usersController.logout)

module.exports = router