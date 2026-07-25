var cartFlight = cloneElement('cartFlight', 0);
var cartConnection = cloneElement('cartConnection', 0);
if(cartConnection !== false){
	var cartConnectionSingleFlight = cartConnection.getElementsByClassName('grayRow')[1].cloneNode(true,true,true);
	cartConnection.getElementsByClassName('moreInfo')[0].innerHTML = '';
}
var cartExtra = cloneElement('ancPaxRow', 0);
var cartHs = cloneElement('HSPaxRow',0);
var cartPkgFlight = cloneElement('cartFlightPkg', 0);
var cartPkgConnection = cloneElement('cartConnectionPkg', 0);
var cartPkg = cloneElement('ancPaxRowpkg', 0);
var cartSeat = cloneElement('seatPaxRow', 0);
var cartMembership = cloneElement('cartMembership', 0);
var packExtra = cloneElement('packExtra', 0);
var packMembership = cloneElement('packMembership', 0);
var packPkg = cloneElement('packPkg', 0);
var packSeat = cloneElement('packSeat', 0);
var packHS = cloneElement('packHS', 0);
var cartTrans = cloneElement('transRow', 0);
var packTrans = cloneElement('packTrans', 0);
var cartOther = cloneElement('otherPaxRow', 0);
var carRentalPaxRow = cloneElement('carRentalPaxRow', 0);
var cartDiscount = cloneElement('discountPaxRow', 0);
var packOther = cloneElement('packOther', 0);
var packCarRental = cloneElement('packCarRental', 0);
var packDiscount = cloneElement('packDiscount', 0);
var cartGiftcard = cloneElement('GiftcardPaxRow', 0);
var packGiftcard = cloneElement('packGiftcard', 0);
var topUpPaxRow = cloneElement('topUpPaxRow', 0);
var topUpcard = cloneElement('packTopUpcard', 0);
var packCoupon = cloneElement('packcoupon', 0);
var cartCoupon = cloneElement('cartCoupon', 0);
//IBE-545 additions
var cartFlightHolder = cloneElement('cartFlightsHolder', 0);
var cartExtrasHolder = cloneElement('cartExtrasHolder', 0);
var cartPkgHolder = cloneElement('cartPkgHolder', 0);
var cartGiftCardHolder = cloneElement('cartGiftCardHolder', 0);
var topUpCardHolder = cloneElement('topUpCardHolder', 0);
var cartCouponHolder = cloneElement('cartCouponHolder', 0);
var emptyCart = cloneElement('emptyCart', 0);
var totalPrice = cloneElement('totalPrice', 0); 
var btnOk = cloneElement('btnOk', 0); 
var totalRow = cloneElement('totalRow', 0); 
var cartOthersContainer = cloneElement('cartOthersContainer', 0);
var cartCarRentalReservation = cloneElement('cartCarRentalReservation', 0);
$(document).on('click','.lightBox .openClose', function(){
	if($(this).attr('aria-expanded') == 'false')
	{
		$('#' + $(this).attr('aria-controls') + '').slideDown();
		$(this).children('span').html($('#cart_hide').val());
		$(this).attr('aria-expanded','true');
	}
	else{
		$('#' + $(this).attr('aria-controls') + '').slideUp();
		$(this).children('span').html($('#cart_more_info').val());
		$(this).attr('aria-expanded','false');
	}
	return false;	
});

$('.openCart').click(function(e){
	//RWP-117
	window.scroll({ 
		top: 0,
		left: 0,
		behavior: 'smooth'
	});
	e.preventDefault();
	if($(this).attr('aria-expanded') == 'false')
	{  
		$('body').css('overflow','hidden');
		$('#' + $(this).attr('aria-controls') + '').fadeIn().addClass('view');
		$(this).attr('aria-expanded','true');
	}
	else{
		$('body').css('overflow', '');
		$('#' + $(this).attr('aria-controls') + '').removeClass('view');
		$(this).attr('aria-expanded','false');		

	}
	return false;	
});

$('.closeCart').click(function(e){
	e.preventDefault();
	$('body').css('overflow', '');
	$('.lightBox').removeClass('view').fadeOut();
	$('.openCart').attr('aria-expanded','false');	
});

//when user click outside the cart when it's open
$(document).on('click','#cartBox',e => {
	var container = $('#cartbox');
    var childBanner = $('#cartBox .wrapper .top-tale');
    var childContainer = $('#cartBox .wrapper .block');
    var clickedX = e.clientX;
    var clickedY = e.clientY;
    var containerRect = container.offset();
    var childRectBanner = {
      left: childBanner.offset().left,
      top: childBanner.offset().top,
      right: childBanner.offset().left + childBanner.outerWidth(),
      bottom: childBanner.offset().top + childBanner.outerHeight()
    };
    var childRectContainer = {
      left: childContainer.offset().left,
      top: childContainer.offset().top,
      right: childContainer.offset().left + childContainer.outerWidth(),
      bottom: childContainer.offset().top + childContainer.outerHeight()
    };

	var isOutsideBanner = clickedX < childRectBanner.left || clickedX > childRectBanner.right || clickedY < childRectBanner.top || clickedY > childRectBanner.bottom
	var isOutsideContainer = clickedX < childRectContainer.left || clickedX > childRectContainer.right || clickedY < childRectContainer.top || clickedY > childRectContainer.bottom

  if (isOutsideBanner && isOutsideContainer) {
	e.preventDefault();
	$('body').css('overflow', '');
	$('.lightBox').removeClass('view').fadeOut();
	$('.openCart').attr('aria-expanded','false');	
  }
})

