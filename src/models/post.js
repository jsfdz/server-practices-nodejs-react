const { Schema, model } = require('mongoose')

const schema = new Schema({
  title: { type: String },
  text: { type: String },
  likes: {
    type: Number,
    default: 0
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
})

schema.methods.toJSON = function () {
  const { _id, __v, ...rest } = this.toObject()
  rest.id = _id
  return rest
}

module.exports = model('Post', schema)
