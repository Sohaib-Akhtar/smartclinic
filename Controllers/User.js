const bcrypt = require('bcryptjs');

const User = require('../Model/User');
const Image = require('../Model/Image');
const Doctor = require('../Model/Doctor');
const Appointment = require('../Model/Appointment');


exports.getLogin = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    errorMessage: message
  });
};

exports.getLoginDoc = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('auth/loginDoc', {
    path: '/logindoc',
    pageTitle: 'Login Doc',
    errorMessage: message
  });
};

exports.getAppointments = (req, res, next) => {

  User
  .findOne({ _id: req.user._id})
  .then(user => {
    const Appointments = user.Appointments.items;
  var aps = [];
  
  for (var i=0; i<Appointments.length; i++)
  aps.push(Appointments[i].appointId);

  Appointment.find().where('_id').in(aps).exec((err, records) => {
    var ids = [];

    for (var i=0; i<records.length; i++)
    ids.push(records[i].docId);  

    Doctor.find().where('_id').in(ids).exec((err, docs) => {
      console.log(docs);
      res.render('auth/appointments', {
      user: user,
      appointments: records,
      docs: docs,
      path: '/userappointments',
      pageTitle: 'User Appointments'
     });
    });
  });
  })
  .catch(err => {
    console.log(err)
  });
  
};

exports.getDashboard = (req, res, next) => {

  Doctor
  .findOne({ _id: req.session.user._id})
  .then(user => {
  const Appointments = user.Appointments.items;
  const Comments = user.comments.items;
  var aps = [];
  
  for (var i=0; i<Appointments.length; i++)
  aps.push(Appointments[i].appointId);

  var len = aps.length;

  Appointment.find().where('_id').in(aps).exec((err, records) => {
    res.render('auth/dashboard', {
      appointments: records,
      comments: Comments,
      doc: req.session.user,
      path: '/dashboard',
      len: len,
      pageTitle: 'Dashboard'
     });
  });
})
.catch(err => {
  console.log(err)
});
};

exports.getSignup = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    errorMessage: message
  });
};

exports.getRemoveAppointment = (req, res, next) => {
  const ApID = req.params.AppointID;
  req.user.removeFromCart(ApID);
  res.redirect('/userappointments');  
};

exports.getRemoveAppointmentDoc = (req, res, next) => {
  const ApID = req.params.AppointID;
  Doctor
  .findOne({_id: req.session.user._id})
  .then(user =>{
    user.removeFromCart(ApID);
    res.redirect('/dashboard');
  })
  .catch(err => console.log(err));
};

exports.getSignupDoc = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('auth/signupDoc', {
    path: '/signupdoc',
    pageTitle: 'SignupDoc',
    errorMessage: message
  });
};

exports.postLogin = (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  
  User.findOne({ username: username })
    .then(user => {
      if (!user) {
        req.flash('error', 'Invalid email or password.');
        return res.redirect('/login');
      }
      bcrypt
        .compare(password, user.password)
        .then(doMatch => {
          if (doMatch) {
            console.log("passed");
            req.session.isLoggedIn = true;
            req.session.user = user;
            //res.locals.isAuthenticated = true;
            return req.session.save(err => {
              console.log(err);
              res.redirect('/');
            });
          }
          req.flash('error', 'Invalid email or password.');
          res.redirect('/login');
        })
        .catch(err => {
          console.log(err);
          res.redirect('/login');
        });
    })
    .catch(err => console.log(err));
};

exports.postLoginDoc = (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  
  Doctor.findOne({ username: username })
    .then(user => {
      if (!user) {
        req.flash('error', 'Invalid email or password.');
        return res.redirect('/login');
      }
      bcrypt
        .compare(password, user.password)
        .then(doMatch => {
          if (doMatch) {
            console.log("passed");
            req.session.isLoggedIn = true;
            req.session.user = user;
            //res.locals.isAuthenticated = true;
            return req.session.save(err => {
              console.log(err);
              res.redirect('/');
            });
          }
          req.flash('error', 'Invalid email or password.');
          res.redirect('/login');
        })
        .catch(err => {
          console.log(err);
          res.redirect('/login');
        });
    })
    .catch(err => console.log(err));
};

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password[0];
  const firstname = req.body.firstname;
  const lastname = req.body.lastname;
  const username = req.body.username;
  const phone = req.body.phonenumber;
  const mem = false;
  //console.log(email,' ',password,' ',firstname,' ',lastname,' ',username,' ',phone);
  User.findOne({ email: email })
    .then(userDoc => {
      if (userDoc) {
        req.flash('error', 'E-Mail exists already, please pick a different one.');
        return res.redirect('/signup');
      }
      //using bcrypt to hash the passwords 
      return bcrypt
        .hash(password, 12)
        .then(hashedPassword => {
          //creating user object
          const user = new User({
            email: email,
            password: hashedPassword,
            firstName: firstname,
            lastName: lastname,
            username: username,
            phone: phone,
            isMember: mem,
            Appointments: { items: [] }
          });
          return user.save();
        })
        .then(result => {
          res.redirect('/login');
        });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.postSignupDoc = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password[0];
  const firstname = req.body.firstname;
  const lastname = req.body.lastname;
  const username = req.body.username;
  const phone = req.body.phonenumber;
  const sp = req.body.Specialization;
  const ps = req.body.personalS;
  const isdoc = true;
  const stars = 4;
  const img = "abc";
  //console.log(email,' ',password,' ',firstname,' ',lastname,' ',username,' ',phone);
  Doctor.findOne({ email: email })
    .then(userDoc => {
      if (userDoc) {
        req.flash('error', 'E-Mail exists already, please pick a different one.');
        return res.redirect('/signupdoc');
      }
      //using bcrypt to hash the passwords 
      return bcrypt
        .hash(password, 12)
        .then(hashedPassword => {
          //creating user object
          const user = new Doctor({
            email: email,
            password: hashedPassword,
            firstName: firstname,
            lastName: lastname,
            username: username,
            phone: phone,
            specialization: sp,
            personalStatement: ps,
            isDoc: isdoc,
            img: img,
            Appointments: { items: [] }
          });
          return user.save();
        })
        .then(result => {
          res.redirect('/login');
        });
    })
    .catch(err => {
      console.log(err);
    });
};


exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect('/');
  });
};


// const multer = require("multer");
// const cloudinary = require("cloudinary");
// const cloudinaryStorage = require("multer-storage-cloudinary");

// cloudinary.config({
// cloud_name: 'fast-university',
// api_key: '221485714924264',
// api_secret: '9jSAMo-f0ylYzeBlT6RW_VTklhg'
// });
// const storage = cloudinaryStorage({
// cloudinary: cloudinary,
// folder: "demo",
// allowedFormats: ["jpg", "png"],
// transformation: [{ width: 500, height: 500, crop: "limit" }]
// });
// const parser = multer({ storage: storage });

// exports.postImage = (parser.single("image"), (req, res, next) => {
//   console.log("called"); // to see what is returned to you
//   const image = {};
//   image.url = req.file.url;
//   image.id = req.file.public_id;
//   Image.create(image) // save image information in database
//     .then(newImage => {
//       res.json(newImage);
//       res.redirect('/signupdoc');
//     })
//     .catch(err => console.log(err));
// });
