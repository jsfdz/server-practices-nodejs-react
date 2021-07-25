const { Schema, model } = require('mongoose')

const schema = new Schema({
  name: { type: String },
  email: { type: String },
  password: { type: String }
},
{
  timestamps: true
})

schema.methods.toJSON = function () {
  const { _id, __v, password, ...rest } = this.toObject()
  rest.id = _id
  return rest
}

module.exports = model('User', schema)
