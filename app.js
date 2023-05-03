const express = require('express')
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const session = require('express-session')
const flash = require('connect-flash')

require('./config/mongoose')

const routes = require('./routes')
const helpers = require('./utility/helper')
const usePassport = require('./config/passport')
const app = express()
const PORT = process.env.PORT

app.engine('hbs', exphbs.engine({ extname: 'hbs', helpers: helpers }))
app.set('view engine', 'hbs')

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}))
usePassport(app)
app.use(flash())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use((req, res, next) => {
    res.locals.isAuthenticated = req.isAuthenticated()
    res.locals.user = req.user
    res.locals.success_msg = req.flash('success_msg')
    res.locals.warning_msg = req.flash('warning_msg')
    next()
})
app.use(routes)

app.listen(PORT, () => {
    console.log(`This server is running on http://localhost:${PORT}`)
})