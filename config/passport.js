const passport = require('passport')
const bcrypt = require('bcryptjs')
const LocalStrategy = require('passport-local').Strategy
const FacebookStrategy = require('passport-facebook').Strategy
const User = require('../models/user')

module.exports = app => {
    // 1.設定middleware-初始化passport套件
    app.use(passport.initialize())
    app.use(passport.session())
    // 2-1.設定登入策略-本地登入
    passport.use(new LocalStrategy({ usernameField: 'email', passReqToCallback: true },
        async (req, email, password, done) => {
            try {
                const user = await User.findOne({ email })
                if (!user) {
                    return done(null, false, req.flash("warning_msg", "這個Email沒有註冊過。"))
                } else {
                    const isMatch = await bcrypt.compare(password, user.password)
                    if (!isMatch) {
                        return done(null, false, req.flash("warning_msg", "Password不正確。"))
                    }
                    return done(null, user)
                }
            } catch (err) {
                done(err, false)
            }
        }))
    // 2-2.設定登入策略-facebook登入
    passport.use(new FacebookStrategy({
        clientID: process.env.FACEBOOK_ID,
        clientSecret: process.env.FACEBOOK_SECRET,
        callbackURL: process.env.FACEBOOK_CALLBACK,
        profileFields: ['email', 'displayName']
    }, async (accessToken, refreshToken, profile, done) => {
        const { name, email } = profile._json
        try {
            const user = await User.findOne({ email })
            if (user) {
                return done(null, user)
            } else {
                const randomPassword = Math.random().toString(36).slice(-8)
                const hash = await bcrypt.hash(randomPassword, await bcrypt.genSalt(10))
                await User.create({ name, email, password: hash })
                return done(null, user)
            }
        } catch (err) {
            done(err, false)
        }
    }))
    // 3.設定序列化與反序列化
    passport.serializeUser((user, done) => {
        done(null, user.id)
    })
    passport.deserializeUser((id, done) => {
        User.findById(id)
            .lean()
            .then(user => done(null, user))
            .catch(err => done(err, null))
    })
}