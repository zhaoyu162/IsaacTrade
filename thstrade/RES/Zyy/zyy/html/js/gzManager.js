/*************************************************************************
 *	creator 	: @ji
 *	Function	: 国债逆回购页面功能函数(与页面操作无关)
 *	Date		：2017-01-23
 *************************************************************************/
 

/*******************************************************************
 * creator		: @ji
 * function		: 价格下拉框的下标对应显示内容
 * Date			: 2017-01-23
 * parameter	: 
 * return		: 
 * *****************************************************************/
var GZNHG_PriceComboBoxShowContentConfig = 
{
	"0" : "买 一",
	"1" : "买 二",
	"2" : "买 三",
	"3" : "买 四",
	"4" : "买 五"
};

/*******************************************************************
 * creator		: @niuyaozong
 * function		: 初始化国债品种信息 二维数组 g_arrGzInfoData[10][9] gpdm（股票代码）,zxjg（最新价格）,mrj1（买一价）,mrj2（买二价）,mrj3（买三价）,mrj4（买四价）,mrj5（买五价）,sxfDays（手续费天数）,zjzyDays（资金占用天数即计息天数）
 * Date			: 2017-12-15
 * parameter	: 
 * return		: 
 * *****************************************************************/
function GZNHG_InitGzInfoData()
{
	for (var i = 0; i < g_arrGzInfoData.length; i++)
	{
		g_arrGzInfoData[i] = new Array(9);
		
		for(var j = 0; j< 9; j++)
		{
			g_arrGzInfoData[i][j] = '';
		}
	}
}

/*********************************************
* 国债逆回购上海市场单位特殊配置表
* "qsid" : "unit" ，unit为100，表示上海市场单位为张
* niuyaozong 20180103
*********************************************/
var GZNHG_ShMarketUnitSpecialConfig = 
{
	def : '',
	"11" : "100",	//财富证券
	"12" : "100",	//财通证券
	"13" : "100",	//长城证券
	"15" : "100",	//长江证券
	"16" : "100",	//川财证券
	"25" : "100",	//方正证券
	"27" : "100",	//广发证券
	"29" : "100",	//国都证券
	"30" : "100",	//国联证券
	"31" : "100",	//国泰君安
	"32" : "100",	//海通证券
	"33" : "100",	//信达证券
	"35" : "100",	//宏信证券
	"36" : "100",	//恒泰证券
	"39" : "100",	//华创证券
	"40" : "100",	//中邮证券
	"41" : "100",	//华林证券
	"46" : "100",	//中信浙江
	"49" : "100",	//金元证券
	"51" : "100",	//联讯证券
	"53" : "100",	//民族证券
	"57" : "100",	//中投证券
	"59" : "100",	//平安证券
	"63" : "100",	//世纪证券
	"72" : "100",	//广发武证
	"73" : "100",	//西南证券
	"75" : "100",	//东北证券
	"80" : "100",	//兴业证券
	"85" : "100",	//中山证券
	"87" : "100",	//中银国际
	"89" : "100",	//中原证券
	"90" : "100",	//银河证券
	"91" : "100",	//华福证券
	"96" : "100",	//太平洋证券
	"99" : "100",	//万联证券
	"100" : "100",	//中泰证券（原齐鲁）
	"109" : "100",	//申港证券
	"110" : "100",	//红塔证券
	"119" : "100",	//华菁证券
	"120" : "100",	//民生证券
	"123" : "100",	//开源证券
	"124" : "100",	//财达证券
	"125" : "100",	//德邦证券
	"131" : "100",	//中金公司（中金证券）
	"134" : "100",	//爱建证券
	"136" : "100",	//华龙证券
	"137" : "100",	//西藏东方财富证券
	"143" : "100",	//国元证券
	"158" : "100",	//中信证券
	"185" : "100",	//联储证券
	"186" : "100",	//万和证券
	"191" : "100",	//华金证券
	"193" : "100",	//五矿证券
	"195" : "100",	//江海证券
	"196" : "100",	//湘财证券
	"301" : "100",	//中信建投
	"302" : "100",	//申万宏源（原宏源）
	"313" : "100",	//国盛证券
	"320" : "100",	//银泰证券
	"322" : "100",	//长城国瑞证券
	"327" : "100",	//山西证券
	"331" : "100",	//国金证券
	"339" : "100",	//浙商证券
	"340" : "100",	//东莞证券
	"343" : "100",	//天风证券
	"344" : "100",	//国开证券
	"347" : "100",	//华融证券
	"349" : "100",	//大同证券
	"552" : "100"	//广州证券
};

