const express = require('express')
const router = express.Router()
const { validationResult, matchedData, body } = require('express-validator')
const { checkRecord } = require('../../middleware/validator')
const Record = require('../../models/record')
const Category = require('../../models/category')
const categoryIconList = require('../../utility/categoryIconList')

// 瀏覽新增支出的頁面
router.get('/new', (req, res) => {
    res.render('new')
})

// 提交一筆支出
router.post('/new', checkRecord, async (req, res) => {

    const { name, date, categoryId, amount } = req.body
    const result = validationResult(req)

    if (result.isEmpty()) { // 資料驗證正確
        try {
            const validData = matchedData(req)
            const categoryList = await Category.find({}).lean() // 找出所有category
            const categoryExists = categoryList.find(category => { return validData.categoryId === category.name })
            if (categoryExists) { // 如果categoryExists存在，使用categoryExists的_id建立新record
                await Record.create(Object.assign(validData, { categoryId: categoryExists._id }))
                res.redirect('/')
            } else { // 如果categoryExists不存在，先新建category並取得_id，再建立新record
                const category = await Category.create({
                    name: validData.categoryId,
                    icon: categoryIconList[validData.categoryId]
                })
                await Record.create(Object.assign(validData, { categoryId: category._id }))
                res.redirect('/')
            }
        } catch (err) {
            console.log(err)
        }
    } else { // 資料驗證錯誤
        const errors = result.array()
        res.render('new', { name, date, amount, errors })
    }
})

module.exports = router