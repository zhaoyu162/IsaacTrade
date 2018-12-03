/*************************************************************************
 *	creator 	: @niuyaozong
 *	Function	: 国债逆回购页面相关的操作函数(按钮点击、页面数据更新等)
 *	Date		：2017-12-14
 *************************************************************************/

/*******************************************************************
 * creator		: @niuyaozong
 * function		: 国债绑定事件处理函数
 * Date			: 2017-12-18
 * parameter	: 
 * return		: 
 * *****************************************************************/
function GZNHG_BindEvent()
{
	BindMoveEvent("block_main_title", GZNHG_MovePage);			//标题栏，移动页面
	BindCloseBtnClickEvent("BlockMainClose", GZNHG_ClosePage);	//页面右上方关闭按钮
	BindCloseBtnClickEvent("buttonSuccess", GZNHG_ClosePage);	//委托成功页面关闭按钮
	BindCloseBtnClickEvent("buttonFailure", GZNHG_ClosePage);	//委托失败页面关闭按钮

	GZNHG_BindWtpzTableEvent();		//绑定委托品种表格事件
	//GZNHG_BindWtjeInputBoxEvent();	//绑定委托金额输入框事件 在html中已绑定事件
	GZNHG_BindWtjgComboBoxEvent();	//绑定委托价格下拉框事件
	
	//国债页面除输入框外，其他控件禁止选中
	document.onselectstart = function()
	{
		var eleInput = document.getElementById("shuru");
		if(document.activeElement.id == eleInput.id)
			return true;
		return false;	//禁止选取
	}
}

/*******************************************************************
 * creator		: @niuyaozong
 * function		: 国债IE兼容性处理函数
 * Date			: 2017-12-18
 * parameter	: 
 * return		: 
 * *****************************************************************/
function GZNHG_HanleIECompatibility()
{
	//浏览器兼容处理
	var browser = navigator.appName;
	var b_version = navigator.appVersion;
	var version = b_version.split(";"); 
	var trim_Version = version[1].replace(/\s/g,"");	//去除空格（空白字符）
	
	var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
	var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1; //判断是否IE<11浏览器  
	var isEdge = userAgent.indexOf("Edge") > -1 && !isIE; //判断是否IE的Edge浏览器  
	var isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf("rv:11.0") > -1;
	if(isIE11) 
	{
		d_ieVer = "IE11.0";
	}
	else if(isEdge)
	{
		d_ieVer = "Edge";
	}
	else
	{
		d_ieVer = trim_Version;
	}

	//IE6
	if(browser == "Microsoft Internet Explorer" && trim_Version == "MSIE6.0") 
	{ 
		EvPNG.fix('*');	//ie6的PNG透明解决方案
		GZNHG_BindIE6OverMouseEvent("BlockMainClose");	//鼠标悬停，鼠标移除
		var eleTitle = document.getElementById("block_main_title");
		var eleHead = document.getElementById("block_main_head");
		var eleSubMoney = document.getElementById("subtractMoney");
		var eleUseMoney = document.getElementById("useMoney");
		var eleHasMoney = document.getElementById("acountMoney");
		eleHasMoney.style.margin="16px 0 0 0";
		eleUseMoney.style.margin="16px 0 0 0";
		eleSubMoney.style.margin="-4px 0 0 0";
		eleTitle.style.margin="2px 0 0 0";
		eleHead.style.margin="5px 0 0 10px";
	}
	
	//IE7
	if(browser == "Microsoft Internet Explorer" && trim_Version == "MSIE7.0") 
	{ 
		GZNHG_BindIE6OverMouseEvent("BlockMainClose");	//鼠标悬停，鼠标移除 部分ie7版本也需要特殊处理
		
		var eleHead = document.getElementById("block_main_head");
		eleHead.style.margin="1px 0 0 20px";
	}
}

/*******************************************************************
 * creator		: @niuyaozong
 * function		: 移动页面，鼠标按键按下去的瞬间触发
 * Date			: 2017-12-14
 * parameter	: strId : 移动的页面id func：移动页面前执行函数
 * return		: 
 * *****************************************************************/
function BindMoveEvent(strId, func)
{
	var eleBtn = document.getElementById(strId);
	eleBtn.onmousedown = func;
}

/*******************************************************************
 * creator		: @niuyaozong
 * function		: 移动国债页面
 * Date			: 2017-12-14
 * parameter	: 
 * return		: 
 * *****************************************************************/
function GZNHG_MovePage()
{
	fnFunction("move_dlg", '');
}

