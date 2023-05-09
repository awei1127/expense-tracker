const express = require('express')
const router = express.Router()
const dateTrans = require('../../config/dateTrans')
const RecordModel = require('../../models/recordModel')
const UserModel = require('../../models/userModel')

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

module.exports = router