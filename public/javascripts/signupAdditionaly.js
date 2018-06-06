//обработчик события по клику на элемент label
//если элемент не видимый, то показать его
//если видимый скрыть
$('.signup_additionaly label').on('click', function () {
    if($(this).siblings('.container_addidionaly').is(":visible")){
        $(this).siblings('.container_addidionaly').hide();
    }else $(this).siblings('.container_addidionaly').show();
});

$(".password2").on("keyup", function() { // Выполняем скрипт при изменении содержимого 2-го поля

    var pas = $(".password").val(); // Получаем содержимое 1-го поля
    var pas2 = $(this).val(); // Получаем содержимое 2-го поля

    if(pas != pas2) { // Условие, если поля не совпадают

        $(".error_password").html("Пароли не совпадают!"); // Выводим сообщение
        $("#submit_signup").attr("disabled", "disabled"); // Запрещаем отправку формы

    } else { // Условие, если поля совпадают

        $("#submit_signup").removeAttr("disabled");  // Разрешаем отправку формы
        $(".error").html(""); // Скрываем сообщение

    }

});