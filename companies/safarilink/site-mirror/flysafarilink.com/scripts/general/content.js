var li;
var ol;
var remark;

/* validate email insert */
function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

$(document).ready(function(){
    if($(this).width() < 900){
        $('div').removeClass('uprightEngine');
    }

    $("#CUFormBanner").hide();
    $("#contactUS").closest(".pageContact").show();
    $(".dynamicFormBanner").each(function(){
        $(this).hide();
    });
    $(".dynamicForm").each(function(){
        $(this).closest(".pageContact").show();
    });

    if($('.trackingpage').length > 0){
        li = cloneElement('track-progress-li', 0);
        ol = cloneElement('track-progress', 0);
        remark = cloneElement('statusdate', 0);
    }
});
$( window ).resize(function() {
    if($(this).width() < 880){
        $('div').removeClass('uprightEngine');
    }
    else if(($(this).width() > 880) && $('.engineFrame').attr('data-clip') != 3 && $('.engineFrame').attr('data-clip') != ''){
        $('.engineFrame').addClass('uprightEngine');
        }
})

/* Getting countries for drop down */
callController('general','clips',createQueryString(window.location.pathname,'general')+"action=country",'spinner',false,function(data){
    try {
        var data1 = JSON.parse(copyObj(data));
        var country = document.getElementById('countrySelectCU');
        var phone = document.getElementById('phoneSelectCU');
        var countryff = document.getElementById('countrySelectFF');
        var phoneff = document.getElementById('phoneSelectFF');
        var arr = [];

        if($('#contactUS').length > 0){
            injectDropDown(data1,"id","name",country,false,0);
            var iso = $('#extPhoneCU').attr('data-flag');
            var defaultCountry;
            $.each (data1, function (key, value) {
                if(value.iso==iso){
                    defaultCountry = value.id
                }
             });
            $('#countrySelectCU').val(defaultCountry).change();
            /* Getting subject for contact us */
            callController('general','clips',createQueryString(window.location.pathname,'general')+"action=cnuss",'',false,function(data){
                var data2 = JSON.parse(copyObj(data));
                var select = document.getElementById('subjectSelect');
                var subjectSelectLabel =  $("#subjectSelectLabel").html().substring(1);
                injectDropDown(data2,"id","name",select,subjectSelectLabel,0);
            });
        }
        if($('#FFSUform').length > 0){
            injectDropDown(data1,"id","name",countryff,false,0);
            /* Getting title for ff form */
            callController('general','clips',createQueryString(window.location.pathname,'general')+"action=title",'',false,function(data){
                var data2 = JSON.parse(copyObj(data));
                var select = document.getElementById('titleSelectFF');
                injectDropDown(data2,"id","name",select,false,0);
            });
            setDate();
        }
    }
    catch (err) {
        logError(err);
    }
});


$(document).on('click','.date',function(){
    $(this).datetimepicker({
        format: 'YYYY/MM/DD',
        ignoreReadonly: true
    });
})

