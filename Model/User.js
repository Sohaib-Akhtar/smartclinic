const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
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

userSchema.methods.addToCart = function(Appointment) {
  /*const cartAppointmentIndex = this.Appointments.items.findIndex(cp => {
    return cp.AppointmentId.toString() === Appointment._id.toString();
  });*/

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

userSchema.methods.removeFromCart = function(AppointmentId) {
  const updatedCartItems = this.Appointments.items.filter(item => {
    return item.AppointmentId.toString() !== AppointmentId.toString();
  });
  this.Appointments.items = updatedCartItems;
  return this.save();
};

userSchema.methods.clearCart = function() {
  this.Appointments = { items: [] };
  return this.save();
};

module.exports = mongoose.model('User', userSchema);