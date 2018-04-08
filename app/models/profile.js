'use strict'

const mongoose = require('mongoose')
const User = require('./user.js')

const profileSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: [true, 'User name required'],
    unique: true
  },
  phone: {
    type: String,
    // validator looks for this input: '201-555-0123'
    validate: {
      validator: function (v) {
        return /\d{3}-\d{3}-\d{4}/.test(v)
      },
      message: '{VALUE} is not a valid phone number!'
    },
    required: [true, 'User phone number required']
  },
  _owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: function (doc, ret, options) {
      const userId = (options.user && options.user._id) || false
      ret.editable = userId && userId.equals(doc._owner)
      return ret
    }
  }
})

const Profile = mongoose.model('Profile', profileSchema)

module.exports = Profile
