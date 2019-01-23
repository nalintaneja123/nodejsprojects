var fs = require('fs');
var path = require('path');


var jsonpath = path.join(__dirname, '../models/users.json');

var books = path.join(__dirname, "../models/books.json");
var data = require('../models/bookswapping');


// function User(userId, firstName, lastName, email, addressField1, addressField2, city, state, postCode, country) {
//     this.userId = userId;
//     this.firstName = firstName;
//     this.lastName = lastName;
//     this.email = email;
//     this.addressField1 = addressField1;
//     this.addressField2 = addressField2;
//     this.city = city;
//     this.state = state;
//     this.postCode = postCode;
//     this.country = country;
// }


///gettting all users
module.exports.getTotalUsers = function () {
    var query = data.users.find();
    return query;


// var query =  getallUsers();

}

module.exports.insertUser = function (email, password, userid) {

    var query = data.users({Userid: userid, email: email, password: password});

    return query;


}


module.exports.getUsers = function () {

    var contents = fs.readFileSync(jsonpath);
    var jsoncontent = JSON.parse(contents);
    var userslist = [];
    for (var i = 0; i < jsoncontent.users.length; i++) {

        userslist.push(jsoncontent.users[i]);

    }
    return userslist;

}


//getting one specific user

module.exports.getUser = function (userId) {
    var query = data.users.findOne({Userid: userId});
    return query;

}


//getting useritems

module.exports.getAllUserItems = function (userId) {

    var query = data.userProfile.find({UserID: userId}, {userItems: true, _id: false});
    return query;
}


module.exports.getSpecificUserItemsByUserID = function (userId) {

    var query = data.useritem.find({UserID: userId});
    return query;
}


module.exports.getUserByEmail = function (email, password) {
    var query = data.users.find({email: email, password: password});
    return query;
}

// module.exports.getUser = function (userId) {
//
//     var contents = fs.readFileSync(jsonpath);
//     var jsoncontent = JSON.parse(contents);
//
//     var specificuser = [];
//
//     for (var i = 0; i < jsoncontent.users.length; i++) {
//
//         if (userId === jsoncontent.users[i].Userid) {
//             return jsoncontent.users[i];
//         }
//     }
//
//     return false;
//
// }


module.exports.getUserProfile = function (userId) {

    var contents = fs.readFileSync(jsonpath);
    var jsoncontent = JSON.parse(contents);
    for (var i = 0; i < jsoncontent.userProfile.length; i++) {

        if (userId === jsoncontent.userProfile[i].Userid) {

            return jsoncontent.userProfile[i];

        }

    }
    return false;

}


// module.exports.getUserItems = function (userId) {
//
//     var contents = fs.readFileSync(jsonpath);
//     var jsoncontent = JSON.parse(contents);
//     var userProfileList = [];
//
//     for (var i = 0; i < jsoncontent.userProfile.length; i++) {
//
//
//         if (userId == jsoncontent.userProfile[i].UserID) {
//             return jsoncontent.userProfile[i].userItems;
//         }
//     }
//
//
//     return false;
//
// }


//check status of the book
// module.exports.checkStatus = function (bookname) {
//
//     var contents = fs.readFileSync(jsonpath);
//     var jsoncontent = JSON.parse(contents);
//
//
//     for (var i = 0; i < jsoncontent.useritem.length; i++) {
//
//
//         if (bookname === jsoncontent.useritem[i].item) {
//
//             return jsoncontent.useritem[i];
//         }
//
//     }
//
//     return false;
//
//
// }

module.exports.getStatus = function (item) {

    var query = data.useritem.find({item: item});
    return query;
}


module.exports.updateStatustoSwappedofUserItem = function (userID, bookname) {
    var query = data.useritem.update({UserID: userID, item: bookname}, {$set: {status: "swapped"}});
    return query;
}

module.exports.updateStatusToAvailableOfUserItem = function (userID, bookname) {
    var query = data.useritem.update({UserID: userID, item: bookname}, {$set: {status: "available"}});
    return query;
}

module.exports.insertIntoUserItem = function (userID, bookname, swapItem) {
    var query = data.useritem({
        UserID: userID,
        item: bookname,
        Rating: "***",
        status: "swapped",
        swapitem: swapItem,
        swapItemRating: "",
        swapperRating: ""
    });

    return query;
}


module.exports.insertIntoFeedBack = function (bookName, rating, userID) {

    var query=data.offerFeedback({

        BookName:bookName,
        Rating:rating,
        UserID:userID

    });

    return query;

}

// module.exports.removeUserItem = function (userId, useritem) {
//
//     var contents = fs.readFileSync(jsonpath);
//     var jsoncontent = JSON.parse(contents);
//      var userProfileList = [];
//
//     for (var i = 0; i < jsoncontent.userProfile.length; i++) {
//
//         if (userId === jsoncontent.userProfile[i].UserID) {
//
//             var index = jsoncontent.userProfile[i].userItems.indexOf(useritem);
//
//             if (index > -1) {
//                 jsoncontent.userProfile[i].userItems.splice(index, 1);
//             }
//             userProfileList.push(jsoncontent.userProfile[i]);
//         }
//     }
//
//
//     return userProfileList;
//
//
// }


