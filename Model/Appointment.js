const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const productSchema = new Schema({
  date: {
    type: Date,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  docId: {
    type: Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true
  }
});

module.exports = mongoose.model('Appointment', productSchema);