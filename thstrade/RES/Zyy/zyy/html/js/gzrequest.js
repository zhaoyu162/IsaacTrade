/*************************************************************************
 *	creator 	: @ji
 *	Function	: 国债逆回购页面请求数据文件，所有的请求均在此文件发出
 *	Date		：2017-01-23
 *************************************************************************/
 
//全局变量定义

 var d_sa = ''; 		//服务器站点，ip_port
 var d_gdzh = '';		//股东账号
 var d_fnStart = '';	//国债页面fnStart入参
 var d_gzinfo = '';		//查询国债信息请求现场数据
 var d_cxzj = '';		//查询资金请求现场数据
 var d_cxhq = '';		//查询国债行情请求现场数据
 var d_pushhq = '';		//推送国债行情异常返回数据
 var d_gzwt = '';		//国债委托数据（证券名称_证券代码_市场代码_委托价格_委托数量）
 var d_error = '';		//回调函数错误信息
 var d_kyzj = '';		//可用资金
 var d_ieVer = '';		//ie版本
 
 var rt_gzinfo = '';	//查国债信息耗时
 var rt_cxzj = '';		//查询资金耗时
 var rt_cxhq = '';		//查询国债行情耗时
 var rt_gzwt = '';		//国债委托耗时
 

 /*******************************************************************
 * creator		: @niuyaozong
 * function		: 调用客户端接口发请求
 * Date			: 2017-12-17
 * parameter	: arr_std：标准字段	arr_ext：扩展字段 arr_local：本地使用字段
 * return		: 
 * *****************************************************************/
function SendRequest(arr_std, arr_ext, arr_local)
{
	arr_local['reqStart'] = new Date().getTime().toString();	//local字段，不影响请求，所有请求均需增加此字段
	
	var parameter = "";
	var jsonStr1 = window.JSON.stringify(arr_std);
	var jsonStr2 = window.JSON.stringify(arr_ext);
	var jsonStr3 = window.JSON.stringify(arr_local);
	parameter = '{"standard":'+ jsonStr1 +',"extra":'+ jsonStr2 +',"local":'+ jsonStr3 +'}';
	
	fnRequest("", parameter);
}

/*******************************************************************
 * creator		: @niuyaozong
 * function		: 从自运营主站查询国债逆回购信息
 * Date			: 2017-12-15
 * parameter	: callbackName : 回调函数名
 * return		: 
 * *****************************************************************/
function GZNHG_QueryGzInfoFromZyy(callbackName)
{
	var arr_std = {};
	var arr_ext = {};
	var arr_local = {};
	
	arr_std['reqtype'] = "2318";					// 	XT_QU_STOCKINFO
	arr_std['refresh'] = "1";						// 	是否强制后台查询
	arr_std['userkey'] = g_curUserInfo;				//	USERKEY用户标识
	
	arr_ext['cmd'] = "Query_GzInfo";				// 	DataTrans请求的子请求类型
	
	arr_local['html_callback'] = callbackName;
	arr_local['destination'] = "1";

	SendRequest(arr_std,arr_ext,arr_local);
}

/*********************************************
* 国债逆回购委托入参menuid特殊配置表
* "qsid" : "menuid" ，menuid为717，融券回购菜单，默认为162，卖出菜单
* niuyaozong 20180103
*********************************************/
var GZNHG_WtMenuidConfig = 
{
	def : '162',
	"114" : "717" //华泰证券
};

/*******************************************************************
 * creator		: @牛耀宗
 * function		: 国债委托请求
 * Date			: 2017-12-17
 * parameter	: jsonParam ：json对象{'stockcode' : '', 'entrustprice' : '', 'entrustamount' : '', 'scdm' : '', 'callBackName' : '', }	委托品种，委托数量，委托价格，市场代码，回调函数名
 * return		: 
 * *****************************************************************/
function GZNHG_WtConfirm(jsonParam)
{
	var arr_std = {};
	var arr_local = {};
	var arr_ext = {};
	
	var gdzh = fnGetGDZH(g_curUserInfo,jsonParam["scdm"]);
	var eleBalance = document.getElementById("haveMoney");
	var kyzj = eleBalance.innerText;
	
	var wtData = g_zqmc + '_' + g_zqdm + '_' + jsonParam["scdm"] + '_' + jsonParam["entrustprice"] + '_' + jsonParam["entrustamount"] + '_' + g_wtje + '元';	//证券名称_证券代码_市场代码_委托价格_委托数量_委托金额
	
	arr_std['reqtype'] = "259";				//XT_WEITUO_MAICHU
	arr_std['setcode'] = jsonParam["scdm"];
	arr_std['stockcode'] = jsonParam["stockcode"];
	arr_std['entrustprice'] = jsonParam["entrustprice"];
	arr_std['entrustamount'] = jsonParam["entrustamount"];
	arr_std['contractid'] = "1|" + gdzh;	//使用userkey查询股东账号
	arr_std['refresh'] = "1";
	arr_std['userkey'] = g_curUserInfo;
	arr_std['menuid'] = GetValueByKey(GZNHG_WtMenuidConfig, g_qsid);		//默认卖出菜单，华泰证券717融券回购菜单
	
	arr_ext['zqdm'] = jsonParam["stockcode"];
	arr_ext['wtjg'] = jsonParam["entrustprice"];
	arr_ext['wtsl'] = jsonParam["entrustamount"];	
	arr_ext['dataid'] = "gznhg";
	arr_ext['scdm'] = jsonParam["scdm"];
	arr_ext['skip_error'] = "1";		//客户端跳过工作流的报错,E065.18.95.104及以上版本支持
	
	arr_local['html_callback'] = jsonParam["callBackName"];
	arr_local['destination'] = "0";
	arr_local['workflow'] = "2";
	arr_local['gdzh'] = gdzh;	//股东账号
	arr_local['kyzj'] = kyzj;	//可用资金
	arr_local['wtData'] = wtData;	//委托数据
	
	SendRequest(arr_std,arr_ext,arr_local);
}

