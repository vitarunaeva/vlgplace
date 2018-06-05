function preperaDataFormToAjax(formId) {
    var formObj = {};
    var inputs = $('#' + formId).serializeArray();
    console.log('inputs', inputs);

    $.each(inputs, function (i, input) {
        formObj[input.name] = input.value;
    });
    return JSON.stringify(formObj);
}



//переход между вкладками фотокарта и фотогалерея
$('.js-tab-button').on('click', '.js-button:not(.active)', function () {
    $(this)
        .addClass('active').siblings().removeClass('active')
        .closest('.js-container-wrapper').find('.js-container').removeClass('active').eq($(this).index()).addClass('active');
});

//раскрывающиаяся форма поиска
$('.search-label').on('click', function (e) {
    e.preventDefault();

    var $this = $(this),
        form = $this.closest('.search-form'),
        input = form.find('.search-input');
    input.toggleClass('show');
});
$(document).mouseup(function (e) {
    var container = $('.search-input');
    if (container.has(e.target).length == 0) {
        container.removeClass = ('show');
    }
});

// $("#filterPhoto").on('submit', function (e) {
//     e.preventDefault();
//
//     var inputs = $('#filterPhoto').serializeArray();
//     var data = JSON.stringify({
//         kwPhoto: inputs[0].value
//     });
//
//     $.ajax({
//         url: '/filterPhoto',
//         type: 'POST',
//         data: data,
//         contentType: 'application/json',
//         success: function(response) {
//             $('.popup-close').trigger('click');
//
//             console.log('response', response);
//         },
//         error: function(error) {
//             console.error('filter error', error);
//         }
//     });
// });

