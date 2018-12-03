document.write('<script language=javascript src="./adapter.js"></script>');
document.write('<script type="text/javascript" src="./hxcomm.js"></script> ');


//var  g_curUserInfo = "";			// 当前用户信息
//var  g_qsid		   = "";			// 券商ID
//var  g_loginType   = 0;    			// 登录信息 0 普通 1 信用
/*
function fn_glocalInit(userInfo, qsid, loginType)
{
	q_curUserInfo = userInfo;
	g_qsid = qsid;
	g_loginType = loginType;
}
*/

var g_xginfolog = new Array("","","","","","","");						//新股日志记录表
/************************************************************
*g_xginfolog[0]			datatype	业务类型调用方式
*g_xginfolog[1]			pkg版本
*g_xginfolog[2]			retcode
*g_xginfolog[3]			retmsg
*g_xginfolog[4]			cbasdata  字符串
*g_xginfolog[5]			qsid 
*g_xginfolog[6]			userkey  
*************************************************************/
var g_xginfolog_ext = new Array("","","","","","","","","");					//新股日志记录
/************************************************************
*g_xginfolog_ext[0]			新股列表信息
*g_xginfolog_ext[1]			可申购数量返回信息
*g_xginfolog_ext[2]			委托入参
*g_xginfolog_ext[3]         可买数量信息
*g_xginfolog_ext[4]			查可申购数量入参
*g_xginfolog_ext[5]			记录其他异常情况(如今日无新股)
*g_xginfolog_ext[6] 		查用户配号请求数据
*g_xginfolog_ext[7] 		查用户配号返回数据
*g_xginfolog_ext[8] 		可买数量信息中的股东账户，证券代码，证券名称
*************************************************************/

//201171125 NiWeiGuo 日志改版规范字段

//请求耗时中间变量
var g_req_start = 0;	//请求开始时间戳

//请求耗时
var rt_xgyw = 0;	//查新股业务耗时
var rt_xgxx = new Array(0,0);	//查新股信息耗时 rt_xgxx[0]为从券商查询的耗时 ，rt_xgxx[1]为从自营查的请求耗时
var rt_xgksg = 0;	//查可申购数量耗时（多只合一）
var rt_xgysg = 0;	//查已申购数量耗时
var rt_wt = 0;		//委托耗时

//返回信息
var i_xgxx = '';	//查新股请求信息
var i_xgksg = '';	//查可申购请求信息
var i_xgysg = '';	//查已申购请求信息
var i_xgwt = '';	//一键申购委托信息
var i_dswt = '';	//定时申购委托信息
var i_xgzh = '';	//股东账户及对应市场的新股
var i_error = '' ;  	//记录委托的错误信息

//标识or用户信息
var f_xgyw = '';	//新股业务标识
var f_dssg = '';	//用户设置的状态

//定时器
var tt_dssg = '';	//定时器触发时间

//日志字段
var g_datatype = '';
var g_retcode = '';
var g_retmsg = '';
var g_cbasdata = '';

//初始化日志字段
function InitLogData()
{
	g_datatype = '';
	g_retcode = '';
	g_retmsg = '';
	g_cbasdata = '';
}
/************************************************************
* 查已申购数量时需要特殊处理的券商列表（实质是查委托）
* key:value  
* key:券商id
* value:处理方式，qlwt表示需要全量委托
* 20171025 nwg
*************************************************************/
var g_qsid_cxwt_special = {
	"15":"qlwt",	//长江证券
	"27":"qlwt",	//广发证券
	"30":"qlwt",	//国联证券
	"36":"qlwt",	//恒泰证券
	"40":"qlwt",	//中邮证券
	"39":"qlwt",	//华创证券
	"46":"qlwt",	//中信浙江
	"53":"qlwt",	//民族证券
	"57":"qlwt",	//中投证券
	"59":"qlwt",	//平安证券
	"73":"qlwt",	//西南证券
	"80":"qlwt",	//兴业证券
	"96":"qlwt",	//太平洋证券
	"114":"qlwt",	//华泰证券
	"124":"qlwt",	//财达证券
	"158":"qlwt",	//中信证券
	"322":"qlwt",	//长城国瑞
	"327":"qlwt",	//山西证券
	"331":"qlwt",	//国金证券
	"339":"qlwt",	//浙商证券
	"340":"qlwt",	//东莞证券
	"343":"qlwt",	//天风证券
	"347":"qlwt",	//华融证券
	"349":"qlwt"	//大同证券
}
var g_pkgver = "Ver3.5.7";	//全局pkg版本标志，所有页面从此变量获得版本  20181112 niweiguo
var g_xginfo_support = '' ; // 是否支持从cxinfo中获取可申购数量 '1'，支持 '0'，不支持
var g_ksgsl_request = ''; //可申购数量请求方向，C 或者 L-0-cx_xgsg
var g_cur_ReqDest = '0'  // 请求方向，默认向券商接口请求 为0  1为向自营请求

