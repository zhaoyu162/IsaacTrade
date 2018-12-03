/*************************************************************************
 *	creator 	: @ji
 *	Function	: 国债逆回购页面返回数据接收文件，包含所有请求的回调
 *	Date		：2017-01-23
 *************************************************************************/



/*******************************************************************
 * creator		: @niuyaozong
 * function		: 委托回调函数，显示委托成功（ret_code为0）或委托失败页面（ret_code不为0）
 * Date			: 2017-12-17
 * parameter	: strParam : json字符串 格式:'{"local" : *, "reply" : *}' 
 * return		: 
 * *****************************************************************/
function GZNHG_WtCallBack(strParam) 
{ 
	if(g_callbackName != "GZNHG_WtCallBack") 
	{
		return; 
	}
	g_callbackName = "";

	var objGzWt = new Object();
	var objGzWt = GZNHG_ParseWtData(strParam);

	var datatype = 'GZWT';
	var retcode = objGzWt['retcode'];
	var retmsg = objGzWt['retmsg'];
	var htbh = objGzWt['htbh'];
	var gdzh = objGzWt['gdzh'];
	var wtData = objGzWt['wtData'];
	var cbasdata = '';
	
	rt_gzwt = CalcReqTime(objGzWt['reqStart']);
	strParam = objGzWt['strParam'];
	cbasdata = 'd_sa=' + d_sa + '|' + 'd_fnStart=' + d_fnStart + '|' + 'rt_gzwt=' + rt_gzwt + '|' + 'd_gzwt=' + wtData + '|' + 'd_gdzh=' + gdzh;
	
	if(objGzWt['retcode'] == 'undefined')	//无委托数据返回
	{
		cbasdata = cbasdata + '||' + 'd_error=' + strParam;
		
		GZNHG_UploadLog(datatype, retcode, retmsg, cbasdata);
		return;
	}

	if(retcode == "0")	//委托成功，显示委托成功页面
	{
		$('#zqdm').text(g_zqdm);
		$('#zqmc').text(g_zqmc);
		$('#czlb').text("卖出");
		$('#wtsl').text(g_count);
		$('#wtje').text(g_wtje);
		$('#htbh').text(htbh);
		var PageRoot = document.getElementById("PageRoot");
		PageRoot.className = PageRoot.className.replace("showHtml","hideHtml");
		var success = document.getElementById("success");
		success.className = success.className.replace("hideHtml","showHtml");

		cbasdata = cbasdata + '|' + 'd_htbh=' + htbh;
		g_wtKyzjLogFlag = false;
		QueryZijin('GZNHG_QueryZijinCallBack');	//委托成功，强制更新用户可用资金
	}
	else	//委托失败，显示委托失败页面
	{
		$('#faildPrompt').text(retmsg);
		var PageRoot = document.getElementById("PageRoot");
		PageRoot.className = PageRoot.className.replace("showHtml","hideHtml");
		var failure = document.getElementById("failure");
		failure.className = failure.className.replace("hideHtml","showHtml");
		
		g_wtKyzjLogFlag = true;
		QueryZijin('GZNHG_QueryZijinCallBack');	//委托失败，强制更新用户可用资金 
		
		var eleBalance = document.getElementById("haveMoney");
		var kyzj = eleBalance.innerText;
		
		cbasdata = cbasdata + '||' + 'd_kyzj=' + kyzj + '|' + 'd_error=' + strParam;
	}
	
	GZNHG_UploadLog(datatype, retcode, retmsg, cbasdata);
}
/*******************************************************************
 * creator		: @niuyaozong
 * function		: 解析从自运营服务器查回的国债信息数据，向自运营服务器查询国债行情数据
 * Date			: 2017-12-15
 * parameter	: strParam : json字符串 格式:'{"local" : *, "reply" : *}'
 * return		: 
 * *****************************************************************/
