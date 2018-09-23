var bcrypt = require('bcrypt')
var mongoose = require('mongoose')
var Schema = require('mongoose').Schema
var jwt = require('jsonwebtoken')
var uniqueValidator = require('mongoose-unique-validator')


const schema = new Schema(
  {
    email: {
      type: String,
      required: true
    },
    passwordHash: {
      type: String,
      required: true
    },
    confirmed: {
      type: Boolean,
      default: true
    },
    confirmationToken: {
      type: String,
      required: false
    },
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    userName: {
      type: String,
      required: true
    },
    phoneNumber: {
      type: String,
      required: true
    },
    profileImageUrl: {
      type: String,
      required: false
    },
    favoriteCities: {
      type: [{
        type: Schema.Types.ObjectId,
        ref: 'City'
      }],
      requried: false
    },
    role: {  //0 - user 1-airline owner, 2-admin
      type: Number,
      default: 0
    },

    idImage: {
      type: String,
      default: '',
    },
    originCity: {
      type: Schema.Types.ObjectId,
    },
    fireToken: {
      type: String,
      required: false
    },
    isTermsAgree: {
      type: Schema.Types.Boolean,
      default: true,
      required: false,
    }
  }, 
  {
    timestamps: true
  }
)

schema.methods.isValidPassword = function(password) {
  return bcrypt.compareSync(password, this.passwordHash)
}

schema.methods.setPassword = function(password){
  this.passwordHash = bcrypt.hashSync(password, 10);
  console.log(this);
}

schema.methods.setConfirmationToken = function setConfirmationToken(){
  this.confirmationToken = this.generateJWT();
}

schema.methods.generateJWT = function generateJWT(){
  return jwt.sign(
      {
          email: this.email,
          confirmed: this.confirmed
      },
      process.env.JWT_SECRET
  );
};

schema.methods.toAuthJSON = function toAuthJSON() {
  return {
      email: this.email,
      confirmed: this.confirmed,
      token: this.generateJWT()
  }
}

schema.methods.setConfirmationToken = function setConfirmationToken(){
  this.confirmationToken = this.generateJWT();
}

schema.methods.generateJWT = function generateJWT(){
  return jwt.sign(
      {
          email: this.email,
          confirmed: this.confirmed
      },
      process.env.JWT_SECRET
  );
};

schema.methods.toAuthJSON = function toAuthJSON() {
  return {
      email: this.email,
      confirmed: this.confirmed,
      token: this.generateJWT()
  }
}

schema.methods.generateConfirmationUrl= function(){
  return `${process.env.HOST}/confirmation/${this.confirmationToken}`
}

schema.methods.generateResetPasswordLink = function generateResetPasswordLink() {
  return `${process.env.HOST}/reset_password/${this.generateResetPasswordToken()}`;
}

schema.methods.generateResetPasswordToken = function() {
  return jwt.sign(
      {
          _id: this._id,
          email: this.email,
      },
      process.env.JWT_SECRET,
      {expiresIn: "1h"}
  )
}



schema.plugin(uniqueValidator, {message: "This email is already taken"});

module.exports = mongoose.model('User', schema)