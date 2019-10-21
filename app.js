var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

//添加引用模块
var session = require('express-session');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser("An"));

app.use(session({
  secret:'an',
  resave:false,
  saveUninitialized:true
}));

app.use('/public',express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Nor Found');
  err.status = 404;
  next(err);
});

// error handler

if(app.get('env') === 'development'){
  app.use(function(err,req, res, next){
    res.status(err.status || 500);
    res.render('error',{
      message:err.message,
      error:err
    });
  });
}

app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.status(err.status || 500);
  res.render("erroe", {
    message:err.message,
    error:{}
  })
});

module.exports = app;