//查询新股信息
function fn_cxXgInfo(html_callbackName, cur_ReqDest)
{
	var arr_ext = {};
	var arr_std = {};
	var arr_local = {};
	g_cur_ReqDest = cur_ReqDest;
	//获取扩展数据
	switch (parseInt(g_qsid)) 
	{
		case 552:// 广州证券特殊处理	20171031 nwg
		case 143:// 国元证券特殊处理	20171031 nwg
		case 166: // 申万宏源证券特殊处理
		case 13:  //长城证券特殊处理 20170331
			arr_std['menuid'] = "554";		// 菜单ID
			arr_ext['menuid'] = "554";		// 菜单ID
			break;
		case 193:  //五矿证券20170401 
		case 22:   //东海证券20170411
			arr_ext['type'] = "simple";
			break;
		default:
			arr_std['menuid'] = "";
			break;
	}	
	if (g_loginType == 1 )    //信用登录要送rzrq=1
	{
		arr_ext['rzrq'] = '1';
	}
	if(cur_ReqDest == "0")			// 券商主站
	{
		arr_std['reqtype'] = "2304";			// XT_DATA_TRANS	
		arr_std['setcode'] = "";				// 市场
		arr_std['refresh'] = "1";				// 是否强制后台查询
		arr_std['cachedata'] = "1";				// 是否需要缓存应答数据
		arr_std['tablename'] = "xg_info";		// 查询回来的多行数据表头名称
		arr_std['userkey'] = g_curUserInfo;		// USERKEY用户标识
		arr_std['zjzh'] = GetZjzh(g_curUserInfo);//资金账号
		
		arr_ext['cmd'] = "cx_xginfo";			// DataTrans请求的子请求类型
		arr_ext['dataid'] = "xg_info";			// 数据ID
		arr_ext['scdm'] = "";					// 市场代码
		arr_ext['zjzh'] = GetZjzh(g_curUserInfo);//资金账号
		
		arr_local['html_callback'] = html_callbackName;
		arr_local['destination'] = "0";			//0 券商，1 自运营，2 认证中心 回调函数使用
		fn_request(arr_std,arr_ext,arr_local);
	}
	if(cur_ReqDest == "1")			// 自运营主站
	{
		arr_std['reqtype'] = "2318";			// XT_DT_ZDJY_REQ				
		arr_std['setcode'] = "";								
		arr_std['refresh'] = "1";
		arr_std['cachedata'] = "1";
		arr_std['tablename'] = "xg_info_simple";
		arr_std['userkey'] = g_curUserInfo;		
		
		arr_ext['zdjy'] = "1";
		arr_ext['cmd'] = "cx_xginfo";			
		arr_ext['dataid'] = "xg_info_simple";			
		arr_ext['type'] = "simple";
		
		arr_local['html_callback'] = html_callbackName;
		arr_local['destination'] = "1";			//0 券商，1 自运营，2 认证中心 回调函数使用
		
		fn_request(arr_std,arr_ext,arr_local);
	}
	
}

/*******************************************************************
 * creator		: @ji
 * function		: 新股日志请求
 * Date			: 2017-01-23
 * parameter	: post JSON数据 
 * return		: 
 * *****************************************************************/
