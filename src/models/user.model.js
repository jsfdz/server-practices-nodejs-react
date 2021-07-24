const { Schema, model } = require('mongoose')

const schema = new Schema({
  name: { type: String },
  email: { type: String },
  password: { type: String }
},
{
  timestamp: true
})

module.exports = model('User', schema)
