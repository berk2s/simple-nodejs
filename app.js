var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

//config
const {API_KEY, PANEL_API_KEY} = require('./constants/config');

//routers
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var usersPRouter = require('./routes/P_users');
const categoryRouter = require('./routes/category');
const brandRouter = require('./routes/brand');
const productRouter = require('./routes/product');
const notificationRouter = require('./routes/notification');
const ordersRouter = require('./routes/orders');
const couponPRouter = require('./routes/P_coupon');
const couponRouter = require('./routes/coupon');
const smsRouter = require('./routes/sms');


//middlewares
const apikeyMiddleware = require('./middleware/apikeymid')
const tokenVerifyMiddleware = require('./middleware/token-verify');

var app = express();

const cors = require('cors');
app.use(cors());

// mongoose connection
const mongoose = require('./helper/db')();

//api key
app.set('API_KEY', API_KEY);
app.set('PANEL_API_KEY', PANEL_API_KEY);

//var schedule = require('node-schedule');/
//var CronJob = require('cron').CronJob;

//app.set('CronJob', CronJob)

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', apikeyMiddleware, indexRouter);
app.use('/api/category',  categoryRouter);
app.use('/api/brand',  brandRouter);
app.use('/api/product',  productRouter);
app.use('/api/notification',  notificationRouter);
app.use('/api/orders',  ordersRouter);
app.use('/api/user',  tokenVerifyMiddleware, usersRouter);
app.use('/api/p/user',  usersPRouter);
app.use('/api/p/coupon',  couponPRouter);
app.use('/api/coupon',  tokenVerifyMiddleware, couponRouter);
app.use('/api/sms', smsRouter);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