function fn_requestlog(arr_xginfo)
{
	var arr_ext = {};
	var arr_std = {};
	var arr_local = {};
	
	arr_std['reqtype'] 	 = "2318";			
	arr_std['setcode'] 	 = "";									
	arr_std['refresh'] 	 = "1";
	arr_std['cachedata'] 	 = "1";
	arr_std['userkey']   	 = g_curUserInfo;
	
	arr_ext['cmd'] = "cbas_ipo_log";	
	arr_ext['xd_local_notify_req'] = "1";
	
	arr_ext['datatype']	 = arr_xginfo[0];
	arr_ext['pkgver']	 = arr_xginfo[1];
	arr_ext['retcode']	 = arr_xginfo[2];
	arr_ext['retmsg'] 	 = arr_xginfo[3];
	arr_ext['cbasdata'] 	 = arr_xginfo[4];
	arr_ext['qsid'] 	 = arr_xginfo[5];
	arr_ext['userkey']	 = arr_xginfo[6];
	arr_ext['ldatetime'] = get_cur_date() + clientTimeZone();
	arr_ext['zjzh'] = GetZjzh(g_curUserInfo);
	arr_ext['module'] = arr_xginfo[7];
	
	arr_local['html_callback'] = 'fn_callback_ipolog';
	arr_local['destination']   = "1";
	fn_request(arr_std,arr_ext,arr_local);
	//fnRequest("", parameter);
}

/*******************************************************************
 * creator		: @ji
 * function		: 新股日志请求返回
 * Date			: 2017-01-23
 * parameter	: post JSON数据
 * return		: 
 * *****************************************************************/
function fn_callback_ipolog(stripolog)
{
}
      
//查询可申购数量
function fn_cxKsgsl(html_callbackName,marketCode,sgCode,sgPrice)
{
	var arr_std = {};
	var arr_ext = {};
	var arr_local = {};
	
	if(g_loginType == 1)
	{
		if (g_cur_ReqDest == '1')
		{
			marketCode = String.fromCharCode(marketCode.charCodeAt() - 16);
		}
		
		arr_std['reqtype'] = "2304";									// XT_DATA_TRANS
		arr_std['setcode'] = marketCode;										// 市场代码
		arr_std['menuid'] = "5161";										// 菜单id
		arr_std['refresh'] = "1";										// 是否强制后台查询
		arr_std['contractid'] = "1|"+fnGetGDZH(g_curUserInfo, marketCode);	// 股东账户		
		arr_std['userkey'] = g_curUserInfo;								// USERKEY用户标识
		
		arr_ext['cmd'] = 'cx_wtsl';										// DataTrans请求的子请求类型
		arr_ext['zqdm'] = sgCode;										// 证券代码
		arr_ext['wtjg'] = sgPrice;										// 委托价格
		arr_ext['scdm'] = marketCode;									// 市场代码
		arr_ext['gdzh'] = fnGetGDZH(g_curUserInfo, marketCode);				// 股东账号
		arr_ext['zjzh'] = "";											// 资金账号
		arr_ext['gdxm'] = "";											// 股东姓名	
		arr_ext['menuid'] = "5161";										// 菜单id
		arr_ext['rzrq'] = "1";
		
		arr_local['html_callback'] = html_callbackName;
		arr_local['destination'] = "0";		
		arr_local['gdzh'] = fnGetGDZH(g_curUserInfo, marketCode);		// 股东账号
	}
	else
	{
		arr_std['reqtype'] = "1025";			// XT_QU_STOCKINFO
		arr_std['entrustamount'] = "5";			// 买卖方向
		arr_std['setcode'] = marketCode;		// 市场代码
		arr_std['stockcode'] = sgCode;			// 股票代码
		arr_std['entrustprice'] = sgPrice;		// 委托价格
		arr_std['menuid'] = "";					// 菜单id
		arr_std['refresh'] = "1";				// 是否强制后台查询
		arr_std['userkey'] = g_curUserInfo;		//USERKEY用户标识
		
		arr_ext['wtjg'] = "";					// 委托价格
		arr_ext['czlb'] = "B";					// 操作类别
		arr_ext['scdm'] = "";					// 市场代码
		arr_ext['mini_weituo'] = "1";			// 主站查询行情返回后，不切换市场
		arr_ext['xd_local_param'] = "IPO";
		
		arr_local['html_callback'] = html_callbackName;
		arr_local['destination'] = "0";
		arr_local['cmd'] = "cx_ksgsl";			// 新版本fn_cxKsgsl不需要cmd字段，老版本需要，放到local中为了兼容
		arr_local['gdzh'] = fnGetGDZHBySetCode(marketCode);	 // 股东账号
	}
	
	//获取扩展数据
	if(parseInt(g_qsid) == 90 && g_loginType == 1)
	{// 银河信用特殊处理
		arr_std['setcode'] = marketCode;
	}
	var parameter = "";
	var jsonStr1 = window.JSON.stringify(arr_std);
	var jsonStr2 = window.JSON.stringify(arr_ext);
	var jsonStr3 = window.JSON.stringify(arr_local);
	parameter = '{"standard":'+ jsonStr1 +',"extra":'+ jsonStr2 +',"local":'+ jsonStr3 +'}';
	if(g_xginfolog_ext[4] && g_xginfolog_ext[4].length > 0) //记录所有查可申购数量入参数据
	{
		g_xginfolog_ext[4] += "||";
	}
	g_xginfolog_ext[4] += parameter;	//查可申购数量入参
	fn_request(arr_std,arr_ext,arr_local); 
}