// module.exports.removeUserItem = function (useritemlist, item) {
//
//     var updatedlist = [];
//
//     for (var i in useritemlist) {
//         if (useritemlist[i] === item) {
//             continue;
//         }
//         updatedlist.push(useritemlist[i]);
//     }
//
//     return updatedlist;
//
// }


module.exports.deleteUserItem = function (UserId, bookname) {

    var query = data.useritem.remove({UserID: UserId, item: bookname});
    return query;

}


module.exports.emptyProfile = function (userId) {

    var contents = fs.readFileSync(jsonpath);
    var jsoncontent = JSON.parse(contents);
    var usersProfilelist = [];
    for (var i = 0; i < jsoncontent.userProfile.length; i++) {


        if (userId === jsoncontent.userProfile[i].UserID) {

            jsoncontent.userProfile.splice(i, 1);
        }

    }
    usersProfilelist.push(jsoncontent.userProfile);

    return usersProfilelist;


}


module.exports.getItemsWithoutUserItems = function (useritems) {
    var query = data.books.find({ItemName: {$nin: useritems[0].userItems}});
    return query;
}


module.exports.getRatingOfUserItem = function (useritems, user) {

    var query = data.useritem.find({UserID: user, item: useritems}, {Rating: 1, _id: 0});
    return query;
}

module.exports.getStatusOfUserItem = function (useritems, user) {

    var query = data.useritem.find({UserID: user, item: useritems}, {status: 1, _id: 0});
    return query;
}


module.exports.getItemwithAvailableStatusOtherThantheSwappedItem = function (userId, bookname) {
    var query = data.useritem.find({UserID: userId, status: "available", item: {$ne: bookname}});
    return query;
}

// module.exports.getItemsWithoutUserItems = function (userId) {
//     var contents = fs.readFileSync(jsonpath);
//     var jsoncontent = JSON.parse(contents);
//
//     var booksOtherThanUsersBooksList = [];
//
//
//     for (var i = 0; i < jsoncontent.userProfile.length; i++) {
//
//         if (userId === jsoncontent.userProfile[i].UserID) {
//             var items = jsoncontent.userProfile[i].userItems;
//
//             var booksNotborrowedbyUser = fs.readFileSync(books);
//             var jsoncontentForBooks = JSON.parse(booksNotborrowedbyUser);
//
//
//             for (var k = 0; k < items.length; k++) {
//                 for (var j = 0; j < jsoncontentForBooks.books.length; j++) {
//                     if (items[k] === jsoncontentForBooks.books[j].ItemName) {
//                         jsoncontentForBooks.books.splice(j, 1);
//                     }
//                 }
//             }
//             return jsoncontentForBooks.books;
//
//
//         }
//     }
//
//     return false;
// }


module.exports.getItemsDescriptionByUser = function (userId, bookname) {

    var contents = fs.readFileSync(jsonpath);
    var jsoncontent = JSON.parse(contents);
    //  var userslist = [];
    for (var i = 0; i < jsoncontent.useritem.length; i++) {

        if (userId === jsoncontent.useritem[i].UserID && bookname === jsoncontent.useritem[i].item) {
            return jsoncontent.useritem[i]
        }


    }
    return false;
}


// module.exports.getStatusOfItems = function (userId, bookName) {
//
//     var contents = fs.readFileSync(jsonpath);
//     var jsoncontent = JSON.parse(contents);
//
//
//     for (var i = 0; i < jsoncontent.useritem.length; i++) {
//
//
//         if (userId === jsoncontent.useritem[i].UserID && bookName === jsoncontent.useritem[i].item) {
//
//             return jsoncontent.useritem[i];
//         }
//
//     }
//
//     return false;
//
// }


module.exports.getallitemsofUserFromUserItemObject = function (userId) {

    var contents = fs.readFileSync(jsonpath);
    var jsoncontent = JSON.parse(contents);
    var useritemlist = [];


    for (var i = 0; i < jsoncontent.useritem.length; i++) {


        if (userId === jsoncontent.useritem[i].UserID) {

            useritemlist.push(jsoncontent.useritem[i]);
        }

    }

    return useritemlist;


}


module.exports.removeItemWithAvailableStatus = function (itemshavingstatuslist, bookname) {

    var updatedlist = [];

    for (var i in itemshavingstatuslist) {

        if (itemshavingstatuslist[i].item === bookname && itemshavingstatuslist[i].status === 'available') {


            continue;


        }
        updatedlist.push(itemshavingstatuslist[i]);

    }

    return updatedlist;


}


