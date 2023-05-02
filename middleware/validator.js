const { body } = require('express-validator')
const checkRecord = [
    body('name')
        .trim()
        .notEmpty().withMessage('請填入名稱。')
        .bail() // 如果上一個條件不合格，就停止接下來的驗證。
        .isLength({ min: 1, max: 25 }).withMessage('名稱至少1個字、至多25個字。'),
    body('date').notEmpty().withMessage('請選擇日期。'),
    body('categoryId').notEmpty().withMessage('請選擇類別。'),
    body('amount')
        .trim()
        .notEmpty().withMessage('請填入金額。')
        .bail() // 如果上一個條件不合格，就停止接下來的驗證。
        .isLength({ min: 1, max: 9 }).withMessage('金額至少1位數、至多9位數。')
]
module.exports = { checkRecord }