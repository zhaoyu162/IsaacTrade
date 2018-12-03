// select  请换成id绑定
$('.form-group-select').click(function(){
	$(this).next('.form-group-options').toggle();
});
$('.form-group-options .item').click(function(){
	var text = $(this).find('a').text();
	var index = $(this).attr("index");
	setInfoToHtml(index); 
	$('.form-group-select .fl').text(text);
	$('.form-group-options').hide();
});
$(document).click(function(e){
	if($('.form-group-options').css('display') === 'none') {return;}
	if($(e.target).parent().is('.form-group-select')){return;}
	if($(e.target).parents().is('.form-group-options')){return;}
	$('.form-group-options').hide();
});

// $(function(){
// 	checkNumAccount('45564564');
// 	checkNumContent('asd 45 642 1');
// });

//  填充 起始配号
function checkNumContent(value){
	var $dom = $('#input-num-content');
	var res = value;
	if(res!==''){
		$('#input-num-content-warn').hide();
		if($('#input-num-account').val()){
			enableSearch();
		}
	}else {
		$('#input-num-content-warn').show();
		unableSearch();
	}
	$dom.val(res);
	return res;
}

//  填充 配号数量
function checkNumAccount(value){
	var $dom = $('#input-num-account');
	value = value.replace(/[^\d]/g,'').substring(0,4);
	if(value!==''){
		$('#input-num-account-warn').hide();
		if($('#input-num-content').val()){
			enableSearch();
		}
	}else {
		$('#input-num-account-warn').show();
		unableSearch();
	}
	$dom.val(value);
	return value;
}


function enableSearch(){
	$('#btn-search').removeClass('btn-ban');
}

function unableSearch(){
	$('#btn-search').addClass('btn-ban');
}

//  查询
function doSearch(){
	var data = {};
	data.code = $('#input-code').text().replace(/[^\d]/g,'');
	data.num = $('#input-num-content').val().replace(/[^\d]/g,'');
	data.account = $('#input-num-account').val().replace(/[^\d]/g,'').substring(0,4);
}