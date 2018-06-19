var mongoose = require('mongoose');
var multer = require('multer');

var sightsSchema = mongoose.Schema({
    sight:{
        titleSight: String,
        descSight: String,
        categorySight : String,
        lng: Number,
        lat: Number
    },
    oversight: {
        urlOverSight: String
    }



});

// создание модели фотографии
module.exports = mongoose.model('Sight', sightsSchema);