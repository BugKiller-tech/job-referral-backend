var mongoose = require('mongoose')
var Schema = require('mongoose').Schema

const schema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    creator: {
      type: Schema.Types.ObjectId,
    }
  }, 
  {
    timestamps: true
  }
)


module.exports = mongoose.model('Job', schema)