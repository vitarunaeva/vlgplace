//обработчик события по клику на элемент label
//если элемент не видимый, то показать его
//если видимый скрыть
$('.signup_additionaly label').on('click', function () {
    if($(this).siblings('.container_addidionaly').is(":visible")){
        $(this).siblings('.container_addidionaly').hide();
    }else $(this).siblings('.container_addidionaly').show();
});