/* Validate required input and alert when missing */
$(document).on('click','.btnSbumit',function(){
    try {
        var error = false;
        if($(this).attr('data-btn') == 'form'){
            $(this).closest(".rootDynamicForm").find(".inputFiled").each(function(){
                if($(this).find("input").attr('type')!==undefined || $(this).find("textarea").attr('type')!==undefined){
                    type = $(this).find("input").attr('type') || $(this).find("textarea").attr('type');
                }else{
                    type = 'Dropdown';
                }
                switch(type){
                    case 'Text':
                        if($(this).hasClass("date")){
                            if(!$(this).hasClass("dynamicFormMandatoryField")){
                                if($(this).find("input").val()!=="" && !moment($(this).find("input").val(), 'YYYY/MM/DD',true).isValid()){
                                    $(this).find("input").css('background','#ff000087');
                                    $(this).find('.userPop_formError').html($('#err_invalid_input').val());
                                    error = true;
                                }
                                break;
                            }
                            if(!moment($(this).find("input").val(), 'YYYY/MM/DD',true).isValid()){
                                $(this).find("input").css('background','#ff000087');
                                $(this).find('.userPop_formError').html($('#err_invalid_input').val());
                                error = true;
                            }
                            break;
                        }
                        if(!$(this).hasClass("dynamicFormMandatoryField")){
                            break;
                        }
                        if($(this).find("input").val()==""){
                            $(this).find("input").css('background','#ff000087');
                            $(this).find('.userPop_formError').html($('#err_invalid_input').val());
                            error = true;
                        }
                    break;
                    case 'Dropdown':
                        if(!$(this).hasClass("dynamicFormMandatoryField")){
                            break;
                        }
                        if($(this).find("select").val()=="select title"){
                            $(this).find("select").css('background','#ff000087');
                            $(this).find('.userPop_formError').html($('#err_invalid_input').val());
                            error = true;
                        }
                    break;
                    case 'Tel':  
                        if(!$(this).hasClass("dynamicFormMandatoryField")){
                            if($(this).find("input").val()!=="" && !hasOnlyNumbers($(this).find("input").val())){
                                $(this).find("input").css('background','#ff000087');
                                $(this).find('.userPop_formError').html($('#err_invalid_input').val());
                                error = true;
                            }
                            break;
                        }
                        if($(this).find("input").val()=="" || !hasOnlyNumbers($(this).find("input").val())){
                            $(this).find("input").css('background','#ff000087');
                            $(this).find('.userPop_formError').html($('#err_invalid_input').val());
                            error = true;
                        }
                    break;
                    case 'Number': 
                        if(!$(this).hasClass("dynamicFormMandatoryField")){
                            break;
                        }
                        if(!isNumber($(this).find("input").val())){
                            $(this).find("input").css('background','#ff000087');
                            $(this).find('.userPop_formError').html($('#err_invalid_input').val());
                            $(this).find('.userPop_formError').attr('dirty','true');
                            error = true;
                        }
                    break;
                    case 'Email': 
                        if(!$(this).hasClass("dynamicFormMandatoryField")){
                            if($(this).find("input").val()!=="" && !validateEmail($(this).find("input").val())){
                                $(this).find("input").css('background','#ff000087');
                                $(this).find('.userPop_formError').html($('#err_invalid_input').val());
                                error = true;
                            }
                            break;
                        }
                        if(!validateEmail($(this).find("input").val())){
                            $(this).find("input").css('background','#ff000087');
                            $(this).find('.userPop_formError').html($('#err_invalid_input').val());
                            error = true;
                        }
                    break;
                    case 'Textarea':
                        if(!$(this).hasClass("dynamicFormMandatoryField")){
                            break;
                        }
                        if($(this).find("textarea").val()==""){
                            $(this).find("textarea").css('background','#ff000087');
                            $(this).find('.userPop_formError').html($('#err_invalid_input').val());
                            error = true;
                        }
                    break;
                }
            });
            if(!error){
                $(this).closest(".dynamicForm").find(".dynamicFormPhone").each(function(){
                    if($(this).val())
                        $(this).val($(this).prev().text()+'-'+$(this).val());
                });

                var formData = {
                    "titleSelectFF" : $('#titleSelectFF').val(),
                    "firstnameFF" : $('input[name="firstnameFF"]').val(),
                    "lastnameFF" : $('input[name="lastnameFF"]').val(),
                    "emailFF" : $('input[name="emailFF"]').val(),
                    "phoneFF" : $('input[name="phoneFF"]').val(),
                    "mobileFF" : $('input[name="mobileFF"]').val(),
                    "countrySelectFF" : $('#countrySelectFF').val(),
                    "city" : $('#FFCUform').find('input[name="city"]').val(),
                    "zipcode" : $('input[name="zipcode"]').val(),
                    "passport" : $('input[name="passport"]').val(),
                    "daySelect" : $('#daySelect').val(),
                    "monthSelect" : $('#monthSelect').val(),
                    "yearSelect" : $('#yearSelect').val()
                }

                

                // Get all form fields dynamically
                var dynamicFormData = {};
                var dynamicFormQueryString = '';
                $(this).closest(".rootDynamicForm").find(".dynamicForm").find("input, select, textarea").each(function() {
                    if ($(this).attr('name') && $(this).attr('name')!="g-recaptcha-response") {
                        dynamicFormData[$(this).attr('name')] = $(this).val();
                        dynamicFormQueryString += '&' + encodeURIComponent($(this).attr('name')) + '=' + encodeURIComponent($(this).val());
                    }
                });

                callController('general','form',createQueryString(window.location.pathname,'general')+dynamicFormQueryString+"&dynamicFormName="+$(this).closest(".rootDynamicForm").find(".dynamicFormName").text()+"&dynamicFormEmails="+$(this).closest(".rootDynamicForm").find(".dynamicFormEmails").val(),'',false,function(data){
                    var data1 = JSON.parse(copyObj(data));
                    $("#dynamicForm_"+data1[0].dynamicFormName).find(".dynamicFormPhone").each(function(){
                        if($(this).val())
                            $(this).val($(this).val().substring($(this).val().indexOf("-") + 1));
                    });
                
                    if(data1[0].status=="ok"){
                        $("#CUsuccessPop").after(
                        "<div class='userPop noRes' id='dynamicFormPop_"+data1[0].dynamicFormName+"' aria-hidden='true'>"+
                            "<a href='#' aria-controls='dynamicFormPop_"+data1[0].dynamicFormName+"' class='userPop_close'>&times;</a>"+
                            "<div class='userPop_title'>"+data1[0].dynamicFormName+"</div>"+
                            "<div class='userPop_body'>"+
                                "<div class='userPop_tabs'>"+
                                    "<div class='userPop_panel' id='dynamicFormPop_panel_"+data1[0].dynamicFormName+"' role='tabpanel' aria-hidden='false'>"+
                                        "<div class='userPop_form'>"+
                                            "<div class='userPop_formTitle'>"+$("#contactus_finish").val()+"</div>"+
                                            "<div class='userPop_submit' id='closeDynamicFormPopPop_"+data1[0].dynamicFormName+"'><input type='submit' value='OK'></div>"+
                                        "</div>"+
                                    "</div>"+
                                "</div>"+
                            "</div>"+
                        "</div>" 
                        );
                        $("#dynamicFormPop_"+data1[0].dynamicFormName).fadeIn().promise().done(function(){
                            $('#overlay').attr('aria-hidden', 'false');
                            $('#overlay').css('display', '');
                            $('html, body').animate({scrollTop: $(this).offset().top-10}, 100);
                        });
                        $("#closeDynamicFormPopPop_"+data1[0].dynamicFormName).on('click',function(){
                            $("#dynamicFormPop_"+data1[0].dynamicFormName).slideUp().promise().done(function(){
                                $('#overlay').attr('aria-hidden', 'true');
                                $('#overlay').css('display', '');
                                if ($("#dynamicFormBanner_"+data1[0].dynamicFormName).length == 0) {
                                    showAeroLoader();
                                    window.location.reload();
                                }
                                $("#dynamicFormBanner_"+data1[0].dynamicFormName).show(); 
                                $("#dynamicForm_"+data1[0].dynamicFormName).closest(".pageContact").hide();  
                            });
                        });
                        $('a.userPop_close').on('click', function(){
                            selfix = this;
                            $('#overlay').attr('aria-hidden', 'true');
                            $("#"+$(selfix).attr('aria-controls')).fadeOut().promise().done(function(){
                                $(this).attr('aria-hidden', 'true');
                                $(this).css('display', '');
                            });
                            $(this).siblings('.userPop_body').find('input').not(':submit').val('');
                            return false;
                        });
                    }
                    else
                    {
                        $("#captcahErr_"+data1[0].dynamicFormName).html($('#err_captcha').val());
                    }
                
                });
            }

        }
        if($(this).attr('data-btn') == 'contactUS'){
            if($('[name=subjectSelect]').val() == 0){
                $('[name=subjectSelect]').css('background','#ff000087');
                $('[name=subjectSelect]').attr('data-subject','1');
                $('[name=subjectSelect]').parent().siblings('.userPop_formError').html($('#err_subject').val());
                error = true;
            }
            if(!validateEmail($('[name=emailUS]').val())){
                $('[name=emailUS]').css('background','#ff000087');
                $('[name=emailUS]').attr('data-email','1')
                $('[name=emailUS]').siblings('.userPop_formError').html($('#err_email').val());
                error = true;
            }
            if($('[name=firstNameCU]').val() == '' || validateText($('[name=firstNameCU]').val())){
                $('[name=firstNameCU]').css('background','#ff000087');
                $('[name=firstNameCU]').attr('data-first','1')
                $('[name=firstNameCU]').siblings('.userPop_formError').html($('#err_firstname').val());
                error = true;
            }
            if($('[name=lastNameCU]').val() == '' || validateText($('[name=firstNameCU]').val())){
                $('[name=lastNameCU]').css('background','#ff000087');
                $('[name=lastNameCU]').attr('data-last','1')
                $('[name=lastNameCU]').siblings('.userPop_formError').html($('#err_lastname').val());
                error = true;
            }
            if(validateText($('[name=msg]').val())){
                $('[name=msg]').css('background','#ff000087');
                $('[name=msg]').attr('data-last','1')
                $('[name=msg]').siblings('.userPop_formError').html($('#err_msg').val());
                error = true;
            }

            if(validateText($('#contactUSForm').find('input[name="city"]').val())){
                $('#contactUSForm').find('input[name="city"]').css('background','#ff000087');
                $('#contactUSForm').find('input[name="city"]').attr('data-last','1')
                $('#contactUSForm').find('input[name="city"]').siblings('.userPop_formError').html($('#err_msg').val());
                error = true;
            }
            $('#contactUSForm').find('input[name="phone"]').val($('#contactUSForm').find('input[name="phone"]').val().replace(/-/g, '')); // remove dashes
            if(validateNumbersOnly($('#contactUSForm').find('input[name="phone"]').val())){
                $('#contactUSForm').find('input[name="phone"]').css('background','#ff000087');
                $('#contactUSForm').find('input[name="phone"]').attr('data-last','1')
                $('#contactUSForm').find('input[name="phone"]').siblings('.userPop_formError').html($('#err_phone').val());
                error = true;
            }

            if(!error){
                var contactUsData = {
                    "firstNameCU" : $('input[name="firstNameCU"]').val(),
                    "lastNameCU" : $('input[name="lastNameCU"]').val(),
                    "extPhone" : $('#extPhoneCU').html(),
                    "phone" : $('#contactUSForm').find('input[name="phone"]').val(),
                    "emailUS" : $('input[name="emailUS"]').val(),
                    "city" : $('#contactUSForm').find('input[name="city"]').val(),
                    "countrySelectCU" : $('#countrySelectCU').val(),
                    "socials" : $('input[name="socials"]').val(),
                    "subjectSelected" : String($('#subjectSelect').val()),
                    "msg" : $('textarea[name="msg"]').val(),
                    "cpatcahTxt" : $('#g-recaptcha-response-1').val()
                };
                callController('general','contactUS',JSON.stringify(contactUsData),'',false,function(data){
                    var data1 = JSON.parse(copyObj(data));
                    if(data1.res){
                        $("#CUsuccessPop").fadeIn().promise().done(function(){
                            $('#overlay').attr('aria-hidden', 'false');
                            $('#overlay').css('display', '');
                            $('html, body').animate({scrollTop: $(this).offset().top-10}, 100);
                        });
                    }
                    else
                    {
                       $('#captcahErr').html($('#err_captcha').val());
                    }
                }, false, 'POST');
            }
        }
        if($(this).attr('data-btn') == 'FFsignUp'){
            error = false;
            element = $('#FFSUform').serializeArray(FFSUform);
            element.forEach(function(el,index) {
                switch(el.name){
                    case 'titleSelectFF':
                        if(el.value == 0){
                            setErrMsgSelect(el.name,$('#err_title').val())
                            error = true;
                        }
                        break;
                    case 'firstnameFF':
                        if(el.value == '' || hasSpecialChars(el.value) || validateText(el.value)){
                            setErrMsg(el.name,$('#err_firstname').val())
                            error = true;
                        }
                        break;
                    case 'lastnameFF':
                        if(el.value == '' || validateText(el.value)){
                            setErrMsg(el.name,$('#err_lastname').val())
                            error = true;
                        }
                        break;
                    case 'countrySelectFF':
                        if(el.value == 0){
                            setErrMsg(el.name,$('#err_country').val())
                            error = true;
                        }
                        break;
                    case 'emailFF':
                        if(!validateEmail($('[name=emailFF]').val())){
                            setErrMsg(el.name,$('#err_email').val());
                            $('[name='+el.name+']').attr('data-email','1')
                            error = true;
                        }
                            break;
                    case 'phoneFF':
                        el.value = el.value.replace(/-/g, ''); // remove dashes
                        if(el.value != '' && !hasOnlyNumbers(el.value)){
                            $('#errPhoneFF').text($('#err_num_val').val());
                            $('#errPhoneFF').css('visibility','visible');
                            setErrMsg(el.name,'')
                            $('[name='+el.name+']').attr('data-phoneff','1')
                            error = true;
                        }
                        break;
                    case 'mobileFF':
                        el.value = el.value.replace(/-/g, ''); // remove dashes
                        if(el.value != '' && !hasOnlyNumbers(el.value)){
                            setErrMsg(el.name,$('#err_firstname').val())
                            $('[name='+el.name+']').attr('data-mobile','1')
                            $('#errMobile').text($('#err_num_val').val());
                            $('#errMobile').css('visibility','visible');
                            error = true;
                        }
                        break;
                    case 'city':
                        if(el.value != '' && hasSpecialChars(el.value) || validateText(el.value)){
                            setErrMsg(el.name,$('#err_city').val())
                            error = true;
                        }
                        break;
                    case 'Address':
                        if(el.value != '' && hasSpecialChars(el.value) || validateText(el.value)){
                            setErrMsg(el.name,$('#err_adress').val())
                            error = true;
                        }
                        break;
                    case 'zipcode':
                        if(el.value != '' && hasSpecialChars(el.value)){
                            setErrMsg(el.name,$('#err_zip').val())
                            error = true;
                        }
                        break;
                    case 'passport':
                        var regTest = /^[a-zA-Z0-9()/]{4,}$/;
                        if(el.value != '' && !regTest.test(el.value) && el.value.trim() != ""){
                            setErrMsg(el.name,$('#err_num_val').val())
                            error = true;
                        }
                        break;
                    // case '':
                    //     if(el.value == ''){
                    //         setErrMsg(el.name,$('#err_lastname').val())
                    //     }
                    //     error = true;
                    //     break;
                }
            });
            if($('[name=daySelect]').val() == 0){
                $('[name=daySelect]').css('background','#ff000087');
                $('[name=daySelect]').attr('data-day','1');
                $('[name=daySelect]').parent().siblings('.userPop_formError').html($('#err_subject').val());
                error = true;
            }
            if($('[name=monthSelect]').val() == 0){
                $('[name=monthSelect]').css('background','#ff000087');
                $('[name=monthSelect]').attr('data-month','1');
                $('[name=monthSelect]').parent().siblings('.userPop_formError').html($('#err_subject').val());
                error = true;
            }
            if($('[name=yearSelect]').val() == 0){
                $('[name=yearSelect]').css('background','#ff000087');
                $('[name=yearSelect]').attr('data-year','1');
                $('[name=yearSelect]').parent().siblings('.userPop_formError').html($('#err_subject').val());
                error = true;
            }
            if(!validBirthDay($('[name=daySelect]').val(),$('[name=monthSelect]').val(),$('[name=yearSelect]').val())){
                $('#birthDay').text('Please enter valid date');
                $('#birthDay').css('visibility','visible');
                
                $('[name=yearSelect]').css('background','#ff000087');
                $('[name=monthSelect]').css('background','#ff000087');
                $('[name=daySelect]').css('background','#ff000087');
                error = true;
            }

            if(!error){
                var formData = {
                    "titleSelectFF" : $('#titleSelectFF').val(),
                    "firstnameFF" : $('input[name="firstnameFF"]').val(),
                    "lastnameFF" : $('input[name="lastnameFF"]').val(),
                    "emailFF" : $('input[name="emailFF"]').val(),
                    "extPhoneFF" : $('#extPhoneFF').html(),
                    "phoneFF" : $('input[name="phoneFF"]').val(),
                    "extMobileFF" : $('#extMobileFF').html(),
                    "mobileFF" : $('input[name="mobileFF"]').val(),
                    "countrySelectFF" : $('#countrySelectFF').val(),
                    "city" : $('#FFCUform').find('input[name="city"]').val(),
                    "paxaddress" : $('#FFCUform').find('input[name="Address"]').val(),
                    "zipcode" : $('input[name="zipcode"]').val(),
                    "passport" : $('input[name="passport"]').val(),
                    "daySelect" : $('#daySelect').val(),
                    "monthSelect" : $('#monthSelect').val(),
                    "yearSelect" : $('#yearSelect').val(),
                    "cpatcahTxt" : $('#g-recaptcha-response-1').val()
                }

                callController('general','signUpFF',JSON.stringify(formData),'',false,function(data){
                    var data1 = JSON.parse(copyObj(data));
                    if(data1.res || data1.status == "sent"){
                        $("#ffsuccessPop").fadeIn().promise().done(function(){
                            $('#overlay').attr('aria-hidden', 'false');
                            $('#overlay').css('display', '');
                            $('html, body').animate({scrollTop: $(this).offset().top-10}, 100);
                            $("#ffsuccessPop").find('.userPop_formTitle').html($('#ff_success').val()+'<br>'+$('#new_usr').val());
                        });
                    }
                    else if(data1.res == 2){
                        $("#ffsuccessPop").fadeIn().promise().done(function(){
                            $('#overlay').attr('aria-hidden', 'false');
                            $('#overlay').css('display', '');
                            $('html, body').animate({scrollTop: $(this).offset().top-10}, 100);
                        });
                    }
                    else
                    {
                        if(data1.error == 1)
                        {
                            $('#captcahErr').html($('#err_captcha').val());
                        }
                        else
                        {
                            $("#ffsuccessPop").fadeIn().promise().done(function(){
                                $('#overlay').attr('aria-hidden', 'false');
                                $('#overlay').css('display', '');
                                $('html, body').animate({scrollTop: $(this).offset().top-10}, 100);
                                $("#ffsuccessPop").find('.userPop_formTitle').html($('#err_ff_email').val());
                            });
                        }
                    }
                }, false, 'POST');
            }


        }
    }
    catch (err) {
        logError(err);
    }
});

