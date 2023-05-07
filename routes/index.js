const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
  res.render('index')
})

router.get('/new', (req, res) => {
  res.render('new')
})

router.get('/:id/edit', (req, res) => {
  res.render('edit')
})

router.get('/register', (req, res) => {
  res.render('register')
})

router.get('/login', (req, res) => {
  res.render('login')
})

module.exports = router