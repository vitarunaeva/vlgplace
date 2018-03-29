$('.signup_additionaly label').on('click', function () {
    if($(this).siblings('.container_addidionaly').is(":visible")){
        $(this).siblings('.container_addidionaly').hide();
    }else $(this).siblings('.container_addidionaly').show();
});