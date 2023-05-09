const express = require('express')
const router = express.Router()
const dateTrans = require('../../config/dateTrans')
const RecordModel = require('../../models/recordModel')
const UserModel = require('../../models/userModel')

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
  const record = await RecordModel.findOne({ _id })
  Object.assign(record, req.body) // 把使用者輸入的一筆資料賦值給從資料庫找出的一筆資料
  await record.save()
  res.redirect('/')
})

// 刪
router.delete('/:id', async (req, res) => {
  const _id = req.params.id
  await RecordModel.findOneAndDelete({ _id })
  res.redirect('/')
})

module.exports = router