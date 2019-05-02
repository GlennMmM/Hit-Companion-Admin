let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');


const Parse = require('parse/node');
Parse.initialize("project",null ,'glenn');
Parse.serverURL = 'http://10.42.0.1:1337/parse'

//ROUTES IMPORTS
const indexRouter = require('./routes/index')
const usersRouter = require('./routes/users')
const clubsRouter = require('./routes/clubs')
const deptsRouter = require('./routes/depts')
const authRouter = require('./routes/login')
// END ROUTES IMPORTS

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// ROUTE REGISTRATION
app.use('/', indexRouter)

app.use('/users', usersRouter)
app.use('/clubs', clubsRouter)
app.use('/depts', deptsRouter)
app.use('/auth', authRouter)

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
