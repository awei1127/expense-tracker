const express = require('express')
const router = express.Router()
const { authenticator } = require('../middleware/auth')
const users = require('./modules/users')
const home = require('./modules/home')
const records = require('./modules/records')

router.use('/users', users)
router.use('/records', authenticator, records)
router.use('/', authenticator, home)

module.exports = router