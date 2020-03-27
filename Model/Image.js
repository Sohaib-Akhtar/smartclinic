const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Image = new Schema({
  url: {
    type: String,
    required: true
  },
  id: {
    type: String,
    required: true
  }
}, {timestamps: true});

module.exports = mongoose.model('Image', Image);