//券商版查询可申购数量
function fn_cxQsbKsgsl(html_callbackName,marketCode,sgCode,sgPrice)
{
	var arr_std = {};
	var arr_ext = {};
	var arr_local = {};
	
	if (g_loginType == 1 && g_cur_ReqDest == '1')
	{
		marketCode = String.fromCharCode(marketCode.charCodeAt() - 16);
	}
	
	arr_std['reqtype'] = "2304";					// XT_DATA_TRANS
	arr_std['setcode'] = marketCode;				// 市场代码
	arr_std['menuid'] = "";							// 菜单id
	arr_std['refresh'] = "1";						// 是否强制后台查询	
	arr_std['userkey'] = g_curUserInfo;				// USERKEY用户标识
	arr_std['zjzh'] = GetZjzh(g_curUserInfo);			//资金账号
		
	arr_ext['cmd'] = 'cx_xgsg';						// DataTrans请求的子请求类型
	arr_ext['zqdm'] = sgCode;						// 证券代码
	arr_ext['wtjg'] = sgPrice;						// 委托价格
	arr_ext['scdm'] = marketCode;					// 市场代码
	arr_ext['zjzh'] = "";							// 资金账号
	arr_ext['gdxm'] = "";							// 股东姓名	
	arr_ext['menuid'] = "";							// 菜单id
	arr_ext['dataid'] = "cx_xgsg";					 
	arr_ext['xd_local_name'] = "query_xgsg";		 
	arr_ext['zjzh'] = GetZjzh(g_curUserInfo);				//资金账号
	
	arr_local['html_callback'] = html_callbackName;
	arr_local['destination'] = "0";
	
	if(g_loginType == 1)
	{
		arr_std['menuid'] = "5161";	
		arr_std['contractid'] = "1|"+fnGetGDZH(g_curUserInfo, marketCode);	// 股东账户	
		
		arr_ext['gdzh'] = fnGetGDZH(g_curUserInfo, marketCode);				// 股东账号
		arr_ext['menuid'] = "5161";										// 菜单id
		arr_ext['rzrq'] = "1";
		
		arr_local['html_callback'] = html_callbackName;
		arr_local['destination'] = "0";		
	}
	else
	{
		arr_std['menuid'] = "554";					// 菜单id
		arr_std['contractid'] = "1|" + fnGetGDZHBySetCode(marketCode);	// 股东账户
		
		arr_local['html_callback'] = html_callbackName;
		arr_local['cmd'] = "cx_xgsg";			// 新版本cx_xgsg不需要cmd字段，老版本需要，放到local中为了兼容
		arr_local['gdzh'] = fnGetGDZHBySetCode(marketCode);	 // 股东账号
	}
	
	var parameter = "";
	var jsonStr1 = window.JSON.stringify(arr_std);
	var jsonStr2 = window.JSON.stringify(arr_ext);
	var jsonStr3 = window.JSON.stringify(arr_local);
	parameter = '{"standard":'+ jsonStr1 +',"extra":'+ jsonStr2 +',"local":'+ jsonStr3 +'}';
	if(g_xginfolog_ext[4] && g_xginfolog_ext[4].length > 0) //记录所有查可申购数量入参数据
	{
		g_xginfolog_ext[4] += "|";
	}
	g_xginfolog_ext[4] += parameter;	//查可申购数量入参
	fn_request(arr_std,arr_ext,arr_local); 
}

