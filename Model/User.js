const mongoose = require('mongoose');
const Appointment = require('../Model/Appointment');
const Schema = mongoose.Schema;
const Doctor = require('../Model/Doctor');

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
  isMember: {
    type: Boolean
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
    return item.appointId.toString() !== AppointmentId.toString();
  });
  this.Appointments.items = updatedCartItems;
  Appointment.findOneAndDelete({ _id: AppointmentId.toString() })
  .then(appoint => {
    Doctor.
    findOne({_id : appoint.docId})
    .then(doc => {
      doc.removeFromCart(AppointmentId);
    })
  })
  .catch(err => console.log(err));
  return this.save();
};

userSchema.methods.clearCart = function() {
  this.Appointments = { items: [] };
  return this.save();
};

module.exports = mongoose.model('User', userSchema);