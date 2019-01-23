var mongoose = require('mongoose');

mongoose.connect("mongodb://127.0.0.1:27017/bookswap");

var db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error"));
db.once("open", function (callback) {

    console.log("connection succeeded");
});

var Schema = mongoose.Schema;


module.exports.books = mongoose.model("Books", Schema({
    ItemCode: String,
    ItemName: String,
    CatalogCategoryCode: String,
    Description: String,
    Author: String,
    Rating: String,
    ImageURL: String
}, {collection: 'books'}));

module.exports.categories = mongoose.model("Categories", Schema({


    categoryCode: String,
    categoryName: String

}, {collection: 'categories'}));


module.exports.userProfile = mongoose.model("userProfile", Schema({


    UserID: String,
    userItems: [{type:String}]

}, {collection: 'userProfile'}));

module.exports.useritem = mongoose.model("useritem", Schema({

    UserID: String,
    item: String,
    Rating: String,
    status: String,
    swapitem: String,
    swapitemrating: String,
    swapperRating: String


}, {collection: 'useritem'}));


module.exports.users = mongoose.model('users', Schema({

    Userid: String,
    FirstName: String,
    EmailAddress: String,
    Address1: String,
    Address2: String,
    City: String,
    State: String,
    PostalCode: String,
    Country: String,
    email:String,
    password:String

}, {collection: 'users'}));


module.exports.offerFeedback=mongoose.model('offerFeedback',Schema({

    // offerID:String,
    // userID1:String,
    // userID2:String,
    // rating:String

    BookName:String,
    Rating:String,
    UserID:String

},{collection:"offerFeedback"}));




