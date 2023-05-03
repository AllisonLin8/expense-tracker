const express = require('express')
const router = express.Router()
const { validationResult, matchedData } = require('express-validator')
const bcrypt = require('bcryptjs')
const passport = require('passport')
const { checkSignUpData, checkLoginData } = require('../../middleware/validator')
const User = require('../../models/user')

// 瀏覽登入頁面
router.get('/login', (req, res) => {
    res.render('login')
})

// 提交登入資料
router.post('/login', (req, res, next) => {
    const { email, password } = req.body
    const flashErrors = []
    if (!email || !password) {
        flashErrors.push({ message: '請輸入Email和Password。' })
        return res.render('login', { flashErrors })
    }
    next()
}, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/users/login'
}))

// 瀏覽註冊頁面
router.get('/register', (req, res) => {
    res.render('register')
})

// 提交註冊資料
router.post('/register', checkSignUpData, async (req, res) => {

    const { name, email, password, confirmPassword } = req.body
    const result = validationResult(req)

    try {
        if (result.isEmpty()) {
            const { name, email, password } = matchedData(req)
            // console.log('註冊新的使用者', name, email, password)
            const hash = await bcrypt.hash(password, await bcrypt.genSalt(10))
            // console.log('密碼處理', name, email, hash)
            await User.create({ name, email, password: hash })
            res.redirect('/users/login')
        } else {
            // console.log('註冊資料錯誤或有缺')
            const errors = result.array()
            res.render('register', { name, email, password, confirmPassword, errors })
        }
    } catch (err) {
        console.log(err)
    }
})

// 登出
router.get('/logout', (req, res, next) => {
    req.logout(err => {
        if (err) { return next(err) }
        req.flash('success_msg', '你已經成功登出。')
        res.redirect('/users/login')
    })
})

module.exports = router