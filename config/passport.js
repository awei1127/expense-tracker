const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const UserModel = require('../models/userModel')
const bcrypt = require('bcryptjs')

function usePassport(app) {
  // 初始化passport
  app.use(passport.initialize())
  app.use(passport.session())

  // 設定passport本地登入策略
  passport.use(new LocalStrategy({ usernameField: 'email', passReqToCallback: true },
    async function (req, email, password, done) {
      try {
        const user = await UserModel.findOne({ email })
        if (!user) {
          return done(null, false, { message: '這個email尚未註冊' })
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) return done(null, false, { message: '密碼錯誤' })
        return done(null, user)
      } catch {
        return done(err)
      }
    }
  ))

  // 設定passport序列化
  passport.serializeUser((user, done) => {
    done(null, user.id)
  })

  // 設定passport反序列化
  passport.deserializeUser((id, done) => {
    UserModel.findById(id)
      .lean()
      .then(user => done(null, user))
      .catch(err => done(err, false))
  })
}

module.exports = usePassport