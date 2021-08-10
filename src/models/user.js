const { Schema, model } = require('mongoose')

const schema = new Schema({
  name: { type: String },
  email: { type: String },
  password: { type: String },
  tasks: [{
    type: Schema.Types.ObjectId,
    ref: 'Task'
  }],
  posts: [{
    type: Schema.Types.ObjectId,
    ref: 'Post'
  }]
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
