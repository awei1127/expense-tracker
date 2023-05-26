// 載入種子資料
const records = require('./records.json')
const db = require('../../config/mongoose')
const RecordModel = require('../recordModel')
const UserModel = require('../userModel')
const CategoryModel = require('../categoryModel')
const bcrypt = require('bcryptjs')
const SEED_USER = [
  {
    name: 'user1',
    email: 'user1@example.com',
    password: '12345678',
  },
  {
    name: 'user2',
    email: 'user2@example.com',
    password: '12345678',
  }
]

db.once('open', async () => {
  // 先處理好recordSeedData。具體來說要根據category名稱加上categoryId，以及把String類型的日期資訊轉換成Date類型。
  const recordSeedData = records.results  // 載入records.json資料
  const categories = await CategoryModel.find().lean().sort({ _id: 'asc' }) // 從資料庫取得所有類別資料(陣列)

  recordSeedData.forEach(record => {
    // 用category名稱找到categoryId並新增到record
    const category = categories.find(category => category.name === record.category)
    record.categoryId = category._id
    // 將日期資料從String轉為Date類型
    record.date = new Date(record.date)
  })

  // 先分別寫好兩個Promise。一是創兩個user。二是拿著這兩個user創record。
  function userPromise() {
    return Promise.all(Array.from(SEED_USER, seedUser => {
      return bcrypt.genSalt(10)
        .then(salt => bcrypt.hash(seedUser.password, salt))
        .then(hash => UserModel.create({
          name: seedUser.name,
          email: seedUser.email,
          password: hash
        }))
    }))
  }

  function recordPromise(users) {
    return Promise.all(Array.from(users, (seedUser, i) => {
      return Promise.all(Array.from(recordSeedData, (record, j) => {
        if (i * 3 <= j && j < (i + 1) * 3) {
          return RecordModel.create({
            name: record.name,
            date: record.date,
            amount: record.amount,
            categoryId: record.categoryId,
            userId: seedUser._id
          })
        }
      }))
    }))
  }

  // 執行兩個Promise
  const users = await userPromise()
  await recordPromise(users)
  console.log('users and records created.')
  process.exit()
})


