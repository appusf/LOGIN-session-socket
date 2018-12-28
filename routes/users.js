var express = require('express');
var router = express.Router();
var Sequelize = require('sequelize');
// var session = require('express-session');
// var passport = require('passport');
// var LocalStrategy = require('passport-local').Strategy;
const jwt = require('jsonwebtoken');
var Request = require("request");
// var schedule = require('node-schedule');
// var cron = require('node-cron');
// var CronJob = require('cron').CronJob;
var cron = require('cron');




var sequelize = new Sequelize('logindetails', 'root', 'root', {
    host: 'localhost',
    dialect: 'mysql',
    insecureAuth: false,
    timezone: "+05:30"

});
var dbusers = sequelize.define('Usersdb', {

    name: Sequelize.TEXT,
    username: Sequelize.TEXT,
    email: Sequelize.TEXT,
    password: Sequelize.TEXT,
    place: Sequelize.TEXT,
    age: Sequelize.INTEGER,


}, {
    freezeTableName: true,
    operatorsAliases: false
});

var lgusers = sequelize.define('UsersLog', {

    name: Sequelize.TEXT,
    username: Sequelize.TEXT,
    logd: Sequelize.TEXT,
    logt: Sequelize.TEXT


}, {
    freezeTableName: true,
    operatorsAliases: false
});
var apidata = sequelize.define('apidata', {

    author: Sequelize.TEXT,
    categories: Sequelize.TEXT,
    content: Sequelize.TEXT,
    title: Sequelize.TEXT


}, {
    freezeTableName: true,
    operatorsAliases: false
});


// router.use(session({
//     secret: 'secret',
//     saveUninitialized: true,
//     resave: true
// }));



router.get('/login', function(req, res) {

    if (req.session.username) {
        console.log(req.session)
        res.render('dashboard');

    } else {

        res.render('login');


    }

});

router.post('/login', function(req, res) {
    console.log("In Login Post")

    var username = req.body.username;
    var password = req.body.password;

    // dbusers.all({ where: { name: req.body.username } }).then(projects => {

    //     console.log(projects);


    // })

    dbusers.findAll({ where: { username: req.body.username } }).spread(function(result, test) {

        if (result) {



            productsDataToUse = result.get({
                plain: true
            });

            console.log('User login :', productsDataToUse)
            if (password == productsDataToUse.password) {
                // console.log(productsDataToUse);
                // req.session.regenerate()
                req.session.name = productsDataToUse
                    // req.session.save();

                sequelize.sync({ force: false }).then(function() {
                    var details = {
                        name: productsDataToUse.name,
                        username: productsDataToUse.username,
                        logd: new Date().toJSON().slice(0, 10).replace(/-/g, '/'),
                        logt: new Date().toLocaleTimeString(),

                    }
                    lgusers.create(details).then(function() {
                        res.redirect("/dashboard")
                    })
                })



            } else {
                res.render('login', {
                    errors: 'Wrong Password Entered'
                });

            }
        } else {
            res.render('login', { errors: 'Username does not Exist' })
        }
    })


})



router.get('/signup', function(req, res) {
    console.log("In get signup Page");
    res.render('signup');
})
router.post('/register', function(req, res) {
    console.log("In post register ");
    console.log(req.body);
    console.log(req.body.name);
    console.log(req.body.username);

    var name = req.body.name;
    var email = req.body.email;
    var username = req.body.username;
    var password = req.body.password;
    var password2 = req.body.password2;
    var place = req.body.place;
    var age = req.body.age;
    var agree = req.body.agree;

    req.checkBody('name', 'Name Field is Required').notEmpty();
    req.checkBody('age', 'Age Field is Required').notEmpty();
    req.checkBody('place', 'Place Field is Required').notEmpty();

    req.checkBody('email', 'Email Field is Required').notEmpty();
    req.checkBody('email', 'Name Field is Required').isEmail();
    req.checkBody('username', 'Username Field is Required').notEmpty();
    req.checkBody('password', 'Password Field is Required').notEmpty();
    req.checkBody('password', 'Confirm Password').notEmpty();
    req.checkBody('password2', 'Passwords are not equal').equals(req.body.password);
    req.checkBody('agree', 'Please Agree to terms and Conditions').notEmpty();

    console.log(agree);
    var errors = req.validationErrors();
    console.log(errors);




    if (errors) {
        res.render('signup', {
            errors: errors
        });


    } else {



        sequelize.sync({ force: false }).then(function() {
            var details = {
                name: req.body.name,
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                place: req.body.place,
                age: req.body.age
            }
            dbusers.create(details).then(function() {
                req.session = details;
            })

        })

        // req.flash('success_msg', 'You are registered and can now login');
        res.redirect('/dashboard');
    }


})

