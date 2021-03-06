const { Schema, model } = require('mongoose')

const schema = new Schema({
  title: { type: String },
  task: { type: String },
  date: { type: Date },
  isCompleted: {
    type: Boolean,
    default: false
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

module.exports = model('Task', schema)
