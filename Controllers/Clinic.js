const Appointment = require('../Model/Appointment');
const Doctor = require('../Model/Doctor');


exports.getIndex = (req, res, next) => {
    
    res.render('clinic/index', {
        pageTitle: 'Clinic',
        path: '/'
    });
  };

exports.getAppointment = (req, res, next) => {
    const docID = req.params.DocID;
    Doctor
    .findById(docID)
    .then(doctor => {
      res.render('clinic/appointment',{
        doctor: doctor,
        pageTitle: 'Appointment',
        path: '/appointment'
    });
    })
    .catch(err => console.log(err));
};

exports.getMembership = (req, res, next) => {
    res.render('clinic/membership',{
        pageTitle: 'Membership',
        path: '/membership'
    });
};

exports.postAppointment = (req, res, next) => {
    const desc = req.body.description;
    const docid = req.params.DocID;;
    const date = req.body.date;
    const time = String(req.body.time);
   // console.log(desc,' ',docid,' ',date,' ',time);
    const appointment = new Appointment({
        description: desc,
        date: date,
        time: time,
        docId: docid
    });
    const result=appointment.save();
    req.user.addToCart(appointment);
    console.log(result);
    res.redirect('/');
};

exports.getDoctors = (req, res, next) => {
    Doctor.find()
      .then(doctors => {
        res.render('clinic/doctors', {
          docs: doctors,
          pageTitle: 'Doctors',
          path: '/doctors'
        });
      })
      .catch(err => {
        console.log(err);
      });
  };
  
  exports.getDoctor = (req, res, next) => {
    const prodId = req.params.productId;
    Product.findById(prodId)
      .then(product => {
        res.render('shop/product-detail', {
          product: product,
          pageTitle: product.title,
          path: '/products'
        });
      })
      .catch(err => console.log(err));
  };
  