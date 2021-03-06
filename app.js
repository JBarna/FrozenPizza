var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

/*Session and Database management*/
var MongoClient = require('mongodb').MongoClient;
var expressSession = require('express-session');
var mongoStore = require('connect-mongo')({session: expressSession});

var routes = require('./routes/index');
var users = require('./routes/users');

var mongo = new MongoClient();
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



mongo.connect(process.env.MONGOLAB_URI, function(err, db) {
    app.use(expressSession({secret: "sfda",
                           cookie: {maxAge: 60000*15 },
                           store: new mongoStore({
                                db: db,
                                collection: 'sessions'
                            })
        }));
    
    app.use('/', routes);
    app.use('/users', users);

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

});
module.exports = app;
