function preperaDataFormToAjax(formId) {
    var formObj = {};
    var inputs = $('#' + formId).serializeArray();
    console.log('inputs', inputs);

    $.each(inputs, function (i, input) {
        formObj[input.name] = input.value;
    });
    return JSON.stringify(formObj);
}

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

// $("#addPhoto").on('submit', function (e) {
//     e.preventDefault();
//     console.log($("#addPhoto")[0][1].files);
    
//     var data = preperaDataFormToAjax('addPhoto');
//  // var formData = new FormData();
//     // TODO сделать загрузку фото
    
//     $.ajax({
//         url: '/addPhoto',
//         type: 'POST',
//         data: data,
//         dataType: "json",
//         contentType: 'application/json',
//         success: function() {
//             $('.popup-close').trigger('click');

//         },
//         error: function(error) {
//             console.error('1Фото не сохранилось', error);
//         }
//     });
// });

