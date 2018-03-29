var mongoose = require('mongoose');
var multer = require('multer');

var photoSchema = mongoose.Schema({
    titlePhoto: String,
    filePhoto: String,
    categoryPhoto: String,
    kwPhoto: String,
    descPhoto: String,
    datePhoto: String
});

// создание модели фотографии
module.exports = mongoose.model('Photo', photoSchema);