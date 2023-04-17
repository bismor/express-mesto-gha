const mongoose = require('mongoose')

const  cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  link: {
    type: String,
    required: true,
  },
  owner: {
    type: ObjectId,
    required: true,
  },
  likes: {
    type: ObjectId,
    default: [],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: true,
  }
})

module.exports = mongoose.model('user', cardSchema);