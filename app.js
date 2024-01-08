const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const flash = require('connect-flash');

const bodyParser = require('body-parser');
const adminRoutes = require('./routes/adminRoutes');
const authRoutes = require('./routes/sessions');
const storeAssociateRoutes = require('./routes/api_v1/storeAssociateRoutes');

const User = require('./models/user');

const MONGODB_URI =
  'mongodb+srv://shamsulhaque:POF0e3YWrFnf6n63@cluster0.28cbquj.mongodb.net/shop?retryWrites=true&w=majority';

const app = express();
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions'
});

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'node_modules')));
app.use(
  session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store: store
  })
);
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
app.use(flash());

app.use('/admin', adminRoutes);
app.use('/api/v1', storeAssociateRoutes);
app.use(authRoutes);
app.use('/device_info', (req, res, next) => {
  res.render('home/device-info',{
    pageTitle: 'Device Info'
  });
});

app.use('/', (req, res, next) => {
  console.log('/path is default')
  // if(req.path != '/'){
  //   next()
  // }
  if (req.session.user) {
    if(req.session.user.role == 1) {
      res.redirect('/admin/stores');
    } else if(req.session.user.role == 2) {
      res.redirect(`/admin/users?store_id=${req.session.user.store}`);
    }
    else {
      res.redirect('/login');
    }
  } else {
    res.redirect('/login');
  }
});

//Connect to database
mongoose.connect(MONGODB_URI).then(result => {
  console.log('Db Connected')
  app.listen(3000)
})
.catch(err => {
  console.log(err)
})
