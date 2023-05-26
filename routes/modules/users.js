const express = require('express')
const router = express.Router()
const UserModel = require('../../models/userModel')
const passport = require('passport')
const bcrypt = require('bcryptjs')

router.get('/register', (req, res) => {
  res.render('register')
})

router.post('/register', async (req, res) => {
  const { name, email, password, confirmPassword } = req.body
  // 若兩次密碼不同 或任意欄位為空 則顯示提示訊息
  const errors = []
  if (!name || !email || !password || !confirmPassword) {
    errors.push({ message: '所有欄位都是必填。' })
  }
  if (password !== confirmPassword) {
    errors.push({ message: '密碼與確認密碼不相符！' })
  }
  if (errors.length) {
    return res.render('register', {
      errors,
      name,
      email,
      password,
      confirmPassword
    })
  }
  // 找該email是否已存在 若否則新增 若是則顯示提示並渲染register
  const user = await UserModel.findOne({ email })
  if (!user) {
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)
    await UserModel.create({ name, email, password: hash })
    res.redirect('/users/login')
  } else {
    errors.push({ message: '這個 Email 已經註冊過了。' })
    res.render('register', { errors, name, email, password, confirmPassword })
  }
})

router.get('/login', (req, res) => {
  res.render('login')
})

router.post('/login', passport.authenticate('local', {
  failureRedirect: '/users/login',
  successRedirect: '/'
}))

router.post('/logout', (req, res) => {
  req.logOut(() => {
    req.flash('success_msg', '你已經成功登出。')
    res.redirect('/users/login')
  })

})

module.exports = router