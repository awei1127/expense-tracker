const express = require('express')
const router = express.Router()
const tools = require('../../config/tools')
const RecordModel = require('../../models/recordModel')
const CategoryModel = require('../../models/categoryModel')

// 查
router.get('/', async (req, res) => {
  const userId = req.user._id
  const records = await RecordModel.find({ userId }).lean().sort({ _id: 'asc' })
  const categories = await CategoryModel.find().lean().sort({ _id: 'asc' })

  // 轉換date格式
  records.forEach(record => {
    record.date = tools.formatDate(record.date)
  })

  res.render('index', { records, categories })
})

router.get('/new', async (req, res) => {
  const date = tools.getToday()
  const categories = await CategoryModel.find().lean().sort({ _id: 'asc' })
  res.render('new', { date, categories })
})

// 增
router.post('/new', async (req, res) => {
  const { name, date, amount, categoryId } = req.body
  const userId = req.user._id
  await RecordModel.create({ name, date, amount, userId, categoryId })
  res.redirect('/')
})

module.exports = router