var mongoose = require('mongoose');

var categoriesSchema = mongoose.Schema({
   categoriesPhoto:{
        categoryPhoto : String
   },
    categoriesNews: {
       categoryNews   : String
    }
});

// создание модели категорий
module.exports = mongoose.model('Categories', categoriesSchema);