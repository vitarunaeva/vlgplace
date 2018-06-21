var mongoose = require('mongoose');
var multer = require('multer');

var photoSchema = mongoose.Schema({
    titlePhoto: [String],
    author : String,
    filePhoto: String,
    preview: String,
    medium: String,
    standartPhoto: String,
    titleSight: String,
    kwPhoto: Array,
    descPhoto: String,
    datePhoto: String,
    longit: Number,
    latit: Number
    }, {
    timestamps: {
        createAt: 'createAt',
        updateAt: 'updateAt'
    }
});

// создание модели фотографии
module.exports = mongoose.model('Photo', photoSchema);