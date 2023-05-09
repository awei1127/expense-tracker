const mongoose = require('mongoose')
const { Schema } = mongoose

const recordSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'UserModel',
    required: true,
    index: true
  },
  categoryId: {
    type: Schema.Types.ObjectId,
    ref: 'CategoryModel',
    required: true
  }
})

module.exports = mongoose.model('RecordModel', recordSchema)