menu.onclick=function myFunction() {
    const x = document.getElementById("myTopnav");

    if(x.className === "topnav"){
        x.className += " responsive"
    } else{
        x.className = "topnav";
    }
};


//плавный скролл по элементам меню
$(document).ready(function(){
    $("#myTopnav").on("click","a", function (event) {
        event.preventDefault();
        var id  = $(this).attr('href'),
            top = $(id).offset().top;
        $('body,html').animate({scrollTop: top}, 1500);
    });
});

