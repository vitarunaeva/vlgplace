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
//
// $("#addPhoto").on('submit', function (e) {
//     e.preventDefault();
//     // var photoFile = $(this).find('input[name="filePhoto"]')[0].files[0];
//     var data = preperaDataFormToAjax('addPhoto');
//     // var formData = new formData();
//     // formData.append('file_ima')
//     // data.append('uploadFile', photoFile);
//
//     $.ajax({
//         url: '/addPhoto',
//         type: 'POST',
//         data: data,
//         dataType: "json",
//         contentType: 'application/json',
//         success: function (response) {
//             var message = photoFile.element.find('td.message');
//             if (response.status == 'ok') {
//                 message.html(response.text);
//                 file.element.find('button.uploadPhoto').remove();
//             } else {
//                 message.html(response.errors);
//             }xhr: function () {
//             var xhr = $.ajaxSettings.xhr();
//         }
//         },
//
//     });
// });

// $("#addPhoto").on('submit', function (e) {
//     e.preventDefault();
//     var data = preperaDataFormToAjax('addPhoto');
//
//     // TODO сделать загрузку фото
//
//
//     $.ajax({
//         url: '/addPhoto',
//         type: 'POST',
//         data: data,
//         dataType: "json",
//         contentType: 'application/json'
//     }).then(function (response) {
//         // TODO закрыть попап или вывести сообжение о сохранении фото
//     }).catch(function (error) {
//         console.error('Фото не сохранилось', error);
//     });
// });


$("#addPhoto").on('submit', function (e) {
    e.preventDefault();
    var photoFile = $(this).find('input[name="filePhoto"]')[0].files[0];
   //var data = preperaDataFormToAjax('addPhoto');
    var formData = new FormData();
    // TODO сделать загрузку фото


    $.ajax({
        url: '/addPhoto',
        type: 'POST',
        data: FormData,
        dataType: "json",
        contentType: 'application/json'
    }).then(function (response) {
        // TODO закрыть попап или вывести сообжение о сохранении фото
    }).catch(function (error) {
        console.error('Фото не сохранилось', error);
    });
});