//查询已申购数量
function fn_cxHaveCount(html_callbackName)
{	
	var arr_std = {};
	var arr_local = {};
	var arr_ext = {};
	var qsid = parseInt(g_qsid);
	// stockcode字段置为空字符串,代表查全量委托
	// qsid对应列表:
	// 59:平安证券 114:华泰证券 347:华融证券 57:中投证券 327:山西证券 36:恒泰证券 331:国金证券
	if( g_qsid_cxwt_special[qsid] == 'qlwt') // 查询qsid是否在需要特殊处理券商的表中 20171025 nwg
	{
		arr_std['reqtype'] = "1539";
		arr_std['setcode'] = "1";
		arr_std['menuid'] = "";
		arr_std['refresh'] = "1";
		arr_std['cachedata'] = "1";
		arr_std['userkey'] = g_curUserInfo;
		
		arr_ext['dataid'] = "yjsg";
		arr_ext['xd_local_name'] = "query_weituo";
		
		arr_local['html_callback'] = html_callbackName;
		arr_local['destination'] = "0";
	}
	else
	{
		arr_std['reqtype'] = "1539";			// XT_NEW_QU_WEITUO
		arr_std['setcode'] = "1";		        // 市场
		arr_std['stockcode'] = "W";				// 股票代码
		arr_std['menuid'] = "";					// 菜单id
		arr_std['refresh'] = "1";				// 是否强制后台查询
		arr_std['cachedata'] = "1";				// 是否需要缓存应答数据
		arr_std['userkey'] = g_curUserInfo;		// USERKEY用户标识
		
		arr_ext['dataid'] = "yjsg";						
		arr_ext['xd_local_name'] = "query_chedan";

		arr_local['html_callback'] = html_callbackName;
		arr_local['destination'] = "0";
		arr_local['cmd'] = 'cx_wt';				// 新版本fn_cxHaveCount不需要cmd字段，老版本需要，放到local中为了兼容
	}

	fn_request(arr_std,arr_ext,arr_local);
}

