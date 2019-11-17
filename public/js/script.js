$(function () {
    $(".toggle-password").click(function() {

        $(this).toggleClass("-eye -eye-off");
        const input = $($(this).attr('toggle'));
        if (input.attr("type") === "password") {
            input.attr("type", "text");
        } else {
            input.attr("type", "password");
        }
    });

    $('.navigation').on('click',function(e){
        e.stopPropagation();
        navMenu('toggle')
    });

    $('#bg,.header').on('click',function(e){
        if(!$(e.target).hasClass('nav-menu'))
            if(navMenu()) navMenu('close')
    });


    function navMenu(action){
        if(action==='open'){
            $('#nav,#bg').removeClass('disabled').addClass('active');
            $('html').removeClass('active').addClass('disabled');
        }else if(action==='close'){
            $('#nav,#bg').removeClass('active').addClass('disabled');
            $('html').removeClass('disabled').addClass('active');
        }else if(action==='toggle'){
           if(navMenu()) navMenu('close');
           else navMenu('open');
        }else{
            return $('#nav').hasClass('active');
        }
    }
});