/*******************************************************************
 * creator		: @niuyaozong
 * function		: 从自运营服务查询国债行情数据
 * Date			: 2017-12-15
 * parameter	: callbackName ：回调函数名  
 * datatype 	：数据类型，取值 1（获取仅最新价）和 2（获取最新价和五档价格 ）
 * codelist 	：代码列表格式如下，行情市场1（代码1，代码2），行情市场2（代码1，代码2）等行情市场示例：上海A股（17）、上海债券（19）、深圳A股（33）、深圳债券（35）
 * mmlb 		：买卖列表，取值 B（买入价格）和 S（卖出价格），该值可以不传默认返回买入价格
 * return		: 
 * *****************************************************************/
function GZNHG_QueryHqDataFromZyy(callbackName, datatype, codelist, mmlb)
{
	var arr_std = {};
	var arr_ext = {};
	var arr_local = {};
	arr_std['reqtype'] = "2318";					// 	XT_QU_STOCKINFO
	arr_std['refresh'] = "1";						// 	是否强制后台查询
	arr_std['userkey'] = g_curUserInfo;				//	USERKEY用户标识
	
	arr_ext['cmd'] = "Query_HQData";				// 	DataTrans请求的子请求类型
	arr_ext['datatype'] = datatype;
	arr_ext['codelist'] = codelist;
	arr_ext['mmlb'] = mmlb;
	
	arr_local['html_callback'] = callbackName;
	arr_local['destination'] = "1";
	
	SendRequest(arr_std,arr_ext,arr_local);
}

/*******************************************************************
 * creator		: @ji
 * function		: 注册机制行情客户端查询行情
 * Date			: 2017-01-23
 * parameter	: arrStockCode：股票代码数组
 * return		: 
 * *****************************************************************/
function GZNHG_RegisterHqDataPushFromHqClient(arrStockCode)
{
	var strStockCodes = '';
	for(var nIndex in arrStockCode)
	{
		strStockCodes = strStockCodes + arrStockCode[nIndex] + ',';
	}
	
	var arrParam = {};
	arrParam["stock_code"] = strStockCodes;
	arrParam["data_grade"] = "0";
	
	var strParam = window.JSON.stringify(arrParam);
	fnFunction("reg_push_from_hq", strParam);
}

/*******************************************************************
 * creator		: @ji
 * function		: 注销行情客户端行情数据推送
 * Date			: 2017-01-23
 * parameter	: arrStockCode：股票代码数组
 * return		: 
 * *****************************************************************/
function GZNHG_UnregisterHqDataPushFromHqClient(arrStockCode)
{
	var strStockCodes = '';
	for(var nIndex in arrStockCode)
	{
		strStockCodes = strStockCodes + arrStockCode[nIndex] + ',';
	}
	
	var arrParam = {};
	arrParam["stock_code"] = strStockCodes;
	arrParam["data_grade"] = "0";
	
	var strParam = window.JSON.stringify(arrParam);
	fnFunction("unreg_push_from_hq", strParam);
}

/*******************************************************************
 * creator		: @niuyaozong
 * function		: 国债逆回购向自运营服务器上传日志
 * Date			: 2017-12-07
 * parameter	: datatype：日志类型 retcode：返回码 retmsg：返回信息 cbasdata：扩展返回数据
 * return		: 
 * *****************************************************************/
function GZNHG_UploadLog(datatype, retcode, retmsg, cbasdata)
{
	var arr_ext = {};
	var arr_std = {};
	var arr_local = {};
	
	arr_std['reqtype'] 	 = "2318";			
	arr_std['setcode'] 	 = "";									
	arr_std['refresh'] 	 = "1";
	arr_std['cachedata'] = "1";
	arr_std['userkey']   = g_curUserInfo;
	
	arr_ext['cmd'] = "cbas_ipo_log";	
	arr_ext['xd_local_notify_req'] = "1";
	arr_ext['datatype']	 = datatype;
	arr_ext['retcode']	 = retcode;
	arr_ext['retmsg'] 	 = retmsg;
	arr_ext['cbasdata']  = cbasdata;
	arr_ext['ldatetime'] = GetLocalTime() + GetLocalTimeZone();
	arr_ext['zjzh'] = GetZjzh(g_curUserInfo);	//hxcomm.js 函数
	arr_ext['pkgver']	 = g_pkgver;
	arr_ext['qsid'] 	 = g_qsid;
	arr_ext['userkey']	 = g_curUserInfo;
	arr_ext['module'] = 'GZNHG';
	
	arr_local['html_callback'] = 'GZNHG_UploadLogCallBack';
	arr_local['destination']   = "1";
	
	SendRequest(arr_std,arr_ext,arr_local);
}
/*******************************************************************
 * creator 		: @ji
 * function 	: 查询资金
 * Date 		: 2017-06-05
 * parameter 	: callbackName：回调函数名
 * return 		: 
 * *****************************************************************/
function QueryZijin(callbackName)
{
	var arr_std = {};
	var arr_ext = {};
	var arr_local = {};
	
	arr_std['reqtype'] = "5";
	arr_std['userkey'] = g_curUserInfo;
	arr_std['entrustamount'] = "555"; 
	arr_std['refresh'] = "1"
	arr_std['cachedata'] = "1";
	
	arr_ext['xd_local_name'] = "query_zijin";
	arr_ext['zjzh'] = fnFunction("get_zjzh_ex",g_curUserInfo);
	
	arr_local['html_callback'] = callbackName;
	
	SendRequest(arr_std,arr_ext,arr_local);
}