$(document).on('click', '.totalRow .btnOk', function(e){
	e.preventDefault();
	$('body').css('overflow', '');
	$('.lightBox').removeClass('view').fadeOut();
	$('.openCart').attr('aria-expanded','false');	
});

$(document).on('click', '.remFlt', function(){
	var respons
	storeInSession('lastSearch','get',false,'',function (data) {
		respons = JSON.parse(data);
		callController('bookingProcess','cancelFlights','flightids='+$(this).parent().attr('data-flightid'),false,false ,function(){
			//location.reload();
			var homeurl = $('#homeUrl').val();
			if(respons !== null)
				window.location.href = homeurl+respons
			else
				window.location.href = homeurl
			
			
		});
	});
});

function updateCart(cartData, firstLoad){
	if (firstLoad === undefined)
		firstLoad = false;
    var cartUpdate = function(cartData, firstLoad){
    	var itemFound = false;
    	if (firstLoad === undefined)
			firstLoad = false;
		$('#cartBodyContainer .aerocrsWrapper').remove();
		cartData = JSON.parse(copyObj(cartData));
        //If session has expired
        if (cartData.update !== undefined && cartData.update)
        	location.reload();
        //Always remove these
        removeElement('emptyCart',0,true,true);
        removeElement('btnOk',0,true,true);
        removeElement('totalPrice',0,true,true);
        removeElement('totalRow', 0,true,true); 
        
        removeElement('cartFlight',0,true,true);
        removeElement('cartConnection',0,true,true);
        removeElement('cartFlightsHolder',0,true,true);
		var connectionsNum = Number(0);

		$('#cartMain').html('');
        if (cartData.flights && cartData.flights.length > 0 && (!cartData?.packages?.package?.info || (Object.keys(cartData.packages.package.info).length === 0))) {
			if (cartData.flights.length > 1) {
				for (let i = 0; i < cartData.flights.length; i++) {
					if (i > 0) {	
						const prevFlight = cartData.flights[i - 1];
						const currFlight = cartData.flights[i];
						if (prevFlight.fromcode === currFlight.fromcode && prevFlight.tocode === currFlight.tocode && prevFlight.sta === currFlight.sta) {
							const toRemove = cartData.flights.splice(i - 1, 1);
							storeInSession('lastSearch','get',false,'',function (data) {
								var homeurl = $('#homeUrl').val();
								response = JSON.parse(data);
								if(response !== null) {
									window.location.href = homeurl+response
								} else {
									window.location.href = homeurl
								}
							});


						}
					}
					
				}
			}
			if ($('#cartFlightsContainer').length == 0) {
				injectHTML({}, cartFlightHolder, 'cartMain');
			}
			cartData.flights.forEach(function(flight){
					var injectedFlight = injectHTML(flight,(flight.flighttype === 'Connection') ? cartConnection : cartFlight,'cartFlightsContainer');
					if (flight.flighttype === 'Connection') {
						injectChildren(flight['flights'],cartConnectionSingleFlight, 'moreInfo', injectedFlight);
						connectionsNum++;
					}
					if (flight.seatselection != 'true' && !flight.seatselection) {
	                   $(injectedFlight).find('.seatSelection').remove();
	                }
	                if (flight.checkedinbaggage != 'true' && !flight.checkedinbaggage) {
						$(injectedFlight).find('.checkedInBaggage').remove();
	                }
	                if (flight.handbaggage != 'true' && !flight.checkedinbaggage) {
						$(injectedFlight).find('.handBaggage').remove();
	                }
	                if (flight.foodonboard != 'true' && !flight.foodonboard) {
	                   $(injectedFlight).find('.foodOnBoard').remove();
	                }
	                if (flight.refundableticket != 'true' && !flight.refundableticket) {
	                   $(injectedFlight).find('.refundableTicket').remove();
	                }
	                if (flight.flexibleamendment != 'true' && !flight.flexibleamendment) {
	                   $(injectedFlight).find('.flexibleAmendment').remove();
	                }
	                if ((flight.flexiblecancellation != 'true' || (flight.flexibleamendment == 'true' && $('#display_newFlightScreen').val() != 1))) {

	                   $(injectedFlight).find('.flightChoice_icons  .flexibleCancellation').remove();
	                   $(injectedFlight).find('.cartFlightChoice_tooltipOptions  .flexibleCancellation').remove();
	                   if (flight.flexibleamendment != 'true' && !flight.flexibleamendment)
	                   		$(injectedFlight).find('.flexibleCancellation').remove();
	                }
	                if (flight.prioritycheckin != 'true' && !flight.prioritycheckin) {
	                   $(injectedFlight).find('.priorityCheckin').remove();
	                }

					// CRS 2148 add dynamic branding
					if (flight.benefits != undefined) {
						flight.benefits.forEach(function(benefit){
							newLi = buildDynamicLi(benefit.name, benefit.icon, benefit.description)
	                        // show only 5 icons to avoid it extends outside the container
							if ($(injectedFlight).find('.flex .extrasBox .flightChoice_icons ul li').length > 6) {
								newLi.style.display = "none"
							}
							
							$(injectedFlight).find('.flex .extrasBox .flightChoice_icons ul').append(newLi)

							// new element for tooltip
							newLiTt = buildDynamicLiTooltip(benefit.name, benefit.icon, benefit.description)
							newLiTt.style.textOverflow = "hidden"
							$(injectedFlight).find('.flex .cartFlightChoice_tooltipHolder ul').append(newLiTt)

							$('.flex .cartFlightChoice_tooltipHolder ul li i').css("color", "black")
						});
					}
					
					addIndex(injectedFlight, ['f_'], connectionsNum, ['aria-controls'], false);
					if (typeof(outboundFlightSelection) !== 'undefined') {
						injectHTML(flight,(flight.direction === 'outbound') ? outboundFlightSelection : inboundFlightSelection,'flightSelection_holder', (flight.direction === 'outbound') ? 0 : 1, true);
						var holder = (flight.direction == 'outbound') ? 'outboundFlight_summary' : 'inboundFlight_summary'
						if (flight.seatselection != 'true') {
		                   $('#'+holder).find('.seatSelection').remove();
		                }
		                if (flight.checkedinbaggage != 'true') {
		                   $('#'+holder).find('.checkedInBaggage').remove();
		                }
		                if (flight.handbaggage != 'true') {
							$('#'+holder).find('.handBaggage').remove();
		                }
		                if (flight.foodonboard != 'true') {
							$('#'+holder).find('.foodOnBoard').remove();
		                }
		                if (flight.refundableticket != 'true') {
		                   $('#'+holder).find('.refundableTicket').remove();
		                }
		                if (flight.flexibleamendment != 'true') {
		                   $('#'+holder).find('.flexibleAmendment').remove();
		                }
		                if (flight.flexiblecancellation != 'true' || ($('#display_newFlightScreen').val() != 1 && flight.flexibleamendment == 'true')) {
		                   $('#'+holder).find('.flexibleCancellation').remove();
		                }
		                if (flight.prioritycheckin != 'true') {
		                   $('#'+holder).find('.priorityCheckin').remove();
		                }

						// CRS 2148 add dynamic branding
						flight.benefits.forEach(function(benefit){
							newLi = buildDynamicLi(benefit.name, benefit.icon, benefit.description)
							$('#'+holder+' .flightSelection_chosenOptions').append(newLi)
							// show only 5 icons to avoid it extends outside the container
							if ($('#'+holder+' .flightSelection_chosenOptions li').length > 6) {
								newLi.style.display = "none"
							}
							
							$('#'+holder+' .flightSelection_chosenOptions li i').css("color", "black")

							newLiTt = buildDynamicLiTooltip(benefit.name, benefit.icon, benefit.description)
							newLiTt.style.textOverflow = "hidden"
							$('#'+holder+'.cartFlightChoice_tooltipOptions ul').append(newLiTt)
						});

						//Display membership discount amounts if the customer chose
						if($("#outboundFlightMembershipSelected").val() == 1)
							$('#outboundFlight_summary .summary_membership_price').attr('aria-hidden', 'false');
						else
							$('#outboundFlight_summary .summary_regular_price').attr('aria-hidden', 'false');

						if($("#inboundFlightMembershipSelected").val() == 1)
							$('#inboundFlight_summary .summary_membership_price').attr('aria-hidden', 'false');
						else
							$('#inboundFlight_summary .summary_regular_price').attr('aria-hidden', 'false');
					}
					$('.flightSelection_chosenButton').attr('aria-controls', 'inboundFlight');
					$('.flightSelection_chosenButton').first().attr('aria-controls', 'outboundFlight');
			});
			
		}
		removeElement('packExtra',0,true,true);
		removeElement('packSeat',0,true,true);
		removeElement('packHS',0,true,true);
		removeElement('packTrans',0,true,true);
		removeElement('cartExtrasHolder',0,true,true);
		removeElement('packMembership',0,true,true);

		if (cartData.extras !== undefined) {
			var ancArrLength = cartData?.extras?.ancillaries?.length ?? 0;
			if (ancArrLength > 0) {
				itemFound = true;
				injectHTML({}, cartExtrasHolder, 'cartMain');
				var total = 0;
				var titleRow = injectHTML({"currency" : cartData.currency}, packExtra, 'packHolder');
				cartData.extras.ancillaries.forEach(function(extra, index) {
					if(extra.hasOwnProperty('price')){
						injectHTML(extra, cartExtra, 'ancHolder');

						total += parseFloat(extra.price);
						//if its the last row -> remove sepereation line
						if (index == ancArrLength - 1) {
							removeElement('gLine',ancArrLength - 1,true,true);
						}
					}
				});

				//change the price on the ancillaries title
				titleRow.getElementsByClassName('totalPrice')[0].innerHTML = numberFormatFunction(total,null,false);
			}
			var seatArrLength = cartData?.extras?.seats?.length ?? 0;
			if (seatArrLength > 0) {
				if ($('.cartExtrasHolder').length == 0)
					injectHTML({}, cartExtrasHolder, 'cartMain');
				itemFound = true;
				var total = 0;
				var titleRow = injectHTML({"currency" : cartData.currency}, packSeat, 'packHolder');
				
				cartData.extras.seats.forEach(function(seats, index) {
					if(seats.hasOwnProperty('price')){
						if(seats.seattotal > 0 ){
							seats.price = seats.seattotal > 0 ? seats.seattotal : seats.price;
							seats.name = seats.seatname;
							seats.paxname = seats.paxfullname;
						}
						//IBE-738 - fix for seat price is 0 and not showing in the cart
						if (seats.price === 0){
							seats.price = "0.00";
							seats.priceformat = "0.00";
							seats.priceformatnoround = "0.00";
						}
						// IBE-764 if from buyseat only get details from seat and not from flight
						if(cartData.buyseats.fromBuySeat){
							$('#cartFlightsContainer').css('display', 'none');
							seats.name = seats.seatname;
							seats.flightnumber = seats.seatfltnum;
						}
						// IBE-764 
						if(typeof(seats.seatname) !== "undefined" && seats.seatname.length > 0){
							seats.name = seats.seatname;
						}

						injectHTML(seats, cartSeat, 'seatHolder');

						total += parseFloat(seats.price);
						//if its the last row -> remove sepereation line
						if (index == seatArrLength - 1) {
							removeElement('gLine',seatArrLength - 1,true,true);
						}
					}
				});

				//change the price on the seats title
				titleRow.getElementsByClassName('totalPrice')[0].innerHTML = numberFormatFunction(total,null,false);
				$('#vbg').show();
				$('#checkv').show();
			}
		}

		var membershipplan = cartData.membershipplan;
		if(membershipplan && membershipplan.length > 0){
			if (!$('.cartExtrasHolder') || $('.cartExtrasHolder').length == 0)
				injectHTML({}, cartExtrasHolder, 'cartMain');
			itemFound = true;
			var total = 0;
			var titleRow = injectHTML({"currency" : cartData.currency}, packMembership, 'packHolder');
			if(membershipplan[0].hasOwnProperty('price')){
				membershipplan[0].custfullname = (membershipplan[0].custfullname) ? membershipplan[0].custfullname : $('#pax_num').val() + ' 1';
				membershipplan[0].currency = cartData.currency;
				injectHTML(membershipplan[0], cartMembership, 'membershipHolder');
				total = parseFloat(membershipplan[0].price);
				removeElement('gLine',0,true,true);
			}
			
			//change the price on the membership title
			titleRow.getElementsByClassName('totalPrice')[0].innerHTML = numberFormatFunction(total,null,false);
		}

		if (cartData.insurare != undefined) {
			var insArrLength = cartData?.insurare?.length ?? 0;
			if (insArrLength > 0) {
				if ($('.cartExtrasHolder').length == 0)
					injectHTML({}, cartExtrasHolder, 'cartMain');
				itemFound = true;
				var total = 0;
				cartData.insurare.forEach(function(ins, index) {
					var titleRow = injectHTML(ins, packHS, 'packHolder');
						if(ins.hasOwnProperty('price')){
							// injectHTML(ins, cartHs, 'HSHolder');
							total += parseFloat(ins.price);
							//if its the last row -> remove sepereation line
							if (index == insArrLength - 1) {
								removeElement('gLine',insArrLength - 1,true,true);
							}
						}
				});
				//change the price on the ancillaries title
				// titleRow.getElementsByClassName('totalPrice')[0].innerHTML = total;
			}		 
		}
		if (cartData.transfer != undefined) {
			var transArrLength = cartData?.transfer?.length ?? 0;
			if (transArrLength > 0) {
				if ($('.cartExtrasHolder').length == 0)
					injectHTML({}, cartExtrasHolder, 'cartMain');
				itemFound = true;
				var total = 0;
				var titleRow = injectHTML({"currency" : cartData.currency}, packTrans, 'packHolder');
				cartData.transfer.forEach(function(tra, index) {
					transJson = JSON.parse(copyObj(tra));
						if(transJson.hasOwnProperty('price')){
							injectHTML(transJson, cartTrans, 'transHolder');
							total += parseFloat(transJson.price);
							//if its the last row -> remove sepereation line
							if (index == transArrLength - 1) {
								removeElement('gLine',transArrLength - 1,true,true);
							}
						}
				});
				//change the price on the ancillaries title
				titleRow.getElementsByClassName('totalPrice')[0].innerHTML = total;
			}		 
		}
		removeElement('packOther',0,true,true);
		var otherArrLength =  cartData?.other?.length ?? 0;
		if (otherArrLength > 0) {
			if ($('.cartOthersContainer').length == 0)
				injectHTML({}, cartOthersContainer, 'cartMain');
			itemFound = true;
			var total = 0;
			var titleRow = injectHTML({"currency" : cartData.currency}, packOther, 'packOtherHolder');
			cartData.other.forEach(function(otherItem, index) {
				otherItem.currency = cartData.currency;
				if(!otherItem.priceformatnoround && otherItem.price) {
					otherItem.priceformatnoround = otherItem.price.toFixed(2);
				}
				if(otherItem.hasOwnProperty('price')){
					injectHTML(otherItem, cartOther, 'otherHolder');

					total += parseFloat(otherItem.price);
					//if its the last row -> remove sepereation line
					if (index == otherArrLength - 1) {
						removeElement('gLine',otherArrLength - 1,true,true);
					}
				}
			});

			//change the price on the others title
			titleRow.getElementsByClassName('totalPrice')[0].innerHTML = numberFormatFunction(total,null,false);
		}
		var carRentalReservation = cartData.carRentalReservation;
		if ((Array.isArray(carRentalReservation) && carRentalReservation.length > 0) || (typeof carRentalReservation === 'object' && Object.keys(carRentalReservation).length > 0)) {
			carRentalReservation.currency = cartData.currency
			if ($('.cartCarRentalReservation').length == 0)
				injectHTML({}, cartCarRentalReservation, 'cartMain');
			itemFound = true;
			var total = 0;

			var titleRow = injectHTML({"currency" : cartData.currency}, packCarRental, 'cartRentalContainer');
			if(!carRentalReservation.priceformatnoround && carRentalReservation.price) {
				carRentalReservation.priceformatnoround = typeof(carRentalReservation.price) === 'number' ? carRentalReservation.price.toFixed(2) : parseFloat(carRentalReservation.price).toFixed(2);
			}
			if(carRentalReservation.hasOwnProperty('price')){
				carRentalReservation.webname = carRentalReservation.carDesc
				injectHTML(carRentalReservation, carRentalPaxRow, 'carRentalHolder');
				total = parseFloat(carRentalReservation.price);
			}

			//change the price on the others title
			titleRow.getElementsByClassName('totalPrice')[0].innerHTML = ''
			$('.carRentalPrice').html('');
		}
		removeElement('packcoupon',0,true,true);
		removeElement('cartCoupon', 0, true, true);
		removeElement('cartCouponHolder', 0, true, true);
		if (cartData.coupon !== undefined && cartData.coupon.name !== null) {
			itemFound = true;
			injectHTML({}, cartCouponHolder, 'cartMain');
			injectHTML({}, cartCoupon, 'cartCoupon')
			cartData.coupon.currency = cartData.currency;
			// Set default price if undefined to prevent 0.00 display issues
			if(cartData.coupon.price == undefined || cartData.coupon.price == null) {
				cartData.coupon.price = 0;
			}
			var titleRow = injectHTML(cartData.coupon, packCoupon, 'packcouponHolder');
		} 
		else 
			cartData.coupon = {'price': 0}
		
		removeElement('packDiscount',0,true,true);
		var discountArrLength = cartData?.discount?.length ?? 0;
		if (discountArrLength > 0) {
			itemFound = true;
			var total = 0;
			var titleRow = injectHTML({"currency" : cartData.currency}, packDiscount, 'packDiscountHolder');
			cartData.discount.forEach(function(discountItem, index) {
				discountItem.currency = cartData.currency;
				if(discountItem.hasOwnProperty('discountprice')){
					injectHTML(discountItem, cartDiscount, 'discountHolder');

					total += parseFloat(discountItem.discountprice);
					//if its the last row -> remove sepereation line
					if (index == discountArrLength - 1) {
						removeElement('gLine',discountArrLength - 1,true,true);
					}
				}
			});

			//change the price on the others title
			titleRow.getElementsByClassName('totalPrice')[0].innerHTML = numberFormatFunction(total,null,false);
		}

		removeElement('packGiftcard', 0, true, true);
		removeElement('cartGiftCardHolder', 0, true, true);
		if((cartData?.giftcards?.length ?? 0) > 0){
			itemFound = true;
			injectHTML({}, cartGiftCardHolder, 'cartMain');
			injectHTML({}, packGiftcard, 'packGiftcardHolder');
			cartData.giftcards.forEach(function(card, index){
				card.currency = cartData.currency;
				card.price = numberFormatFunction(card.price, null, false);
				var titleRow = injectHTML(card, cartGiftcard, 'GiftcardHolder');
				total += parseFloat(card.price);

				if (index == cartData.giftcards.length - 1) {
					removeElement('gLine',cartData.giftcards.length - 1,true,true);
				}
			});
			$('.giftcards_continue').attr('aria-hidden', "false");
		}
		removeElement('packTopUpcard', 0, true, true);
		removeElement('topUpCardHolder', 0, true, true);
		if((cartData?.topupdeposit?.length ?? 0) > 0){
			itemFound = true;
			injectHTML({}, topUpCardHolder, 'cartMain');
			injectHTML({}, topUpcard, 'topUpcardPackHolder');
			cartData.topupdeposit.forEach(function(card, index){
				card.currency = cartData.currency;
				card.price = numberFormatFunction(card.price, null, false);
				var titleRow = injectHTML(card, topUpPaxRow, 'topUpHolder');
				total += parseFloat(card.price);

				if (index == cartData.topupdeposit.length - 1) {
					removeElement('gLine',cartData.topupdeposit.length - 1,true,true);
				}
			});
			$('.giftcards_continue').attr('aria-hidden', "false");
		}

		removeElement('packPkg',0,true,true);
		removeElement('cartPkgHolder',0,true,true);
		var connectionsNumPkg = Number(0);
		if (cartData?.packages?.package?.info && Object.keys(cartData.packages.package.info).length > 0){
			itemFound = true;
			injectHTML({}, cartPkgHolder, 'cartMain');
			var pkg = (cartData.packages.package.flights !== undefined) ? cartData.packages.package : cartData.packages[0];
			var total = (cartData.packages.package.flights !== undefined) ? pkg.info.price : cartData.packages.package.info.price;
			var pkgInfo = (cartData.packages.package.flights !== undefined) ? pkg.info : {'name': pkg.pkgname, 'style' : pkg.pkgstyle};
			var titleRow = injectHTML(pkgInfo, packPkg, 'packHolderPkg');
			if((pkg.flights !== undefined && pkg.flights.length > 0) ||  (cartData.flights !== undefined && cartData.flights.length > 0)) {
				$(titleRow).find('.openClose').css('visibility', 'visible');
				flights = (pkg.flights !== undefined && pkg.flights.length > 0) ? pkg.flights : cartData.flights;
				flights.forEach(function(flt, index) {
					injectHTML(flt, cartPkg, 'ancHolderpkg');
					var injectedFlight = injectHTML(flt,(flt.flighttype === 'Connection') ? cartPkgConnection : cartPkgFlight,'cartFlightsContainerPkg');
					if (flt.flighttype === 'Connection') {
						injectChildren(flt['flights'],cartConnectionSingleFlight, 'moreInfo', injectedFlight);
						connectionsNumPkg++;
					}
					addIndex(injectedFlight, ['f_'], connectionsNumPkg, ['aria-controls'], false);
					if (typeof(FlightSummary) !== 'undefined') {
						injectHTML(flt,FlightSummary,'flightSelection_holder', index, true);
					}
					var summ = 	$('#outboundFlight_summary-'+ flt['order'] +' a.flightSelection_chosenButton');
					summ.attr('aria-controls', 'daynumber-'+flt['order']);
					summ.addClass('summaryForPkg');
					//if its the last row -> remove sepereation line
					if (index == flights.length - 1) {
						removeElement('xgLine',flights.length - 1,true,true);
					}
				});
			}
			//change the price on the ancillaries title
			titleRow.getElementsByClassName('totalPrice')[0].innerHTML = numberFormatFunction(total,null,false);

		}
		
		if(cartData.decimals == undefined){
			var decimals = 2;
		}
		else
		{
			var decimals = cartData.decimals;
		}

		if (!itemFound) {
			injectHTML({}, emptyCart, 'cartMain');
		}

		injectHTML({}, totalRow, 'cartMain');
		if (itemFound) {
			injectHTML({}, totalPrice, 'cartFooterContainer');
		}
		injectHTML({}, btnOk, 'cartFooterContainer');

		$('#cartMain').append('<div class="clear"></div>');
		$("[data-cartupdate=true]").trigger("cartUpdate", [total, cartData]);
        $('.flightsPrice').html(cartData.currency +' '+ numberFormatFunction(cartData.flightsprice,null,false));
        $('.flightsPrice').parent().attr('data-flightsprice', cartData.flightsprice);
        $('.extrasPrice').html(cartData.currency +' '+ numberFormatFunction(cartData.extrasprice+cartData.insurareprice+cartData.transferprice+cartData.membershipplanprice,null,false));
        $('.extrasPrice').parent().attr('data-extrasprice', cartData.extrasprice);
        $('.othersPrice').html(cartData.currency +' '+ numberFormatFunction(cartData.otherprice,null,false));
        if(cartData.coupon.price !== undefined) $('.couponPrice').html(cartData.currency +' '+ numberFormatFunction(cartData.coupon.price,null,false));
        $('.discountPrice').html(cartData.currency +' '+ numberFormatFunction(cartData.discountprice,null,false));
        $('.packagePrice').html(cartData.currency + ' ' + ((cartData.packages.package.info.price) !== undefined ? numberFormatFunction(cartData.packages.package.info.price,null,false) : '0'));
        $('.GiftcardPrice').html(cartData.currency +' '+ numberFormatFunction(cartData.giftcardsprice,null,false));
        $('.topUpPrice').html(cartData.currency +' '+ numberFormatFunction(cartData.topupdepositprice,null,false));
        $('.totalPrice strong').html(cartData.currency +' '+ cartData.totalFormatPrice);
        $('.cartPrice').html(cartData.currency +' '+ cartData.totalFormatPrice);
		$('#changeFlight').attr('href',cartData.recentSearch);  
		//
		var cartItems = [];
		if((cartData?.extras?.ancillaries?.length ?? 0) > 0){
			cartData.extras.ancillaries.forEach(function (el){cartItems.push(el.itemid);});
			var ancitems = document.querySelectorAll('.ancItem');
			Array.prototype.forEach.call(ancitems, function(elements, index) {
				var flag = false;
				if ($('#ancgridview').val() == 1 || $('#ancgridview_ck').val() == 1) {
					var ancillaryItem = $(elements).find('.bgWhite').find('.ancillary-item.selected');
					//Check if the current item exists in the seleceted items
					if (ancillaryItem.length > 0 && cartItems.indexOf(parseInt($(ancillaryItem).attr('data-itemid'))) > -1) {
						flag = true;
					}
				}
				else {
					var childItem = $(elements).find('.bgWhite').find('select')[0];
					$(childItem).find('option').each(function (index, item) {
						if ($(item).attr('data-itemid') != undefined)
							if (cartItems.indexOf(parseInt($(item).attr('data-itemid'))) > -1)
								flag = true;
					});
				}
				
				if(!flag){ 
					$(elements).find('.vClassExtra').hide();
                	$(elements).find('.btnModify').html($('#modifyToAdd').val());
				}else{
					$(elements).find('.vClassExtra').show();
                    $(elements).find('.btnModify').html($('#addToModify').val());
				}

			});
		}else{
			if($('.ancItem') != undefined){
				$('.ancItem').find('.vClassExtra').hide();
				$('.ancItem').find('.btnModify').html($('#modifyToAdd').val());
			}
		}

		if((cartData?.membershipplan?.length ?? 0) > 0){
			$(".membershipWrapper").find('.vClassExtra').show();
			$(".membershipWrapper").find('.btnModify').html($('#addToModify').val());
		}
		else if ($(".membershipWrapper") != undefined) {
			$(".membershipWrapper").find('.vClassExtra').hide();
			$(".membershipWrapper").find('.btnModify').html($('#selectYourLevel').val());
		}

		if(cartData.extras.seats == 0){
			$('#vbg').hide();
			$('#checkv').hide();
		}
		var insurItem = [];
		if((cartData?.insurare?.length ??0 ) > 0){
			cartData.insurare.forEach(function (el){insurItem.push(el.invid == null ? 0 : el.invid.toString());});
			var insItems = document.querySelectorAll('.heapItem');
			Array.prototype.forEach.call(insItems, function(elements, index) {
				var childItem = $(elements).find('.addInsur');
				var flag = false;
				if($(childItem).attr('data-invid') != undefined)
					if(insurItem.indexOf($(childItem).attr('data-invid')) > -1)
						flag = true;
				if(flag){
					$(elements).find('.vClassExtra').hide();
                	$(elements).find('.HSmodify').html($('#modifyToAdd').val());
				}else if(index == $('#hepstarSelected').val()) {
					$(elements).find('.vClassExtra').show();
                    $(elements).find('.HSmodify').html($('#addToModify').val());
				}

			});
		}else{
			if($('.heapItem') != undefined){
				$('.heapItem').find('.vClassExtra').hide();
				$('.heapItem').find('.HSmodify').html($('#modifyToAdd').val());
			}
		}

		if($('#hepstarRemoved').val() != ''){ //RWP-697
			let i = $('#hepstarRemoved').val();
			$('.heapItem:eq('+ i +')').find('.vClassExtra').hide();
			$('.heapItem:eq('+ i +')').find('.HSmodify').html($('#modifyToAdd').val());
			$('#hepstarRemoved').val('');
		}

		var insurItem = [];
		if((cartData?.transfer?.length ?? 0) > 0){
			var haveTransfer = false
			cartData.transfer.forEach(function(tra, index) {
				transJson = JSON.parse(copyObj(tra));
				if(transJson.hasOwnProperty('price') && !haveTransfer){
					$('.transferItem').find('.vClassExtra').show();
					$('.transferItem').find('.HSmodify').html($('#addToModify').val());
					haveTransfer = true;
				}
			});
			if(!haveTransfer && $('.transferItem') != undefined){
				$('.transferItem').find('.vClassExtra').hide();
				$('.transferItem').find('.HSmodify').html($('#modifyToAdd').val());
			}
		}else{
			if($('.transferItem') != undefined){
				$('.transferItem').find('.vClassExtra').hide();
				$('.transferItem').find('.HSmodify').html($('#modifyToAdd').val());
			}
		}
    }

    if (firstLoad) {
		if (typeof(itinerary) == 'undefined')
			itinerary = false;
			callController('bookingProcess','cartBody',((itinerary) ? 'itinerary=true' : false),'cartBodyContainer',false ,cartUpdate, true);
    }
    else{
        cartUpdate(cartData);
    }
}

