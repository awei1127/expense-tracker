const express = require('express')
const exphbs = require('express-handlebars')
const app = express()
const routes = require('./routes')
require('./config/mongoose')

// 僅在非正式環境時, 使用 dotenv
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

app.engine('.hbs', exphbs.engine({ extname: '.hbs', defaultLayout: 'main' }))
app.set('view engine', '.hbs')
app.use(routes)

app.listen(process.env.PORT, () => {
  console.log(`app is listening at http://localhost:${process.env.PORT}/`)
})