/*******************************************************************
 * creator		: @niuyaozong
 * function		: 绑定关闭按钮鼠标单击事件
 * Date			: 2017-12-14
 * parameter	: strId : 控件ID func：关闭页面前执行函数
 * return		: 
 * *****************************************************************/
function BindCloseBtnClickEvent(strId, func)
{
	var eleBtn = document.getElementById(strId);
	eleBtn.onclick = func;
}

/*******************************************************************
 * creator		: @niuyaozong
 * function		: 关闭国债页面 下单客户端独立启动，关闭定时器；下单客户端在行情客户端下启动，反注册国债行情
 * Date			: 2017-12-14
 * parameter	: 
 * return		: 
 * *****************************************************************/
function GZNHG_ClosePage()
{
	if(g_startMode == '0')
	{	
		CloseTimer();	//关闭定时器
	}
	else if(g_startMode == '1')
	{
		var arrStocks = new Array();
		for(var nRet = 0; nRet < g_arrGzInfoData.length; nRet++)
		{
			arrStocks.push(g_arrGzInfoData[nRet][0]);
		}
		
		GZNHG_UnregisterHqDataPushFromHqClient(arrStocks);	//反注册国债行情
	}
	
	fnFunction("close_dlg_ex", '');	//关闭页面窗口
}

/*******************************************************************
 * creator		: @niuyaozong
 * function		: 绑定委托品种表格事件
 * 鼠标指针单击 ：更新背景色，更新国债委托品种数据，校验委托参数合法性
 * Date			: 2017-12-15
 * parameter	: 
 * return		: 
 * *****************************************************************/
function GZNHG_BindWtpzTableEvent()
{
	//国债品种选择
	$('.tableSort').click(function(){
		$('.tableSort').css({"background-color":"#f7f7f7"});
		$('.tableSort').find('.tableSize').find('.data1').css({"color":"#222222"});
		$('.tableSort').find('.tableSize').find('.data2').css({"color":"#666"});
		$('.tableSort').find('.tableSize').find('.data3').css({"color":"#FF0000"});
		$(this).css({"background-color":"#4084D5"});
		$(this).find('.tableSize').find('.data1').css({"color":"#ffffff"});
		$(this).find('.tableSize').find('.data2').css({"color":"#ffffff"});
		$(this).find('.tableSize').find('.data3').css({"color":"#ffffff"});
		$("#btn").css("background-color","#dfdfdf");
		g_tableIndex = parseInt($(this).find('.tableSize').find('td').attr("index"),10);
		$('ul.form-group-options').slideUp();
		
		GZNHG_UpdateWtjgComboBoxPrice();			//	切换不同的国债信息,买入价格联动更新
		
		var zqdm = g_arrGzInfoData[g_tableIndex][0];	//证券代码 行情联动
		fnFunction("notify_hq_change_code", zqdm);
		
		GZNHG_CheckWt(g_money, g_tableIndex, g_price);	//检查委托参数
	})
}

/*******************************************************************
 * creator		: @niuyaozong
 * function		: 绑定委托金额输入框事件（已在html页面中绑定函数，此处不处理）
 * Date			: 2017-12-15
 * parameter	: 
 * return		: 
 * *****************************************************************/
/*
function GZNHG_BindWtjeInputBoxEvent()
{
	
}
*/


/*******************************************************************
 * creator		: @ji
 * function		: 出借金额输入框获得焦点事件，若内容为默认文本，将内容置空
 * Date			: 2017-08-10
 * parameter	: strId：控件ID strDefaultText：默认文本
 * return		: 
 * *****************************************************************/
function GZNHG_WtjeInputBoxOnGetFocus(strId, strDefaultText)
{
	var eleInput = document.getElementById(strId);
	
	if(eleInput.value == strDefaultText)
	{
		eleInput.value = "";

		fnGetAccountBalance();
	}
	
	eleInput.style.color = "#000000";	//字体刷黑
}

/*******************************************************************
 * creator		: @ji
 * function		: 出借金额输入框失去焦点事件，若内容为空，将内容置为默认文本
 * Date			: 2017-08-10
 * parameter	: 
 * return		: 
 * *****************************************************************/
function GZNHG_WtjeInputBoxOnLoseFocus(strId, strDefaultText)
{
	var eleInput = document.getElementById(strId);
	if(eleInput.value == "")
	{
		eleInput.value = strDefaultText;
		eleInput.style.color = "#999";	//字体刷灰
	}	
}

