var mongoose = require('mongoose');
var multer = require('multer');

var photoSchema = mongoose.Schema({
    titlePhoto: String,
    email : String,
    filePhoto: String,
    previewPhoto: String,
    standartPhoto: String,
    categoryPhoto: String,
    kwPhoto: String,
    descPhoto: String,
    datePhoto: String,
    longit: Number,
    latit: Number
});

// создание модели фотографии
module.exports = mongoose.model('Photo', photoSchema);