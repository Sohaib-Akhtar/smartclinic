const mongoose = require('mongoose');
const Appointment = require('../Model/Appointment');
const User = require('../Model/User');
const Schema = mongoose.Schema;

const doctorSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  username:{
    type: String,
    required: true
  },
  phone:{
    type: String,
    required: true
  },
  specialization:{
    type: String,
    required: true
  },
  isDoc:{
      type: Boolean
  },
  personalStatement:{
    type: String,
    required: true
  },
  stars:{
    type: Number
  },
  img:{
    type: String
  },
  comments:{
    items:[
      {
        comment:{
          type: String
        }
      }
    ]
  },
  Appointments: {
    items: [
      {
          // used for preventing csrf attacks
        appointId: {
          type: Schema.Types.ObjectId,
          ref: 'Appointment',
          required: true
        },
        status: {
            type: String 
        }
      }
    ]
  }
});

doctorSchema.methods.addToCart = function(Appointment) {

  const updatedCartItems = [...this.Appointments.items];

  //pushing new appointment to appointments arr
  updatedCartItems.push({
    appointId: Appointment._id,
    status: 'Pending'
  });
  const updatedCart = {
    items: updatedCartItems
  };
  this.Appointments = updatedCart;
  return this.save();
};

doctorSchema.methods.addToComments = function(comment) {

  const updatedCommentItems = [...this.comments.items];

  //pushing new appointment to appointments arr
  updatedCommentItems.push({
    comment: comment
  });
  const updatedCart = {
    items: updatedCommentItems
  };
  this.comments = updatedCart;
  return this.save();
};

doctorSchema.methods.removeFromCart = function(AppointmentId) {
  const updatedCartItems = this.Appointments.items.filter(item => {
    return item.appointId.toString() !== AppointmentId.toString();
  });
  this.Appointments.items = updatedCartItems;
  mongoose
  .model('User')
  .find()
  .then(user => {
    var brek = 0;
    for (var i=0;i<user.length;++i){
      for (var j=0;j<user[i].Appointments.items.length;++j){
        if (user[i].Appointments.items[j].appointId.toString() == AppointmentId.toString()){
          user[i].Appointments.items[j].status = 'Declined';
          brek+=1;
          user[i].save();
          break;
        }
      }
      if(brek > 0)
      break;
    }
    return this.save();
  })
  .catch(err => console.log(err));
};

doctorSchema.methods.clearCart = function() {
  this.Appointments = { items: [] };
  return this.save();
};

module.exports = mongoose.model('Doctor', doctorSchema);