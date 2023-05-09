const mongoose = require('mongoose')
const { Schema } = mongoose

const categorySchema = new Schema({
  name: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    default: 'fa-sharp fa-solid fa-star fa-2xl'
  }
})

module.exports = mongoose.model('CategoryModel', categorySchema)