$('#closeffsuccessPopPop').on('click',function(){
    $("#ffsuccessPop").slideUp().promise().done(function(){
        $('#overlay').attr('aria-hidden', 'true');
        $('#overlay').css('display', '');
        window.location.reload();
    });
});

$('#closeCUsuccessPopPop, #CUsuccessPop a.userPop_close').on('click',function(){
    $("#CUsuccessPop").slideUp().promise().done(function(){
        $('#overlay').attr('aria-hidden', 'true');
        $('#overlay').css('display', '');
        if ($("#CUFormBanner").length == 0) {
            showAeroLoader();
            window.location.reload();
        }
        $("#CUFormBanner").show();
        $("#contactUSForm").trigger("reset");  
        $("#contactUS").closest(".pageContact").hide();  
    });
});
/* Dates for ff form */
function setDate() {
    callController('general','clips',createQueryString(window.location.pathname,'myAccount')+"&action=calendar",'',false,function(data){
        try {
            calendar = JSON.parse(copyObj(data));
            var day = document.getElementById('daySelect');
            var month = document.getElementById('monthSelect');
            var year = document.getElementById('yearSelect');
            //monthsArray id contains all the value + monthDisplay of monthes, such "value" is the month serial number, and "monthDisplay" is the month name
            var monthList = JSON.parse($("#monthsArray").val()); 
            /* Createing Year list up to 20 year */
            var yearList = new Date();
            var globalYear = yearList.getFullYear();
            var yearArr = [];
            for(i = globalYear ; i >= 1900 ; i--){
                yearArr.push({"year":i,"yearid":i});
            }
            /* Creating the calendar drop down and input the currect Date */
            var yearIndex = 1900;
            var monthIndex = 1;
            var dayIndex = 0;
            injectDropDown(calendar[yearIndex].months[monthIndex-1].days,'daynumber','daynumber',day,'Day',dayIndex);
            injectDropDown(monthList,'value','monthDisplay',month,'Month',0);
            injectDropDown(yearArr,'year','yearid',year,'Year',0);
        }
        catch (err) {
            logError(err);
        }
    });
}

