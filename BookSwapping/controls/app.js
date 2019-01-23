var express = require('express');
var path = require('path');
var app = express();
var session = require('express-session');

var items = require("../models/bookdata");

//var users = require("../models/userdata");

var profile = require("../controllers/ProfileController");

var userdata = require("../models/userdata");

var validator = require('express-validator');


var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({extended: true});

app.use(bodyParser.urlencoded({extended: true}));


app.use(session({secret: "this is a secret", proxy: true, resave: true, saveUninitialized: true}));

app.use(validator());

app.set('view engine', 'ejs');

app.use('/resources', express.static(path.join(__dirname, '../resources/')));


app.get('/Index', function (req, res) {


    if (req.session.theUser) {
        res.render(path.join(__dirname, '../views/Index'), {
            req: req,
            itemcode: null,
            nameofcategory: null,
            user: req.session.theUser[0].Userid
        });
    }
    else {

        res.render(path.join(__dirname, '../views/Index'), {
            req: req,
            itemcode: null,
            nameofcategory: null,
            user: null
        });
    }

});

app.get('/about', function (req, res) {

    if (req.session.theUser) {
        res.render(path.join(__dirname, '../views/about'), {
            req: req,
            itemcode: null,
            nameofcategory: null,
            user: req.session.theUser[0].Userid
        });
    }
    else {
        res.render(path.join(__dirname, '../views/about'), {
            req: req,
            itemcode: null,
            nameofcategory: null,
            user: 1
        });
    }


});

app.get('/contact', function (req, res) {


    if (req.session.theUser) {

        res.render(path.join(__dirname, '../views/contact'), {
            req: req,
            itemcode: null,
            nameofcategory: null,
            user: req.session.theUser[0].Userid
        });

    } else {
        res.render(path.join(__dirname, '../views/contact'), {
            req: req,
            itemcode: null,
            nameofcategory: null,
            user: 1
        });
    }

});


app.get('/login', profile);

// app.get('/login', function (req, res) {
//
//     res.render(path.join(__dirname, '../views/login'), {req: req, itemcode: null, nameofcategory: null, flag: 1});
//
// });


app.get('/register', profile);

app.post('/register', urlencodedParser, function (req, res) {

    req.assert('email', 'Invalid Email').trim().isEmail();
    req.assert('password', 'Invalid Password').trim().matches(/^[a-zA-Z\d\s]+$/);
    req.assert('userid', 'Invalid Userid').trim().isAlphanumeric();
    var errors = req.validationErrors();

    var usersarray = [];
    if (errors) {
        res.render(path.join(__dirname, '../views/register'), {
            errors: errors,
            req: req,
            itemcode: null,
            nameofcategory: null,
            flag: 1
        })
    }
    else {

        userdata.getTotalUsers().exec(function (err, users) {


            for (var i = 0; i < users.length; i++) {
                usersarray.push(users[i].Userid);
            }

            if (usersarray.includes(req.body.userid)) {
                // console.log("user is already in the database...please enter new user");


                res.render(path.join(__dirname, '../views/register'), {
                    errors: errors,
                    req: req,
                    itemcode: null,
                    nameofcategory: null,
                    email: req.body.email,
                    password: req.body.password,
                    userid: req.body.userid,
                    flag: 2
                })
            }
            else {
                userdata.insertUser(req.body.email, req.body.password, req.body.userid).save(function (err, insertion) {

                    if (err) console.error(err)

                    res.render(path.join(__dirname, '../views/register'), {
                        errors: errors,
                        req: req,
                        itemcode: null,
                        nameofcategory: null,

                        flag: 3
                    })


                });


            }


        });

    }


});