/*******************************************************************
 * creator		: @niuyaozong
 * function		: 出借金额微调增加按钮鼠标单击事件，上海市场单位10W，深圳市场单位1000，重新校验委托参数合法性
 * Date			: 2017-08-10
 * parameter	: 
 * return		: 
 * *****************************************************************/
function GZNHG_WtjeInputBoxOnAddMoneyBtnClick()
{
	clearTimeout(g_wtjeAddTimer);
	
	g_wtjeAddTimer = setTimeout(function() 
	{ 
		var money = $('#shuru').val();
		money = parseInt(money, 10);
		if(money == '' || money == undefined || isNaN(money)) 
		{
			money = 0;
		}

		if(g_tableIndex >= 0 && g_tableIndex <= 4)	//上海市场 最大1000万
		{
			money = money + 100000;
			if(money > 10000000)
			{
				money = 10000000;
			}
		}
		else if(g_tableIndex >= 5 && g_tableIndex <= 9)	//深圳市场
		{
			money = money + 1000;
		}

		if(money == 0)
		{
			$('#shuru').val("请输入出借金额");
		}
		else
		{
			$('#shuru').val(money);
			
		}

		GZNHG_CheckWt(money, g_tableIndex, g_price);
	}, 300); 
}

/*******************************************************************
 * creator		: @niuyaozong
 * function		: 出借金额微调增加按钮鼠标双击事件，上海市场单位10W，金额变化为100000 * 2，深圳市场单位1000，金额变化为1000 * 2，重新校验委托参数合法性
 * Date			: 2018-02-28
 * parameter	: 
 * return		: 
 * *****************************************************************/
function GZNHG_WtjeInputBoxOnAddMoneyBtnDblClick()
{
	clearTimeout(g_wtjeAddTimer);
	
	var money = $('#shuru').val();
	money = parseInt(money, 10);
	if(money == '' || money == undefined || isNaN(money)) 
	{
		money = 0;
	}
	
	if(g_tableIndex >= 0 && g_tableIndex <= 4)	//上海市场 最大1000万
	{
		money = money + 100000 * 2;
		if(money > 10000000)
		{
			money = 10000000;
		}
	}
	else if(g_tableIndex >= 5 && g_tableIndex <= 9)	//深圳市场
	{
		money = money + 1000 * 2;
	}
	
	if(money == 0)
	{
		$('#shuru').val("请输入出借金额");
	}
	else
	{
		$('#shuru').val(money);
		
	}

	GZNHG_CheckWt(money, g_tableIndex, g_price);
}

/*******************************************************************
 * creator		: @niuyaozong
 * function		: 出借金额微调减少按钮鼠标单击事件，上海市场单位10W，深圳市场单位1000，重新校验委托参数合法性
 * Date			: 2017-08-10
 * parameter	: 
 * return		: 
 * *****************************************************************/
function GZNHG_WtjeInputBoxOnSubMoneyBtnClick()
{
	clearTimeout(g_wtjeSubTimer);
	
	g_wtjeSubTimer = setTimeout(function()
	{ 
		var money = $('#shuru').val();
		money = parseInt(money,10);
		if(money == '' || money == undefined || isNaN(money))
		{
			money = 0;
		}
		
		if(g_tableIndex >= 0 && g_tableIndex <= 4)	//上海市场
		{
			money = money - 100000;
		}
		else if(g_tableIndex >= 5 && g_tableIndex <= 9)	//深圳市场
		{
			money = money - 1000;
			
		}
		
		if(money <= 0)
		{
			money = 0;
			$('#shuru').val("请输入出借金额");
		}
		else
		{
			$('#shuru').val(money);
			
		}

		GZNHG_CheckWt(money, g_tableIndex, g_price);
	}, 300); 
}

/*******************************************************************
 * creator		: @niuyaozong
 * function		: 出借金额微调减少按钮鼠标双击事件，上海市场单位10W，金额变化为100000 * 2，深圳市场单位1000，金额变化为1000 * 2，重新校验委托参数合法性
 * Date			: 2018-02-28
 * parameter	: 
 * return		: 
 * *****************************************************************/
function GZNHG_WtjeInputBoxOnSubMoneyBtnDblClick() 
{
	clearTimeout(g_wtjeSubTimer);
	
	var money = $('#shuru').val();
	money = parseInt(money,10);
	if(money == '' || money == undefined || isNaN(money))
	{
		money = 0;
	}
	
	if(g_tableIndex >= 0 && g_tableIndex <= 4)	//上海市场
	{
		money = money - 100000 * 2;
	}
	else if(g_tableIndex >= 5 && g_tableIndex <= 9)	//深圳市场
	{
		money = money - 1000 * 2;
		
	}
	
	if(money <= 0)
	{
		money = 0;
		$('#shuru').val("请输入出借金额");
	}
	else
	{
		$('#shuru').val(money);
		
	}

	GZNHG_CheckWt(money, g_tableIndex, g_price);
}

