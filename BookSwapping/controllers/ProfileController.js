var express = require('express');
var app = express();
var path = require('path');


var userdata = require("../models/userdata");
var books = require("../models/bookdata");

var data = require("../models/bookswapping");


var router = module.exports = express.Router();

var validator = require('express-validator');

// var userss = require("../models/users");

var bodyParser = require('body-parser');
//var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.use(bodyParser.urlencoded({extended: true}));

app.use(validator());

module.exports = function (req, res, next) {
    if (req.method === 'GET') {


        if (req.url === '/login') {
            res.render(path.join(__dirname, '../views/login'), {
                req: req,
                itemcode: null,
                nameofcategory: null,
                flag: 1,
                errors: null
            });
        }
        else if (req.url === '/register') {
            res.render(path.join(__dirname, '../views/register'), {

                req: req,
                itemcode: null,
                nameofcategory: null,
                flag: 1,
                errors: null

            });
        }

//////////////////////////////MY SWAPS STARTS HERE////////////////////////////////////////////////////////////
        else if (req.url === '/myswaps') {

            if (req.session.theUser) {


                //req.session.swapItem;

                if (req.session.swapItem == undefined) {


                    res.render(path.join(__dirname, "../views/myswaps"), {
                        req: req,
                        swapitem: null,
                        user: req.session.theUser[0].Userid
                    });

                }

                else {


                    if (req.session.swapItem[0].status == "available" || req.session.swapItem[0].status == "swapped") {

                        res.render(path.join(__dirname, "../views/myswaps"), {
                            req: req,
                            swapitem: null,
                            user: req.session.theUser.Userid
                        });

                    }
                    else {
                        res.render(path.join(__dirname, "../views/myswaps"), {
                            req: req,
                            swapitem: req.session.swapItem[0],
                            user: req.session.theUser.Userid
                        });
                    }


                }
            } else {


                res.render(path.join(__dirname, '../views/login'), {
                    req: req,
                    itemcode: null,
                    nameofcategory: null,
                    user: null,
                    errors: null,
                    flag: 1
                });


            }


        }
        ////////////////////////////My ITEMS starts here///////////////////////////
        else if (req.url === '/myItems') {


            if (req.session.theUser) {

                console.log("session already exists with id=" + req.session.id);

                userdata.getSpecificUserItemsByUserID(req.session.theUser[0].Userid).exec(function (err, useritems) {

                    if (err) console.error(err);

                    req.session.currentProfile = useritems;

                    books.getItems().exec(function (err, allitems) {

                        books.getCategories().exec(function (err, allcategories) {


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
                    flag: 1,
                    user: null,
                    errors: null

                });

                //
                // userdata.getUser("US001").exec(function (err, user) {
                //
                //
                //     if (err) console.error(err);
                //
                //     req.session.theUser = user;
                //
                //     userdata.getSpecificUserItemsByUserID("US001").exec(function (err, useritems) {
                //
                //         if (err) console.error(err);
                //
                //         req.session.currentProfile = useritems;
                //
                //
                //         books.getItems().exec(function (err, allitems) {
                //
                //             books.getCategories().exec(function (err, allcategories) {
                //
                //
                //                 res.render(path.join(__dirname, "../views/myItems"),
                //                     {
                //                         req: req,
                //                         user: req.session.theUser.Userid,
                //                         useritems: req.session.currentProfile,
                //                         allitems: allitems,
                //                         allcategories: allcategories,
                //                         name: null
                //
                //                     });
                //
                //             });
                //         });
                //
                //
                //     });
                // });


            }
        }///////////////////////My ITEM Pages ends/////////////////////////////////////////////////////////
        /////////////////////////////////////////////Category Page Starts here////////////////////////////
        else if (req.url === '/Categories') {


            if (req.session.theUser) {
                console.log("session already exists with id=" + req.session.id);

                //var itemsbaseoncategory = books.getItemListBasedOnCategoryName(req.query.categoryname);
                //req.session.theUser = userdata.getUser("US001");

                userdata.getAllUserItems(req.session.theUser[0].Userid).exec(function (err, useritems) {

                    if (err) console.error(err)

                    if (useritems != 0) {
                        userdata.getItemsWithoutUserItems(useritems).exec(function (err, items) {

                            if (err) console.error(err)

                            //console.log(items);

                            // req.session.currentProfile = userdata.getItemsWithoutUserItems(req.session.theUser.Userid);
                            req.session.currentProfile = items;


                            books.getCategories().exec(function (err, categories) {

                                if (err) return err;


                                books.getCategoryCodeBasedOnCategoryName(req.query.categoryname).exec(function (err, categorycode) {

                                    if (err) return console.log(err);


                                    books.getItemListBasedOnCategoryCode(categorycode).exec(function (err, itemsBasedOnCategory) {

                                        if (err) return console.log(err);


                                        res.render(path.join(__dirname, '../views/Categories'), {
                                            req: req,
                                            categories: categories,
                                            itemlist: req.session.currentProfile,
                                            nameofcategory: req.query.categoryname,
                                            user: req.session.theUser[0].Userid,
                                            qs: itemsBasedOnCategory,
                                        });

                                    });

                                });

                            });

                        });

                    }
                    else {

                        res.render(path.join(__dirname, '../views/Categories'), {
                            req: req,
                            categories: 0,
                            itemlist: req.session.currentProfile,
                            nameofcategory: req.query.categoryname,
                            user: req.session.theUser[0].Userid,
                            // qs: itemsBasedOnCategory,
                        });
                    }

                });


                console.log("session for category is created");
                //next();
            }
            else {


                books.getCategoryCodeBasedOnCategoryName(req.query.categoryname).exec(function (err, categorycode) {

                    if (err) return console.log(err);

                    books.getItemListBasedOnCategoryCode(categorycode).exec(function (err, itemsBasedOnCategory) {

                        if (err) return console.log(err);

                        books.getCategories().exec(function (err, categories) {

                            if (err) return console.log(err);


                            books.getItems().exec(function (err, items) {


                                if (err) return console.log(err);


                                res.render(path.join(__dirname, '../views/Categories'), {
                                    req: req,
                                    categories: categories,
                                    itemlist: items,
                                    nameofcategory: req.query.categoryname,
                                    user: 1,
                                    qs: itemsBasedOnCategory,
                                    itemcode: null

                                });


                            });


                        });


                    });

                });


                // userdata.getUser("US001").exec(function (err, user) {
                //     if (err) return err;
                //
                //
                //     req.session.theUser = user;
                //
                //     userdata.getAllUserItems("US001").exec(function (err, useritems) {
                //
                //         if (err) console.error(err)
                //
                //
                //         userdata.getItemsWithoutUserItems(useritems).exec(function (err, items) {
                //
                //             if (err) console.error(err)
                //
                //
                //             req.session.currentProfile = items;
                //
                //
                //             books.getCategories().exec(function (err, categories) {
                //
                //                 if (err) return err;
                //
                //
                //                 books.getCategoryCodeBasedOnCategoryName(req.query.categoryname).exec(function (err, categorycode) {
                //
                //                     if (err) return console.log(err);
                //
                //
                //                     books.getItemListBasedOnCategoryCode(categorycode).exec(function (err, itemsBasedOnCategory) {
                //
                //                         if (err) return console.log(err);
                //                         books.getCategories().exec(function (err, categories) {
                //
                //                             if (err) return err;
                //
                //                             res.render(path.join(__dirname, '../views/Categories'), {
                //                                 req: req,
                //                                 categories: categories,
                //                                 itemlist: req.session.currentProfile,
                //                                 nameofcategory: req.query.categoryname,
                //                                 user: req.session.theUser.Userid,
                //                                 qs: itemsBasedOnCategory,
                //                             });
                //
                //                         });
                //
                //                     });
                //
                //                 });
                //
                //             });
                //
                //
                //         });
                //
                //
                //     });
                //
                // });
                //
                //
                // console.log("session for category is created");
                // // next();


            }


        }
        //////////Display items based on Category Name////////////////////////////////////
        else if (req.url === '/Categories?categoryname=' + req.query.categoryname) {


            // userdata.getUser("US001").exec(function (err, user) {
            //     if (err) return err;

            // req.session.theUser = user;

            if (req.session.theUser) {

                userdata.getAllUserItems(req.session.theUser[0].Userid).exec(function (err, useritems) {

                    if (err) console.error(err)

                    userdata.getItemsWithoutUserItems(useritems).exec(function (err, items) {

                        if (err) console.error(err)

                        books.getCategories().exec(function (err, categories) {

                            if (err) return err;

                            books.getCategoryCodeBasedOnCategoryName(req.query.categoryname).exec(function (err, categorycode) {

                                if (err) return console.log(err);

                                if (categorycode != null) {
                                    res.render(path.join(__dirname, '../views/Categories'), {
                                        req: req,
                                        // categories: categories,
                                        itemlist: items,
                                        nameofcategory: req.query.categoryname,
                                        categoryCode: categorycode.categoryCode,
                                        user: req.session.theUser[0].Userid,
                                        // qs: itemsBasedOnCategory,
                                        itemcode: null

                                    });
                                }
                                else {
                                    res.render(path.join(__dirname, '../views/Categories'), {
                                        req: req,
                                        // categories: categories,
                                        itemlist: items,
                                        nameofcategory: req.query.categoryname,
                                        categoryCode: null,
                                        user: req.session.theUser.Userid,
                                        // qs: itemsBasedOnCategory,
                                        itemcode: null

                                    });
                                }

                            });

                        });

                    });
                });
            }
            else {


                books.getItems().exec(function (err, items) {


                    if (err) return console.error(err);


                    books.getCategoryCodeBasedOnCategoryName(req.query.categoryname).exec(function (err, categorycode) {

                        if (err) return console.log(err);

                        if (categorycode != null) {

                            res.render(path.join(__dirname, '../views/Categories'), {
                                req: req,
                                // categories: categories,
                                itemlist: items,
                                nameofcategory: req.query.categoryname,
                                categoryCode: categorycode.categoryCode,
                                user: 1,
                                // qs: itemsBasedOnCategory,
                                itemcode: null

                            });
                        }
                        else {
                            res.render(path.join(__dirname, '../views/Categories'), {
                                req: req,
                                // categories: categories,
                                itemlist: items,
                                nameofcategory: req.query.categoryname,
                                categoryCode: null,
                                user: 1,
                                // qs: itemsBasedOnCategory,
                                itemcode: null

                            });
                        }

                    });

                });
            }
        }



        //     });
        //
        //
        // }
        //////////////////////////////////////Signout Starts here//////////////////////////////////////////////

        else if (req.url === '/signout') {
            req.session.destroy();

            console.log("Session Destroyed");

            res.render(path.join(__dirname, '../views/login'), {
                req: req,
                itemcode: null,
                nameofcategory: null,
                errors: null,
                flag: 1
            });

            //
            // books.getCategoryCodeBasedOnCategoryName(req.query.categoryname).exec(function (err, categorycode) {
            //
            //     if (err) return console.log(err);
            //
            //     books.getItemListBasedOnCategoryCode(categorycode).exec(function (err, itemsBasedOnCategory) {
            //
            //         if (err) return console.log(err);
            //
            //         books.getCategories().exec(function (err, categories) {
            //
            //             if (err) return console.log(err);
            //
            //
            //             books.getItems().exec(function (err, items) {
            //
            //
            //                 if (err) return console.log(err);
            //
            //
            //                 res.render(path.join(__dirname, '../views/Categories'), {
            //                     req: req,
            //                     categories: categories,
            //                     itemlist: items,
            //                     nameofcategory: req.query.categoryname,
            //                     user: 1,
            //                     qs: itemsBasedOnCategory,
            //                     itemcode: null
            //
            //                 });
            //
            //
            //             });
            //
            //
            //         });
            //
            //
            //     });
            //
            // });


            //var categories = books.getCategories();


        }

        /////////////////////////////////////////Signout page ends here/////////////////////////
    }

    ////////////////////////////POST METHODS START//////////////////////////////////////////////////
    else if (req.method === 'POST') {


        if (req.session.theUser) {

            console.log(req.session.id);
            var buttonclicked = req.body;

            if (buttonclicked.Update) {

                userdata.getStatus(buttonclicked.Update).exec(function (err, items) {


                    req.session.swapItem = items;

                    if (items[0].status === "available" || items[0].status === "swapped") {

                        books.getItemCodeOfBook(buttonclicked.Update).exec(function (err, itemcode) {

                            books.getItem(itemcode[0].ItemCode).exec(function (err, item) {

                                //req.session.swapItem=item;

                                books.getCategories().exec(function (err, allcategories) {

                                    res.render(path.join(__dirname, "../views/item"), {
                                        req: req,
                                        itemcode: itemcode,
                                        qs: item,
                                        qscategory: allcategories,
                                        itemdescription: null,
                                        user: req.session.theUser[0].Userid,
                                        swapItem: req.session.swapItem
                                    });

                                });
                            })


                        });


                    }
                    else if (items[0].status === "pending") {
                        userdata.getStatus(buttonclicked.Update).exec(function (err, items) {

                            req.session.swapItem = items;

                            res.render(path.join(__dirname, "../views/myswaps"), {
                                req: req,
                                swapitem: req.session.swapItem[0],
                                user: req.session.theUser[0].Userid
                            });
                        });
                    }
                });


                console.log("This is update");
            }//////UPDATE BUTTON ENDS HERE/////////////////////////////////////////////////////////////////////
            else if (buttonclicked.Delete) {


                //var removeItems = userdata.removeUserItem(req.session.currentProfile, buttonclicked.Delete);

                userdata.deleteUserItem(req.session.theUser[0].Userid, buttonclicked.Delete).exec(function (err, items) {

                    //req.session.currentProfile = items;

                    if (items.ok == 1) {

                        userdata.getSpecificUserItemsByUserID(req.session.theUser[0].Userid).exec(function (err, useritems) {

                            if (err) console.error(err);

                            req.session.currentProfile = useritems;


                            books.getItems().exec(function (err, allitems) {

                                books.getCategories().exec(function (err, allcategories) {


                                    res.render(path.join(__dirname, "../views/myItems"),
                                        {
                                            req: req,
                                            user: req.session.theUser[0].Userid,

                                            useritems: req.session.currentProfile,
                                            allitems: allitems,
                                            allcategories: allcategories,

                                            name: null


                                        });
                                    next();

                                });

                            });
                        });
                    }


                    else {
                        res.send("<html>There are no items to delete now</html>")
                    }

                });


            }//////////////////////////DELETE BUTTON ENDS HERE//////////////////////////////////////////////////
            else if (buttonclicked.Accept) {

                // req.session.swapItem.status = "swapped";

                userdata.updateStatustoSwappedofUserItem(req.session.theUser[0].Userid, buttonclicked.Accept).exec(function (err, updatedstatus) {

                    userdata.getSpecificUserItemsByUserID(req.session.theUser[0].Userid).exec(function (err, items) {

                        req.session.currentProfile = items;


                        books.getItems().exec(function (err, allitems) {

                            books.getCategories().exec(function (err, allcategories) {


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


                });


            }//////////////////////////////////////ACCEPT BUTTON ENDS HERE///////////////////////////////////////
            else if (buttonclicked.Reject) {


                userdata.updateStatusToAvailableOfUserItem(req.session.theUser[0].Userid, buttonclicked.Reject).exec(function (err, updatedstatus) {

                    userdata.getSpecificUserItemsByUserID(req.session.theUser[0].Userid).exec(function (err, items) {

                        req.session.currentProfile = items

                        books.getItems().exec(function (err, allitems) {

                            books.getCategories().exec(function (err, allcategories) {


                                res.render(path.join(__dirname, "../views/myItems"),
                                    {
                                        req: req,
                                        user: req.session.theUser.Userid,

                                        useritems: req.session.currentProfile,
                                        allitems: allitems,
                                        allcategories: allcategories,

                                        name: null
                                        // data: userdata,
                                        // value: req.session.swapItem.status,
                                        // name: req.session.swapItem.item


                                    });

                            });
                        });

                    });


                });


            }////////////////////////////////REJECT BUTTON ENDS HERE/////////////////////////////////////////////
            else if (buttonclicked.WithrawSwap) {


                userdata.updateStatusToAvailableOfUserItem(req.session.theUser[0].Userid, buttonclicked.WithrawSwap).exec(function (err, updatedstatus) {

                    userdata.getSpecificUserItemsByUserID(req.session.theUser[0].Userid).exec(function (err, items) {

                        req.session.currentProfile = items;

                        books.getItems().exec(function (err, allitems) {

                            books.getCategories().exec(function (err, allcategories) {

                                res.render(path.join(__dirname, "../views/myItems"),
                                    {
                                        req: req,
                                        user: req.session.theUser[0].Userid,

                                        useritems: req.session.currentProfile,
                                        allitems: allitems,
                                        allcategories: allcategories,
                                        name: null
                                        // data: userdata,
                                        // value: req.session.swapItem.status,
                                        // name: req.session.swapItem.item


                                    });
                            });
                        });

                    });


                });


            }/////////////////////////////////WITHRAW BUTTON ENDS HERE///////////////////////////////////////////

            else if (buttonclicked.Swapit) {


                var value = books.filteritems();


                var item = req.session.swapItem;

                if (item != undefined) {

                    if (item[0].status === "available") {


                        data.books.find().exec(function (err, allitems) {

                            data.useritem.find({UserID: "US001"}).exec(function (err, useritems) {


                                var filteritems = allitems.filter(function (item) {

                                    return !useritems.find(function (useritem) {

                                        return useritem.item.trim() == item.ItemName.trim();
                                    });
                                });


                                req.session.thelist = filteritems;
                                console.log(filteritems);

                                res.render(path.join(__dirname, "../views/swap"), {
                                    req: req,
                                    list: req.session.thelist,
                                    user: req.session.theUser[0].Userid,
                                    itemcode: null,
                                    nameofcategory: null,
                                    flag: 1

                                });
                            });
                        });


                    }


                    //userdata.getItemwithAvailableStatusOtherThantheSwappedItem(req.session.theUser[0].Userid, item[0].item).exec(function (err, newitem) {

                    //   });


                    else {
                        res.render(path.join(__dirname, "../views/swap"), {
                            req: req,
                            list: 0,
                            user: req.session.theUser[0].Userid,
                            itemcode: null,
                            nameofcategory: null,
                            flag: 1

                        });
                    }
                } else {

                    res.render(path.join(__dirname, "../views/swap"), {
                        req: req,
                        list: 0,
                        user: req.session.theUser[0].Userid,
                        itemcode: null,
                        nameofcategory: null,
                        flag: 1

                    });


                }
            }//////////////////////////////////////////SWAP IT ENDS HERE///////////////////////////////////////
            else if (buttonclicked.Rateit) {


            }
            else if (buttonclicked.GoBacktoCategory) {
                console.log("session already exists with id=" + req.session.id);


                books.getCategories().exec(function (err, categories) {

                    if (err) return err;


                    res.render(path.join(__dirname, '../views/Categories'), {
                        req: req,
                        categories: categories,
                        itemlist: req.session.currentProfile,
                        // nameofcategory: req.query.categoryname,
                        user: req.session.theUser[0].Userid,
                        itemcode: null,
                        nameofcategory: null
                        // qs: itemsBasedOnCategory,

                    });

                });


            }
            else if (buttonclicked.ConfirmSwap) {
                // console.log("confirm swapped clicked");
                //console.log(req.body.swapitem);


                userdata.insertIntoUserItem(req.session.theUser[0].Userid, req.body.swapitem, req.session.swapItem[0].item).save(function (err, insertion) {

                    req.session.item = req.body.swapitem;

                    userdata.updateStatustoSwappedofUserItem(req.session.theUser[0].Userid, req.session.swapItem[0].item).exec(function (err, statusupdated) {


                        res.render(path.join(__dirname, "../views/swap"), {
                            req: req,
                            list: req.session.thelist,
                            user: req.session.theUser[0].Userid,
                            itemcode: null,
                            nameofcategory: null,
                            flag: 2

                        });

                    });
                });
            }
            else if (buttonclicked.submitrating) {
                userdata.insertIntoFeedBack(req.session.item, req.body.ownerrating, req.session.theUser[0].Userid).save(function (err, insertion) {

                    res.render(path.join(__dirname, '../views/ThankYouFeedback'), {
                        req: req,
                        itemcode: null,
                        nameofcategory: null,
                        user:null
                    });


                });
            }


        }
        else {


            res.render(path.join(__dirname, '../views/login'), {
                req: req,
                itemcode: null,
                nameofcategory: null,
                flag: 1,
                user: null,
                errors: null

            });

            // res.render(path.join(__dirname, "../views/swap"), {
            //     req: req,
            //     list: 0,
            //     user: null,
            //     itemcode: null,
            //     nameofcategory: null
            //
            // });
        }
    }


}









