var mongoose = require('mongoose');

var categoriesSchema = mongoose.Schema({
   categoriesSight:{
        categorySight : Array
   },
    categoriesNews: {
       categoryNews   : String
    }
});

// создание модели категорий
module.exports = mongoose.model('Categories', categoriesSchema);