/*******************************************************************
 * creator		: @ji
 * function		: 出借金额输入框变化事件，过滤非数字字符，重新校验委托参数合法性
 * Date			: 2017-08-10
 * parameter	: 
 * return		: 
 * *****************************************************************/
function GZNHG_WtjeInputBoxOnInputZijinChange()
{
	
	var eleInput = document.getElementById("shuru");
	var eleRate = document.getElementById("interestRate");
	var wtje = eleInput.value;
	var allNum = wtje.replace(/\D/g,"");	//过滤非数字字符
	
	if(wtje == "请输入出借金额" || wtje == "")
	{
		return;
	}
	
	if(allNum != wtje) //有非数字字符
	{
		eleInput.value = allNum;
		return;	//值改动会再次触发事件
	}

	if(allNum == '')
	{
		allNum = '0';
	}

	GZNHG_CheckWt(allNum, g_tableIndex, g_price);
}

/*******************************************************************
 * creator		: @niuyaozong
 * function		: 绑定委托价格下拉框事件
 * 1、价格框事件处理
 *    1）鼠标指针单击 价格框点击显示下拉框 再次点击不显示下拉框
 *    2）鼠标指针离开 价格框下拉框不显示
 * 2、价格下拉框事件处理
 *    1）键盘事件     ：价格下拉框显示时响应上箭头（Up Arrow 38），下箭头（Dw Arrow 40），回车（Enter 13）
 *    2）鼠标指针单击 ：设置价格框显示内容，校验委托参数合法性
 *    3）鼠标指针离开 ：价格下拉框不显示
 *    4）鼠标指针穿过下拉框列表 ：列表项高亮
 *    5）鼠标指针离开下拉框列表 ：列表项刷白
 * Date			: 2017-12-15
 * parameter	: 
 * return		: 
 * *****************************************************************/
function GZNHG_BindWtjgComboBoxEvent()
{
	var selIndex = g_selectIndex;
	var box = document.getElementById('divselect'),	//键盘事件全局变量
	as = box.getElementsByTagName('li');
	
	$('.form-group-select').click(function(){ //鼠标移动函数
		
		//下拉框显示时再次点击下拉框，下拉框不显示
		if($('.form-group-options').css('display') == "block")
		{
			$('.form-group-options').css("display","none");
			return;
		}
		//价格背景色刷白		
		for(var i = 0; i< as.length; i++)
		{ 
			as[i].style.backgroundColor = "white"; 
		};
		
		//下拉框显示
		$('.form-group-options').css("display","block");
		
		$(this).parent().find('ul li').hover(function(){
			$(this).addClass('hover')},function(){$(this).removeClass('hover')
		}); 
	});
	
	//鼠标指针离开价格框
	$('.form-group-select').mouseleave(function(){
		$('.form-group-options').css("display","none");
	});
	
	//价格下拉框键盘事件
	document.onkeyup = function(event){
		//价格下拉框不显示时不响应键盘事件
		if($('.form-group-options').css('display') == "none")
		{
			return;
		}
		
		event = event || window.event;
		
		if(event.keyCode == 38)						//Up Arrow上箭头
		{
			//价格背景色先全部刷白，再高亮，防止两个高亮
			for(var i = 0; i < as.length; i++) 
			{ 
				as[i].style.backgroundColor = "white"; 
			}
			
			selIndex--;
			
			if(selIndex < 0 )						//买一到买五
			{  
				selIndex = as.length-1;
			}
			
			as[selIndex].style.backgroundColor = "#4084D5";
			/*	2017.12.22 只有enter键才校验
			if(g_tableIndex != -1) 
			{ 
				var price = g_arrGzInfoData[g_tableIndex][selIndex+2]; 
				GZNHG_CheckWt(g_money, g_tableIndex, price);
			}
			*/
		}
		
		if(event.keyCode == 40)						//Dw Arrow下箭头
		{
			//价格背景色先全部刷白，再高亮，防止两个高亮
			for(var i = 0; i < as.length; i++) 
			{ 
				as[i].style.backgroundColor = "white"; 
			}
			
			selIndex++;
			if(selIndex > as.length-1)				//买五到买一
			{
				selIndex = 0;
			}
			
			as[selIndex].style.backgroundColor = "#4084D5"; //新下标对应背景色高亮
			/*	2017.12.22 只有enter键才校验
			if(g_tableIndex != -1) 
			{ 
				var price = g_arrGzInfoData[g_tableIndex][selIndex+2]; 	//必须enter键才改变价格
				GZNHG_CheckWt(g_money, g_tableIndex, price);
			}
			*/
		};
		
		if(event.keyCode == 13)						//Enter回车
		{
			$('#default').html(as[selIndex].innerHTML);
			$('#default').attr("index", selIndex);
			g_selectIndex = selIndex; 
			if(g_tableIndex != -1) 
			{ 
				g_price = g_arrGzInfoData[g_tableIndex][selIndex+2]; 
				GZNHG_CheckWt(g_money, g_tableIndex, g_price);
			}
			
			$('.form-group-options').css("display","none");	//价格下拉框不显示
		}
	};
	
	//价格下拉框点击事件
	$('ul.form-group-options li').click(function(event){
		event.stopPropagation();	//不再派发事件
		
		var lihtml = $(this).html();
		$("#default").html(lihtml);	//设置价格框显示内容
		$('#default').attr("index", $(this).index());
		selIndex = $(this).index();
		g_selectIndex = selIndex;	//更新价格下拉框选择下标
		$('.form-group-options').css("display","none");
		
		if(g_tableIndex != -1) 
		{ 
			g_price = g_arrGzInfoData[g_tableIndex][selIndex + 2];
			GZNHG_CheckWt(g_money, g_tableIndex, g_price);
		}
	});
	
	//鼠标指针离开价格下拉框
	$('ul.form-group-options').mouseleave(function(){
		$('.form-group-options').css("display","none");
	});
	
	//鼠标指针穿过价格下拉框列表项
	$(".form-group-options li").mouseenter(function() {
		for(var i = 0; i < as.length; i++) 
		{ 
			as[i].style.backgroundColor = "white"; 
		}
		
		$(this).css("background-color","#4084D5");
	});
	
	//鼠标指针离开价格下拉框列表项
	$(".form-group-options li").mouseleave(function() 
	{
		$(this).css("background-color","white");
	});
}

