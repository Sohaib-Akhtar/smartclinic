const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');

//sconst errorController = require('./controllers/error');
const User = require('./Model/User');
const Appointment = require('./Model/Appointment')
const MONGODB_URI =
  'mongodb+srv://Sohaib:hajwalh1@cluster-ltaee.mongodb.net/test?retryWrites=true';

const app = express();
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions'
});
const csrfProtection = csrf();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'Public')));
app.use(
  session({
    secret: 'test',
    resave: false,
    saveUninitialized: false,
    store: store
  })
);
app.use(csrfProtection);
app.use(flash());

const authRoutes = require('./Routes/User');
const clinicRoutes = require('./Routes/Clinic');

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use(authRoutes);
app.use(clinicRoutes);
//app.use(errorController.get404);

mongoose
.connect(MONGODB_URI, {
  useNewUrlParser: true
})
.then(result => {
  app.listen(3000);
  console.log('connected');
})
.catch(err => {
  console.log(err);
});
