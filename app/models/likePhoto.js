var mongoose = require('mongoose');

var likePhotoSchema = mongoose.Schema({
    dateLike : Date,
    //TODO добавить user_id
});

// создание модели фотографии
module.exports = mongoose.model('likePhoto', likePhotoSchema);