const {Schema, model} = require('mongoose')

const schema = new Schema({
  title: {type: String},
  task: { type: String },
  date: { type: Date },
  isCompleted: {
    type: Boolean,
    defualt: false
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
  const { _id, _v, ...rest } = this.toObject()
  rest.id = _id
  return rest
}

module.exports = model('Task', schema)