$(document).on('click', '.removeAnc', function(){ //Removing ancillaries from checkin page
    self = this;
    var toDelete = [{
        'invid'     : $(this).data('invid') == "" ? $(this).data('ancinvid') : $(this).data('invid'),
        'itemid'    : $(this).data('itemid'),
        'bookingid' : $(this).data('bookingid'),
        'flightid'  : $(this).data('flightid')
    }];

    callController('extras','addAncillary',JSON.stringify({data: toDelete}),false, false, function(data){
        data = JSON.parse(data);

        if ((data['createdAnc']?.length ?? 0) > 0) {

            // 🔹 collect all invids to remove in one go
            var invidsToRemove = data['createdAnc'].map(function(anc){
                return anc['invid'];
            });

            storeInSession('extras', 'remove', false, invidsToRemove, function(resp){  
                if($('#psps').length > 0) {
                    location.reload();
                } else {
                    // remove all related checkinItem elements for these invids
                    invidsToRemove.forEach(function(invid){
                        $('.checkinItem').each(function(){
                            if ($(this).attr('data-invid') == invid){
                                $(this).remove();
                            }
                        });
                    });

                    updateCart(resp);
                }
            });

        } else {
            $('.closeCart').trigger('click');
            $("#removeAnc").fadeIn().promise().done(function(){
                $('#overlay').attr('aria-hidden', 'false');
                $('#overlay').css('display', '');
                //$('html, body').animate({scrollTop: $("#removeAnc").offset().top-10}, 100);
            });
        }
        
    }, false, "POST");
});

