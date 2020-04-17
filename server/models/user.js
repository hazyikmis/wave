const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const SALT_I = 10;

const jwt = require("jsonwebtoken");

const crypto = require("crypto");
const moment = require("moment");

require("dotenv").config();

const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    unique: 1,
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
  },
  name: {
    type: String,
    required: true,
    maxlength: 100,
  },
  lastname: {
    type: String,
    required: true,
    maxlength: 100,
  },
  cart: {
    type: Array,
    default: [],
  },
  history: {
    type: Array,
    default: [],
  },
  role: {
    type: Number,
    default: 0,
  },
  token: {
    type: String,
  },
  resetToken: {
    type: String,
  },
  resetTokenExp: {
    type: Number,
  },
});

//the "pre" function below runs like a db-trigger, runs just before "saving" a user to "users" collection
userSchema.pre("save", function (next) {
  var user = this;
  //this function runs not only new inserts, it runs also in updates
  //so, in order NOT to re-hash the password, we are checking first if password changed or not
  if (user.isModified("password")) {
    bcrypt.genSalt(SALT_I, function (err, salt) {
      if (err) return next(err);
      bcrypt.hash(user.password, salt, function (err, hashedPassword) {
        if (err) return next(err);

        user.password = hashedPassword;
        next();
      });
    });
  } else {
    next();
  }
});

userSchema.methods.comparePassword = function (candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

userSchema.methods.generateToken = function (cb) {
  var user = this;
  var token = jwt.sign(user._id.toHexString(), process.env.JWT_SECRET_PHRASE);

  user.token = token;
  user.save(function (err, user) {
    if (err) return cb(err);
    cb(null, user);
  });
};

userSchema.statics.findByToken = function (token, cb) {
  var user = this;
  jwt.verify(token, process.env.JWT_SECRET_PHRASE, function (err, decoded_id) {
    //if (err) return cb(err);

    user.findOne({ _id: decoded_id, token: token }, function (err, user) {
      if (err) return cb(err);
      cb(null, user);
    });
  });
};

userSchema.methods.generateResetPwdToken = function (cb) {
  var user = this;

  crypto.randomBytes(20, function (err, buffer) {
    var token = buffer.toString("hex");
    user.resetToken = token;

    var today = moment().startOf("day").valueOf();
    var tomorrow = moment(today).endOf("day").valueOf();
    user.resetTokenExp = tomorrow;

    user.save(function (err, user) {
      if (err) return cb(err);
      cb(null, user);
    });
  });
};

const User = mongoose.model("User", userSchema);

module.exports = { User };
