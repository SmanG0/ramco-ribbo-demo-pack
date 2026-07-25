$.fn.exists = function () {
    return this.length !== 0;
}

function getViewport_width() {
    var viewPortWidth;
    if(typeof window.innerWidth != 'undefined') {viewPortWidth = window.innerWidth}
    else if(typeof document.documentElement != 'undefined' && typeof document.documentElement.clientWidth != 'undefined' && document.documentElement.clientWidth != 0){viewPortWidth = document.documentElement.clientWidth}
    else{viewPortWidth = document.getElementsByTagName('body')[0].clientWidth;}
    return viewPortWidth;
}

var isMobile = false; //initiate as false
// device detection
if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) 
    || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) isMobile = true;
/* shows accessible outline only on keydown*/
var outlineStyle = document.createElement('style');
outlineStyle.type = 'text/css';
outlineStyle.id = 'outlineHandle';
$('body').append(outlineStyle);
var keyboardActive = false;
if(!isMobile) {
    $("body").mousedown(function(){
        document.getElementById('outlineHandle').innerHTML='a, label, span, img, div, input, button{outline: none !important;}';
        keyboardActive = false;
    });

    $("body").keydown(function(){
        document.getElementById('outlineHandle').innerHTML='';
        keyboardActive = true;
    });
}
else {
    if (document != null && document.getElementById('outlineHandle') != undefined && document.getElementById('outlineHandle') != null)
        document.getElementById('outlineHandle').innerHTML='a, label, span, img, div, input{outline: none !important;}';
}

$(".passengersDetails_termsToggle input[type='checkbox']").on('click', function(){
    selfix = this;
    $('#overlay').attr('aria-hidden', 'false');
    $("#"+$(selfix).attr('aria-controls')).fadeIn().promise().done(function(){
        $(this).attr('aria-hidden', 'false');
        $(this).css('display', '');
        $('html, body').animate({scrollTop: $(this).offset().top-10}, 100);
    });
    return false;
});

//set lang with flag
$("#headerTop_languagePop").on("click","a", function(e){
    var replaceFlag = $(".headerTop_language").find("img").first().attr("class");
    var replaceLang = $(".headerTop_language").find("span").first().html();
    var selectedFlag = $(this).find("img").first().attr("class");
    var selectedLang = $(this).find("span").first().html();

    $(".headerTop_language img").first().attr("class",selectedFlag);
    $(".headerTop_language span").first().text(selectedLang);
    $(this).find("img").first().attr("class",replaceFlag);
    $(this).find("span").first().text(replaceLang);
    //close the lang menu
    $(".headerTop_flags").trigger("click");
});

$(function(){
    var resizeFunc = function() {
        if($('.plazmaFrame').data('engine')=="uprightEngine" || $('.widget').data('engine') === 'uprightEngine') {
            if(getViewport_width()<768) {
                $('.plazmaFrame').removeClass('uprightEngine');
                $('.engineFrame').removeClass('uprightEngine');
            }
            else {
                $('.plazmaFrame').addClass('uprightEngine');
                $('.engineFrame').addClass('uprightEngine');
            }
        }};
    resizeFunc();
    $(window).resize(resizeFunc);
});


//display cookies banner
storeInSession('cookies', 'add', false, 'get', function(needToShowBanner){
    if (needToShowBanner == 'true') {
        $('#cookiesBanner').css("display", "block");
    }
});

//close cookies banner
$(document).on('click','#cookieButton',function (){
    $("#cookiesBanner").fadeOut("slow");
    storeInSession('cookies', 'add', false, 'set');
});



//gdpr cookie modal
$('.cookieShowDetails a , .cookieShowDetails').on('click', function(){
    var self = $('.cookieShowDetails a');
    if($("."+$(self).attr('aria-controls')).attr('aria-hidden') == 'true'){
        //show details
        $("."+$(self).attr('aria-controls')).slideDown().promise().done(function() {
            $(this).attr('aria-hidden', 'false');
            $(this).css('display', 'block');
        });
        $('.cookieShowDetails .arrow').animate({deg:-90}, {duration: 500,step: function(now) {
            $(this).css({ transform: 'rotate(' + now + 'deg)' });
        }});
        $(self).html($('#cookie_show').val());$(self).html($('#cookie_hide').val());
    } else {
        //hide details
        $("."+$(self).attr('aria-controls')).slideUp().promise().done(function() {
            $(this).attr('aria-hidden', 'true');
            $(this).css('display', 'none');
        });
        $('.cookieShowDetails .arrow').animate({deg:90}, {duration: 500,step: function(now) {
            $(this).css({ transform: 'rotate(' + now + 'deg)' });
        }});
        $(self).html($('#cookie_show').val());
    }
});