router.post('/viewlog', function(req, res) {

    console.log(req.body.username, req.body.un);

    if (req.body.username == "admin") {
        lgusers.all().then(projects => {
            // console.log(projects);
            res.json(projects);



        })
    } else {

        lgusers.all({
            where: {
                username: req.body.username

            }
        }).then(projects => {
            // console.log(projects);
            res.json(projects);



        })

    }



});

router.get('/api/datatable', (req, res) => {

    res.render('schedulenode');

})



router.get('/api', (req, res) => {
    res.json({
        message: 'Welcome to the API'
    });
});

router.post('/api/posts', verifyToken, (req, res) => {




    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if (err) {
            res.sendStatus(403);
        } else {

            Request.get("https://myblog-46a92.firebaseio.com/posts.json/", (error, response, body) => {
                if (error) {
                    return res.send('Response not available right now, may be due to network issues!');
                    // return console.dir(error);
                }
                try {
                    console.dir(JSN.parse(body));
                } catch (error) {
                    console.error(error);
                    // expected output: ReferenceError: nonExistentFunction is not defined
                    // Note - error messages will vary depending on browser
                }

                let dataa = JSON.parse(body);



                res.json({
                    message: dataa,
                    authData
                });
            });
        }
    });
});


router.post('/api/testing', (req, res) => {

    async function f() {

        let promise = new Promise((resolve, reject) => {

            Request.get("https://myblog-46a92.firebaseio.com/posts.json/", (error, response, body) => {
                if (error) {
                    reject("Not found!!!");

                } else {
                    resolve(JSON.parse(body));
                }
            })
        })


        let result = await promise; // wait till the promise resolves (*)

        console.log(result); // "done!"
        seq(result)
    }

    f();

    function seq(newd) {
        sequelize.sync({ force: false }).then(function() {
            var det = {
                author: newd['-KpLB4Z5O1QX2iw1RWOD'].author,
                categories: newd['-KpLB4Z5O1QX2iw1RWOD'].categories[0],
                content: newd['-KpLB4Z5O1QX2iw1RWOD'].content,
                title: newd['-KpLB4Z5O1QX2iw1RWOD'].title

            }

            apidata.create(det).then(function() {
                apidata.all().then(projects => {
                    // console.log(projects);
                    res.json(projects);
                });
            })

        })
    }


    // console.log(result);

});




router.post('/api/getexapi', (req, res) => {



    Request.get("https://myblog-46a92.firebaseio.com/posts.json/", (error, response, body) => {
        if (error) {
            return res.send('Response not available right now, may be due to network issues!');
            // return console.dir(error);
        }
        try {
            console.dir(JSN.parse(body));
        } catch (error) {
            console.error(error);
            // expected output: ReferenceError: nonExistentFunction is not defined
            // Note - error messages will vary depending on browser
        }

        let newd = JSON.parse(body);
        console.log(newd)




        sequelize.sync({ force: false }).then(function() {
            var det = {
                    author: newd['-KpLB4Z5O1QX2iw1RWOD'].author,
                    categories: newd['-KpLB4Z5O1QX2iw1RWOD'].categories[0],
                    content: newd['-KpLB4Z5O1QX2iw1RWOD'].content,
                    title: newd['-KpLB4Z5O1QX2iw1RWOD'].title

                }
                // apidata.create(det).then(function() {
                //     apidata.all().then(projects => {
                //         // console.log(projects);
                //         res.json(projects);
                //     });

            // })


            var cronJob = cron.job("*/2 * * * * *", function() {
                // perform operation e.g. GET request http.get() etc.
                console.info('cron job completed');

                apidata.create(det).then(function() {


                })

            }); //cron last
            cronJob.start();


        })







    });

    apidata.all().then(projects => {
        // console.log(projects);
        res.json(projects);
    });


})
router.post('/api/login', (req, res) => {
    // Mock user
    console.log(req.body.username)
    const user = {
        id: 1,
        username: req.body.username,
        email: req.body.email,
        place: req.body.place
    }
    console.log(user);

    jwt.sign({ user }, 'secretkey', { expiresIn: '50s' }, (err, token) => {
        res.json({
            token
        });
    });
});

// FORMAT OF TOKEN
// Authorization: Bearer <access_token>

// Verify Token
function verifyToken(req, res, next) {
    // Get auth header value
    const bearerHeader = req.headers['authorization'];
    // Check if bearer is undefined
    if (typeof bearerHeader !== 'undefined') {
        // Split at the space
        const bearer = bearerHeader.split(' ');
        // Get token from array
        const bearerToken = bearer[1];
        // Set the token
        req.token = bearerToken;
        // Next middleware
        next();
    } else {
        // Forbidden
        res.sendStatus(403);
    }

}





module.exports = router;