//close remove ticketed ancillary error
$('#closeremoveAnc').on('click', function(){
	$("#removeAnc").fadeOut().promise().done(function(){
		$('#overlay').attr('aria-hidden', 'true');
		$('#overlay').css('display', '');
		hideAeroLoader();
	});
	location.reload();
});

$(document).on('click', '.removeIns', function(){
	let removedHepstarIndex = $(this).attr('data-index');
	$('#hepstarRemoved').val(removedHepstarIndex.charAt(removedHepstarIndex.length -1) -1);
	var toDelete = [{
		'invid' 	: $(this).data('invid'),
		'extinv'	: $(this).data('extinv'),
		'bookingid'	: $(this).data('bookingid'),
		'flightid'	: $(this).data('flightid')
	}];
	callController('extras','addInsurance','data='+JSON.stringify(toDelete)+'&Del=1',false, false, function(data){
		data = JSON.parse(data);
        if (data['createdIns'].length > 0) {
            storeInSession('insurance', 'remove', false , data['createdIns'][0], function(data){  
                if($('#psps').length>0)
                {
                	location.reload();
                }else{
                    updateCart(data);
                }
            });
        }
    });
});
/* Remove transfer from cart and db */
$(document).on('click','.removeTrans',function(){
	var toDelete = {
		'invid' 	: $(this).data('invid'),
		'extinv'	: $(this).data('extinv')
	};
	callController('extras','addTransfer','data='+JSON.stringify(toDelete)+'&Del=1',false, false, function(data){
		data = JSON.parse(data);
        if (Object.keys(data.createdIns).length > 0) {
            storeInSession('transfer', 'remove', false , data.createdIns, updateCart);
            if($('#psps').length>0)
            {
            	location.reload();
            }
        }
        
    });

});

