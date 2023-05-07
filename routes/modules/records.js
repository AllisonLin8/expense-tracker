const express = require('express')
const router = express.Router()
const { validationResult, matchedData, body } = require('express-validator')
const { checkRecord } = require('../../middleware/validator')
const { formatDate } = require('../../utility/utility')
const Record = require('../../models/record')
const Category = require('../../models/category')
const categoryIconList = require('../../utility/categoryIconList')

// 瀏覽新增支出的頁面
router.get('/new', (req, res) => {
    res.render('new')
})

// 新增一筆支出
router.post('/new', checkRecord, async (req, res) => {

    const { name, date, categoryId, amount } = req.body
    const result = validationResult(req)

    if (result.isEmpty()) { // 資料驗證正確
        try {
            const validData = matchedData(req)
            validData.userId = req.user._id
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
        const categories = Object.keys(categoryIconList).map(key => {
            return { name: key }
        })
        res.render('new', { name, date, categoryId, amount, errors, categories })
    }
})

// 瀏覽修改支出的頁面
router.get('/:recordId/edit', async (req, res) => {

    const userId = req.user._id
    const _id = req.params.recordId

    try {
        const record = await Record.findOne({ _id, userId }).populate({ path: 'categoryId', select: 'name' }).lean()
        formatDate([record]) // 轉換日期格式
        const categories = Object.keys(categoryIconList).map(key => {
            return { name: key }
        })
        res.render('edit', { record, categories })
    } catch (err) {
        console.log(err)
    }
})

// 修改一筆支出
router.put('/:recordId', checkRecord, async (req, res) => {

    const { name, date, categoryId, amount } = req.body
    const userId = req.user._id
    const result = validationResult(req)

    if (result.isEmpty()) { // 資料驗證正確
        try {
            const { name, date, amount, categoryId } = matchedData(req)
            const categoryList = await Category.find({}).lean() // 找出所有category
            const categoryExists = categoryList.find(category => { return categoryId === category.name })
            if (categoryExists) { // 如果categoryExists存在，使用categoryExists的_id儲存修改後的record
                await Record.findOneAndUpdate(
                    { _id: req.params.recordId, userId },
                    { name, date, categoryId: categoryExists._id, amount },
                )
                res.redirect('/')
            } else { // 如果categoryExists不存在，先新建category並取得_id，將_id覆蓋到修改後的record，再儲存updatedRecord
                const category = await Category.create({
                    name: validData.categoryId,
                    icon: categoryIconList[validData.categoryId]
                })
                await Record.findOneAndUpdate(
                    { _id: req.params.recordId, userId },
                    { name, date, categoryId: category._id, amount },
                )
                res.redirect('/')
            }
        } catch (err) {
            console.log(err)
        }
    } else { // 資料驗證錯誤
        req.flash('warning_msg', '所有欄位皆為必填！名稱至少1個字、至多25個字。金額至少1位數、至多9位數。')
        res.redirect(`/records/${req.params.recordId}/edit`)
    }
})

// 刪除一筆支出
router.delete('/:recordId', (req, res) => {
    const userId = req.user._id
    const _id = req.params.recordId
    return Record.findOne({ _id, userId })
        .then(record => record.remove())
        .then(() => res.redirect('/'))
        .catch(err => console.log(err))
})

module.exports = router