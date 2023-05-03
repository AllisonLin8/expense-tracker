const express = require('express')
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
require('./config/mongoose')
const routes = require('./routes')
const helpers = require('./utility/helper')
const app = express()
const PORT = process.env.PORT

app.engine('hbs', exphbs.engine({ extname: 'hbs', helpers: helpers }))
app.set('view engine', 'hbs')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(routes)

app.listen(PORT, () => {
    console.log(`This server is running on http://localhost:${PORT}`)
})