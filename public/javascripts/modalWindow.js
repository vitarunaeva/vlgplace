var modalFilter = document.getElementById('modalWindow__filter'),
    modalAuth = document.getElementById('modalWindow__auth'),
    auth = document.getElementById('authorization'),
    index = document.getElementById('index');

(function () {
    'use strict';

    //открытие модального окна
    $('.js-popup-open').on('click', function (e) {
        e.preventDefault();

        var popupId = $(this).attr('href');

        $('.overlay').addClass('visible');
        $(popupId).addClass('visible');
    });
    //закрытие модального окна на "крестик"
    $('.popup-close').on('click', function () {
        $('.overlay').removeClass('visible');
        $(this).parents('.popup').removeClass('visible');
    });
    //закрытие модального окна путем нажатия кнопки "esc"
    $(document).keydown(function (e) {
        if (e.keyCode === 27 && $('.overlay').hasClass('visible')) {
            $('.overlay').removeClass('visible');
            $('.popup').removeClass('visible');
        }
    });

    $('.js-popup-open2').on('click', function (e) {
        e.preventDefault();

        var popupId = $(this).attr('href');
        $(this).parents('.popup').removeClass('visible');
        $(popupId).addClass('visible');
    });
    //закрытие модального окна на "крестик"
    $('.popup-close').on('click', function () {
        $('.overlay').removeClass('visible');
        $(this).parents('.popup').removeClass('visible');
    });

    // $(".overlayLink").click(function(event){
    //     event.preventDefault();
    //     var action = $(this).attr('data-action');
    //
    //     $("#loginTarget").load("ajax/" + action);
    //
    //     $(".overlay").fadeToggle("fast");
    // });
})();