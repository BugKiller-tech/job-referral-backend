var mongoose = require('mongoose')
var Schema = require('mongoose').Schema

const schema = new Schema(
  {
    name: String,
    type: String,
    imageUrl: String,
    size: Number,
    verified: {
      type: Boolean,
      default: false
    }

  }, 
  {
    timestamps: true
  }
)


module.exports = mongoose.model('Company', schema)