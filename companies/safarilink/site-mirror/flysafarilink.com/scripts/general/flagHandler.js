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
				$("#extPhone").text("+"+phoneext);
				$("#extPhone").attr("data-flag",flag);
				$("#extPhone").attr("phoneext",phoneext);
				//set flag
				setSelectedFlag(passengerID,flag);
				el.value = el.value.replace(el.value,"");
			}
		}
	}
}