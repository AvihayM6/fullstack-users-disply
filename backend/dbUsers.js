const mongoose = require('mongoose')

const userSchema = mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    myId: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    ip: {
      type: String,
      required: true,
    }
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('users', userSchema)