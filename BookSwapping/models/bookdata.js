var fs = require('fs');
var path = require('path');


var jsonpath = path.join(__dirname, '../models/books.json');

var users = path.join(__dirname, '../models/users.json');


var data = require('../models/bookswapping');




var nn=[];
module.exports.getItemCodes = function () {

    var query = data.books.find({}, {ItemCode: 1, _id: 0});
    return query;
}


module.exports.getItems = function () {

    var query = data.books.find();
    return query;

}






module.exports.getItem = function (itemCode) {

    var query = data.books.find({ItemCode: itemCode});
    return query;
}


module.exports.getItemBasedOnName = function (bookname) {

    var contents = fs.readFileSync(jsonpath);
    var jsoncontent = JSON.parse(contents);
    for (var i = 0; i < jsoncontent.books.length; i++) {

        if (bookname == jsoncontent.books[i].ItemName) {

            return jsoncontent.books[i];

        }

    }
    return false;

}

//categories
module.exports.getCategories = function () {

    var query = data.categories.find();
    return query;


}


module.exports.filteritems=function(){

    data.books.find().exec(function(err,allitems){

        data.useritem.find({UserID:"US001"}).exec(function(err,useritems){


            var filteritems=allitems.filter(function(item){

                return !useritems.find(function(useritem){

                        return useritem.item.trim()==item.ItemName.trim();
                    });
                });



            console.log(filteritems);


            });




        });



}




module.exports.getCategoryCodeBasedOnCategoryName = function (categoryName) {

    var query = data.categories.findOne({categoryName: categoryName})
    return query;

}


module.exports.getItemListBasedOnCategoryCode = function (categoryCode) {

    var query = data.books.findOne(({CatelogCategoryCode: categoryCode}));
    return query;

}



module.exports.getCategoryCodeBasedOnItem = function (bookname) {

    var query = data.books.find({ItemName: bookname}, {CatalogCategoryCode: 1, _id: 0});
    return query;
}


module.exports.getCategoryNameBasedOnCategoryCode = function (categoryCode) {


    // var categoryNames = {};

    for(var i=0;i<categoryCode.length;i++) {

        var query = data.categories.find({categoryCode: categoryCode[i].CatalogCategoryCode}, {
            categoryName: 1,
            _id: 0
        });


        query.exec(function(err,categorynames){

            if (err) console.error(err)


            dosomethingwithdata(categorynames)


        });
    }


}


module.exports.dosomethingwithdata=function(categorynames){



    nn.push(categorynames);

    return nn;
}




module.exports.getItemCodeOfBook=function(bookname){

    var query=data.books.find({ItemName:bookname},{ItemCode:1,_id:0});
    return query;
}