function GZNHG_QueryGzInfoFromZyyCallBack(strParam)
{
	if(g_callbackName != "GZNHG_QueryGzInfoFromZyyCallBack") 
	{ 
		return;
	}
	g_callbackName = "";
	
	//解析数据
	var objGzInfo = new Object();
	var arrGzInfo = new Array();
	var retData = GZNHG_ParseGzInfoFromZyy(strParam);
	
	objGzInfo = retData.obj;
	arrGzInfo = retData.array;

	rt_gzinfo = CalcReqTime(objGzInfo['reqStart']);
	
	if(arrGzInfo.length == 0)	//无国债信息返回
	{
		strParam = objGzInfo['strParam'];
		var datatype = 'GZINFO';
		var retcode = objGzInfo['retcode'];
		var retmsg = objGzInfo['retmsg'];
		var cbasdata = 'd_sa=' + d_sa + '|' + 'd_fnStart=' + d_fnStart + '|' + 'rt_gzinfo=' +　rt_gzinfo + '||' + 'd_error=' + strParam;
		
		GZNHG_UploadLog(datatype, retcode, retmsg, cbasdata);
		return;
	}
	
	var sh_codelist = '';
	var sz_codelist = '';
	var setcode = '';
	
	for(var nIndex = 0; nIndex < arrGzInfo.length; nIndex++)
	{
		setcode = arrGzInfo[nIndex][3];
		if(setcode == '2')
		{
			sh_codelist += arrGzInfo[nIndex][0];
			sh_codelist += ',';
		}
		else
		{
			sz_codelist += arrGzInfo[nIndex][0];
			sz_codelist += ','; 
		}
		
		g_arrGzInfoData[nIndex][0] = arrGzInfo[nIndex][0];	//股票代码
		g_arrGzInfoData[nIndex][7] = arrGzInfo[nIndex][4];	//手续费天数
		g_arrGzInfoData[nIndex][8] = arrGzInfo[nIndex][5];	//资金占用天数
	}

	sh_codelist = sh_codelist.substring(0,sh_codelist.length-1);	//去除末尾逗号
	sz_codelist = sz_codelist.substring(0,sz_codelist.length-1);	//去除末尾逗号
	g_codelist = '19(' + sh_codelist + '),35(' + sz_codelist + ')';
	g_datatype = '2';
	g_mmlb = 'B';
	
	g_callbackName = "GZNHG_QueryHqDataFromZyyCallBack"; 
	GZNHG_QueryHqDataFromZyy(g_callbackName, g_datatype, g_codelist, g_mmlb);	//解决注册查询行情首次数据返回缓慢问题，先从自运营服务器查询一次行情
}

/*******************************************************************
 * creator		: @niuyaozong
 * function		: 自营主站返回行情数据时回调处理
 * Date			: 2017-01-23
 * parameter	: strParam : json字符串 格式:'{"local" : *, "reply" : *}' 
 * return		: 
 * *****************************************************************/
function GZNHG_OnTimerQueryHqDataFromZyyCallBack(strParam)
{
	if(g_callbackOnTimerName != "GZNHG_OnTimerQueryHqDataFromZyyCallBack")
	{
		return;
	}
	g_callbackOnTimerName = '';
	
	var objHqDataByzyy = new Object();
	var arrHqDataByzyy = new Array();
	var retData = GZNHG_ParseHqDataFromZyy(strParam);
	
	objHqDataByzyy = retData.obj;
	arrHqDataByzyy = retData.array;

	if(arrHqDataByzyy.length == 0)
	{
		strParam = objHqDataByzyy['strParam'];
		var rt_cxhq_T = CalcReqTime(objHqDataByzyy['reqStart']);
		var datatype = 'CXHQ';
		var retcode = objHqDataByzyy['retcode'];
		var retmsg = objHqDataByzyy['retmsg'];
		var cbasdata = 'd_sa=' + d_sa + '|' + 'd_fnStart=' + d_fnStart + '|' + 'rt_cxhq=' + rt_cxhq_T + '||' + 'd_error=' + strParam;
		
		GZNHG_UploadLog(datatype, retcode, retmsg, cbasdata);
		return;
	}
	
	//查询顺序确定，返回股票数据顺序确定，只需更新最新价和买一至买五价
	for(var i = 0; i < arrHqDataByzyy.length; i++)
	{

		g_arrGzInfoData[i][1] = arrHqDataByzyy[i][1];	//最新价
		g_arrGzInfoData[i][2] = arrHqDataByzyy[i][2];	//买一价
		g_arrGzInfoData[i][3] = arrHqDataByzyy[i][3];	//买二价
		g_arrGzInfoData[i][4] = arrHqDataByzyy[i][4];	//买三价
		g_arrGzInfoData[i][5] = arrHqDataByzyy[i][5];	//买四价
		g_arrGzInfoData[i][6] = arrHqDataByzyy[i][6];	//买五价
	}
	
	GZNHG_UpdatePriceDisplayByHqData();
}
/*******************************************************************
 * creator		: @niuyaozong
 * function		: 解析从自运营服务器查回的国债行情数据，注册查询行情或定时器从自运营服务器查询行情，显示国债页面
 * Date			: 2017-12-15
 * parameter	: strParam : json字符串 格式:'{"local" : *, "reply" : *}'
 * return		: 
 * *****************************************************************/
