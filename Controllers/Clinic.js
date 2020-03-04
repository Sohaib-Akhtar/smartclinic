const Appointment = require('../Model/Appointment');

exports.getIndex = (req, res, next) => {
    
    res.render('clinic/index', {
        pageTitle: 'Clinic',
        path: '/'
    });
  };

exports.getAppointment = (req, res, next) => {
    res.render('clinic/appointment',{
        pageTitle: 'Appointment',
        path: '/appointment'
    });
};

exports.postAppointment = (req, res, next) => {
    const desc = req.body.description;
    const docid = 1;
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

