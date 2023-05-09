const express = require('express')
const router = express.Router()
const tools = require('../../config/tools')
const RecordModel = require('../../models/recordModel')
const CategoryModel = require('../../models/categoryModel')

router.get('/:id/edit', async (req, res) => {
  const _id = req.params.id
  const userId = req.user._id
  const record = await RecordModel.findOne({ _id, userId })
  const categories = await CategoryModel.find().lean().sort({ _id: 'asc' })
  const { name, date, amount, categoryId } = record
  // 在類別清單中，為已選中的類別加上isSelected屬性。
  categories.forEach(category => {
    if (category._id.toString() === categoryId.toString()) {
      category.isSelected = true
    }
  })
  const formatDate = tools.formatDate(date)
  res.render('edit', { name, date: formatDate, amount, _id, categories })
})

// 改
router.put('/:id/edit', async (req, res) => {
  const _id = req.params.id
  const userId = req.user._id
  const record = await RecordModel.findOne({ _id, userId })
  Object.assign(record, req.body) // 把使用者輸入的一筆資料賦值給從資料庫找出的一筆資料
  await record.save()
  res.redirect('/')
})

// 刪
router.delete('/:id', async (req, res) => {
  const _id = req.params.id
  const userId = req.user._id
  await RecordModel.findOneAndDelete({ _id, userId })
  res.redirect('/')
})

module.exports = router