$(document).on('click', '.removeGiftcard', function(){
    //if we are after catch then we already have the unique code
    var queryString = 'action=remove';
    uniquecode = $(this).data('uniquecode');

    //if we are before catch then we send the general code
    if(uniquecode == "") {
        couponcode = $(this).data('couponcode');
        queryString += '&couponcode='+couponcode;
    } else {
        queryString += '&uniquecode='+uniquecode;
    }

    callController('general', 'giftcards', queryString, false, false ,function(cart){
		updateCart(cart);

		//add the button to the gift since we can now add more from the amount left
		cart = JSON.parse(cart);
		var giftcard = $('.voucherBox[data-coupcode="' + couponcode + '"');
		var giftInCart = cart.giftcards.filter(function(card){ return card.couponcode = giftcard.attr('data-coupcode')});
		if(giftInCart.length < parseInt(giftcard.attr('data-amountleft')) && giftcard.find('button').css('display') == 'none'){
			$({deg: 0}).fadeIn("fast", "swing").promise().done(function(){
				giftcard.find('.giftcardcheck').fadeOut("slow", "swing").promise().done(function(){
					giftcard.find('button').removeClass('size').fadeIn("swing");
				});
			});
		}

		//remove continue button if there are no items in cart
		if((cart?.giftcards?.length ?? 0) == 0)
			$('.giftcards_continue').attr('aria-hidden', 'true');
		if((cart?.topupdeposit?.length ??0) == 0)
			$('.giftcards_continue').attr('aria-hidden', 'true');	
	});
});