/* Calendar handler reset the date according to change in year or month  */
$(document).on('change','.dateSelect', function(){
    var year = parseInt($('#yearSelect').val()) == 0 ? 1900 : parseInt($('#yearSelect').val());
    var month = parseInt($('#monthSelect').val()) == 0 ? 1 : parseInt($('#monthSelect').val());
    var day = document.getElementById('daySelect');
    var day1 = calendar[year].months[month-1].days[day.value] == undefined ? 0 : day.value;
        switch(this.id){
            case "yearSelect":
                day.options.length = 0;
                injectDropDown(calendar[year].months[month-1].days,'daynumber','daynumber',day,'Day',day1);
                break;
            case "monthSelect":
                day.options.length = 0;
                injectDropDown(calendar[year].months[month-1].days,'daynumber','daynumber',day,'Day',day1);
                break;
        } 
});


function isNumber(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

function setErrMsgSelect(name,msg) {
    $('[name='+name+']').css('background','#ff000087');
    $('[name='+name+']').parent().siblings('.userPop_formError').html(msg);
    
}
function setErrMsg(name,msg) {
    $('[name='+name+']').css('background','#ff000087');
    $('[name='+name+']').siblings('.userPop_formError').html(msg);
    
}

$(document).on('click','.glyphicon-calendar',function() {
    if($(this).closest(".date").find('.userPop_formError').html()!==''){
        $(this).parent().siblings("input").css('background','#ffffff');
        $(this).closest(".date").find('.userPop_formError').html('');
    }
});
/* Remove the alert when the missing information is completed */
$(document).on('click','input',function() {
    if($(this).attr('type')=='Number' && $(this).siblings('.userPop_formError').html()!=='' && $(this).siblings('.userPop_formError').attr('dirty')=="true"){
        $(this).css('background','#ffffff');
        $(this).siblings('.userPop_formError').html('');
    }
});
/* Remove the alert when the missing information is completed */
$(document).on('keyup','input',function() {
    if($(this).attr('data-email')){
        if(validateEmail(this.value)){
            $(this).css('background','#ffffff');
            $('.userPop_formError').html('');
        }
    }else if($(this).attr('data-mobile')){
        $(this).css('background','#ffffff');
        $('#errMobile').css('visibility','hidden');
    }else if($(this).hasClass('dynamicFormPhone')){
        $(this).css('background','#ffffff');
        $(this).parent().siblings('.userPop_formError').html('');
    }else if($(this).attr('data-phoneff')){
        $(this).css('background','#ffffff');
        $('#errPhoneFF').css('visibility','hidden');
    }else if($(this).prop("type") !== 'submit'){
        $(this).css('background','#ffffff');
        $(this).siblings('.userPop_formError').html('');
    }
});
/* Remove the alert when the missing information is completed - textarea */
$(document).on('keyup','textarea',function() {
    if ($(this).attr('name') == 'msg' || $(this).attr('type') == 'Textarea') {
        $(this).css('background','#ffffff');
        $(this).siblings('.userPop_formError').html('');
    }
});

//remove error from country input when customer chooses an option
$( "#countrySelectFF" ).change(function() {
    if(this.value !== 0){
        $(this).css('background','');
        $(this).siblings('.userPop_formError').html('');
    }
});
/* Remove the alert when the missing information is completed */
$(document).on('change','select',function(){
    if ($(this).parent().hasClass('comboHolder'))
        return false;
    $(this).css('background','#ffffff');
    $(this).parent().siblings('.userPop_formError').html('');
});
function htmlEntityDecode(str) {
    return str.replace(/&#(\d+);/g, function(match, dec) {
        return String.fromCharCode(dec);
    });
}
function htmlEntityEncode(str) {
    var buf = [];
    
    for (var i=str.length-1;i>=0;i--) {
        buf.unshift(['&#', str[i].charCodeAt(), ';'].join(''));
    }
    
    return buf.join('');
}
injectJSfile(["/scripts/passengers/passengersDetails.js"]);
function getFlagAccordingPhoneExt(phoneext) {

    var container = $(".passengersDetails_phoneFrame").find("a");
    var flag;
    $(container).each(function(index,el){
        if($(el).attr("phoneext") == phoneext)
        {
            flag = $(el).attr("data-flag");
            return false;
        }
    });

    return flag;
}
function setSelectedFlag(passengerID,isoCode) {
    //event.preventDefault();
var imgEl = document.getElementById("phone_"+passengerID).getElementsByTagName("IMG")[0];
imgEl.setAttribute("class","passengersDetails_flagSelected flag flag-"+isoCode);
}
function autocompleteCountries(name,passengerID) {
    var container = document.getElementById("passengersDetails_extPop_"+passengerID);
    var li = $(container).find("li");
    var country;
    name = name.toLowerCase();
    $(li).each(function(index,el){
        country = $(el).find("strong").first().html();
        country = country.toLowerCase();
        if(country.indexOf(name) < 0)
            $(el).css("display","none");
        else
            $(el).css("display","inherit");
    });
}
function setFlagShortCutWithPlus(passengerID,el) {
    var phoneext = el.value;
    //check if the first char is + sign
    if(phoneext.charAt(0) == "+")
    {
        //remove + sign from string in order to compare ext
        phoneext = phoneext.substr(1);
        // and phone ext between 1-3 digits
        if(phoneext.length > 0 && phoneext.length < 4)
        {
            var flag = getFlagAccordingPhoneExt(phoneext);
            if(flag)
            {
                //in case of phoneext 1, set us flag and ext, as default
                if(phoneext == "1")
                    flag = "us";
                //set ext
                $(el).siblings("span").text("+"+phoneext);
                $(el).siblings("span").attr("data-flag",flag);
                $(el).siblings("span").attr("phoneext",phoneext);
                //set flag
                setSelectedFlag(passengerID,flag);
                el.value = el.value.replace(el.value,"");
            }
        }
    }
}

