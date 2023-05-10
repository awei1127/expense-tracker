const categories = require('./categories.json')
const db = require('../../config/mongoose')
const CategoryModel = require('../categoryModel')

db.once('open', async () => {

  const categorySeedData = categories.results

  try {
    await Promise.all(Array.from(categorySeedData, category => {
      return CategoryModel.create({
        name: category.name,
        icon: category.icon
      })
    }))
  } catch {
    console.log(error)
  }

  console.log('category created.')
  process.exit()
})