/*******************************************************************
 * creator		: @ji
 * function		: 出借金额转换委托数量，上海市场单位为手（1000）（特殊券商单位为张（100），配置表为GZNHG_CountSpecialConfigSH），深圳市场单位为张（100）
 * Date			: 2017-01-23
 * parameter	: money：出借金额 scdm：市场代码
 * return		: count：出借数量
 * *****************************************************************/
function GZNHG_MoneyToCount(money, scdm)
{
	var count = 0;
	if(money == "" || money == undefined || scdm == "" || scdm == undefined)
	{
		return 0;
	}
	
	if(scdm == '1')					//深圳市场单位为张，一张100元
	{
		count = parseInt(money, 10) / 100;
	}
	else if(scdm == '2')			//上海市场单位为手，一手1000元
	{
		count = parseInt(money, 10) / 1000;
	}
	
	var unit = GetValueByKey(GZNHG_ShMarketUnitSpecialConfig, g_qsid);

	if(scdm == '2' && unit != '')	// 上海市场，特殊券商按照配置表中单位
	{
		count = parseInt(money, 10) / parseInt(unit, 10);
	}
	
	return count;
}

/*******************************************************************
 * creator		: @ji
 * function		: 设置可用资金（客户端读取可用资金控件同步返回，调用此函数），若无返回结果（如恒泰证券欢迎界面）发查资金请求
 * Date			: 2017-01-23
 * parameter	: 可用资金
 * return		: 
 * *****************************************************************/
function SetZijin(strParam)
{
	if(strParam == '')
	{
		QueryZijin("GZNHG_QueryZijinCallBack");
		return;
	}
	var eleBalance = document.getElementById("haveMoney");
	eleBalance.innerText = strParam;
}

/*******************************************************************
 * creator		: @ji
 * function		: 保留2位小数
 * Date			: 2017-01-23
 * parameter	: 源数据
 * return		: 保留两位小数后的数字
 * *****************************************************************/
function toDecimal(f, size)  
{  
	var tf = f * Math.pow(10, size);  
	tf = Math.round(tf + 0.000000001);  
	tf = tf/Math.pow(10, size);  
	
	if(tf % 1 == 0) 
	{ 
		parseFloat(tf);
		tf = tf.toFixed(2);
	}
	
	var sf="" + tf; 
	
	return formatfloat2(sf,size);  
} 
 
/*******************************************************************
 * creator		: @ji
 * function		: 格式化浮点数字符串
 * Date			: 2017-01-23
 * parameter	: 源数据	需要保留的小数位数
 * return		: 保留两位小数后的数字字符串
 * *****************************************************************/
function formatfloat2(f, size)  
{  
	aa = f.split("");  
	var varchar = "";  
	var num = 0, k = 0;
	
	for(var i = 0;i< aa.length; i++)  
	{  
		varchar += aa[i];  
		if(aa[i] == ".") 
		{ 
			k = 1; 
		}  
		
		if(k == 1)
		{ 
			if(num++ > size)
				break; 
		}  
	} 
	
	num--;  
	
	for(; num < size; num++)
	{
		varchar += "0";
	}
	
	return varchar;
}

/*******************************************************************
 * creator		: @niuyaozong
 * function		: 通过键获取值，若未找到键返回空字符
 * Date			: 2017-12-17
 * parameter	: jsonParam：配置表 key：键
 * return		: value：键所对应值
 * *****************************************************************/
function GetValueByKey(jsonParam, key)
{
	var value = jsonParam[key] || jsonParam['def'] || '';

	return value;
}

/*******************************************************************
 * creator		: @ji
 * function		: 定时器1s一次从自运营服务器查询行情
 * Date			: 2017-08-10
 * parameter	: 
 * return		: 
 * *****************************************************************/