function GZNHG_QueryHqDataFromZyyCallBack(strParam)
{
	if(g_callbackName != "GZNHG_QueryHqDataFromZyyCallBack")
	{
		return;
	}
	g_callbackName = '';
	
	var objHqData = new Object();
	var arrHqData = new Array();
	var retData = GZNHG_ParseHqDataFromZyy(strParam);
	
	objHqData = retData.obj;
	arrHqData = retData.array;
	
	rt_cxhq = CalcReqTime(objHqData['reqStart']);
	
	if(arrHqData.length == 0)
	{
		strParam = objHqData['strParam'];
		var datatype = 'CXHQ';
		var retcode = objHqData['retcode'];
		var retmsg = objHqData['retmsg'];
		var cbasdata = 'd_sa=' + d_sa + '|' + 'd_fnStart=' + d_fnStart + '|' + 'rt_cxhq=' + rt_cxhq + '||' + 'd_error=' + strParam;
		
		GZNHG_UploadLog(datatype, retcode, retmsg, cbasdata);
		return;
	}
	
	//查询顺序确定，返回股票数据顺序确定，只需更新最新价和买一至买五价
	for(var i = 0; i < arrHqData.length; i++)
	{

		g_arrGzInfoData[i][1] = arrHqData[i][1];	//最新价
		g_arrGzInfoData[i][2] = arrHqData[i][2];	//买一价
		g_arrGzInfoData[i][3] = arrHqData[i][3];	//买二价
		g_arrGzInfoData[i][4] = arrHqData[i][4];	//买三价
		g_arrGzInfoData[i][5] = arrHqData[i][5];	//买四价
		g_arrGzInfoData[i][6] = arrHqData[i][6];	//买五价
	}
	
	GZNHG_UpdatePriceDisplayByHqData();	//更新价格显示，委托品种表格最新价，委托价格框价格和委托价格下拉框买一~买五价
	
	g_startMode = fnGetStartMode();		//下单启动方式，"0":下单独立启动，"1":下单在行情客户端下启动
	if(g_startMode == "0")
	{
		StartTimer();
	}
	else if(g_startMode == "1")
	{
		var arrStocks = new Array();
		for(var nRet = 0; nRet < g_arrGzInfoData.length;nRet++)
		{
			arrStocks.push(g_arrGzInfoData[nRet][0]);
		}
		GZNHG_UnregisterHqDataPushFromHqClient(arrStocks);	//反注册国债行情
		GZNHG_RegisterHqDataPushFromHqClient(arrStocks);	//注册查询行情，第一次行情推送耗时长，先从自运营服务器查询一次行情
	}
	
	var datatype = 'DJYYW';
	var retcode = '0';
	var retmsg = '页面显示成功';
	var cbasdata = '';
	if (d_ieVer == '')
	{
		var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
		d_ieVer = userAgent;
	}
	if (rt_cxzj == '' ) 
	{
		cbasdata = 'd_sa=' + d_sa + '|' + 'd_fnStart=' + d_fnStart + '|' + 'rt_gzinfo=' + rt_gzinfo + '|' + 'rt_cxhq=' + rt_cxhq + '|' + 'f_startmode=' + g_startMode + '|' + 'd_ieVer=' + d_ieVer;
	}
	else
	{
		cbasdata = 'd_sa=' + d_sa + '|' + 'd_fnStart=' + d_fnStart + '|' + 'rt_cxzj=' + rt_cxzj + '|' + 'rt_gzinfo=' + rt_gzinfo + '|' + 'rt_cxhq=' + rt_cxhq + '|' + 'f_startmode=' + g_startMode + '|' + 'd_ieVer=' + d_ieVer;
	}
	
	GZNHG_UploadLog(datatype, retcode, retmsg, cbasdata);
	
	var PageRoot= document.getElementById("PageRoot");
	PageRoot.className = PageRoot.className.replace("hideHtml","showHtml");	//显示国债主页面
	
	fnFunction("show_dlg",""); 
}
/*******************************************************************
 * creator		: @niuyaozong
 * function		: 行情客户端推送行情数据处理，更新委托品种最新价格，更新委托价格框价格及买一~买五价
 * Date			: 2017-08-10
 * parameter	: strParam  : json字符串 格式:'{"zqdm" : *, "zxjg" : *, ...}'
 * return		: 
 * *****************************************************************/
