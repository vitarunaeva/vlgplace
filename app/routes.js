var express = require('express');
var router = express.Router();
var passport = require('passport');
var multer = require('multer');
var fs = require('fs');


//механизм хранения
var storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: function (req, file, cd) {
        cd(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});
//+
//инициализация загрузки
var upload = multer({
    storage: storage,
    limits: {fileSize: 7},
    fileFilter: function (req, file, cd) {
        checkFileType(file, cd);
    }
}).single('filePhoto');

//проверка типа файла
function checkFiletType(file, cd) {
    const fileTypes = /jpeg|jpg/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);

    if (extname && mimetype) {
        return cd(null, true);
    } else {
        cd('Error: Только изображения формата JPEG или JPG!')
    }
}

//загрузка модели фотографии
var Photo = require('../app/models/photo');

module.exports = function (app, passport) {

    // показать домашнюю страницу
    app.get('/', function (req, res) {
        Photo.find({}, function (error, photos) {
            var photoList = '';

            // photos.forEach(function (photo) {
            //     photoList += '\
            //         <a href="/sight-photo" style="background-image: url(' + photo.filePhoto + ')" class="photo_gallery-wrapper">\
            //             <span class="photo_gallery-title">' + photo.titlePhoto + '</span>\
            //             <span class="photo_gallery-desc-hover">\
            //                 <span class="desc-hover__auth">Автор: <span class="desc-hover__style">' + photo.username + '</span></span>\
            //                 <span class="desc-hover__date">Опубликовано: <span class="desc-hover__style">' + photo.dateTime + '</span></span>\
            //                 <span class="desc-hover__category"> Категория: <span class="desc-hover__style">' + photo.categoryPhoto + '</span></span>\
            //                 <span class="desc-hover__rating"> Рейтинг: <span class="desc-hover__style">' +  photo.rating + '</span></span>\
            //             </span>\
            //         </a>\
            //     ';
            // });

            res.render('index.ejs', {photoList: photos});
        });
    });

    // локальный логин. показывает форму входа
    app.get('/login', function (req, res) {
        res.render('index.ejs', {message: req.flash('loginMessage')});
    });

    // обработка формы входа
    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/profile', // перенаправление на страницу profile
        failureRedirect: '/404', // если ошибка, перенправление на страницу login
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
        }));

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
    app.get('/connect/facebook', passport.authorize('facebook', {scope: ['public_profile', 'email']}));

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


    app.post('/addPhoto', function (req, res, next) {
        next();
        // upload(req, res, function (err) {
        //     if(err){
        //         // res.render('index', {
        //         //     msg: err
        //         // });
        //         console.log('tre');
        //         next();
        //     }else{
        //         console.log('here');
        //         if(req.file == undefined){
        //             res.render('index', {
        //                 msg: 'Фото не выбрано!'
        //             });
        //         } else {
        //             res.render('index', {
        //                 msg: 'Файл загружен!',
        //                 file: 'uploads/' + req.file.fieldname
        //             });
        //         }
        //     }
        // })
        // return upload(req, res, function (err) {
        //     //TODO посмотреть как выводить ошибки
        //
        //     if (err) {
        //         return res.render('index', {
        //             msg: err
        //         });
        //     }
        //
        //     if (req.body.filePhoto == undefined) {
        //         console.error('Изображение не добавлено');
        //     } else {
        //         console.log('res', res);
        //     }
        //
        //     next();
        // });
    }, function (req, res) {
        var newPhoto = new Photo(req.body);

        newPhoto.save().then(function (response) {
            console.log('here', response);
            res.status(200).json({code: 200, message: 'OK'});
        }).catch(function (error) {
            console.error('new photo error', error);
        });
    },function (req, res) {
        Photo.find({}, function (error, photos) {
            res.send('index.ejs', {
                photoList: photos
            });
        });
    });
};

