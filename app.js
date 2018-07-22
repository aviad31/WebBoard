var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');

var privateRoomRouter = require('./routes/privateRoom');
var indexRouter = require('./routes/index');
var adminRouter = require('./routes/admin');

var app = express();

var singleDB=require('./singletonDB');
singleDB.createDB();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));




app.use('/admin', adminRouter);
app.use('/', indexRouter);
// catch group pages
app.use(function(req, res, next) {
    console.log(req.path);
    var privateroom = require('./routes/privateRoom');
    privateroom(req.path,res);
});




app.use(function(err, req, res, next) {

    // set locals, only providing error in development

    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});


module.exports = app;