$(document).on('click', '.removetopUp', function(){
    //if we are after catch then we already have the unique code
    var queryString = 'action=remove';
    let uniquecode = $(this).data('uniquecode');
	let couponcode = $(this).data('couponcode');

    //if we are before catch then we send the general code
    if(uniquecode == "") {
        couponcode = $(this).data('couponcode');
        queryString += '&couponcode='+couponcode;
    } else {
        queryString += '&uniquecode='+uniquecode;
    }

    callController('general', 'topUpDeposit', queryString, false, false ,function(cart){
		updateCart(cart);

		//add the button to the gift since we can now add more from the amount left
		cart = JSON.parse(cart);
		var topupcard = $('.voucherBox[data-coupcode="' + couponcode + '"');
		var topupInCart = cart.topupdeposit.filter(function(card){ return card.couponcode = topupcard.attr('data-coupcode')});
		if(topupInCart.length < parseInt(topupcard.attr('data-amountleft')) && topupcard.find('button').css('display') == 'none'){
			$({deg: 0}).fadeIn("fast", "swing").promise().done(function(){
				topupcard.find('.giftcardcheck').fadeOut("slow", "swing").promise().done(function(){
					topupcard.find('button').removeClass('size').fadeIn("swing");
				});
			});
		}

		//remove continue button if there are no items in cart
		if((cart?.topupdeposit?.length ?? 0 ) == 0)
			$('.giftcards_continue').attr('aria-hidden', 'true');
		location.reload();
	});
});

