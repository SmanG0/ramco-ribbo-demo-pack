$(document).ready(function () {
    var login = cloneElement('headerTop_left',0,true);
    var welcome = cloneElement('headerTop_left',0,true);
    var loginGlobType = 'customerLogin';
    checkSession()
    
    $(function () {
      // temp change for chair - GO-2718 (the agent login popup should opened when redirected from new ibe agent login)
      var params = new URLSearchParams(window.location.search);
      if (params.get('company_id') == "b8a6-8e1cac8553ac") {
        $(".engineFrame").remove();
        setTimeout(function () {
          $("#loginPop").css("display", "block");
          $('.userPop_tabs > ul a[data-name="agent"]').trigger('click');
        }, 150);
      }
    });
    
    /* Open modal */
    $(document).on('click','.loginMo',function(){
        selfix = this;
        $('#overlay').attr('aria-hidden', 'false');
        $("#loginPop").fadeIn().promise().done(function(){
            $('#overlay').attr('aria-hidden', 'false');
            $('#overlay').css('display', '');
        });
        $('.userPop_tabs > ul a').attr('aria-selected', 'false');
        $('#'+$(this).attr('id')+'_1').attr('aria-selected', 'true');
        $('.login_panel').attr('aria-hidden', 'true');
        $("#"+$(this).attr('aria-controls')).attr('aria-hidden', 'false');
        var loginType = $('#'+$(this).attr('id')+'_1').attr('data-name');
        $('[data-type]').attr('data-type',loginType == undefined ? 'customer' : loginType)
        if ($(selfix).attr('id') == 'agentLogin' || $(selfix).attr('id') == 'crsLogin') {
            $('.userPop_switch').css('display','none');
        }
        if ($(selfix).attr('id') == 'customerLogin') {
            $('.userPop_switch').css('display','block');
        }
        return false;
    });
    /* Open tooltip with the login option */
    $(document).on('click','a.loginMenu_toggleMobile', function() {
        if($(this).attr('aria-expanded')=="false") {
            $('a.headerTop_toggle, a.headerMenu_toggle').attr('aria-expanded', 'false');
            $('.headerBottom_menuPop, .headerTop_pop').slideUp().promise().done(function(){
                $(this).attr('aria-hidden', 'true');
                $(this).css('display', '');
            });
            if(getViewport_width() <= 1024) {
                if($('a.headerMenu_toggleMobile').attr('aria-expanded')=="true")
                    $('a.headerMenu_toggleMobile').trigger('click');
            }
            
            $(this).attr('aria-expanded', 'true');
            $("#"+$(this).attr('aria-controls')).slideDown().promise().done(function(){
                $(this).attr('aria-hidden', 'false');
                $(this).css('display', '');
            });
        }
        else {
            $(this).attr('aria-expanded', 'false');
            $("#"+$(this).attr('aria-controls')).slideUp().promise().done(function(){
                $(this).attr('aria-hidden', 'true');
                $(this).css('display', '');
            });
        }
        return false;
    });  

    $('#closepasssuccessPopPop').on('click', function(){
        $("#passsuccessPop").fadeOut().promise().done(function(){
            $('#overlay').attr('aria-hidden', 'true');
            $('#overlay').css('display', '');
        });
        window.location.href=$('#homeUrl').val();
        
    });
    /* Toggle between tabs customer agent and crs agent */
    $('.userPop_tabs > ul a').on('click', function(){
        if($(this).attr('aria-selected')=='false') {
            $('.userPop_tabs > ul a').attr('aria-selected', 'false');
            $(this).attr('aria-selected', 'true');
            $('.login_panel').attr('aria-hidden', 'true');
            $("#"+$(this).attr('aria-controls')).attr('aria-hidden', 'false');
            var loginType = $(this).attr('data-name');
            $('[data-type]').attr('data-type',loginType)
        }
        
        return false;
    });

    /* toggle between login, sing up and password recovering */
    $('.userPop_switch a,.userPop_forgot a').on('click', function(){
        selfix = this;
        $(selfix).parents('.userPop').fadeOut().promise().done(function(){
            $(this).attr('aria-hidden', 'true');
            $(this).css('display', '');
        });
        $("#"+$(selfix).attr('aria-controls')).fadeIn().promise().done(function(){
            $(this).attr('aria-hidden', 'false');
            $(this).css('display', '');
            $('html, body').animate({scrollTop: $(this).offset().top-10}, 100);
        });
        if($(selfix).attr('aria-controls') == 'registerPop'){
            /* Set the countries drop down */
            callController('general','signUp',createQueryString(window.location.pathname,'myAccount')+"&domain="+window.location.hostname+"&action=countries",'spinner',false,function(data){
                var data2 = JSON.parse(copyObj(data));
                var select = document.getElementById('countrySelect');
                injectDropDown(data2,"id","name",select,false,0);
            });
        }
        
        return false;
    });

    $(document).on('click','.recoverBtn',function() {
        var newPass;
        var form = $(this).parents()[0].querySelectorAll('input');
        var loginType = $('.recoverBtn').attr('data-type');
        var usrid = $('.recoverBtn').attr('data-cust');
        if (form[0].value == form[1].value && passwordValidation(form[0].value)) {
            const data = {
            usrid: usrid,
            action: "pass_change",
                loginType: loginType,
                pass: form[0].value
            };
            callController('general','recoverPass',JSON.stringify(data),false,false,function(data){
                var data1 = JSON.parse(data);
                if(!data1.success)
                    $('.invalidToken').html(data1.details.detail)
                else{
                    $("#passsuccessPop").fadeIn().promise().done(function(){
                        $('#overlay').attr('aria-hidden', 'false');
                        $('#overlay').css('display', '');
                    });
                }
            },false, 'POST'); 
        }else{
            if(form[0].value == ''){
                $('[name='+form[0].name+']').css('background','#ff000087');
                $('[name='+form[0].name+']').attr('data-pass','1')
                $('[name='+form[0].name+']').siblings('.userPop_formError').html($('#err_pw').val());
                return;
            }
            if(!passwordValidation(form[0].value)){
                $('[name='+form[0].name+']').css('background','#ff000087');
                $('[name='+form[0].name+']').attr('data-pass','1')
                $('[name='+form[0].name+']').siblings('.userPop_formError').html($('#err_block_password').val());
                return;
            }
            if(form[1].value == '' || form[1].value != form[0].value){
                $('[name='+form[1].name+']').css('background','#ff000087');
                $('[name='+form[1].name+']').attr('data-passNew','1')
                $('[name='+form[1].name+']').siblings('.userPop_formError').html($('#err_pw2').val());
                return;
            }
        }
            

    });


    $(document).on('click','#signUpSuccessPopPop',function(){
        $("#signUpSuccessPop").slideUp().promise().done(function(){
            $('#overlay').attr('aria-hidden', 'true');
            $('#overlay').css('display', '');
            $('#signUpSuccessPop_panel').css('display', 'none');
        });
        window.location.reload();
    })

    /* Handel the submit button */
    $(document).on('click','.userPop_submit',function(){
        const passwordInput = document.querySelector('input[type="password"][name="password"]').value; //RWP-107
        const dobField = document.querySelector('#dobField');
        if ($(this).attr('id') == 'paymentErrBTN')
            return;
        if ($(this).attr('id') == 'closeCUsuccessPopPop'){
            return false;
        }
        if ($(this).attr('id') != undefined && $(this).attr('id') != null && $(this).attr('id').startsWith('closeDynamicFormPopPop')){
            return false;
        }
        
        var form = $(this).parents()[0].querySelectorAll('input');
        var type = $($(this).find('input')).attr('name');
        loginGlobType = type
        /* Checking the form, according to login or sign up  */
        if($(this).attr('data-target') == "login"){
            showAeroLoader();
            if(validateEmail(form[0].value) && form[1].value != '' || loginGlobType == 'crsLogin' && form[1].value != '' || loginGlobType == 'agentLogin' && form[1].value != ''){/* In case of agent or crs agent login email isn't mandatory */
                if (loginGlobType != 'crsLogin') {
                    const loginData = {
                        domain: window.location.hostname,
                        email: form[0].value,
                        pass: form[1].value,
                        loginType:loginGlobType
                    }
                    callController('general','login',JSON.stringify(loginData),'',false,function(data){
                        var data1 = JSON.parse(copyObj(data));
                        if(!data1.success){
                            hideAeroLoader();
                            $('[name='+form[1].name+']').siblings('.userPop_formError').html(data1.details.detail[0]);
                        }else{
                            // var session = [data1.userid,data1.userFirstName,loginGlobType,form[0].value,data1.agencyid];/* [custid,firstname,customerLogin/agentLogin/crsLogin,email] */
                            // var session = [data1.userid,data1.userFirstName,loginGlobType,form[0].value,data1.agencyid,data1.agency, data1.agtBlockSeatSelect === 1 ? true : false];/* [custid,firstname,customerLogin/agentLogin/crsLogin,email] */
                            // storeInSession('login','add',false,session,function(loginData){
                                callController('myAccount','personalDetails',createQueryString(window.location.pathname,'myAccount')+"&domain="+window.location.hostname+"&action=personal",'spinner',false,function(data){
                                    var data1 = JSON.parse(copyObj(data));
                                    if(type === 'customerLogin')
                                        session = [data1[0]['firstname'],data1[0]['lastname'],'extraInfo',data1[0]['ffnumber'],data1[0]['custsubscribe'],data1[0]['title']]
                                    else if(type === 'agentLogin')
                                        session = [data1[0]['usrname'],'','extraInfo','']
                                    storeInSession('login','add',false,session,function(data){
                                        if(loginGlobType == 'agentLogin'){
                                            window.location.replace(document.getElementById('homeUrl').value);
                                        }
                                        else if(data)
                                            window.location.reload();
                                    });
                                });
                            // });
                        }
                    
                    }, false,'POST' );
                }else if(loginGlobType == 'crsLogin'){/* Redirect to crs system */
                    // check if user2fa not empty if the checkbox is checked
                    if(form[2].checked && form[3].value.length === 0 ){
                        hideAeroLoader();
                        $('[name='+form[3].name+']').css('background','#ff000087');
                        $('[name='+form[3].name+']').attr('data-usr2fa','1');
                        $('[name='+form[3].name+']').siblings('.userPop_formError').html($('#err_valid_usr2fa').val());
                        return false;
                    }

                    const data = {
                        email: form[0].value,
                        pass: form[1].value,
                        loginType:loginGlobType
                        
                    };
                    callController('general','login',JSON.stringify(data),'',false,function(data){
                        var res = data.split(";");
                        // jquery extend function
                        $.extend(
                        {
                            redirectPost: function(location, args)
                            {
                                var $form = $('<form>').attr({ action: location, method: 'POST' });
                                $.each(args, function(key, value) {
                                    $('<input>').attr({ type: 'hidden', name: key }).val(value).appendTo($form);
                                });
                                $form.appendTo('body').submit();
                            }
                        });                       
                        var redirect = res[0];

                        $.redirectPost(redirect, {
                            usrCompanyid:res[1], 
                            usrName: form[0].value, 
                            usrPassword: form[1].value,
                            show2fa:form[2].checked, 
                            usr2fa:form[3].value, 
                            action: 'login'}
                        );
                    }, false,'POST');
                    
                }
            }else{ 
                if(!validateEmail(form[0].value)){
                    hideAeroLoader();
                    var err_name = (loginGlobType == 'crsLogin') ? '#err_valid_username' :'#err_valid_email';
                    var data_name = (loginGlobType == 'crsLogin') ? 'data-username' :'data-email';
                    $('[name='+form[0].name+']').css('background','#ff000087');
                    $('[name='+form[0].name+']').attr(data_name,'1');
                    $('[name='+form[0].name+']').siblings('.userPop_formError').html($(err_name).val());
                }
                if(form[1].value == ''){
                    hideAeroLoader();
                    $('[name='+form[1].name+']').css('background','#ff000087');
                    $('[name='+form[1].name+']').attr('data-pass','1');
                    $('[name='+form[1].name+']').siblings('.userPop_formError').html($('#err_pw').val());
                }

                // check if user2fa not empty if the checkbox is checked
                if(form[2].checked && form[3].value.length === 0 ){
                    hideAeroLoader();
                    $('[name='+form[3].name+']').css('background','#ff000087');
                    $('[name='+form[3].name+']').attr('data-usr2fa','1');
                    $('[name='+form[3].name+']').siblings('.userPop_formError').html($('#err_valid_usr2fa').val());
                }
            }
        }else if($(this).attr('data-target') == "signUp"){
            showAeroLoader();
            if(validateEmail(form[8].value) && form[9].value != '' && form[10].value != '' && validateName(form[0].value) && validateName(form[1].value) && form[8].value != '' && form[7].value != '' && validatePhone(form[7].value) && document.getElementById('countrySelect').value != 0 && validateZip(form[5].value) && passwordValidation(passwordInput) && validateAddress(form[4].value) && validateAddress(form[3].value) && validateDob(dobField)){
                if(form[9].value == form[10].value ){
                    var subscribe = (form[11].checked) ? '1' : '0';
                    queryString = {
                        firstname: form[0].value,
                        lastname: form[1].value,
                        dob: dobField.querySelector('[name="dobYearSelect"]').value + '-' +
                             dobField.querySelector('[name="dobMonthSelect"]').value.padStart(2, '0') + '-' +
                             dobField.querySelector('[name="dobDaySelect"]').value.padStart(2, '0'),
                        company: form[2].value,
                        address: form[3].value,
                        city: form[4].value,
                        country: document.getElementById('countrySelect').value,
                        zipcode: form[5].value,
                        phone: form[7].value,
                        email: form[8].value,
                        pass: form[9].value,
                        repass: form[10].value,
                        subscribe: subscribe,
                        phoneext: $('#extPhone').html().replace('+', ''),
                        cpatcahTxt: $('#g-recaptcha-response').val()
                    }
                    callController('general','signUp',JSON.stringify(queryString),'',false,function(data){
                        let data1 = JSON.parse(copyObj(data));
                        if(data1.success){
                            var session = [data1.custid,form[0].value,'customerLogin',form[8].value];/* [custid,firstname,customerLogin/agentLogin/crsLogin] */
                            storeInSession('login','add',false,session,function(data){
                                callController('myAccount','personalDetails',"&action=personal",'spinner',false,function(data2){
                                    let data1 = JSON.parse(copyObj(data));
                                    session = [form[0].value,form[1].value,'extraInfo',data1[0]['ffnumber'],data1[0]['custsubscribe']];
                                    storeInSession('login','add',false,session,function(){
                                        hideAeroLoader();
                                        $("#registerPop").slideUp().promise().done(function(){
                                            $('#overlay').attr('aria-hidden', 'true');
                                            $('#overlay').css('display', '');
                                        });
                                        $("#signUpSuccessPop").slideDown().promise().done(function(){
                                            $('#overlay').attr('aria-hidden', 'false');
                                            $('#overlay').css('display', '');
                                            $('#signUpSuccessPop_panel').css('display', 'block');
                                            $('html, body').animate({scrollTop: $(this).offset().top-10}, 100);
                                        });
                                    });
                                });
                            });
                        }else{
                            if(data1.error == 1){
                                hideAeroLoader();
                                $('#captcahErrSignUp').html($('#err_captcha').val());    
                            } else {
                                hideAeroLoader();
                                $('#generalError').show();
                                $('#generalError').html(data1.details.detail);
                            }
                        }
                    }, false, 'POST');
                }else{
                    hideAeroLoader();
                    if(form[10].value == '' || form[10].value != form[9].value){
                        $('[name='+form[10].name+']').css('background','#ff000087');
                        $('[name='+form[10].name+']').attr('data-passNew','1')
                        $('[name='+form[10].name+']').siblings('.userPop_formError').html($('#err_pw2').val());
                    }
                }
            }else{/* validate email password and retype password */
                hideAeroLoader();

                if (!validateDob(dobField)) {
                    $('[name="dobYearSelect"]').css('background', '#ff000087').attr('data-birth', '1');
                    $('[name="dobMonthSelect"]').css('background', '#ff000087').attr('data-birth', '1');
                    $('[name="dobDaySelect"]').css('background', '#ff000087').attr('data-birth', '1');
                    $('#dobError').html($('#err_missing_data').val());
                }

                if(!validateEmail(form[8].value)){
                    $('[name='+form[8].name+']').css('background','#ff000087');
                    $('[name='+form[8].name+']').attr('data-email','1')
                    $('[name='+form[8].name+']').siblings('.userPop_formError').html($('#err_valid_email').val());
                }
                if (!passwordValidation(form[9].value)){
                    $('[name='+form[9].name+']').css('background','#ff000087');
                    $('[name='+form[9].name+']').attr('data-pass','1')
                    $('[name='+form[9].name+']').siblings('.userPop_formError').html($('#err_block_password').val());
                }
                if(form[9].value == ''){
                    $('[name='+form[9].name+']').css('background','#ff000087');
                    $('[name='+form[9].name+']').attr('data-pass','1')
                    $('[name='+form[9].name+']').siblings('.userPop_formError').html($('#err_pw').val());
                }

                if(form[10].value == '' || form[10].value != form[9].value){
                    $('[name='+form[10].name+']').css('background','#ff000087');
                    $('[name='+form[10].name+']').attr('data-passNew','1')
                    $('[name='+form[10].name+']').siblings('.userPop_formError').html($('#err_pw2').val());
                }
                if(!validateName(form[0].value)){
                    $('[name='+form[0].name+']').css('background','#ff000087');
                    $('[name='+form[0].name+']').attr('data-passNew','1');
                    if(!$('#allowNonEnglishChar').val()){
                        $('[name='+form[0].name+']').siblings('.userPop_formError').html($('#err_insert_only_english').val());
                    }else{
                        $('[name='+form[0].name+']').siblings('.userPop_formError').html($('#err_invalid_input').val());
                    }
                }
                
                if(!validateAddress(form[4].value)){
                    $('[name='+form[4].name+']').css('background','#ff000087');
                    $('[name='+form[4].name+']').attr('data-city','1')
                    $('[name='+form[4].name+']').siblings('.userPop_formError').html($('#err_city_lettersNumbers').val());
                }

                if(!validateAddress(form[3].value)){
                    $('[name='+form[3].name+']').css('background','#ff000087');
                    $('[name='+form[3].name+']').attr('data-address','1')
                    $('[name='+form[3].name+']').siblings('.userPop_formError').html($('#err_address_lettersNumbers').val());
                }

                if(!validateName(form[1].value)){
                    $('[name='+form[1].name+']').css('background','#ff000087');
                    $('[name='+form[1].name+']').attr('data-passNew','1');
                    if(!$('#allowNonEnglishChar').val()){
                        $('[name='+form[1].name+']').siblings('.userPop_formError').html($('#err_insert_only_english').val());
                    }else{
                        $('[name='+form[1].name+']').siblings('.userPop_formError').html($('#err_invalid_input').val());
                    }
                }
                if(document.getElementById('countrySelect').value == 0){
                    $('[name='+document.getElementById('countrySelect').name+']').css('background','#ff000087');
                    $('[name='+document.getElementById('countrySelect').name+']').attr('data-country','1')
                    $('[name='+document.getElementById('countrySelect').name+']').siblings('.userPop_formError').html($('#err_country').val());
                }
                if(form[7].value == '' || !validatePhone(form[7].value)){
                    $('[name='+form[7].name+']').css('background','#ff000087');
                    $('[name='+form[7].name+']').attr('data-phone','1')
                    $('#phoneError').html($('#err_phone_format').val())
                    //$('[name='+form[7].name+']').siblings('.userPop_formError').html($('#err_phone_format').val());
                }
                if(form[5].value != '' && !validateZip(form[5].value)){
                    $('[name="'+form[5].name+'"]').css('background','#ff000087');
                    $('#zipError').html($('#err_zip_format').val())
                }
            }
        }else if($(this).attr('data-target') == "reset"){
            showAeroLoader();
            if($(this).attr('data-reset') == "0"){/* Reset button from OK to submit and remover worrning */
                $('#resetPasswordPop').fadeOut();
                $('#overlay').attr('aria-hidden', 'true');
                $('#overlay').css('display', ''); 
                $('[name=signUp]').val('Submit');
                $(this).attr('data-reset',1);
                $(this).siblings('ul').find('.userPop_formError').html('');
                $(this).siblings('ul').find('input').not(':submit').val('');
                hideAeroLoader();
            }else{/* check if mail is valid */
                if(validateEmail(form[0].value)){
                    recoverPassHandler('verify_maill',form[0].value,$(this).attr('data-type'))
                }else{
                    hideAeroLoader();
                    $('[name='+form[0].name+']').css('background','#ff000087');
                    $('[name='+form[0].name+']').attr('data-email','1')
                    $('[name='+form[0].name+']').siblings('.userPop_formError').html($('#err_valid_email').val());
                }
            }
        }
    });

    $(document).on('click','input',function(){
        $('#generalError').hide();
    });


    /* Recover password */
    function recoverPassHandler(action,email,loginType){
        if (action == 'verify_maill') {/* check if the mail exists */
            let data = {
                action: "verify_maill",
                email: email,
                loginType: loginType
            };
            callController('general','recoverPass',JSON.stringify(data),false,false,function(data){
                var data1 = JSON.parse(copyObj(data));
                if(!data1.success){
                    hideAeroLoader();
                    $('[name=emailReset]').siblings('.userPop_formError').css('color','#c90000');
                    $('[name=emailReset]').siblings('.userPop_formError').html(data1.details.detail[0]);
                } else {
                    let data = {
                    action: "create_maill",
                    loginType: loginType,
                    };
                    callController('general','recoverPass',JSON.stringify(data),false,false,function(data){
                        hideAeroLoader();
                        var data1 = JSON.parse(copyObj(data));
                        if(data1[0].status == "sent"){
                            $('[name=emailReset]').siblings('.userPop_formError').css('color','#43a323d1');
                            $('[name=emailReset]').siblings('.userPop_formError').html('<p><strong>'+$('#err_mail_sent').val()+'</strong></p><p>'+$('#err_mail_msg').val()+'</p>');
                            $('[name=signUp]').val('OK')
                            $('[name=signUp]').parent('.userPop_submit').attr('data-reset',0);
                        }
                    },false,'POST')
                }
            },false, 'POST');
        } 
    }

    /* remove warrning from input */
    $( ".inputVal" ).keyup(function() {
        if($(this).attr('data-email')){
            if(validateEmail(this.value)){
                $(this).css('background','');
                $('.userPop_formError').html('');
            }
        }
        if($(this).attr('data-username')){
            if(this.value != ''){
                $(this).css('background','');
                $('.userPop_formError').html('');
            }
        }
        if($(this).attr('data-pass')){
            if(this.value != ''){
                $(this).css('background','');
                $(this).siblings('.userPop_formError').html('');
            }
        }
        if($(this).attr('data-passNew')){
            if(this.value != ''){
                $(this).css('background','');
                $(this).siblings('.userPop_formError').html('');
            }
        }
        if($(this).attr('data-phone')){
            if(validatePhone(this.value)){
                $(this).css('background','');
                $('#phoneError').html('')
                $(this).siblings('.userPop_formError').html('');
            }
        }
        if($(this).attr('data-firstname')){
            if(this.value != ''){
                $(this).css('background','');
                $(this).siblings('.userPop_formError').html('');
            }
        }
        if($(this).attr('data-lastname')){
            if(this.value != ''){
                $(this).css('background','');
                $(this).siblings('.userPop_formError').html('');
            }
        }
        if($(this).attr('data-usr2fa')){
            if(this.value != ''){
                $(this).css('background','');
                $(this).siblings('.userPop_formError').html('');
            }
        } 
    });
    $( "#countrySelect" ).change(function() {
        if(this.value !== 0){
            $(this).css('background','');
            $(this).siblings('.userPop_formError').html('');
        }
    });

    $('[name=city]').change(function() {
        if(this.value != ''){
            $(this).css('background','');
            $(this).siblings('.userPop_formError').html('');
        }
    });

    $('[name=address]').change(function() {
        if(this.value != ''){
            $(this).css('background','');
            $(this).siblings('.userPop_formError').html('');
        }
    });

    /* validate email insert */
    function validateEmail(email) {
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email) && !email.includes('@qq.com');
    }
    function validatePhone(phone) {
        // min 5 -> max 15 digits
        var phonereg = /^\s*\d{8,18}\s*$/
        return phonereg.test('000'+phone)
    }
    function validateZip(zip) {
        return /^[a-zA-Z0-9]+(\s+[a-zA-Z0-9]+)*$/.test('000'+zip)
    }

    function validateAddress(data) { 
        const regex = /^[a-zA-Z\u0590-\u05FF0-9\s\/\\"'\u05F3,\-\s]*$/;
        return regex.test(data);
    }

    function validateDob(container) {
        const year = container.querySelector('[name="dobYearSelect"]').value;
        const month = container.querySelector('[name="dobMonthSelect"]').value;
        const day = container.querySelector('[name="dobDaySelect"]').value;

        if (year === "0" || month === "0" || day === "0" || !year || !month || !day) {
            return false;
        }

        const date = new Date(year, month - 1, day);
        if (
            date.getFullYear() != year ||
            (date.getMonth() + 1) != parseInt(month) ||
            date.getDate() != parseInt(day)
        ) {
            return false;
        }

        return true;
    }

    /* check the session and put in the header the correct status (login or welcome) */
    function checkSession(){
    storeInSession('login','get',false,false,function(data){
        var data1 = JSON.parse(copyObj(data));
        var flag = false;
        Object.keys(data1).map(function(key){
            if(data1[key] === 0)
                data1[key] = '';
            if(data1[key] != 0 && data1[key] != null && (key == 'custid' || key == 'agtid' || key == 'agtusrid'))
                flag = true;
        });
        if(flag){
            injectHTML(data1,welcome,'headerTop_left');
            $('#afterLogin').show();
        }
        else{
            $('#beforeLogin').hide();
            injectHTML(data1,login,'headerTop_left');
        }

        let accountLoginRedirectEnabled = $('#accountLogin').val() === '1';
        /* redirect to personalDetail when user logged-in and setting is set as TRUE*/
        if( accountLoginRedirectEnabled && window.location.pathname == "/" && flag){
            /*Update accountLoggedIn to redirect to the account page automatically only once*/
            storeInSession('accountLoggedIn','add',false,true,function(){
                window.location.replace('/account');
            });
        }
        });
    }

    /* show or hide usr2fa input */
    function toggleUsr2fa(){
        //show it when the checkbox is clicked
        $('#show2fa').on('click', function () {
            if ($(this).prop('checked')) {
                $('input[name="usr2fa"]').fadeIn();
            } else {
                $('input[name="usr2fa"]').hide();
                $('input[name="usr2fa"]').css('background','');
                $('input[name="usr2fa"]').siblings('.userPop_formError').html('');
            }
        });
    }

    $(document).on('click','.customerAccount',function(){
        showAeroLoader();
        window.location.replace('/account');
    });
    $(document).on('click','#Logoff',function(e){
        
        storeInSession('logOff','remove',false,'',function(){
            window.location.replace(document.getElementById('homeUrl').value);
        });
        
    });
    /* close modal using enter press */
    window.onkeydown = function(e) {
        if(e.keyCode == 27){
            $('#loginPop').fadeOut();
            $('#registerPop').fadeOut();
            $('#resetPasswordPop').fadeOut();
            $('#overlay').attr('aria-hidden', 'true');
            $('#overlay').css('display', '');
            $('#loginPop,#registerPop,#resetPasswordPop').find('input').not(':submit').val('');
        }

    }

    $('#crsLogin_1, #agentLogin_1').on('click',function(){
        $('.userPop_switch').css('display','none');
    });

    $('#customerLogin_1, #customerLogin').on('click',function(){
        $('.userPop_switch').css('display','block');
    });

    //RWP-107
    function passwordValidation(password) {
        const regexUpperLowerCase = /^(?=.*[A-Z])(?=.*[a-z]).+$/;
        const regexNumber = /^(?=.*\d)(?=.*[a-z]).+$/;
        const regexSpecialChar = /^(?=.*[^\w\s]).+$/;
        
        if (password.length < 8 || password.length > 32){
            passwordFormError($('#err_pw_length'));
            return false;
        }
        if (!regexNumber.test(password)){
            passwordFormError($('#err_block_password'));
            return false;
        }
        

        if (!regexUpperLowerCase.test(password)){
            passwordFormError($('#err_block_password'));
            return false;
        }
        if (!regexSpecialChar.test(password)){
            passwordFormError($('#err_block_password'));
            return false;
        }
        

        return true;
    }

    function passwordFormError(params) {
        $('[name=password]').css('background','#ff000087');
        $('[name=password]').attr('data-pass','1')
        $('[name=password]').siblings('.userPop_formError').html(params.val());
    }
});

$('[name="dobYearSelect"], [name="dobMonthSelect"], [name="dobDaySelect"]').on('change', function() {
    $(this).css('background', '').removeAttr('data-birth');
    $(this).siblings('.userPop_formError').html('');
    $('#birthDay').html('');
});
