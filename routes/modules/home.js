const express = require('express')
const router = express.Router()
const Record = require('../../models/record')
const Category = require('../../models/category')
const { formatDate, totalAmount } = require('../../utility/utility')

// 瀏覽所有的支出紀錄
router.get('/', async (req, res) => {
    try {
        const records = await Record.find().populate({ path: 'categoryId', select: 'icon' }).lean()
        formatDate(records)// 轉換日期格式
        res.render('index', { records, totalAmount: totalAmount(records) })
    } catch (err) {
        console.log(err)
    }
})

// 瀏覽特定的支出紀錄
router.get('/search', async (req, res) => {
    const sortBy = req.query.sortBy
    try {
        const categoryId = await Category.find({ name: sortBy }).lean()
        const records = await Record.find({ categoryId }).populate({ path: 'categoryId', select: 'icon' }).lean()
        formatDate(records)// 轉換日期格式
        res.render('index', { records, totalAmount: totalAmount(records) })
    } catch (err) {
        console.log(err)
    }
})

module.exports = router