$(document).on('click','.removeMembership',function (){
	storeInSession('membership', 'remove', false , false, updateCart);

	if(itinerary){
		//Display the correct prices in the itinerary page
		location.reload();
	}
});

function numberFormatFunction(price,format,toRound){
    var format = (format == undefined || format == null ? document.getElementById('format_number').value : format);
    var toRound = (toRound == undefined || toRound == null ? document.getElementById('to_round_number').value : toRound);
    var decimals = document.getElementById('curr_decimals').value
    var returnValue = '';
    switch (format) {
        case "1":
            returnValue = parseNumberToFloat ((toRound == true ? roundPrice(price,true) : price), (toRound ? 0 : decimals), '', '.')
            break;
        case "2":
            returnValue = parseNumberToFloat ((toRound == true ? roundPrice(price,true) : price), (toRound ? 0 : decimals), ',', '.')
            break;
        case "3":
            returnValue = parseNumberToFloat ((toRound == true ? roundPrice(price,true) : price), (toRound ? 0 : decimals), '.', ',')
            break;
        default:
            returnValue = parseNumberToFloat ((toRound == true ? roundPrice(price,true) : price), (toRound ? 0 : decimals), '', '.')
            break;
    }
    return returnValue;
}

function parseNumberToFloat (number, decimals, thousands_sep, dec_point) {
    // Strip all characters but numerical ones.
    number = (number + '').replace(/[^0-9+\-Ee.]/g, '');
    var n = !isFinite(+number) ? 0 : +number,
        prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
        sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
        dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
        s = '',
        toFixedFix = function (n, prec) {
            var k = Math.pow(10, prec);
            return '' + Math.round(n * k) / k;
        };
    // Fix for IE parseFloat(0.55).toFixed(0) = 0;
    s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
    if (s[0].length > 3) {
        s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
    }
    if ((s[1] || '').length < prec) {
        s[1] = s[1] || '';
        s[1] += new Array(prec - s[1].length + 1).join('0');
    }
    return s.join(dec);
}

function roundPrice(price,toRound){
    var toRound = (toRound == undefined || toRound == null ? document.getElementById('curr_decimals').value : toRound);
	var roundFormat = document.getElementById('round_format').value;
    switch (roundFormat) {
        case "1":
            priceFormat = price;
            break;
        case "2":
			priceFormat = Math.round(price);
            break;
        case "3":
            priceFormat = Math.ceil(price);
            break;
        default:
            priceFormat = price;
            break;
    }
    
    // if(toRound)
    //     priceFormat = Math.floor(price);
    return priceFormat;
}

function convertStrToNumber(price,format){
    var format = (format == undefined || format == null ? document.getElementById('format_number').value : format);

    var returnValue = '';
    switch (format) {
        case "1":
            returnValue = price
            break;
        case "2":
            price = price+'';
            var split = price.split('.');
            split[0] = split[0].replace(',','');
            returnValue = split.join('.');
            break;
        case "3":
            price = price+'';
            var split = price.split(',');
            split[0] = split[0].replace('.','');
            returnValue = split.join('.');
            break;
        default:
            returnValue = price
            break;
    }
    return returnValue;

}

updateCart(false,true);
