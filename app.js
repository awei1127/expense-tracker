const express = require('express')
const exphbs = require('express-handlebars')
const app = express()
const PORT = 3000

app.engine('.hbs', exphbs.engine({ extname: '.hbs', defaultLayout: 'main' }))
app.set('view engine', '.hbs')

app.get('/', (req, res) => {
  res.render('index')
})

app.get('/new', (req, res) => {
  res.render('new')
})

app.get('/:id/edit', (req, res) => {
  res.render('edit')
})

app.get('/register', (req, res) => {
  res.render('register')
})

app.get('/login', (req, res) => {
  res.render('login')
})

app.listen(PORT, () => {
  console.log(`app is listening at http://localhost:${PORT}/`)
})