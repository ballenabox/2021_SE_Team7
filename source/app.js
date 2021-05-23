var createError = require('http-errors');
var express = require('express');
var session = require('express-session'); //추가
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var mysqlRouter = require('./routes/mysql');
var boardRouter = require('./routes/board');
var accountRouter = require('./routes/account')
var adminRouter = require('./routes/admin_index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static("public"));
app.use(session({ // 세션 미들웨어 설정
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.use('/', indexRouter);
app.use('/mysql', mysqlRouter);
app.use('/board', boardRouter);
app.use('/account', accountRouter); // 추가
app.use('/admin_index',adminRouter);

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