app.post('/login', urlencodedParser, function (req, res) {

    req.assert('email', 'Invalid Email').trim().isEmail();
    req.assert('password', 'Invalid Password').trim().matches(/^[a-zA-Z\d\s]+$/);
    var errors = req.validationErrors();

    if (errors) {
        res.render(path.join(__dirname, '../views/login'), {
            errors: errors,
            req: req,
            itemcode: null,
            nameofcategory: null,
            flag: 1
        })
    }
    else {
        userdata.getUserByEmail(req.body.email, req.body.password).exec(function (err, user) {
            if (user != 0) {
                req.session.theUser = user;

                userdata.getSpecificUserItemsByUserID(req.session.theUser[0].Userid).exec(function (err, useritems) {

                    if (err) console.error(err);

                    req.session.currentProfile = useritems;


                    items.getItems().exec(function (err, allitems) {

                        items.getCategories().exec(function (err, allcategories) {

                            res.render(path.join(__dirname, "../views/myItems"),
                                {
                                    req: req,
                                    user: req.session.theUser[0].Userid,
                                    useritems: req.session.currentProfile,
                                    allitems: allitems,
                                    allcategories: allcategories,
                                    name: null

                                });

                        });
                    });


                });

            }

            else {
                res.render(path.join(__dirname, '../views/login'), {
                    req: req,
                    itemcode: null,
                    nameofcategory: null,
                    errors: null,
                    flag: 2


                })
            }

        });
    }
});


app.get('/feedback', function (req, res) {

    res.render(path.join(__dirname, '../views/feedback'), {req: req, itemcode: null, nameofcategory: null});

});


app.get('/thankyouforfeedback', function (req, res) {
    res.render(path.join(__dirname, '../views/ThankYouFeedback'), {req: req, itemcode: null, nameofcategory: null});

});
app.get('/item', function (req, res) {

    var emptyitemcodesarray = [];
    var emptycategoriesarray = [];

    if (req.session.theUser) {


        if (Object.keys(req.query).length === 0) {
            res.write("<html>No Information is requested</html>");
            res.end();
        }
        else {


            items.getItemCodes().exec(function (err, allitemcodes) {

                if (err) console.log(err);

                for (var i = 0; i < allitemcodes.length; i++) {

                    emptyitemcodesarray.push(allitemcodes[i].ItemCode);
                }

                if (emptyitemcodesarray.includes(req.query.itemcode)) {
                    items.getItem(req.query.itemcode).exec(function (err, item) {

                        if (err) console.log(err);

                        items.getCategories().exec(function (err, allcategories) {

                            if (err) console.log(err);


                            res.render(path.join(__dirname, '../views/item'), {
                                req: req,
                                itemcode: req.query.itemcode,
                                qs: item,
                                qscategory: allcategories,
                                itemdescription: null,
                                user: req.session.theUser[0].Userid
                            });


                        });


                    });
                }
            });

        }
    } else {
        if (Object.keys(req.query).length === 0) {
            res.write("<html>No Information is requested</html>");
            res.end();
        }
        else {

            items.getItemCodes().exec(function (err, allitemcodes) {

                if (err) console.log(err);

                for (var i = 0; i < allitemcodes.length; i++) {

                    emptyitemcodesarray.push(allitemcodes[i].ItemCode);
                }

                if (emptyitemcodesarray.includes(req.query.itemcode)) {
                    items.getItem(req.query.itemcode).exec(function (err, item) {

                        if (err) console.log(err);

                        items.getCategories().exec(function (err, allcategories) {

                            if (err) console.log(err);


                            res.render(path.join(__dirname, '../views/item'), {
                                req: req,
                                itemcode: req.query.itemcode,
                                qs: item,
                                qscategory: allcategories,
                                itemdescription: null,
                                user: null
                            });


                        });


                    });
                }
            });


        }
    }

});


app.get('/swap', function (req, res) {

    res.render(path.join(__dirname, "../views/swap"), {req: req});

});


app.get('/Categories', profile);

// app.get('/Categories/:categoryname',profile);

app.get('/myswaps', profile);

app.post('/myswaps', profile);

app.get('/myItems', profile);


app.post('/myItems', profile);

app.post('/login', profile);


app.post('/item', profile);


app.get('/signout', profile);


app.use(function (req, res, next) {

    res.status(404).send('Sorry Page not found');
});


app.listen(3000);