function GZNHG_UpdateHqDataFromHq(strParam)
{
	var jsonParam = {};
	jsonParam = GZNHG_ParseHqDataFromHq(strParam);

	for(var nIndex = 0; nIndex < 10; nIndex ++)
	{
		if(jsonParam["zqdm"] == g_arrGzInfoData[nIndex][0])
		{
			g_arrGzInfoData[nIndex][1] =  jsonParam["zxjg"];
			g_arrGzInfoData[nIndex][2] =  jsonParam["mrj1"];
			g_arrGzInfoData[nIndex][3] =  jsonParam["mrj2"];
			g_arrGzInfoData[nIndex][4] =  jsonParam["mrj3"];
			g_arrGzInfoData[nIndex][5] =  jsonParam["mrj4"];
			g_arrGzInfoData[nIndex][6] =  jsonParam["mrj5"];
		}
	}
	
	GZNHG_UpdatePriceDisplayByHqData();
}

/*******************************************************************
 * creator		: @niuyaozong
 * function		: 上传日志回调函数，暂无逻辑处理，修改本地时间后，首次点击运营位报数据包无效：时标错误，后续可以增加记录优化。
 * Date			: 2017-12-17
 * parameter	: 
 * return		: {
	"local" : {
		"destination" : "1",
		"reqStart" : "1513733420925",
		"html_callback" : "GZNHG_UploadLogCallBack",
		"htmlloaded_tickcount" : "43681949"
	},
	"reply" : {
		"ret_code" : "-1",
		"ret_msg" : "数据包无效：时标错误"
	}
}
 * *****************************************************************/
function GZNHG_UploadLogCallBack(strParam)
{
	
}

/*******************************************************************
 * creator 		: @niuyaozong
 * function 	: 查询资金回调函数，更新页面可用金额数据显示
 * Date 		: 2017-12-17
 * parameter 	: strParam : json字符串 格式:'{"local" : *, "reply" : *}'
 * return 		: 
 * *****************************************************************/
function GZNHG_QueryZijinCallBack(strParam)
{
	var objZiJin = GZNHG_ParseZiJin(strParam);
	
	rt_cxzj = CalcReqTime(objZiJin['reqStart']);
	
	if(!objZiJin['kyzj'])	//可用资金未返回
	{
		strParam = objZiJin['strParam'];
		var datatype = 'CXZJ';
		var retcode = objZiJin['retcode'];
		var retmsg = objZiJin['retmsg'];
		var cbasdata = 'd_sa=' + d_sa + '|' + 'd_fnStart=' + d_fnStart + '|' + 'rt_cxzj=' + rt_cxzj + '||' + 'd_error=' + strParam;
		
		GZNHG_UploadLog(datatype, retcode, retmsg, cbasdata);
		return;
	}
	
	if(g_wtKyzjLogFlag)
	{
		var datatype = 'WTZJ';
		var retcode = objZiJin['retcode'];
		var retmsg = objZiJin['retmsg'];
		var cbasdata = 'd_sa=' + d_sa + '|' + 'd_fnStart=' + d_fnStart + '|' + 'rt_cxzj=' + rt_cxzj + '||' + 'd_kyzj=' + objZiJin['kyzj'];
		
		GZNHG_UploadLog(datatype, retcode, retmsg, cbasdata);
	}
	
	var eleBalance = document.getElementById("haveMoney");
	eleBalance.innerText = objZiJin['kyzj'];
}
