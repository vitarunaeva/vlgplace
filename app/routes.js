var express = require('express');
var router = express.Router();
var passport = require('passport');
var multer = require('multer');
var sharp = require('sharp');
var fs = require('fs');
const fileUpload = require('express-fileupload');
var ExifImage = require('exif').ExifImage;
var math = require('mathjs');
var ejs = require ('ejs');


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

//загрука модели достопримечательностей
var Sight = require('../app/models/sights');

//загрука модели категорий
var Categories  = require('../app/models/categories');

module.exports = function (app, passport) {
    // показать домашнюю страницу
    app.get('/', function (req, res) {
        Promise.all([
            Photo.find({}),
            Sight.find({}),
            Categories.find({})
        ]).then(function(data) {
            res.render('index.ejs', {photoList: data[0], sights: data[1], categories: data[2], isAuth: req.isAuthenticated()});
        } );
    });

    //показать страницу с фотографией
    app.get('/sight-photo/:id', function (req, res) {
        Photo.find({_id: req.params.id}, function (error, photo) {
            console.log('photo', photo);
            res.render('sight-photo.ejs', {photo: photo[0], isAuth: req.isAuthenticated()});
        });
    });
    //показать страницу с достопримечателньостью
    app.get('/sight-overall/:id', function (req, res) {
        Promise.all([
            Sight.find({_id: req.params.id}),
            Sight.find({})
        ]).then(function(data) {
            var currentSight = data[0][0];
            var sightList = data[1];
            var titleSight = currentSight.sight.titleSight;

            var numberLng = currentSight.sight.lng;
            var numberLat = parseFloat(currentSight.sight.lat);

            // массив объектов вида {достопримечательность, расстояние до текущей достопримечательности}
            var sightsWithDistance = [];

            // проходим по всему списку достопримечательностей
            sightList.forEach(function(sight) {
                //перевод строки в чилсло
                var lng = sight.sight.lng;
                var lat = sight.sight.lat;

                // находим расстояния от текущей достопримечательности (currentSight) до sight
                sightsWithDistance.push({
                    sightData: sight,
                    distance: Math.sqrt(Math.abs((Math.pow(numberLng, 2) - Math.pow(lng, 2)) + (Math.pow(numberLat, 2) - Math.pow(lat, 2))))
                });
            });

            // сортируем по возрастанию и оставляем первые 4
            var nearestSights = sightsWithDistance.sort(function(a, b) {
                return a.distance - b.distance;
            }).slice(0, 4);

            console.log('nearestSights', nearestSights);

            // фильтрируем массив для того, чтобы не возвращать свойство distance, которое не понадобится
            var mappedNearestSights = nearestSights.map(function(sight) {

               return sight.sightData;
            });

            Photo.find({titleSight: titleSight}).then(function(photoData) {
                res.render('sight-overall.ejs', {photoList: photoData, sight: currentSight, nearestSights: mappedNearestSights, isAuth: req.isAuthenticated()});
            });
        });
    });

    // локальный логин. показывает форму входа
    app.get('/login', function (req, res) {
        Photo.find({}, function (arr, photos) {
            res.render('index.ejs', {photoList: photos, message: req.flash('loginMessage')});
        });
        // Sight.find({}, function (arr, sights) {
        //     res.render('index.ejs', {sightList: sights, message: req.flash('loginMessage')});
        // });
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
        function (req, res) {
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
        scope: ['public_profile', 'email']
    }));

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
        user.local.username = undefined;
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



    //ДОБАВЛЕНИЕ ФОТОГРАФИИ
    app.post('/addPhoto', function (req, res) {
        if (!req.files) {
            console.log('*********************************');
        }
        var phts = req.files.filePhotos;
        var author = req.user.local.username;
        var data = req.body;
        var keywords = data.kwPhoto;
       // var ttlPhoto = data.titlePhoto;
        var photoName = './public/uploads/' + Date.now() + phts.name;

        data.author = author;
        data.filePhoto = photoName;
        data.kwPhoto = keywords.split(', ');
        //data.titlePhoto = ttlPhoto.toLocaleLowerCase().split(' ');

        phts.mv(photoName);
        var gps;
        var datePhoto;
        try {

            new ExifImage({image: phts.data}, function (error, exifData) {
                if (error) {
                    //TODO добавить дату съемки и добавления вручную метки фото

                    // console.log('Error EXIF image: ' + error.message);
                    // console.log('phts', phts);
                } else {
                    console.log('exif', exifData);
                    var latRef = exifData.gps.GPSLatitudeRef === 'N' ? 1 : -1;
                    var longRef = exifData.gps.GPSLongitudeRef === 'E' ? 1 : -1;
                    var lat = exifData.gps.GPSLatitude;
                    var long = exifData.gps.GPSLongitude;
                    gps = {
                        latitude: latRef * (lat[0] + (lat[1] / 60) + (lat[2] / 3600)),
                        longtitude: longRef * (long[0] + (long[1] / 60) + (long[2] / 3600))
                    };
                    data.longit = gps.longtitude;
                    data.latit = gps.latitude;
                    data.datePhoto =  exifData.exif.CreateDate;
                    data.exifPhoto = exifData.thumbnail;

                    var newPhoto = new Photo(data);
                    newPhoto.save(function (err, temp) {
                        if (err) {
                            console.log("ooopssss....");
                        }
                        //маленький размер фотографии
                        var previewName = './public/uploads/preview' + Date.now() + phts.name;
                        phts.mv(previewName);
                        data.filePhoto = previewName;

                        sharp(photoName).resize(15, 15).toFile(previewName, function (err, info) {
                            if (err) {
                                console.error('ERROR sharp: ', err);
                                return;
                            }
                            Photo.findOneAndUpdate({filePhoto: photoName}, {preview: previewName}, {upsert: true}, function (err, info) {
                                if (err) {
                                    console.log('err', err);
                                }

                            });
                        });

                        //средний размер фотографии
                        var mediumName = './public/uploads/medium' + Date.now() + phts.name;
                        phts.mv(mediumName);
                        data.filePhoto = mediumName;

                        sharp(photoName).resize(800, 600).toFile(mediumName, function (err, info) {
                            if (err) {
                                console.error('ERROR sharp: ', err);
                                return;
                            }
                            Photo.findOneAndUpdate({filePhoto: photoName}, {medium: mediumName}, {upsert: true}, function (err, info) {
                                if (err) {
                                    console.log('err', err);
                                }

                            });


                        });
                    });

                    // var standartPhoto = gm(filePhoto).resize(900, 600);

                }
            });
        } catch (error) {
            console.log('Error: ' + error.message);
        }
        res.redirect('/');
    });


    //ДОБАВЛЕНИЕ ДОСТОПРИМЕЧАТЕЛЬНОСТИ
    app.post('/addSight', function (req, res) {
        var data = req.body;
        var newSight = {
            sight: data
        };

        console.log('data: ', data);
    console.log("req", req.body);
        var newSight = new Sight(newSight);
        newSight.save(function (err, temp) {
            if (err) {
                console.log("Новая достопримечательность не сохранилась");
            }
            console.log('newSight: ', newSight);


            res.redirect('/');
        });
    });



    //ДОБАВЛЕНИЕ КАТЕГОРИЙ
    app.post('/addCategorySight', function (req, res) {
       var data = req.body;
       var newCategoryPhoto = {
           categoriesSight: data
       };
       console.log('data', data);
       var newCategoryPhoto = new Categories(newCategoryPhoto);
       newCategoryPhoto.save(function (err, temp) {
           if(err){
               console.log("Новая категория не сохранилась");
           }
           console.log('newCategory:', newCategoryPhoto);
           res.redirect('/');
       })
    });

    //ФИЛЬТРАЦИЯ
    app.post('/filterPhoto', function (req, res) {
        var keywords = req.body.kwPhoto;
        var kw = keywords.split(', ');//склеивание строки по разделитью запятая и пробел
        var author = req.body.author;
        var titleSight = req.body.titleSight;
        //выборка фотографий из базы данных
        Photo.find({kwPhoto: {$in: kw}, author: {$in: author}, titleSight: {$in: titleSight}}, function (err, photos) {
            if (err) {
                console.log('err', err);
            }
            res.render('index.ejs', {photoList: photos});
        });
    });


    //ФОРМА ПОИСКА

    app.post('/search-form', function (req, res, next) {
        var inputSearch = req.body.searchString;

        // ищем фото по полному названию
        Photo.find({titlePhoto: inputSearch}, function (err, photos) {
            if (err) {
                console.log('err', err);
            }

            // загружаем шаблон из файловой системы (1 параметр - путь до шаблона, 2 параметр - данные для шаблона
            // 3 параметр - колбек
            ejs.renderFile('./views/photoList.ejs', {photoList: photos}, function(err, html) {
                if (err) {
                    console.log('err', err);
                }

                // возвращаем сгенерированный html с вставленными данными из БД обратно в запрос
                res.end(html);
            });
        });
    });
};

