const express = require('express')
const router = express.Router()
const dateTrans = require('../config/dateTrans')
const RecordModel = require('../models/recordModel')
const UserModel = require('../models/userModel')
const passport = require('passport')


// 查
router.get('/', async (req, res) => {
  const records = await RecordModel.find().lean().sort({ _id: 'asc' })

  // 轉換date格式
  records.forEach(record => {
    record.date = dateTrans.formatDate(record.date)
  })

  res.render('index', { records })
})

router.get('/new', (req, res) => {
  const date = dateTrans.getToday()
  res.render('new', { date })
})

// 增
router.post('/new', async (req, res) => {
  const { name, date, amount } = req.body
  await RecordModel.create({ name, date, amount })
  console.log('record created.')
  res.redirect('/')
})

router.get('/records/:id/edit', async (req, res) => {
  const _id = req.params.id
  const record = await RecordModel.findOne({ _id })
  const { name, date, amount } = record
  const formatDate = dateTrans.formatDate(date)
  res.render('edit', { name, date: formatDate, amount, _id })
})

// 改
router.put('/records/:id/edit', async (req, res) => {
  const _id = req.params.id
  const record = await RecordModel.findOne({ _id })
  Object.assign(record, req.body) // 把使用者輸入的一筆資料賦值給從資料庫找出的一筆資料
  await record.save()
  res.redirect('/')
})

// 刪
router.delete('/records/:id', async (req, res) => {
  const _id = req.params.id
  await RecordModel.findOneAndDelete({ _id })
  res.redirect('/')
})

router.get('/register', (req, res) => {
  res.render('register')
})

router.post('/register', async (req, res) => {
  const { name, email, password, confirmPassword } = req.body
  // 預計在此顯示 兩次密碼不同 或任意欄位為空 的提示訊息
  // 找該email是否已存在 若否則新增 若是則顯示提示並渲染register
  const user = await UserModel.findOne({ email })
  if (!user) {
    await UserModel.create({ name, email, password })
    res.redirect('/login')
  } else {
    console.log('user exist')// 預計在此行顯示email已註冊的提示訊息
    res.render('register', { name, email, password, confirmPassword })
  }
})

router.get('/login', (req, res) => {
  res.render('login')
})

router.post('/login', passport.authenticate('local', {
  failureRedirect: '/login',
  successRedirect: '/'
}))

router.post('/logout', (req, res) => {
  req.logOut(() => {
    res.redirect('/login')
  })
})

module.exports = router