//create giftcards page 
if($('#voucherContainer').length > 0){
    try {
        queryString = 'action=getlist';
        if($('#giftcode').val() != '')
            queryString += ('&onegift='+$('#giftcode').val());
        var voucherBox = cloneElement('voucherBox',0);
        showAeroLoader();
        callController('general', 'giftcards', queryString, false, false, function(data){
            try {
                data = JSON.parse(data);
                data.forEach(function(card) {
                    card.displayprice = numberFormatFunction(card.price, null, false);
                    var cardbox = injectHTML(card, voucherBox, 'voucherContainer');
                    $(cardbox).find('img').attr('src', card.image);
                    if(card.image == ''){
                        $(cardbox).find('img').replaceWith('<svg focusable="false" width="50%" data-prefix="fas" data-icon="gift" class="svg-inline--fa fa-gift fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M32 448c0 17.7 14.3 32 32 32h160V320H32v128zm256 32h160c17.7 0 32-14.3 32-32V320H288v160zm192-320h-42.1c6.2-12.1 10.1-25.5 10.1-40 0-48.5-39.5-88-88-88-41.6 0-68.5 21.3-103 68.3-34.5-47-61.4-68.3-103-68.3-48.5 0-88 39.5-88 88 0 14.5 3.8 27.9 10.1 40H32c-17.7 0-32 14.3-32 32v80c0 8.8 7.2 16 16 16h480c8.8 0 16-7.2 16-16v-80c0-17.7-14.3-32-32-32zm-326.1 0c-22.1 0-40-17.9-40-40s17.9-40 40-40c19.9 0 34.6 3.3 86.1 80h-86.1zm206.1 0h-86.1c51.4-76.5 65.7-80 86.1-80 22.1 0 40 17.9 40 40s-17.9 40-40 40z"></path></svg>')
                    }
                    $(cardbox).attr('data-coupcode', card.name);
                    $(cardbox).attr('data-price', card.price);
                });
                hideAeroLoader();
            }
            catch (err) {
                logError(err);
            }
        });
        //add cart
        $('.contentCart').css('display', 'block');

        //remove flight and extras from cart
        $('#cartFlightsContainer').css('display', 'none');
        $('#cartExtrasContainer').css('display', 'none');    
    }
    catch (err) {
        logError(err);        
    }
}

