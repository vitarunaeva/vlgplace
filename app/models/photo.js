var mongoose = require('mongoose');
var multer = require('multer');

var photoSchema = mongoose.Schema({
    titlePhoto: String,
    author : String,
    filePhoto: String,
    preview: String,
    previewPhoto: String,
    standartPhoto: String,
    titleSight: String,
    kwPhoto: Array,
    descPhoto: String,
    datePhoto: String,
    longit: Number,
    latit: Number
});

// создание модели фотографии
module.exports = mongoose.model('Photo', photoSchema);