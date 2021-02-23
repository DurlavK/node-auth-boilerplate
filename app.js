const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');

const app = express();

require('dotenv').config();

require('./config/passport')(passport);

const db_url = process.env.DB_URL;

mongoose.connect(db_url, {useNewUrlParser:true, useUnifiedTopology:true})
.then(()=>console.log('Mongodb connected...'))
.catch(err=> console.log(err));

app.set('views', path.join(__dirname,'views'));
app.set('view engine', 'pug');

app.use(express.urlencoded({extended:false}));

app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

app.use('/', require('./routes/index'));
app.use('/users', require('./routes/user'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server Started on port ${PORT}`));