$('#gdprcookie button').on('click', function(){
    //select all option
    if($(this).attr('data-action') == "select"){
        $('#gdprcookie .cookieOptions input').each(function(){
            $(this).prop("checked", true);
        });
        $("#cookieButtongdpr").trigger("click");
    }

    //submit
    if($(this).attr('data-action') == "confirm"){
        var options = $('#gdprcookie .cookieOptions input:checked');
        var optionsId = $.map(options, function(el){ return el.id; });
        //if the necessary option wasnt checked then do nothing -> keep displaying modal
        if($.inArray('cookie_necessary_option', optionsId) >= 0){
            $("#gdprcookie").fadeOut("slow");
            window.dataLayer = window.dataLayer || [];
            dataLayer.push({
                'GDPRanalytics'         : $.inArray("cookie_statistics_option", optionsId) >= 0 ? 'approved' : 'declined',
                'GDPRpersonalization'   : $.inArray("cookie_personaliztion_option", optionsId) >= 0 ? 'approved' : 'declined',
                'event'                 : 'gdpr'
            });
            storeInSession('gdprcookies', 'add', false, optionsId.join(','), false, window.location.search);
        }
        return false;
    }
});

function callprintoutwindow(pagename,pagedetails)
{
    var clientsURL = $('#clientsURL').val();
    var url=clientsURL+"Go7pub/"+pagename+".asp"
    var w="800"
    var h="800"
    var myRand=parseInt(Math.random()*99999999);  
    url=url+"?rand="+myRand;
    url=url+pagedetails
    var sURL = url
    var sName = "popName2"
    var sFeatures = "menubar=no,scrollbars=yes,resizable=no"
    sFeatures = sFeatures + ",width=" + w + ",height=" + h;
    var wizWin = window.open(sURL, sName, sFeatures);
    if ($('#clientsURL').attr('data-tkt') == 'true')
        window.location.reload();
} 

function sendEmail(id) {
    if (id == '') {
        //Bad modal
    }
    else {
        var page = $('#connectURL').val() + '/apps/sendEmailConf.php?unq=' + id;
        var request = new XMLHttpRequest();
        request.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
               showLoader();
               if (this.responseText.trim() == 'ok') {
                    $('#emailConf_success').attr('aria-hidden','false');
                    $("#emailConf_success").fadeIn(300).promise().done(function(){
                        $(this).attr('aria-hidden', 'false');
                        $(this).css('display', '');
                        $('body').css('overflow', 'hidden');
                        $('#overlay').attr('aria-hidden', 'false');
                        $("#emailConf_success").css('top',window.pageYOffset);
                        $('#closeemailConf_success').on('click',function(){
                            $('#overlay').attr('aria-hidden', 'true');
                            $('#emailConf_success').attr('aria-hidden','true');
                            $('body').css('overflow', '');
                            return false;
                        });
                    });
               }
               else {
                    $('#emailConf_err').attr('aria-hidden','false');
                    $("#emailConf_err").fadeIn(300).promise().done(function(){
                        $(this).attr('aria-hidden', 'false');
                        $(this).css('display', '');
                        $('body').css('overflow', 'hidden');
                        $('#overlay').attr('aria-hidden', 'false');
                        $("#emailConf_err").css('top',window.pageYOffset);
                        $('#closeemailConf_err').on('click',function(){
                            $('#overlay').attr('aria-hidden', 'true');
                            $('#emailConf_err').attr('aria-hidden','true');
                            $('body').css('overflow', '');
                            return false;
                        });
                    });
               }
            }
        }
        request.open('GET', page, true);
        request.send();
        showLoader();
    }
}

function isDoubleClicked(element) {
    //if already clicked return TRUE to indicate this click is not allowed
    if (element.data("isclicked")) return true;
    //mark as clicked for 1 second
    element.data("isclicked", true);
    setTimeout(function () {
        element.removeData("isclicked");
    }, 700);

    //return FALSE to indicate this click was allowed
    return false;
}

//Fix for IE
if (!String.prototype.startsWith) {
  String.prototype.startsWith = function(searchString, position) {
    position = position || 0;
    return this.indexOf(searchString, position) === position;
  };
}

/* close the modal */
$('a.userPop_close').on('click', function () {
    selfix = this;
    $('#overlay').attr('aria-hidden', 'true');
    $("#" + $(selfix).attr('aria-controls')).fadeOut().promise().done(function () {
        $(this).attr('aria-hidden', 'true');
        $(this).css('display', '');
    });
    $(this).siblings('.userPop_body').find('input').not(':submit').val('');
    return false;
});