function GZNHG_QueryHqDataOnTimer()
{
    if(g_Timer == '')	//页面重新加载后，定时器id开始为空，不查询数据
	{
		return;
	}
	else
	{
		if(g_startMode == "0")	//下单独立启动
		{
			g_callbackOnTimerName = "GZNHG_OnTimerQueryHqDataFromZyyCallBack"; 
			GZNHG_QueryHqDataFromZyy(g_callbackOnTimerName, g_datatype, g_codelist, g_mmlb);
		}
	}
}
/*******************************************************************
 * creator		: @ji
 * function		: 获取用户本地当前时间
 * Date			: 2017-04-01
 * parameter	: 
 * return		: strCurrTime：用户本地时间 格式（yyyy-MM-dd HH-mm-ss）
 * *****************************************************************/
function GetLocalTime()
{
	var date = new Date();
	var strYear = date.getFullYear();
	var strMonth = date.getMonth() + 1;
	var strDay = date.getDate();
	
	if (strMonth >= 1 && strMonth <= 9) 
	{
		strMonth = "0" + strMonth;
	}
	
	if (strDay >= 0 && strDay <= 9) 
	{
		strDay = "0" + strDay;
	}
	
	var hh = date.getHours();
	var mm = date.getMinutes();
	var ss = date.getSeconds();
	
	if(hh >= 1 && hh <= 9)
	{
		hh = "0" + hh;
	}
	
	if(mm >= 0 && mm <= 9)
	{
		mm = "0" + mm;
	}
	
	if(ss >= 0 && ss <= 9)
	{
		ss = "0" + ss;
	}
	
	var strCurrTime = strYear.toString() + "-" + strMonth + "-" + strDay + " " + hh.toString() + ":" + mm.toString() + ":" + ss.toString();
	
	return strCurrTime;
}

/*******************************************************************
 * creator		: @ji
 * function		: 获取用户本地时区
 * Date			: 2017-04-01
 * parameter	: 
 * return		: 
 * *****************************************************************/
function GetLocalTimeZone() 
{
	var munites = new Date().getTimezoneOffset();
	var hour = parseInt(munites / 60);
	var munite = munites % 60;
	var prefix = "-";
	
	if (hour < 0 || munite < 0) 
	{
		prefix = "+";
		hour = -hour;
		if (munite < 0)
		{ 
			munite = -munite; 
		}
	}
	
	hour = hour + "";
	munite = munite + "";
	
	if (hour.length == 1) 
	{ 
		hour = "0" + hour; 
	}
	
	if (munite.length == 1) 
	{ 
		munite = "0" + munite; 
	}
	
	return prefix + hour + munite;
}

/*******************************************************************
 * creator		: @niuyaozong
 * function		: 关闭定时器，点击关闭按钮关闭国债页面，客户端只是隐藏页面，判断定时器ID有效，关闭定时器
 实际上，若联系两次点击运营位，上次创建的定时器关闭不了，仍然在内存，后续需要优化
 * Date			: 2017-12-18
 * parameter	: 
 * return		: 
 * *****************************************************************/
function CloseTimer()
{
	if(g_Timer == "")
	{
		return;
	}
	
	self.clearInterval(g_Timer);
}

/*******************************************************************
 * creator		: @ji
 * function		: 启动定时器
 * Date			: 2017-08-10
 * parameter	: 
 * return		: 
 * *****************************************************************/
function StartTimer()
{
	if(g_Timer != '')	//定时器有效，不需重新设置定时器
	{
		return;
	}
	
	g_Timer = self.setInterval("GZNHG_QueryHqDataOnTimer()",1000);	//定时器ID
}

/*******************************************************************
 * creator 		: @ji
 * function 	: sleep函数，毫秒睡眠计时
 * Date 		: 2017-01-23
 * parameter 	: numberMillis：睡眠时间，单位毫秒
 * return 		: 
 * *****************************************************************/
function OnSleep(numberMillisecond)
{
	var eleEndTime = new Date();
	var strEndTime = eleEndTime.getTime() + numberMillisecond;
	
	while(true)
	{
		var eleStartTime = new Date();
		if(eleStartTime.getTime() > strEndTime) 
		{ 
			return; 
		}
	}
}
