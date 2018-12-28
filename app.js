var express = require('express');

var exphbs = require('express-handlebars');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var session = require('express-session');
var RedisStore = require('connect-redis')(session);
var redis = require("redis").createClient();
// var session = require('express-session'),
//     RedisStore = require('connect-redis')(session);
const jwt = require('jsonwebtoken');



var users = require('./routes/users');







var app = express();
app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.'),
            root = namespace.shift(),
            formParam = root;

        while (namespace.length) {
            formPara += '[' + namespace.shift() + ']';

        }
        return {
            param: formParam,
            msg: msg,
            value: value
        };
    }


}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
    store: new RedisStore({ host: '127.0.0.1', port: 6379, client: redis }),
    secret: 'keyboard cat',
    resave: false
}));

app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({ defaultLayout: 'layout' }));
app.set('view engine', 'handlebars');

app.use(express.static(path.join(__dirname, 'public')));











app.use('/users', users);

server = app.listen(3000, function() {
    console.log('Server Started on Port 3000');

});

app.get('/dashboard', function(req, res) {

    session = req.session;
    console.log(session);
    if (session.name)

    {
        console.log("currently :", session);
        res.render('dashboard', { name: session.name });


    } else {
        console.log("Invalid User");
        res.render("invaliduser");
    }
});
app.get('/', function(req, res) {
    res.render('landing');
});

app.get('/logout', function(req, res) {


    if (session.name)

    {
        req.session.destroy();

        res.redirect("/users/login");


    } else {
        console.log("Invalid User");
        res.render("invaliduser");
    }
});