if($('#topUpContainer').length > 0){
    try {
        queryString = 'action=getlist';
        if($('#giftcode').val() != '')
            queryString += ('&onegift='+$('#giftcode').val());
        var voucherBox = cloneElement('topUpBox',0);
        showAeroLoader();
        callController('general', 'topUpDeposit', queryString, false, false, function(data){
            try {
                data = JSON.parse(data);
                data.forEach(function(card) {
                    var cardbox = injectHTML(card, voucherBox, 'topUpContainer');
                    $(cardbox).find('img').attr('src', card.image);
                    if(card.image == ''){
                        $(cardbox).find('img').replaceWith('<svg focusable="false" width="50%" data-prefix="fas" data-icon="gift" class="svg-inline--fa fa-gift fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M32 448c0 17.7 14.3 32 32 32h160V320H32v128zm256 32h160c17.7 0 32-14.3 32-32V320H288v160zm192-320h-42.1c6.2-12.1 10.1-25.5 10.1-40 0-48.5-39.5-88-88-88-41.6 0-68.5 21.3-103 68.3-34.5-47-61.4-68.3-103-68.3-48.5 0-88 39.5-88 88 0 14.5 3.8 27.9 10.1 40H32c-17.7 0-32 14.3-32 32v80c0 8.8 7.2 16 16 16h480c8.8 0 16-7.2 16-16v-80c0-17.7-14.3-32-32-32zm-326.1 0c-22.1 0-40-17.9-40-40s17.9-40 40-40c19.9 0 34.6 3.3 86.1 80h-86.1zm206.1 0h-86.1c51.4-76.5 65.7-80 86.1-80 22.1 0 40 17.9 40 40s-17.9 40-40 40z"></path></svg>')
                    }
                    $(cardbox).attr('data-coupcode', card.name);
                    $(cardbox).attr('data-price', card.price);
                });
                hideAeroLoader();
            }
            catch (err) {
                logError(err);
            }
        });
        //add cart
        $('.contentCart').css('display', 'block');

        //remove flight and extras from cart
        $('#cartFlightsContainer').css('display', 'none');
        $('#cartExtrasContainer').css('display', 'none');    
    }
    catch (err) {
        logError(err);        
    }
}

