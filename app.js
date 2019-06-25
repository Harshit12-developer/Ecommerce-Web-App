var createError = require('http-errors');
var express = require('express');

var path = require('path');
var cookieParser = require('cookie-parser');

var session=require('express-session');
var passport=require('passport');
var flash= require('connect-flash');

var bodyParser = require('body-parser');
var validator=require('express-validator');
var MongoStore=require('connect-mongo')(session);

var expressHbs=require('express-handlebars');

var indexRouter = require('./routes/index');
 var userRoutes = require('./routes/user');

var mongoose=require("mongoose");

mongoose.connect("mongodb://localhost/shopping2");
require('./config/passport');
// require('./config/passport');
// var jsdom = require("jsdom");
// const { JSDOM } = jsdom;
// const { window } = new JSDOM();
// const { document } = (new JSDOM('')).window;
// global.document = document;
// var $ = require("jquery")(window);

var app = express();
app.use(express.static(path.join(__dirname, 'public')));
// app.set('views', './views');
// app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
// view engine setup
// app.engine('.hbs', expressHbs({defaultLayout: 'layout', extname: '.hbs'}));
// app.set('view engine', '.hbs');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(validator());
app.use(cookieParser());
app.use(session({
	secret:'mysupersecret',
	resave:false,
	saveUninitialized:false,
	store:new MongoStore({mongooseConnection:mongoose.connection}),
	cookie:{maxAge:180*60*1000}
}));
// folllowing 3 middle wears are used after session middle wear
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
// require('./config/passport')(passport);



app.use(function(req,res,next){
res.locals.login=req.isAuthenticated();
res.locals.session=req.session;
next();
});

//order is necessary ----niche wala dono order kyonki agar  / agar pehle ho jata toh /user na chalta. 
// app.use('/user', userRoutes);
app.use('/user', userRoutes);
app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error.ejs', {
      message: err.message,
      error: err
    });
  });
}

app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error.ejs', {
    message: err.message,
    error: {}
  });
});

module.exports = app;

app.listen(3000,function(){
console.log("shopping-cart is running");
});