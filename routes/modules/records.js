const express = require('express')
const router = express.Router()
const dateTrans = require('../../config/dateTrans')
const RecordModel = require('../../models/recordModel')

router.get('/:id/edit', async (req, res) => {
  const _id = req.params.id
  const record = await RecordModel.findOne({ _id })
  const { name, date, amount } = record
  const formatDate = dateTrans.formatDate(date)
  res.render('edit', { name, date: formatDate, amount, _id })
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