//查询申购新股
function fn_xgwt(html_callbackName,sgCode,sgMaxCount, scmc,sgPrice)
{
	//add
	var arr_std = {};
	var arr_local = {};
	var arr_ext = {};
	
	if(g_loginType == 1)			// 如果是信用账户
	{
		arr_std['reqtype'] = "2314";
		arr_std['menuid'] = "5161";
		arr_std['setcode'] = scmc;
		arr_std['stockcode'] = sgCode;
		arr_std['entrustprice'] = sgPrice;
		arr_std['entrustamount'] = sgMaxCount;
		arr_std['contractid'] = "1|"+fnGetGDZH(g_curUserInfo, scmc);	
		arr_std['refresh'] = "1";
		arr_std['cachedata'] = "1";
		arr_std['userkey'] = g_curUserInfo;
		
		arr_ext['cmd'] = "rzrq_xgsg";
		arr_ext['rzrq'] = "1";
		arr_ext['menuid'] = "5161";
		arr_ext['gdzh'] = fnGetGDZH(g_curUserInfo, scmc);		
		arr_ext['rzrq_zjzh'] = GetZjzh(g_curUserInfo);
		arr_ext['zqdm'] = sgCode;
		arr_ext['scdm'] = scmc;	
		arr_ext['wtjg'] = sgPrice;
		arr_ext['wtsl'] = sgMaxCount;
		arr_ext['dataid'] = "yjsg";
		
		arr_local['html_callback'] = html_callbackName;
		arr_local['destination'] = "0";
	}
	else
	{	
		arr_std['reqtype'] = "258";				//XT_WEITUO_MAIRU
		arr_std['setcode'] = scmc;
		arr_std['stockcode'] = sgCode;
		arr_std['entrustprice'] = sgPrice;
		arr_std['entrustamount'] = sgMaxCount;
		arr_std['contractid'] = "1|"+fnGetGDZH(g_curUserInfo, scmc);
		arr_std['refresh'] = "1";
		arr_std['userkey'] = g_curUserInfo;
		
		arr_ext['zqdm'] = sgCode;
		arr_ext['wtjg'] = sgPrice;
		arr_ext['wtsl'] = sgMaxCount;
		arr_ext['dataid'] = "yjsg";
		
		arr_local['html_callback'] = html_callbackName;
		arr_local['destination'] = "0";
		arr_local['cmd'] = "sg";				// 新版本fn_xgwt不需要cmd字段，老版本需要，放到local中为了兼容
		
		//获取扩展数据
		arr_std['menuid'] = "554";		// 菜单ID
		//arr_ext['exdata'] = "scdm|" + scmc + "|menuid|"	
		arr_ext['scdm'] = scmc;
	}
	switch (parseInt(g_qsid)) 
	{
		case 15: // 长江证券特殊处理
			//arr_ext['extradata'] = "menuid|161|scdm|" + scmc + '|';
			arr_ext['menuid'] = "161";		// 菜单ID
			//arr_ext['exdata'] = "scdm|" + scmc + "|menuid|"
			arr_ext['scdm'] = scmc;
			break;
		case 90:// 银河信用特殊处理
			if (g_loginType == 1) 
			{
				//arr_ext['extradata'] = "menuid|554|setcode|"+ scmc + "|scdm|" + scmc + '|';
				arr_ext['menuid'] = "554";		// 菜单ID
				arr_std['setcode'] = scmc;
				arr_ext['scdm'] = scmc;
				//arr_ext['exdata'] = "setcode|" + scmc + "|scdm|" + scmc + "|menuid|"
			}
			break;
		case 552: //广州证券
		case 51: //联讯证券
		case 120://民生证券
		case 100://中泰证券
		case 53:  //民族信用特殊处理
			if(g_loginType == 1)
			{
				if (g_cur_ReqDest == '1')
				{
					scmc = String.fromCharCode(scmc.charCodeAt() - 16);
					arr_ext['gdzh'] = fnGetGDZH(g_curUserInfo, scmc);
				}
				arr_ext['zqdm'] = sgCode;
				arr_ext['scdm'] = scmc;
			}
			break;
		case 23 : // 东吴证券   信用券商返回普通市场，需要手动调整获取信用股东账号
			if(g_loginType == 1)
			{
				if (scmc== '1' || scmc == '2')
				{		
					scmc = String.fromCharCode(scmc.charCodeAt() - 16);
					arr_std['contractid'] = "1|"+fnGetGDZH(g_curUserInfo, scmc);	
					arr_ext['gdzh'] = fnGetGDZH(g_curUserInfo, scmc);		
				}
			}
			break;
		default:
			break;
	}
	var parameter = "";
	var jsonStr1 = window.JSON.stringify(arr_std);
	var jsonStr2 = window.JSON.stringify(arr_ext);
	var jsonStr3 = window.JSON.stringify(arr_local);
	parameter = '{"standard":'+ jsonStr1 +',"extra":'+ jsonStr2 +',"local":'+ jsonStr3 +'}';
	g_xginfolog_ext[2] = parameter;
	fn_request(arr_std,arr_ext,arr_local);
}

//查询web配号
function fn_cxWebph(html_callbackName)
{
	var arr_std = {};
	var arr_local = {};
	var arr_ext = {};
	
	arr_std['reqtype'] = "2318";					// XT_DT_ZDJY_REQ
	arr_std['setcode'] = "";						
	arr_std['refresh'] = "1";
	arr_std['cachedata'] = "1";
	arr_std['userkey'] = g_curUserInfo;
	
	arr_ext['cmd'] = "cx_webpeihao";
	arr_ext['xd_local_notify_req'] = "1";
	
	arr_local['html_callback'] = html_callbackName;
	arr_local['destination'] = "1";
	fn_request(arr_std,arr_ext,arr_local);
}

//查询中签
function fn_cxZq(html_callbackName)
{	
	var arr_std = {};
	var arr_local = {};
	var arr_ext = {};
	
	arr_std['reqtype'] = "2304";				// XT_DATA_TRANS
	arr_std['setcode'] = "";
	arr_std['refresh'] = "1";
	arr_std['cachedata'] = "1";
	arr_std['userkey'] = g_curUserInfo;
	
	arr_ext['cmd'] = 'Query_IPO';
	
	arr_local['html_callback'] = html_callbackName;
	arr_local['destination'] = "0";
	fn_request(arr_std,arr_ext,arr_local);
}

