const express = require('express')
const router = express.Router()
const UserModel = require('../../models/userModel')
const passport = require('passport')

router.get('/register', (req, res) => {
  res.render('register')
})

router.post('/register', async (req, res) => {
  const { name, email, password, confirmPassword } = req.body
  // 預計在此顯示 兩次密碼不同 或任意欄位為空 的提示訊息
  // 找該email是否已存在 若否則新增 若是則顯示提示並渲染register
  const user = await UserModel.findOne({ email })
  if (!user) {
    await UserModel.create({ name, email, password })
    res.redirect('/users/login')
  } else {
    console.log('user exist')// 預計在此行顯示email已註冊的提示訊息
    res.render('register', { name, email, password, confirmPassword })
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
    res.redirect('/users/login')
  })
})

module.exports = router