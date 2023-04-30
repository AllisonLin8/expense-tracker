const express = require('express')
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}
const exphbs = require('express-handlebars'
)
require('./config/mongoose')
const app = express()
const PORT = process.env.PORT

app.engine('hbs', exphbs.engine({ extname: 'hbs' }))
app.set('view engine', 'hbs')

app.get('/', (req, res) => {
    res.render('index')
})

app.listen(PORT, () => {
    console.log(`This server is running on http://localhost:${PORT}`)
})