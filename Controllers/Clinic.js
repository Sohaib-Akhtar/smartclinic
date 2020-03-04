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