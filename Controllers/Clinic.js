exports.getIndex = (req, res, next) => {
    
    res.render('clinic/index', {
        pageTitle: 'Clinic',
        path: '/'
    });
  };