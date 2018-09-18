var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');

//sesions
var Session = require('express-session');
var filesessionstorage = require('session-file-store')(Session);

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
const SECRET_KEY ='12345-45678-45679-123192';
//Cookies
//The first parameter of cookieParser it's Secret-key
//app.use(cookieParser(SECRET_KEY));

//sesion
app.use(Session({
  name: 'session-id',
  secret: SECRET_KEY,
  saveUninitialized:false,
  resave:false,
  store: new filesessionstorage(),
  user:'ss'
}));
app.use(express.static(path.join(__dirname, 'public')));



/**

function auth_cockie(req,res, next)
{
  console.log(req.signedCookies);

  if(!req.signedCookies.user)
  {
    var authheader = req.headers.authorization;
    
    if (authheader)
    {
      
      var auth = new Buffer(authheader.split(' ')[1],'base64').toString().split(':');
      
      var username = auth[0];
      var password = auth[1];
      
      if(username === 'admin' && password === 'passwor')
      {
        res.cookie('user', 'admin',{signed:true});
        next();
      }
      else
      {
        var err = new Error('You are not authenticated');
        res.setHeader('WWW-Authenticate','Basic');
        err.status = 401;
        return next(err);
      }
    }else
    {
      var err = new Error('You are not authenticated');
      res.setHeader('WWW-Authenticate','Basic');
      err.status = 401;
      return next(err);
    }


  }else
  {
    console.log('entro en cookie');
    if(req.signedCookies.user === 'admin')
    {
      next();
    }
    else{
      var err = new Error('You are not authenticated');
      res.setHeader('WWW-Authenticate','Basic');
      err.status = 401;
      return next(err);
    }
  }


  
}
*/
function auth_session(req,res, next)
{
  console.log(req.session);

  if(!req.session.user) 
  {
    var authheader = req.headers.authorization;
    
    if (authheader)
    {
      
      var auth = new Buffer(authheader.split(' ')[1],'base64').toString().split(':');
      
      var username = auth[0];
      var password = auth[1];
      
      if(username === 'admin' && password === 'passwor')
      {
         req.session.user = 'admin';
        next();
      }
      else
      {
        var err = new Error('You are not authenticated');
        res.setHeader('WWW-Authenticate','Basic');
        err.status = 401;
        return next(err);
      }
    }else
    {
      var err = new Error('You are not authenticated');
      res.setHeader('WWW-Authenticate','Basic');
      err.status = 401;
      return next(err);
    }


  }else
  {
    console.log('entro en session');
    if(req.session.user==='admin')
    {
      next();
    }
    else{
      var err = new Error('You are not authenticated');
      res.setHeader('WWW-Authenticate','Basic');
      err.status = 401;
      return next(err);
    }
  }


  
}
app.use(auth_session);


app.use('/', indexRouter);
app.use('/users', usersRouter);

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
