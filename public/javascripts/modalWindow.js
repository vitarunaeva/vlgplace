var modalFilter = document.getElementById('modalWindow__filter'),
    modalAuth = document.getElementById('modalWindow__auth'),
    auth = document.getElementById('authorization'),
    index = document.getElementById('index');

(function () {
    'use strict';

    $('.js-popup-open').on('click', function(e) {
        e.preventDefault();

        var popupId = $(this).attr('href');

        $('.overlay').addClass('visible');
        $(popupId).addClass('visible');
    });

    $('.popup-close').on('click', function() {
        $('.overlay').removeClass('visible');
        $(this).parents('.popup').removeClass('visible');
    });

    $(document).keydown(function(e) {
        if(e.keyCode === 27 && $('.overlay').hasClass('visible')) {
            $('.overlay').removeClass('visible');
            $('.popup').removeClass('visible');
        }
    });


    $(".overlayLink").click(function(event){
        event.preventDefault();
        var action = $(this).attr('data-action');

        $("#loginTarget").load("ajax/" + action);

        $(".overlay").fadeToggle("fast");
    });
})();