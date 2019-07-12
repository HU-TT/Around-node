const express = require('express')
const router = express.Router()
const utils = require('utility')

const model = require('./model')
const User = model.getModel('user')
const Chat = model.getModel('chat')

const _filter = { password: false, __v: false }

router.post('/api/register', (req, res) => {
  const { user, password, type } = req.body
  User.findOne({ user }, function (err, ret) {
    if (ret) {
      return res.json({ success: false, msg: '用户名重复' })
    }
    new User({ user, password: md5Password(password), type })
      .save()
      .then((ret) => {
        res.cookie('user_id', ret._id)
        return res.json({ success: true, data: {
        user: ret.user,
        type: ret.type,
        _id: ret._id} })
      }, (err) => {
        return res.json({ success: false, msg: '后端出错' })
      })
  })
})

router.post('/api/login', (req, res) => {
  const { user, password } = req.body
  User.findOne({ user, password: md5Password(password) }, _filter)
    .then((ret) => {
      res.cookie('user_id', ret._id)
      return res.json({ success: true, data: ret })
    })
    .catch((err) => {
      return res.json({ success: false, msg: '用户名或密码错误' })
    })
})

router.get('/api/info', (req, res) => {
  const { user_id } = req.cookies
  if (!user_id) {
    return res.json({ success: false })
  }
  User.findOne({ _id: user_id }, _filter)
    .then((ret) => {
      return res.json({ success: true, data: ret })
    })
    .catch((err) => {
      return res.json({ success: false, msg: '服务器错误' })
    })
})

router.post('/api/updata', (req, res) => {
  const { user_id } = req.cookies
  if (!user_id) {
    return res.json({ success: false })
  }
  const body = req.body
  User.findByIdAndUpdate(user_id, body)
    .then((ret) => {
      const data = Object.assign({}, {
        user: ret.user,
        type: ret.type
      }, body)
      return res.json({success: true, data})
    })
    .catch((err) => {
        return res.json({ success: false, msg: '服务器错误' })
      })
})

router.get('/api/list', (req, res) => {
  const type = req.query.t
  User.find({ type }, _filter)
    .then(ret => {
      return res.json({success: true, data: ret})
    })
    .catch(err => {
      return res.json({ success: false, msg: '服务器错误' })
    })
})

router.get('/api/msgList', (req, res) => {
  const { user_id } = req.cookies
  User.find()
    .then(ret => {
      const users = {}
      ret.forEach( item => {
        users[item.id] = {name: item.user, avatar: item.avatar}
      })
      Chat.find({'$or': [{from: user_id}, {to: user_id}]})
        .then(ret => {
          return res.json({success: true, data: ret, users})
        })
        .catch(err => {
          return res.json({success: false, err: 'chatFindError'})
        })
    })
    .catch(err => {
      return res.json({success: false, err: 'userFindError'})
    })
})

router.post('/api/readmsg', (req, res) => {
  const { user_id } = req.cookies
  const { from } = req.body
  Chat.update({from, to: user_id}, {read: true}, {'multi': true})
    .then(ret => {
      console.log(ret)
      res.json({success: true, num: ret.nModified})
    })
})

function md5Password (password) {
  const str = 'zhaopin_app'
  return utils.md5(utils.md5(password + str))
}

module.exports = router