/*******************************************************************
 * creator		: @ji
 * function		: Ie6关闭按钮鼠标hover事件
 * Date			: 2017-08-10
 * parameter	: 
 * return		: 
 * *****************************************************************/
function GZNHG_BindIE6OverMouseEvent(strId)
{
	var eleBtn = document.getElementById(strId);
	
	if(strId == 'BlockMainClose')	//标题栏关闭按钮
	{
		eleBtn.onmouseenter = function()
		{
			eleBtn.style.background  = "url('./images/BtnCloseHover.bmp') no-repeat";
		};
	
		eleBtn.onmouseleave = function()
		{
			eleBtn.style.background  = "url('./images/BtnCloseNormal.bmp') no-repeat";
		};
	}
}

/*******************************************************************
 * creator		: @niuyaozong
 * function		: 出借按钮鼠标单击事件，更新委托确认框内容并设置显示委托确认框
 * Date			: 2017-12-13
 * parameter	: 
 * return		: 
 * *****************************************************************/
function GZNHG_OnLendBtnClick()
{
	GZNHG_UpdateWtConfirmBoxData();
	
	var eleConfirm = document.getElementById("BlockConfirm");
	eleConfirm.className = eleConfirm.className.replace("hideHtml","showHtml");
}

/*******************************************************************
 * creator		: @niuyaozong
 * function		: 委托确认框确定按钮鼠标单击事件，国债委托，数据为委托确认框显示数据
 * Date			: 2017-08-10
 * parameter	: 
 * return		: 
 * *****************************************************************/
function GZNHG_OnWtConfirmBoxEnsureBtnClick()
{
	var strCount = GZNHG_MoneyToCount(g_wtje, g_scdm).toString();
	g_count = strCount;	//点确定按钮计算委托数量 保存到全局变量，委托成功页面展示数据使用
	g_callbackName = "GZNHG_WtCallBack";
	
	var elePrice = document.getElementById("BlockConfirmPrice");
	var eleStock = document.getElementById("BlockConfirmStock");
	var eleCount = document.getElementById("BlockConfirmAmount");
	
	var jsonParam = {};
	jsonParam["stockcode"] = eleStock.innerText.substring(0,6);
	jsonParam["entrustprice"] = elePrice.innerText.substring(0,elePrice.innerText.length - 1);
	jsonParam["entrustamount"] = strCount;
	jsonParam["scdm"] = g_scdm.toString();
	jsonParam["callBackName"] = g_callbackName;
	
	GZNHG_WtConfirm(jsonParam);
	GZNHG_OnWtConfirmBoxCancelBtnClick();
}