$(document).on('click', '.voucherBox button', function(){
    try {
        var giftcard = $(this).parents('.voucherBox');
        if(giftcard.hasClass('topUpBox'))
            return;
        var button = $(this);
        button.addClass('size').fadeOut("fast", "swing", function() {
        // Animation complete.
            giftcard.find('.giftcardloader').show();
        });
      
        storeInSession('giftcard', 'add', false , {'couponcode' : giftcard.data('coupcode'), 'price' : giftcard.data('price'), 'description': giftcard.data('description')}, function(cart){
            updateCart(cart);

            /*check if there are giftcards left to add*/
            cart = JSON.parse(cart);
            //get how many giftcards we already added from this type
            var giftInCart = cart.giftcards.filter(function(card){ return card.couponcode = giftcard.attr('data-coupcode')});
            //check if its equal to the amount that is left
            setTimeout(function(){  
                giftcard.find('.giftcardloader').hide();
                var checkmark = giftcard.find('.giftcardcheck');
                checkmark.show();

                // if there are giftcards left ot use 
                if(giftInCart.length < parseInt(giftcard.attr('data-amountleft'))){
                    $({deg: 0}).fadeIn("fast", "swing").promise().done(function(){
                        checkmark.fadeOut("slow", "swing").promise().done(function(){
                            button.removeClass('size').fadeIn("swing")//.css("display","block");
                        });
                    });
                }
                
            }, 1500); 
            
        });
    }
    catch (err) {
        logError(err);
    }
});

$(document).on('click', '.topUpBox button', function(){
    try {
        var topUp = $(this).parents('.topUpBox');
        var button = $(this);
        button.addClass('size').fadeOut("fast", "swing", function() {
        // Animation complete.
            topUp.find('.giftcardloader').show();
        });
        storeInSession('topup', 'add', false , {'couponcode' : topUp.data('coupcode'), 'price' : topUp.data('price'),'priceformat' : topUp.data('priceformat'),'priceformatnoround' : topUp.data('priceformatnoround'), 'description': topUp.data('description'),'title':'topup'}, function(cart){
            updateCart(cart);
            /*check if there are giftcards left to add*/
            cart = JSON.parse(cart);
            //get how many giftcards we already added from this type
            var giftInCart = cart.giftcards.filter(function(card){ return card.couponcode = topUp.attr('data-coupcode')});
            //check if its equal to the amount that is left
            setTimeout(function(){  
                topUp.find('.giftcardloader').hide();
                var checkmark = topUp.find('.giftcardcheck');
                checkmark.show();

                // if there are giftcards left ot use 
                if(giftInCart.length < parseInt(topUp.attr('data-amountleft'))){
                    $({deg: 0}).fadeIn("fast", "swing").promise().done(function(){
                        checkmark.fadeOut("slow", "swing").promise().done(function(){
                            button.removeClass('size').fadeIn("swing")//.css("display","block");
                        });
                    });
                }
                
            }, 1500); 
            
        });
    }
    catch (err) {
        logError(err);
    }
});

//moving from giftcards page after adding to cart
$(document).on('click', '#gc_continue_btn', function(){
    showAeroLoader();
    callController('general', 'giftcards', 'action=catch', false, false, function(data){
        try {
            data = JSON.parse(data);
            storeInSession('giftcardAfterCatch', 'add', false, data.added, updateCart);
            if(data.failed.length > 0){
                hideAeroLoader();
                $("#failedGift").fadeIn().promise().done(function(){
                    $("#failedGift").css('z-index',1000);
                    $('#overlay').attr('aria-hidden', 'false');
                    $('#overlay').css('display', '');
                    $('#overlay').css('z-index',1000);
                    $('html, body').animate({scrollTop: $("#failedGift").offset().top-10}, 100);
                });
            }
            else window.location.href = '/passengers';
        }
        catch (err) {
            logError(err);
        }
    });
    
});

