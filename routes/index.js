const express = require('express')
const router = express.Router()
const dateTrans = require('../config/dateTrans')
const RecordModel = require('../models/recordModel')

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

router.get('/login', (req, res) => {
  res.render('login')
})

module.exports = router