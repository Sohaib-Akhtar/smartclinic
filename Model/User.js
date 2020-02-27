const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  password: {
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
  const cartAppointmentIndex = this.cart.items.findIndex(cp => {
    return cp.AppointmentId.toString() === Appointment._id.toString();
  });

  const updatedCartItems = [...this.cart.items];

  //pushing new appointment to appointments arr
  updatedCartItems.push({
    AppointmentId: Appointment._id,
    status: 'Pending'
  });
  const updatedCart = {
    items: updatedCartItems
  };
  this.Appointments = updatedCart;
  return this.save();
};

userSchema.methods.removeFromCart = function(AppointmentId) {
  const updatedCartItems = this.cart.items.filter(item => {
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