$(document).on('click', '#tpd_continue_btn', function(){
    showAeroLoader();
    callController('general', 'topUpDeposit', 'action=catch', false, false, function(data){
        try {
            data = JSON.parse(data);
            storeInSession('addtopUpDepositAfterCatch', 'add', false, data.added, updateCart);
            if(data.failed.length > 0){
                hideAeroLoader();
                $("#failedGift").fadeIn().promise().done(function(){
                    $("#failedGift").css('z-index',1000);
                    $('#overlay').attr('aria-hidden', 'false');
                    $('#overlay').css('display', '');
                    $('#overlay').css('z-index',1000);
                    $('html, body').animate({scrollTop: $("#failedGift").offset().top-10}, 100);
                });
            }
            else {
                storeInSession('login', 'get', false, '', function(data){
                    data = JSON.parse(data);
                    if(data.custid > 0 || data.agtid > 0){
                        window.location.href = '/itinerary';
                    }else{
                        hideAeroLoader();
                        $("#connectascust").fadeIn().promise().done(function(){
                            $('#overlay').attr('aria-hidden', 'false');
                            $('#overlay').css('display', '');
                        });
                        var new_position = $('#connectascust').offset();
                        $('html, body').stop().animate({ scrollTop: new_position.top-(20/100 * new_position.top) }, 500);
                        setTimeout(function(){hideAeroLoader();},500);

                        // $('#customerLogin').trigger('click');
                        // if($('#customerLogin').length > 0)
                        //     $('html, body').animate({scrollTop: $('#customerLogin').offset().top-10}, 100);
                    }
                });
                
            }
        }
        catch (err) {
            logError(err);
        }
    });
    
});
$('#closeconnectascust').click(function(){
    $('#connectascust').fadeOut().promise().done(function(){
        hideAeroLoader();
        $(this).attr('aria-hidden', 'true');
        $(this).css('display', '');
        $('#overlay').css('display', '')
        $('#overlay').attr('aria-hidden', 'true');
    });
    hideAeroLoader();
    setTimeout(function(){
        $('#customerLogin').trigger('click');
            if($('#customerLogin').length > 0)
                $('html, body').animate({scrollTop: $('#customerLogin').offset().top-10}, 100);
    },300)
    
})
$(document).on('click', '.track', function(){
    $('#trackingcode').css('background', '#ffffff');
    var code = $('#trackingcode').val();

    if(code == ''){
        $('#trackingcode').css({'background': 'rgb(232, 165, 184)', 'border': '1px solid'});
        return;
    }

    showLoader();
    callController('general', 'tracking', 'code='+code, false, false, function(data){
        try{
            data = JSON.parse(data);

            if(data.success && Array.isArray(data.status)){
                $('.trackingpage').slideDown().promise().done(function() {
                    $('#trackprocess').empty();
                    $('#trackinfo').empty();
                    
                    var bar = injectHTML({}, ol, 'trackprocess');
                    $(bar).attr('data-steps', data.status.length);
                    var lastStep = 0;
                    data.status.forEach(function(element, arrKey){
                        var step = injectHTML(element, li, 'track-progress', 0);
                        $(step).css('width', '10%');
                        if (element.date != '') {
                            injectHTML(element, remark, 'trackinfo');
                            lastStep = element.level;
                        }
                    });
                    $('.track-progress-li:lt('+lastStep+')').addClass('done');
                    $('.track-progress-li').eq(lastStep-1).css('width', '25%');
                    $('.track-progress-li').eq(lastStep-1).find('span').html($('.track-progress-li').eq(lastStep-1).attr('data-status'));
                    showLoader();
                    $('.track-progress-li').hover(function () {
                        var newWidth = '25%';
                        $(this).parent().children().not(this).each(function(){
                            $(this).find('span').html($(this).attr('data-level'));
                        });
                        $(this).find('span').html($(this).attr('data-status'));
                        $(this).animate({
                            width: newWidth,
                            step: function() {
                               $(this).css("overflow","hidden");
                             }
                        }, 300 ).css('overflow', 'hidden');
                        $(this).parent().children().not($(this)).animate({
                            width: '10%',
                            step: function() {
                               $(this).css("overflow","hidden");
                             }
                        }, 300 ).css('overflow', 'hidden');
                    }, function() {
                        $(this).find('span').html($(this).attr('data-level'));
                        $(this).parent().children().each(function(key) {
                            if (key == lastStep -1)
                                return;
                            $(this).animate({
                                width: '10%',
                                step: function() {
                                   $(this).css("overflow","hidden");
                                 }
                            }, 300 ).css('overflow', 'hidden');
                        });
                        $('.track-progress-li').eq(lastStep-1).each(function() {
                            $(this).find('span').html($('.track-progress-li').eq(lastStep-1).attr('data-status'));
                            $(this).animate({
                                width: '25%',
                                step: function() {
                                   $(this).css("overflow","hidden");
                                 }
                            }, 300 ).css('overflow', 'hidden');
                        });;
                    });
                });
            } 
            else {
                if (data.redirect) {
                    window.location.href = '/itinerary';
                }
                else {
                    hideAeroLoader();
                    $("#trackingcode_err").fadeIn().promise().done(function(){
                        $('#overlay').attr('aria-hidden', 'false');
                        $('#overlay').css('display', '');
                        $('html, body').animate({scrollTop: $("#trackingcode_err").offset().top-10}, 100);
                    });
                }
            }

        } catch(err){
            logError(err);
        }
    });
});

//close tracking code error msg
$('#closetrackingcode_err').on('click', function(){
    $("#trackingcode_err").fadeOut().promise().done(function(){
        $('#overlay').attr('aria-hidden', 'true');
        $('#overlay').css('display', '');
        hideAeroLoader();
    });
});

$(document).on('click', '#closefailedGift, #failedGift .userPop_close', function(){
    location.reload();
});

function hasSpecialChars(str) {
    var specialChars = /[!@#+$%^&*?":{}|<>]/g;
    if(!specialChars.test(str)){
        return false;
    }
    return true;
}

function hasOnlyNumbers(str) {
    var regex = /^[0-9]*$/gm;
    if(regex.test(str))
        return true;
    return false;
}

function validBirthDay(day,month,year) {
    var q = new Date();
    var m = q.getMonth();
    var d = q.getDate();
    var y = q.getFullYear();
    var date = new Date(y,m,d);
    if(day == 0 || month == 0 || year == 0)
        return false;
    mydate=new Date(year,month-1,day);
    if(date>mydate){
        $('[name=yearSelect]').css('background','#ffffff');
        $('[name=monthSelect]').css('background','#ffffff');
        $('[name=daySelect]').css('background','#ffffff');
        $('#birthDay').css('visibility','hidden');
        return true;
    }
    else
        return false;  
}

if($(window).width() < 880) {
    $('.contentContainer img').each(function(){
        if($(this).width() > 100) {
            $(this).css('max-width','100%')
        }
    })
}

if($('.seat-wrapper').length > 0){
    injectJSfile('/resources/buyseats.js');
}