//查询用户配号
function fn_cxUserPh(html_callbackName,startDate)
{	
	var arr_std = {};
	var arr_local = {};
	var arr_ext = {};
		
		
	arr_std['reqtype'] = "1548";				// XT_NEW_QU_XGPH
	arr_std['setcode'] = "";
	arr_std['refresh'] = "1";
	arr_std['cachedata'] = "1";
	arr_std['userkey'] = g_curUserInfo;
	arr_std['newpwd'] = "1|" + startDate + "|" + startDate;		//"起始日期|结束日期" 只查T日的配号
	
	arr_ext['qsrq'] = startDate;
	arr_ext['jzrq'] = startDate;			//GetDateStr(0)只查T日的配号
	arr_ext['page_roll'] = "1";
	
	arr_local['html_callback'] = html_callbackName;
	arr_local['destination'] = "0";
	arr_local['cmd'] = "cx_ph";				// 新版本fn_cxUserPh不需要cmd字段，老版本需要，放到local中为了兼容
	
	var parameter = "";
	var jsonStr1 = window.JSON.stringify(arr_std);
	var jsonStr2 = window.JSON.stringify(arr_ext);
	var jsonStr3 = window.JSON.stringify(arr_local);
	parameter = '{"standard":'+ jsonStr1 +',"extra":'+ jsonStr2 +',"local":'+ jsonStr3 +'}';
	g_xginfolog_ext[6] = parameter;
	
	fn_request(arr_std,arr_ext,arr_local);	
}

//上传用户配号
function fn_uploadUserph(html_callbackName,userphdata)
{
	var arr_std = {};
	var arr_local = {};
	var arr_ext = {};
	
	arr_std['reqtype'] = "2318";					// XT_DT_ZDJY_REQ
	arr_std['setcode'] = "";						
	arr_std['refresh'] = "1";
	arr_std['cachedata'] = "1";
	arr_std['userkey'] = g_curUserInfo;
	
	arr_ext['cmd'] = "up_xgsgph";
	arr_ext['xd_local_notify_req'] = "1";
	arr_ext['phdata'] = userphdata;
	arr_ext['qsid'] = g_qsid;
	
	arr_local['html_callback'] = html_callbackName;
	arr_local['destination'] = "1";
	fn_request(arr_std,arr_ext,arr_local);
}

//查询新股业务标志
function fn_cxXgywMark(html_callbackName)
{
	var arr_std = {};
	var arr_local = {};
	var arr_ext = {};
	
	arr_std['reqtype'] = "2318";					// XT_DT_ZDJY_REQ
	arr_std['setcode'] = "";						
	arr_std['refresh'] = "1";
	arr_std['cachedata'] = "1";
	arr_std['userkey'] = g_curUserInfo;
	
	arr_ext['cmd'] = "cx_xgywmark";
	arr_ext['xd_local_notify_req'] = "1";
	arr_ext['qsid'] = g_qsid;
	
	arr_local['html_callback'] = html_callbackName;
	arr_local['destination'] = "1";
	fn_request(arr_std,arr_ext,arr_local);
}
/*******************************************************************
 * creator		: @NiWeiGuo
 * function		: 上传新股日志
 * Date			: 2017-11-28
 * parameter	: 数据类型，返回值，返回信息，详细数据，业务标识
 * return		: 无
 * *****************************************************************/
function UploadLog(strType, strRetCode, strRetMsg, strCbasData, strModule)
{
	var arrIPOLog = new Array();
	if(strModule == 'XGSG' || strModule == 'DSSG')  //新股申购or定时申购日志新增登录类型
	{
		strCbasData += "|" + "f_loginType=" + g_loginType;
	}
	arrIPOLog[0] = strType; 
	arrIPOLog[1] = g_pkgver;  //pkg版本
	arrIPOLog[2] = strRetCode;
	arrIPOLog[3] = strRetMsg;
	arrIPOLog[4] = strCbasData;
	arrIPOLog[5] = g_qsid;    //券商id
	arrIPOLog[6] = g_curUserInfo; //userkey
	arrIPOLog[7] = strModule;
	fn_requestlog(arrIPOLog);
}
/*******************************************************************
 * creator		: @NiWeiGuo
 * function		: 计算请求耗时，并重置中间变量
 * Date			: 2017-11-28
 * parameter	: 无
 * return		: 请求耗时
 * *****************************************************************/
function Calc_Request_Time()
{
	var req_end = new Date().getTime(); //请求结束
	var req_time = (req_end - g_req_start) / 1000;  //计算耗时
	
	g_req_start = 0; //重置全局变量
	
	return req_time;
}