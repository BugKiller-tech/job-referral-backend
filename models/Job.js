var mongoose = require('mongoose')
var Schema = require('mongoose').Schema

const schema = new Schema(
  {
    
  }, 
  {
    timestamps: true
  }
)


module.exports = mongoose.model('Job', schema)