/*******************************************************************
 * creator		: @ji
 * function		: 委托确认框取消按钮鼠标单击事件，委托确认框不显示
 * Date			: 2017-08-10
 * parameter	: 
 * return		: 
 * *****************************************************************/
function GZNHG_OnWtConfirmBoxCancelBtnClick()
{
	var eleConfirm = document.getElementById("BlockConfirm");
	eleConfirm.className = eleConfirm.className.replace("showHtml","hideHtml");
}

/*******************************************************************
 * creator		: @niuyaozong
 * function		: 委托状态失败页面返回上一页按钮鼠标单击事件，设置委托结果页面不显示，国债主页面显示
 * Date			: 2017-01-23
 * parameter	: 
 * return		: 
 * *****************************************************************/
function GZNHG_OnWtFailedPagePreviewBtnClick()
{
	var failure = document.getElementById("failure");
	var PageRoot = document.getElementById("PageRoot");
	
	failure.className = failure.className.replace("showHtml","hideHtml");
	PageRoot.className = PageRoot.className.replace("hideHtml","showHtml");
}

/*******************************************************************
 * creator		: @niuyaozong
 * function		: 更新委托确认框显示内容，交易品种（eleConfirmStock），年化收益（eleConfirmPrice），出借金额（eleConfirmAmount）
 * Date			: 2017-12-13
 * parameter	: 
 * return		: 
 * *****************************************************************/
function GZNHG_UpdateWtConfirmBoxData()
{
	var eleAmount = document.getElementById("shuru");	//金额输入框
	var elePrice = document.getElementById("default");	//价格框
	var eleStock = '';
	var eleStockName = "";
	
	if(g_tableIndex >= 0 && g_tableIndex < 4)	//交易品种
	{
		eleStock = document.getElementById("sh_cjqx" + (g_tableIndex + 1));
		eleStockName = document.getElementById("sh_gpmc" + (g_tableIndex + 1));
		g_scdm = '2';
	}
	else if(g_tableIndex == 4)
	{
		eleStock = document.getElementById("sh_cjqx7");
		eleStockName = document.getElementById("sh_gpmc7");
		g_scdm = '2';
	}
	else if(g_tableIndex > 4 && g_tableIndex < 9)
	{
		eleStock = document.getElementById("sz_cjqx" + (g_tableIndex - 4));
		eleStockName = document.getElementById("sz_gpmc" + (g_tableIndex - 4));
		g_scdm = '1';
	}
	else if(g_tableIndex == 9)
	{
		eleStock = document.getElementById("sz_cjqx7");
		eleStockName = document.getElementById("sz_gpmc7");
		g_scdm = '1';
	}
	
	//用委托确认框显示数据更新全局变量数据，在委托成功页面显示此数据
	g_zqdm = eleStockName.innerText.substring(0, 6); //131810 R-001
	g_zqmc = eleStock.innerText;	//一天期  
	g_wtje = parseInt(eleAmount.value,10);	//委托金额 也可直接使用g_money
	
	//更新委托确认框显示内容
	var eleConfirmStock = document.getElementById("BlockConfirmStock");	//交易品种
	var eleConfirmPrice = document.getElementById("BlockConfirmPrice");	//年化收益
	var eleConfirmAmount = document.getElementById("BlockConfirmAmount");	//借出金额
	
	eleConfirmStock.innerHTML = eleStockName.innerText + '(' + eleStock.innerText + ')';
	eleConfirmPrice.innerHTML = elePrice.innerText.substring(4,elePrice.innerText.length);
	eleConfirmAmount.innerHTML = g_wtje + "元";
}

/*******************************************************************
 * creator		: @niuyaozong
 * function		: 更新委托品种表格最新价
 * Date			: 2017-04-01
 * parameter	: 
 * return		: 
 * *****************************************************************/
function GZNHG_UpdateWtpzTableZxjg()
{
	for(var nIndex = 0; nIndex < g_IdIndex.length; nIndex++)
	{
		var eleStockPrice = document.getElementById(g_IdIndex[nIndex]);
		eleStockPrice.innerText = g_arrGzInfoData[nIndex][1] + "%";
	}
}

/*******************************************************************
 * creator		: @niuyaozong
 * function		: 更新委托价格框价格和委托价格下拉框买一~买五价，重新校验委托参数合法性
 * Date			: 2017-04-01
 * parameter	: 
 * return		: 
 * *****************************************************************/
