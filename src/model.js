const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/zhaopin', {useNewUrlParser:true})

const models = {
  user: {
    'user': {
      type: String,
      required: true
    },
    'password': {
      type: String,
      required: true
    },
    'avatar': {
      type: String
    },
    'avatarUrl': {
      type: String
    },
    'type': {
      type: String,
      required: true
    },
    'desc': {
      type: String
    },
    'title': {
      type: String
    },
    'company': {
      type: String
    },
    'money': {
      type: String
    }
  },
  chat: {
    'chatid': {type: String, required: true},
    'from': {type: String, required: true},
    'to': {type: String, required: true},
    'read': {type: Boolean, default: false},
    'content': {type: String, required: true, default: ''},
    'create_time': {type: String, default: new Date().getTime()}
  }
}

for (let key in models) {
  mongoose.model(key, new mongoose.Schema(models[key]))
}

module.exports = {
  getModel (name) {
    return mongoose.model(name)
  }
}
