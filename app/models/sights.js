var mongoose = require('mongoose');
var multer = require('multer');

var sightsSchema = mongoose.Schema({
    sight:{
        titleSight: String,
        categorySight: String,
        descSight: String,
        photoSight: {

        },
    },
    oversight: {
        urlOverSight: String
    }



});

// создание модели фотографии
module.exports = mongoose.model('Sight', sightsSchema);