function GZNHG_UpdateWtjgComboBoxPrice()
{
	if(g_tableIndex == -1)
	{
		return;
	}
	else if(g_tableIndex >=0 && g_tableIndex < 10)
	{
		var eleBuyPrice = document.getElementById("default");
		var strBuyPrice = GetValueByKey(GZNHG_PriceComboBoxShowContentConfig, g_selectIndex);
		
		//委托价格框价格
		if(g_arrGzInfoData[g_tableIndex][g_selectIndex + 2] == 0.000)
		{
			eleBuyPrice.innerHTML = strBuyPrice + '<font color="#ff0000">&nbsp&nbsp&nbsp&nbsp' + "--</font>";
		}
		else
		{
			eleBuyPrice.innerHTML = strBuyPrice + '<font color="#ff0000">&nbsp&nbsp&nbsp&nbsp' + g_arrGzInfoData[g_tableIndex][g_selectIndex + 2] + "%</font>";
		}
		
		//买一价
		if( g_arrGzInfoData[g_tableIndex][2] == 0.000 )
		{
			$('#buy1').html('买 一<font color="#ff0000">&nbsp&nbsp&nbsp&nbsp' + '--</font>');
		}
		else
		{
			$('#buy1').html('买 一<font color="#ff0000">&nbsp&nbsp&nbsp&nbsp' + g_arrGzInfoData[g_tableIndex][2] +'%</font>');	
		}
		
		//买二价
		if( g_arrGzInfoData[g_tableIndex][3] == 0.000 )
		{
			$('#buy2').html('买 二<font color="#ff0000">&nbsp&nbsp&nbsp&nbsp' + '--</font>')
		}
		else
		{
			$('#buy2').html('买 二<font color="#ff0000">&nbsp&nbsp&nbsp&nbsp' + g_arrGzInfoData[g_tableIndex][3] +'%</font>');
		}
		
		//买三价
		if( g_arrGzInfoData[g_tableIndex][4] == 0.000 )
		{
			$('#buy3').html('买 三<font color="#ff0000">&nbsp&nbsp&nbsp&nbsp' + '--</font>')
		}
		else
		{
			$('#buy3').html('买 三<font color="#ff0000">&nbsp&nbsp&nbsp&nbsp' + g_arrGzInfoData[g_tableIndex][4] +'%</font>');
		}
		
		//买四价
		if( g_arrGzInfoData[g_tableIndex][5] == 0.000 )
		{
			$('#buy4').html('买 四<font color="#ff0000">&nbsp&nbsp&nbsp&nbsp' + '--</font>')
		}
		else
		{
			$('#buy4').html('买 四<font color="#ff0000">&nbsp&nbsp&nbsp&nbsp' + g_arrGzInfoData[g_tableIndex][5] +'%</font>');
		}
		
		//买五价
		if( g_arrGzInfoData[g_tableIndex][6] == 0.000 )
		{
			$('#buy5').html('买 五<font color="#ff0000">&nbsp&nbsp&nbsp&nbsp' + '--</font>')
		}
		else
		{
			$('#buy5').html('买 五<font color="#ff0000">&nbsp&nbsp&nbsp&nbsp' + g_arrGzInfoData[g_tableIndex][6] +'%</font>');
		}
		
		//价格刷新，重新校验委托参数合法性
		g_price = g_arrGzInfoData[g_tableIndex][g_selectIndex + 2];
		GZNHG_CheckWt(g_money, g_tableIndex, g_price);
	}
}

/*******************************************************************
 * creator		: @牛耀宗
 * function		: 更新价格显示，委托品种表格最新价，委托价格框价格和委托价格下拉框买一~买五价
 * Date			: 2017-12-17
 * parameter	: 
 * return		: 
 * *****************************************************************/
function GZNHG_UpdatePriceDisplayByHqData()
{
	//更新委托品种表格最新价
	GZNHG_UpdateWtpzTableZxjg();
	
	//更新委托价格框价格和委托价格下拉框买一~买五价
	GZNHG_UpdateWtjgComboBoxPrice();
}

/*******************************************************************
* creator	: @niuyaozong
* function	: 计算手续费
* Date		: 2017-11-06
* parameter	: 出借金额，出借品种
* return	: 出借手续费
*******************************************************************/
function GZNHG_CountSxf(wtje, wtpzIndex)
{
	//g_arrGzInfoData[wtpzIndex][7] 手续费天数
	sxf = g_arrGzInfoData[wtpzIndex][7] * wtje * 0.00001;	//成交金额的0.00n%
	sxf = toDecimal(sxf,2);
	return sxf;
}

