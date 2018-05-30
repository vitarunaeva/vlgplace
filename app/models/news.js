var mongoose = require('mongoose');

var newsSchema = mongoose.Schema({
    titleNews : String,
    textNews  : String,
    photoFile : String,
    typeNews  : String,
    datePublished : Date
    //TODO добавить user_id
});

// создание модели новостей
module.exports = mongoose.model('News', newsSchema);