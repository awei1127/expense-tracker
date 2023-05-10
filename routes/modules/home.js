const express = require('express')
const router = express.Router()
const tools = require('../../config/tools')
const RecordModel = require('../../models/recordModel')
const CategoryModel = require('../../models/categoryModel')


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

// 查
router.get('/', async (req, res) => {
  const userId = req.user._id
  const records = await RecordModel.find({ userId }).lean().sort({ _id: 'asc' })
  const categories = await CategoryModel.find().lean().sort({ _id: 'asc' })
  let totalAmount = 0

  records.forEach(record => {
    // 轉換date格式
    record.date = tools.formatDate(record.date)
    // 計算總金額
    totalAmount += record.amount
    // 用類別id找出icon並新增到record
    const category = categories.find(category => category._id.toString() === record.categoryId.toString())
    record.icon = category.icon
  })
  res.locals.totalAmount = totalAmount
  res.render('index', { records, categories })
})

// 查特定分類
router.get('/:id/category', async (req, res) => {
  const userId = req.user._id
  const categoryId = req.params.id

  const records = await RecordModel.find({ userId, categoryId }).lean().sort({ _id: 'asc' })
  const categories = await CategoryModel.find().lean().sort({ _id: 'asc' })
  let totalAmount = 0

  records.forEach(record => {
    // 轉換date格式
    record.date = tools.formatDate(record.date)
    // 計算總金額
    totalAmount += record.amount
    // 用類別id找出icon並新增到record
    const category = categories.find(category => category._id.toString() === record.categoryId.toString())
    record.icon = category.icon
  })
  res.locals.totalAmount = totalAmount
  res.render('index', { records, categories })
})

module.exports = router