/*******************************************************************
* creator	: @niuyaozong
* function	: 计算预期收益
* Date		: 2017-11-06
* parameter	: 出借金额，出借品种，出借年化收益率，手续费
* return	: 出借预期收益（去除手续费）
*******************************************************************/
function GZNHG_CountYqsy(wtje, wtpzIndex, wtjg, sxf)
{
	//g_arrGzInfoData[wtpzIndex][8] 资金占用天数
	yqsy = g_arrGzInfoData[wtpzIndex][8] * wtje * wtjg/36500 - parseFloat(sxf); 
	yqsy = toDecimal(yqsy,3);
	return yqsy;
}

/*******************************************************************
* creator	: @niuyaozong
* function	: 校验委托参数合法性，不合法不允许出借，即出借按钮为灰
* Date		: 2017-11-06
* parameter	: 出借金额，出借品种，出借年化收益率
* return	: 
*******************************************************************/
function GZNHG_CheckWt(curWtje, curWtpzIndex, curWtjg)
{
	var wtValid = false;	//委托合法标志，默认不合法，即出借按钮为灰
	var wtParamValid = false;//委托参数合法标志，参数合法预期收益显示
	var wtje = curWtje;		//出借金额
	var wtpzIndex = curWtpzIndex;	//出借品种
	var wtjg = curWtjg;		//出借价格
	
	fnGetAccountBalance();	//更新用户可用资金
	
	if(parseInt(wtje, 10) > 10000000)	//上海市场，深圳市场单笔出借最大1000万
	{
		wtje = '10000000';
		$("#shuru").val(wtje);
	}
	
	if(wtje.length > 8)	//上海市场，深圳市场单笔出借最大1000万
	{
		wtje = wtje.substring(0, 8);
		$("#shuru").val(wtje);
	}
	
	g_money = parseInt(wtje, 10);
	
	if(parseInt(wtje, 10) != 0 && !isNaN(parseInt(wtje, 10)) && wtpzIndex != -1 && parseFloat(wtjg) != 0 && !isNaN(parseFloat(wtjg)) )
	{
		wtParamValid = true;
		wtje = parseInt(wtje, 10);
		wtjg = parseFloat(wtjg);

		var sxf = GZNHG_CountSxf(wtje, wtpzIndex);		//计算手续费
		var yqsy = GZNHG_CountYqsy(wtje, wtpzIndex, wtjg, sxf);	//计算预期收益
		
		var eleRate = document.getElementById("interestRate");
		var str = '<span>预期收益：<font color="red">' + yqsy + '元</font>，手续费：<font color="red">'+ sxf + '元</font></span>';	//此处sxf为字符串
		eleRate.innerHTML = str;
		eleRate.style.display = "inline";
		
		var eleBalance = document.getElementById("haveMoney");
		var kyzj = parseFloat(eleBalance.innerText);		//判断出借时用户可用资金
		
		sxf = parseFloat(sxf);	//将sxf改为浮点数，再做数字运算
		if(wtpzIndex >= 0 && wtpzIndex <= 4)	//上海市场
		{
			if(wtje >= 100000 && wtje % 100000 == 0 && (wtje + sxf) <= kyzj)		//可用资金<出借金额+手续费 不允许出借
			{
				wtValid = true;
			}
		}
		else if(wtpzIndex >= 5 && wtpzIndex <= 9) //深圳市场
		{
			if(wtje >= 1000 && wtje % 1000 == 0 && (wtje + sxf) <= kyzj)			//可用资金<出借金额+手续费 不允许出借
			{
				wtValid = true;				
			}
		}
		
	}
	
	var eleBtnLend = document.getElementById("btnLend");
	eleBtnLend.className = "lendBtnDisable";	//默认出借按钮为灰
	$("#shuru").css("color","#000000");		//委托参数合法，字体为黑色
	
	if(wtValid)
	{
		eleBtnLend.className = "lendBtnEnable";
		$("#btnLend").attr('disabled',false);	//出借按钮可响应点击，允许出借
	}
	else
	{
		if(!wtParamValid)
		{
			var eleRate = document.getElementById("interestRate");
			eleRate.style.display = "none";						//不显示手续费，预期收益
		}
		
		var eleInput = document.getElementById("shuru");
		var strInputValue = eleInput.value;
		
		if(strInputValue == '请输入出借金额')
		{
			$("#shuru").css("color","#999");					//请输出出借金额为灰色
		}
		
		$("#btnLend").attr('disabled',true);					//不允许出借
	}

}
