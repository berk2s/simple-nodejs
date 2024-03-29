var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

//config
const {API_KEY, NEW_API_KEY, PANEL_API_KEY} = require('./constants/config');

//routers
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var usersPRouter = require('./routes/P_users');
const categoryRouter = require('./routes/category');
const brandRouter = require('./routes/brand');
const productRouter = require('./routes/product');
const notificationRouter = require('./routes/notification');
const ordersRouter = require('./routes/orders');
const couponRouter = require('./routes/coupon');
const couponPRouter = require('./routes/P_coupon');
const smsRouter = require('./routes/sms');
const campaignRouter = require('./routes/campaign')
const subcategoryRouter = require('./routes/subcategory')
const ordersPRouter = require('./routes/P_orders')
const newsRouter = require('./routes/news')
const statementRouter = require('./routes/statement')
const branchStatus = require('./routes/branchstatus')
const logRouter = require('./routes/log')


//middlewares
const apikeyMiddleware = require('./middleware/apikeymid')
const apikeyPanelMiddleware = require('./middleware/apikeypanel')
const tokenVerifyMiddleware = require('./middleware/token-verify');

var app = express();

const cors = require('cors');
app.use(cors());

// mongoose connection
const mongoose = require('./helper/db')();

const robots = require('express-robots-txt')
app.use(robots({UserAgent: '*', Disallow: '/'}))

//api key
app.set('API_KEY', API_KEY);
app.set('NEW_API_KEY', NEW_API_KEY);
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

app.use('/', indexRouter);
app.use('/api/category',  categoryRouter);
app.use('/api/brand',  brandRouter);
app.use('/api/log',  logRouter);
app.use('/api/product',  productRouter);
app.use('/api/notification',  notificationRouter);

app.use('/api/orders', ordersRouter);
app.use('/api/user', usersRouter);
app.use('/api/coupon', couponRouter);

app.use('/api/sms', smsRouter);
app.use('/api/campaign', campaignRouter);
app.use('/api/subcategory', subcategoryRouter);



app.use('/api/branchstatus', branchStatus);

app.use('/api/statement', statementRouter);

app.use('/api/news',  newsRouter);

app.use('/api/p/orders',  apikeyPanelMiddleware, ordersPRouter);
app.use('/api/p/user', apikeyPanelMiddleware, usersPRouter);
app.use('/api/p/coupon',  apikeyPanelMiddleware, couponPRouter);



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
