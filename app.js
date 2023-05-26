const express = require('express')
const exphbs = require('express-handlebars')
const app = express()
const routes = require('./routes')
const methodOverride = require('method-override')
const session = require('express-session')
const usePassport = require('./config/passport')
const flash = require('connect-flash')
require('./config/mongoose')
const PORT = process.env.PORT || 3000

// 僅在非正式環境時, 使用 dotenv
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

app.engine('.hbs', exphbs.engine({ extname: '.hbs', defaultLayout: 'main' }))
app.set('view engine', '.hbs')
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(session({ secret: process.env.SESSION_SECRET, resave: true, saveUninitialized: true }))
usePassport(app)
app.use(flash())
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated()
  res.locals.user = req.user
  res.locals.success_msg = req.flash('success_msg')  // 設定 success_msg 訊息
  res.locals.warning_msg = req.flash('warning_msg')  // 設定 warning_msg 訊息
  next()
})

app.use(routes)

app.listen(PORT, () => {
  console.log(`app is listening at http://localhost:${PORT}`)
})