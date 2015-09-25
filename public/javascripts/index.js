$(document).ready(function(){

    $('#loginform').submit(function(){
        sendData(this,'/');
        return false;
    })


    $('#regform').submit(function(){
        if( validate('#regform input[name="email"]','email','#regform') && passCheck('#regform input[name="uPass"]','input[name="ucPass"]','password','#regform') && validate('#regform input[name="uName"]','username','#regform'))
        {
            sendData(this,'/');
        }
        return false;
    })


    validateRegForm();



});

function sendData(form,url){
    $.ajax({
        url: url,
        type: 'post',
        data: $(form).serialize(),
        success: function (res) {
            handleRes(res, form);
        }
    })

}

function handleRes(res,form){

    if(res.fid=='login' && res.state){
        window.location=res.url;
    }
    if(res.fid=='login' && !res.state){
        $('#lerr').html('Username or password incorect');
    }



    if(res.fid=='reg' && res.eType=='pval' && !res.status){
        $(form).find('.pvalErr').each(function(){
            $(this).removeClass('has-success').addClass('has-error');

        })
        $(form).find('#perr').html(res.msg);
    }

    if(res.fid=='reg' && res.eType=='pval' && res.status){
        $(form).find('.pvalErr').each(function(){
            $(this).removeClass('has-error').addClass('has-success');
        })
        $(form).find('#perr').html("");
    }
    if(res.fid=='reg' && res.eType=='email' && !res.status){
        $(form).find('.evalErr').each(function(){
            $(this).removeClass('has-success').addClass('has-error');
        })
        $(form).find('#eerr').html(res.msg);
    }

    if(res.fid=='reg' && res.eType=='email' && res.status){
        $(form).find('.evalErr').each(function(){
            $(this).removeClass('has-error').addClass('has-success');
        })
        $(form).find('#eerr').html("");
    }

    if(res.fid=='reg' && res.eType=='user' && !res.status){
        $(form).find('.uvalErr').each(function(){
            $(this).removeClass('has-success').addClass('has-error');
        })
        $(form).find('#uerr').html(res.msg);
    }
    if(res.fid=='reg' && res.eType=='user' && res.status){
        $(form).find('.uvalErr').each(function(){
            $(this).removeClass('has-error').addClass('has-success');
        })
        $(form).find('#uerr').html("");
    }

    if(res.fid=='reg' && res.eType=='success'){
        clear(form);
        $('button.close').click();
        $('#thnx').modal();


    }


}

function clear(form){
    $(form).find('input[type="text"],input[type="password"],input[type="email"]').each(function(){
        $(this).val("");
    });
    $(form).find('textarea').each(function(){
        $(this).html("");
    })
}

function validate(element,typ,form){
    var status;
        $.ajax({
            async: false,
            url:'/val',
            type:'post',
            data:{typ:typ,data:$(element).val()},
            success: function (res) {
                status=res.status;
                handleRes(res,form);


                }
            })
    return status;
}

function passCheck(p1,p2,typ,form){
    var status;
        $.ajax({
            async: false,
            url:'/val',
            type:'post',
            data:{typ:typ,cpass:$(p2).val(),pass:$(p1).val()},
            success: function (res) {
                status=res.status;
                handleRes(res,form);


            }
        })
    return status;

}

function validateRegForm(){

    $('#regform input[name="uName"]').blur(function(){
       validate(this,'username','#regform');
    })
    $('#regform input[name="email"]').blur(function(){
        validate(this,'email','#regform');
    })
    $('#regform input[name="ucPass"]').blur(function(){
        passCheck('#regform input[name="uPass"]','input[name="ucPass"]','password','#regform');
    })
}