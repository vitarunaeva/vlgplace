var express = require('express');
var router = express.Router();
var passport = require('passport');
var multer = require('multer');
var fs = require('fs');
const fileUpload = require('express-fileupload');
var ExifImage = require('exif').ExifImage;


// //механизм хранения
// var storage = multer.diskStorage({
//     destination: './public/uploads/',
//     filename: function (req, file, cd) {
//         cd(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
//     }
// });
// //+
// //инициализация загрузки
// var upload = multer({
//     storage: storage,
//     limits: {fileSize: 7},
//     fileFilter: function (req, file, cd) {
//         checkFileType(file, cd);
//     }
// }).single('filePhoto');
//
// //проверка типа файла
// function checkFiletType(file, cd) {
//     const fileTypes = /jpeg|jpg/;
//     const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
//     const mimetype = fileTypes.test(file.mimetype);
//
//     if (extname && mimetype) {
//         return cd(null, true);
//     } else {
//         cd('Error: Только изображения формата JPEG или JPG!')
//     }
// }

//загрузка модели фотографии
var Photo = require('../app/models/photo');

module.exports = function (app, passport) {
    // показать домашнюю страницу
    app.get('/', function (req, res) {
        Photo.find({}, function (error, photos) {
            res.render('index.ejs', {photoList: photos, isAuth: req.isAuthenticated()});
            console.log('photoList', photos);

        });
    });

    // локальный логин. показывает форму входа
    app.get('/login', function (req, res) {
        Photo.find({}, function(arr, photos){
            res.render('index.ejs', {photoList: photos ,message: req.flash('loginMessage')});
        });
    });

    // обработка формы входа
    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/profile', // перенаправление на страницу profile
        failureRedirect: '/', // если ошибка, перенправление на страницу login
        failureFlash: true //разрешить мгновенные сообщения
    }));


    // РЕГИСТРАЦИЯ
    //показать страницу регистрации
    app.get('/signup', function (req, res) {
        res.render('signup.ejs', {message: req.flash('signupMessage')});
    });

    // обработка регистрационной формы
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/profile',
        failureRedirect: '/signup',
        failureFlash: true
    }));

    // сеанс profile
    app.get('/profile', isLoggedIn, function (req, res) {
        // res.render('profile.ejs', {
        //     user: req.user
        // });
        Photo.find({}, function (error, photos) {
            res.render('profile.ejs', {
                user: req.user,
                photoList: photos
            });
        });
    });

    // выход
    app.get('/logout', function (req, res) {
        req.logout();
        res.redirect('/');
    });

    function isLoggedIn(req, res, next) {
        if (req.isAuthenticated())
            return next();
        res.redirect('/');
    }

    // odnoklassniki
    //отправить в OK для аутентификации
    app.get('/auth/ok', passport.authenticate('odnoklassniki', {scope: ['public_profile', 'email']}));

    //обработка обратного вызова после того, как OK аутентифицировал пользователя
    app.get('/auth/ok/callback',
        passport.authenticate('odnoklassniki', {
            successRedirect: '/profile',
            failureRedirect: '/'
        }));

    //vk
    app.get('/auth/vkontakte', passport.authenticate('vkontakte', {scope: ['public_profile', 'email']}));

    app.get('/auth/vkontakte/callback',
        passport.authenticate('vkontakte', {
            successRedirect: '/profile',
            failureRedirect: '/'
        }),
        function(req, res){
        res.redirect('/');
        });

    // facebook
    app.get('/auth/facebook', passport.authenticate('facebook', {scope: ['public_profile', 'email']}));

    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect: '/profile',
            failureRedirect: '/'
        }));


// АВТОРИЗАЦИЯ (ВХОД/ПОДКЛЮЧЕНИЕ СОЦИАЛЬНОГО АККАУНТА)

    // локальный
    app.get('/connect/local', function (req, res) {
        res.render('connect-local.ejs', {message: req.flash('loginMessage')});
    });
    app.post('/connect/local', passport.authenticate('local-signup', {
        successRedirect: '/profile',
        failureRedirect: '/connect/local',
        failureFlash: true
    }));

    // odnoklassniki
    app.get('/connect/ok', passport.authorize('odnoklassniki', {scope: ['publick_profile', 'email']}));

    app.get('/connect/ok/callback',
        passport.authorize('odnoklassniki', {
            successRedirect: '/profile',
            failureRedirect: '/'
        }));

    //vk
    app.get('/connect/vkontakte', passport.authorize('vkontakte', {scope: ['publick_profile', 'email']}));

    app.get('/connect/vkontakte/callback',
        passport.authorize('vkontakte', {
            successRedirect: '/profile',
            failureRedirect: '/'
        }));

    // facebook
    //подключение к facebook для авторизации
    app.get('/connect/facebook', passport.authorize('facebook', {
        scope: ['public_profile', 'email']}));

    // обработка обратного вызова после успешной авторизации
    app.get('/connect/facebook/callback',
        passport.authorize('facebook', {
            successRedirect: '/profile',
            failureRedirect: '/'
        }));


// разъединение аккаунта
// использование разъединения аккаунта.
// аккаунт пользователя останется активным при новом входе

    // local
    app.get('/unlink/local', isLoggedIn, function (req, res) {
        var user = req.user;
        user.local.email = undefined;
        user.local.password = undefined;
        user.save(function (err) {
            res.redirect('/profile');
        });
    });
    // odnoklassniki
    app.get('/unlink/ok', isLoggedIn, function (req, res) {
        var user = req.user;
        user.odnoklassniki.token = undefined;
        user.save(function (err) {
            res.redirect('/profile');
        });
    });

    //vk
    app.get('/unlink/vkontakte', isLoggedIn, function (req, res) {
        var user = req.user;
        user.vkontakte.token = undefined;
        user.save(function (err) {
            res.redirect('/profile');
        });
    });

    // facebook
    app.get('/unlink/facebook', isLoggedIn, function (req, res) {
        var user = req.user;
        user.facebook.token = undefined;
        user.save(function (err) {
            res.redirect('/profile');
        });
    });


    app.post('/addPhoto',function (req, res) {
        var phts = req.files.filePhotos;
        if (!req.files){
            console.log('*********************************');
        }
        var photoName = './public/uploads/'+Date.now()+phts.name;
        phts.mv(photoName);
        //req.body.filePhotos = phts.name;
        var data = req.body;
        data.filePhoto = photoName;
        var gps;
        try{
            new ExifImage({image: phts.data}, function (error, exifData) {
                if(error){
                    console.log('Error: ' + error.message);
                    console.log(phts);
                } else{
                    console.log('exif', exifData);
                    var latRef = exifData.gps.GPSLatitudeRef === 'N' ? 1 : -1;
                    var longRef = exifData.gps.GPSLongitudeRef === 'E' ? 1 : -1;
                    var lat = exifData.gps.GPSLatitude;
                    var long = exifData.gps.GPSLongitude;
                    gps = {
                        latitude: latRef * (lat[0]+ (lat[1]/60)+(lat[2]/3600)),
                        longtitude: longRef * (long[0] + (long[1]/60) + (long[2]/3600))
                    };
                    data.longit = gps.longtitude;
                    data.latit = gps.latitude;
                    console.log(gps);
                    var newPhoto = new Photo(data);
                    newPhoto.save(function(err, temp){
                        if(err){
                            console.log("ooopssss....");
                        }
                    });
                }
            });
        }catch (error) {
            console.log('Error: ' + error.message);
        }
        console.log(gps);


        res.redirect('/');
    } ) ;
};

