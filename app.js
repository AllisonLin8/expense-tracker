const express = require('express')
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
require('./config/mongoose')
const routes = require('./routes')
const app = express()
const PORT = process.env.PORT

app.engine('hbs', exphbs.engine({ extname: 'hbs' }))
app.set('view engine', 'hbs')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(routes)

app.listen(PORT, () => {
    console.log(`This server is running on http://localhost:${PORT}`)
})