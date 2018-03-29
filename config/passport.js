var AuthLocalStrategy = require('passport-local').Strategy;
var OKStrategy = require('passport-odnoklassniki').Strategy;
var VKStrategy = require('passport-vkontakte').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;


// загрузка модели пользователя
var User = require('../app/models/user');

// зарузка пересенных auth
var configAuth = require('./auth');

module.exports = function (passport) {

    // установка сессии passport
    // для постоянных сеансов входа в систему
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });


    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });


    passport.use('local-login', new AuthLocalStrategy({
            //по умолчанию, локальная стратегия использует username и password, переобпредяет email
            usernameField: 'username',
            passwordField: 'password',
            passReqToCallback: true // проверяет вошел пользователь в систему или нет
        },
        function (req, email, password, done) {

            if (email)
                email = email.toLowerCase(); // нижний регистр


            // ассинхронность
            process.nextTick(function () {
                console.log('124');
                User.findOne({'local.email': email}, function (err, user) {
                    // если ошибка, то воозвращаем ошибку
                    if (err)
                        return done(err);

                    // если пользователь не найден, то выводится сообщение
                    if (!user)
                        return done(null, false, req.flash('loginMessage', 'Пользователь не найден'));

                    if (!user.validPassword(password))
                        return done(null, false, {message:  'Некорректный пароль.'});

                    // если все ок, то возвращаем юзера
                    else
                        return done(null, user);
                });
            });

        }));

    // локальная регистрация
    passport.use('local-signup', new AuthLocalStrategy({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
        },
        function (req, email, password, done) {
            if (email)
                email = email.toLowerCase();

            process.nextTick(function () {
                if (!req.user) {
                    User.findOne({'local.email': email}, function (err, user) {

                        if (err)
                            return done(err);

                        if (user) {
                            return done(null, false, req.flash('signupMessage', 'Такой E-mail уже существует.'));
                        } else {

                            // создание нового пользователя
                            var newUser = new User();

                            newUser.local.email = email;
                            newUser.local.password = newUser.generateHash(password);

                            newUser.save(function (err) {
                                if (err)
                                    return done(err);

                                return done(null, newUser);
                            });
                        }

                    });

                } else if (!req.user.local.email) {


                    User.findOne({'local.email': email}, function (err, user) {
                        if (err)
                            return done(err);

                        if (user) {
                            return done(null, false, req.flash('loginMessage', 'Такой E-mail уже существует.'));

                        } else {
                            var user = req.user;
                            user.local.email = email;
                            user.local.password = user.generateHash(password);
                            user.save(function (err) {
                                if (err)
                                    return done(err);

                                return done(null, user);
                            });
                        }
                    });
                } else {
                    // польльзователь вошел в систему и имеет локальную запись. игнорирование регистрации.
                    //прежде чем создать новую учетную запись необхожимо выйти из системы
                    return done(null, req.user);
                }

            });

        }));


    // Odnoklassniki
    var okStrategy = configAuth.odnoklassnikiAuth;

    okStrategy.passReqToCallback = true;  // проверет, вошел ли пользователь в систему или нет
    passport.use(new OKStrategy(okStrategy,
        function (req, token, refreshToken, profile, done) {
            // ассинхронность
            process.nextTick(function () {

                // проверка существования логина
                if (!req.user) {

                    User.findOne({'odnoklassniki.id': profile.id}, function (err, user) {
                        if (err)
                            return done(err);

                        if (user) {

                            // если есть id пользователя, но нет token
                            if (!user.odnoklassniki.token) {
                                user.odnoklassniki.token = token;
                                user.odnoklassniki.name = profile.name.givenName + ' ' + profile.name.familyName;
                                user.odnoklassniki.email = (profile.emails[0].value || '').toLowerCase();

                                user.save(function (err) {
                                    if (err)
                                        return done(err);

                                    return done(null, user);
                                });
                            }

                            return done(null, user); //если пользователь найден
                        } else {
                            // если нет, создаем нового
                            var newUser = new User();

                            newUser.odnoklassniki.id = profile.id;
                            newUser.odnoklassniki.token = token;
                            newUser.odnoklassniki.name = profile.name.givenName + ' ' + profile.name.familyName;
                            newUser.odnoklassniki.email = (profile.emails[0].value || '').toLowerCase();

                            newUser.save(function (err) {
                                if (err)
                                    return done(err);

                                return done(null, newUser);
                            });
                        }
                    });

                } else {
                    // пользователь существует и вошел в систему, аккаунты связываются
                    var user = req.user;

                    user.odnoklassniki.id = profile.id;
                    user.odnoklassniki.token = token;
                    user.odnoklassniki.name = profile.name.givenName + ' ' + profile.name.familyName;
                    user.odnoklassniki.email = (profile.emails[0].value || '').toLowerCase();

                    user.save(function (err) {
                        if (err)
                            return done(err);

                        return done(null, user);
                    });

                }
            });

        }));

    //VK
    var vkStrategy = configAuth.vkAuth;

    vkStrategy.passReqToCallback = true;  // проверет, вошел ли пользователь в систему или нет
    passport.use(new VKStrategy(vkStrategy,
        function (req, token, refreshToken, profile, done) {
            // ассинхронность
            process.nextTick(function () {

                // проверка существования логина
                if (!req.user) {

                    User.findOne({'vkontakte.id': profile.id}, function (err, user) {
                        if (err)
                            return done(err);

                        if (user) {

                            // если есть id пользователя, но нет token
                            if (!user.vkontakte.token) {
                                user.vkontakte.token = token;
                                user.vkontakte.name = profile.name.givenName + ' ' + profile.name.familyName;
                                user.vkontakte.email = (profile.emails[0].value || '').toLowerCase();

                                user.save(function (err) {
                                    if (err)
                                        return done(err);

                                    return done(null, user);
                                });
                            }

                            return done(null, user); //если пользователь найден
                        } else {
                            // если нет, создаем нового
                            var newUser = new User();

                            newUser.vkontakte.id = profile.id;
                            newUser.vkontakte.token = token;
                            newUser.vkontakte.name = profile.name.givenName + ' ' + profile.name.familyName;
                            newUser.vkontakte.email = (profile.emails[0].value || '').toLowerCase();

                            newUser.save(function (err) {
                                if (err)
                                    return done(err);

                                return done(null, newUser);
                            });
                        }
                    });

                } else {
                    // пользователь существует и вошел в систему, аккаунты связываются
                    var user = req.user;

                    user.vkontakte.id = profile.id;
                    user.vkontakte.token = token;
                    user.vkontakte.name = profile.name.givenName + ' ' + profile.name.familyName;
                    user.vkontakte.email = (profile.emails[0].value || '').toLowerCase();

                    user.save(function (err) {
                        if (err)
                            return done(err);

                        return done(null, user);
                    });

                }
            });

        }));

    // FACEBOOK
    var fbStrategy = configAuth.facebookAuth;
    fbStrategy.passReqToCallback = true;
    passport.use('facebook', new FacebookStrategy(fbStrategy,
        function (req, token, refreshToken, profile, done) {

            process.nextTick(function () {

                if (!req.user) {

                    User.findOne({'facebook.id': profile.id}, function (err, user) {
                        if (err)
                            return done(err);

                        if (user) {
                            if (!user.facebook.token) {
                                user.facebook.token = token;
                                user.facebook.name = profile.name.givenName + ' ' + profile.name.familyName;
                                user.facebook.email = (profile.emails[0].value || '').toLowerCase();

                                user.save(function (err) {
                                    if (err)
                                        return done(err);

                                    return done(null, user);
                                });
                            }

                            return done(null, user);
                        } else {
                            var newUser = new User();

                            newUser.facebook.id = profile.id;
                            newUser.facebook.token = token;
                            newUser.facebook.name = profile.name.givenName + ' ' + profile.name.familyName;
                            newUser.facebook.email = (profile.emails[0].value || '').toLowerCase();

                            newUser.save(function (err) {
                                if (err)
                                    return done(err);

                                return done(null, newUser);
                            });
                        }
                    });

                } else {
                    var user = req.user;

                    user.facebook.id = profile.id;
                    user.facebook.token = token;
                    user.facebook.name = profile.name.givenName + ' ' + profile.name.familyName;
                    user.facebook.email = (profile.emails[0].value || '').toLowerCase();

                    user.save(function (err) {
                        if (err)
                            return done(err);

                        return done(null, user);
                    });

                }
            });

        }));
};