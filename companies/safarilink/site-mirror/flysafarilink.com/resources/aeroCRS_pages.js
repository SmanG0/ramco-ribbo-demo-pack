$('.pageDestination .contentRight .table .row .column.mTitle').click(function(){
	if($(this).parents('.row').hasClass('opened'))
	{
		$(this).parents('.row').removeClass('opened');
	}
	else{
		$(this).parents('.row').addClass('opened');
	}
});