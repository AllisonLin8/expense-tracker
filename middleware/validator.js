const { body } = require('express-validator')
const User = require('../models/user')
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
const checkSignUpData = [
    body('name')
        .trim()
        .notEmpty().withMessage('請填入名稱。')
        .bail() // 如果上一個條件不合格，就停止接下來的驗證。
        .isLength({ min: 1, max: 9 }).withMessage('名稱至少1個字、至多9個字。'),
    body('email')
        .trim()
        .notEmpty().withMessage('請填入Email。')
        .bail() // 如果上一個條件不合格，就停止接下來的驗證。
        .custom(async (value) => {
            const user = await User.findOne({ email: value })
            if (user) {
                throw new Error('這個Email已經註冊過了。')
            }
        }),
    body('password')
        .trim()
        .notEmpty().withMessage('請填入Password。')
        .bail() // 如果上一個條件不合格，就停止接下來的驗證。
        .isLength({ min: 2 }).withMessage('Password至少6個字。'), // 測試時先用最少2個字
    body('confirmPassword')
        .trim()
        .notEmpty().withMessage('請填入Confirm Password。')
        .bail() // 如果上一個條件不合格，就停止接下來的驗證。
        .custom((value, { req }) => {
            return value === req.body.password
        }).withMessage('Password與Confirm Password不相符。')
]

module.exports = { checkRecord, checkSignUpData }