var express          =   require('express');
var app              =   express();
var port             =   process.env.PORT || 8080;
var mongoose         =   require('mongoose');
var mongo            =   require("mongodb");
var passport         =   require('passport');
var path             =   require('path');
var flash            =   require('connect-flash');

var morgan           =  require('morgan');
var cookieParser     =  require('cookie-parser');
var bodyParser       =  require('body-parser');
var session          =  require('express-session');
var expressValidator =  require('express-validator');


var configDB = require('./config/database.js');

//
const fileUpload = require('express-fileupload');
app.use(fileUpload());
//
// конфигурация
mongoose.connect(configDB.url); // соединение с БД

require('./config/passport')(passport);

// настрока express приложения
app.use(express.static('./'));
app.use(morgan('dev')); // запись запроса в консоль
app.use(cookieParser()); // чтение cookies
app.use(bodyParser.urlencoded({ extended: true })); // получение информации форм html
app.use(bodyParser({uploadDir: 'photos'}));
//app.use(bodyParser());

app.set('view engine', 'ejs'); // настройка ejs для представлений


app.use(session({
    secret          :   'vlgplace',
    resave          :   true,
    saveUnintialized:   true
}));
//+
app.use(express.static('./public'));

app.use(passport.initialize());
app.use(passport.session()); // постоянные сеансы входа в систему
app.use(flash()); // использование  connect-flash для мгновенных сообщений сохраенных в сеансе
//+
app.use(function(req, res, next){
   res.locals.success_msg = req.flash('success_msg');
   res.locals.error_msg = req.flash('error_msg');
   res.locals.error = req.flash('error');
   next();
});


//+
// app.use(expressValidator({
//     errorFormatter: function (param, msg, value) {
//         var namespace   =   param.split('.');
//         var root        =   namespace.shift();
//         var formParam   =   root;
//
//         while(namespace.length){
//             formParam += '[' + namespace.shift() + ']';
//         }
//         return {
//             param   :   formParam,
//             msg     :   msg,
//             value   :   value
//         };
//     }
// }));



// маршруты
require('./app/routes.js')(app, passport); // load  routes and pass in  app and fully configured passport

//запуск
app.listen(port, function () {
    console.log('Соединение установлено. Порт ' + port);
});
//console.log('Соединение установлено. Порт ' + port);
