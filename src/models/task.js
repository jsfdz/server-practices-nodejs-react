const {Schema, model} = require('mongoose')

const schema = new Schema({
  title: { type: String },
  task: { type: String },
  date: { type: Date },
  isCompleted: {
    type: Boolean,
    default: false
},
  userId: {
    type: Schema.Types.ObjectId, 
    ref: "users",
    autopopulate: true
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