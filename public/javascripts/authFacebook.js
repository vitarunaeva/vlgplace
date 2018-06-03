// Вызов функции с результатом из FB.getLoginStatus().
function statusChangeCallback(response) {
    console.log('statusChangeCallback');
    console.log(response);
    // Объект ответа возвращается с полем состояния,
    // которое позволяет приложению узнать текущий статус входа пользователя.
    if (response.status === 'connected') {
        // запись в приложение на Facebook.
        testAPI();
    } else {
        //Пользователь не входит в приложение
        document.getElementById('status').innerHTML = 'Please log ' +
            'into this app.';
    }
}

// Функция проверки статуса входа
function checkLoginState() {
    FB.getLoginStatus(function(response) {
        statusChangeCallback(response);
    });
}
window.fbAsyncInit = function() {
    FB.init({
        appId      : '251549642056373',
        //включение файлов cookie, чтобы сервер мог получить доступ к сеансу
        cookie     : true,
        //проанализировать социальные плагины на этой странице
        xfbml      : true,
        version    : 'v3.0'
    });
    // Функция получает состоение пользователя, который посещает эту страницу
    // и может вернуть одно из трех состояний для обратного вызова:
    // 1. Записан в приложение ('connected')
    // 2. Записан в Facebook, но не на сайте ('not_authorized')
    // 3. Не заходит в Facebook и не можете определить, вошел пользотватель в приложение или нет.
    //
    // эти случаи обрабатываются обработчиком обратного вызова.

    FB.getLoginStatus(function(response) {
        statusChangeCallback(response);
    });

};

// ассинхронная загрузка SDK
(function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = "https://connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

//запуск теста API-интерфейса после успешного входа в систему
function testAPI() {
    console.log('Добро пожаловать!  Получение информации.... ');
    FB.api('/me', function(response) {
        console.log('Успешный вход: ' + response.name);
        document.getElementById('status').innerHTML =
            'Спасибо за вход в систему, ' + response.name + '!';
    });
}