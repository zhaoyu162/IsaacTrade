document.write('<script language=javascript src="./request.js"></script>');
document.write('<script language=javascript src="./adapter.js"></script>');
document.write('<script language=javascript src="./json2.js"></script>');
var WT_ZQDM = "2102"; 		// 证券代码
var WT_ZQMC = "2103"; 		// 证券名称
var WT_SJJG = "2197"; 		// 申购价格
var WT_JYS = "2108"; 		// 交易市场
var WT_JYS_YHXY = "3018"; 	// 银河信用特殊处理交易市场
var WT_SCMC = "2171";		// 东兴/东海/中天/长城市场名称
var WT_JYS_DH = "2009"; 	// 东海特殊处理交易市场
var WT_SGJG_YH = "2127"; 	// 银河特殊申购价格信用
var WT_CJ_PH = "2163"; 		// 起始配号
var WT_GP_SJSL = "2164"; 	// 成交笔数
var WT_GP_CJBH = "2130";	// 股票成交编号
var WT_GP_CJSL = "2128";	// 股票成交数量
var WT_CJ_CJBS = "2157";   	// 成交笔数
var WT_ZQSL = "2199"; 		// 中签数量
var WT_GDZH = "2106"; 		// 股东账号
var WT_GP_KYYE = "2121"; 	// 额度
var WT_GP_WTSL = "2126"; 	// 已申购数量
var WT_ZQRQ = "2198";      	// 中签日期 
var WT_FXDJ = "2003";		//发行低价 国元证券 申购价格 金证U柜台
var WT_FXGJ = "2004";		//发行高价 国元证券 申购价格 金证U柜台
var WT_SGSX = "3788";		//国泰君安 申购上限
var WT_SGXX = "3789";		//国泰君安 申购下限
var WT_WTSL = '3016';		//委托数量
/*
	函数功能:
	获取日期, 参数为0当日日期，负数为当日日期向历史日期推，正数为当日日期向前推
*/
function GetDateStr(AddDayCount) 
{
	var dd = new Date();
	dd.setDate(dd.getDate() + AddDayCount); // 获取AddDayCount天后的日期
	var y = dd.getFullYear();
	var m = dd.getMonth() + 1; 				// 获取当前月份的日期
	var d = dd.getDate();
	m = m < 10 ? "0" + m : m;
	d = d < 10 ? "0" + d : d;
	y = y.toString();
	m = m.toString();
	d = d.toString();
	return y + m + d;
}



/*
*函数功能:
*获取当前 日期 时间
*/
function get_cur_date() 
{
	var date = new Date();
	var seperator1 = "-";
	var seperator2 = ":";
	var month = date.getMonth() + 1;
	var strDate = date.getDate();
	if (month >= 1 && month <= 9) 
	{
		month = "0" + month;
	}
	if (strDate >= 0 && strDate <= 9) 
	{
		strDate = "0" + strDate;
	}

	var hh = date.getHours();
	var mm = date.getMinutes();
	var ss = date.getSeconds();
	if (hh >= 1 && hh <= 9) 
	{
		hh = "0" + hh;
	}
	if (mm >= 0 && mm <= 9) 
	{
		mm = "0" + mm;
	}

	if (ss >= 0 && ss <= 9)
	{
		ss = "0" + ss;
	}

	return date.getFullYear() + seperator1 + month + seperator1 + strDate + " " + hh + seperator2 + mm + seperator2 + ss;
}
/*******************************************************************
 * creator		: @ji
 * function		: 获取当前时区
 * Date			: 2017-04-01
 * parameter	: 
 * return		: 
 * *****************************************************************/
function clientTimeZone() 
{
	var munites = new Date().getTimezoneOffset();
	var hour = parseInt(munites / 60);
	var munite = munites % 60;
	var prefix = "-";
	if (hour < 0 || munite < 0) 
	{
		prefix = "+";
		hour = -hour;
		if (munite < 0){ munite = -munite; }
	}
	hour = hour + "";
	munite = munite + "";
	if (hour.length == 1) { hour = "0" + hour; }
	if (munite.length == 1) { munite = "0" + munite; }
	return prefix + hour + munite;
}

/*
*函数功能:
*获取当前新股的中签结果查询日期
*/
function getCxzqDate() 
{
	var date = new Date();
	var seperator1 = "-";
	var seperator2 = ":";
	var month = date.getMonth() + 1;
	var strDate = date.getDate() + 2;
	if (month >= 1 && month <= 9) 
	{
		month = "0" + month;
	}
	if (strDate >= 0 && strDate <= 9) 
	{
		strDate = "0" + strDate;
	}

	return date.getFullYear() + seperator1 + month + seperator1 + strDate ;
}

/*
	函数功能:
	输出日志到同花顺软件根目录的zdjyHandle.log
*/
function write_html_log(str) 
{
	fnFunction("test_json", get_cur_date() + ':htmllog:' + str);
}

/*
	函数功能:
	去掉字符串中的\n,\r,/r,/n
*/
function fun_str_replace(str)
{
	var strdes = str;
	strdes = strdes.replace('\n',' ');
	strdes = strdes.replace('\r',' ');
	strdes = strdes.replace('/n',' ');
	strdes = strdes.replace('/r',' ');
	return strdes;
}

var gt_2_hx_scdm = {"00":"1","01":"4","10":"2","11":"5"};
/*
*新股列表数组相应索引下标对应值的含义：
*证券代码： WT_ZQDM(2102)
*证券名称： WT_ZQMC(2103)
*申购价格： WT_SJJG(2197)2127
*交易市场： WT_JYS(2108) //华泰这个字段是 市场名称, 需要用名称从客户端取下

*参数说明:
*qs_id  		券商id
*str     		需要解析的新股信息字符串
*cur_user  		当前用户登录信息(客户端再调用页面的入口函数中，会附带此信息)
*cur_login_type 当前用户登录类型  0:普通 1:信用
*cur_ReqDest    当前新股信息来源  "0":券商 "1":自运营
*gReqDest		全局信息来源仅记录日志使用 "0":券商 "1":自运营
*函数功能:
*解析新股列表
*/
/*************************************************************************
 *	creator 	: @nwg
 *	Function	: 拆分组装新股信息，同时通过白名单过滤非新股信息
 *	Date		：2017-09-28
 *************************************************************************/
function parse_sglist(qs_id, str, cur_user, cur_login_type, cur_ReqDest, gReqDest) 
{
	var strCfg = fnGetConfigData('XGSG','Feature_code','732*|730*|780*|300*|002*');//获取xiadan.ini下XGSG节点中key为Fearture_code的值，若不存在，则获取默认值
	array_strCfg = strCfg.split('|');//以'|'分割取回的strCfg
	var strdes = fun_str_replace(str);			// str是json字符串，strdes是json字符串
	write_html_log('parse_sglist' + strdes);
	var strToObj = new Function("return" + strdes)();	//strToObj是json对象
	var strAdapter = fn_reply(strToObj, 'parse_sglist');
	g_xginfolog_ext[0] += "全局信息来源:" + gReqDest + "||" +　"当前信息来源:" + cur_ReqDest + "||" + strAdapter;
	var obj = new Function("return" + strAdapter)();
	var parse_array = new Array();
	
	if (strAdapter.indexOf('code') < 0 || strAdapter.indexOf('data') < 0 || obj.code == undefined || obj.code == "-1" || obj.data == undefined || obj.data.table == undefined) 
	{
		return parse_array;
	}
	var qs_id_num = parseInt(qs_id);
	var k = 0;  //用于重新划分parse_array的数组下标，若用i则会存在过滤了0，依旧存在0（为空）
	for (var i = 0; i < obj.data.table.length; i++) 
	{
		if ( MatchFeature(array_strCfg,obj.data.table[i][WT_ZQDM]) )//判断是否匹配特征
		{
			parse_array[k] = new Array();
			parse_array[k][0] = obj.data.table[i][WT_ZQMC]; 		// 证券名称
			parse_array[k][1] = obj.data.table[i][WT_ZQDM]; 		// 申购代码
			if (g_xginfo_support == '1')			// 支持可申购数量的返回
			{
				parse_array[k][2] = parseInt(obj.data.table[i][WT_WTSL], 10).toString(); 		// 可申购数量 消除小数点
			}
			else
			{
				parse_array[k][2] = 0;
			}
			parse_array[k][3] = 0; 									// 已申购数量
			parse_array[k][4] = obj.data.table[i][WT_JYS]; 	        // 交易市场
			parse_array[k][6] = obj.data.table[i][WT_SGSX]; 		// 申购上限 
			parse_array[k][7] = obj.data.table[i]['3685'] || obj.data.table[i]['4021'] || GetDateStr(0);  //申购日期
			//市场代码券商主站新股信息数据特殊处理
			if(cur_ReqDest == "0")		
			{
				switch (qs_id_num) 
				{
					case 114: 	// 华泰证券
					case 13: 	// 长城证券
					case 143:	// 国元证券 牛耀宗20170414
						parse_array[k][4] = fnFunction("get_setcode_ex", 'user=' + cur_user + '\nscmc=' + parse_array[k][4] + '\n'); //市场名称转市场代码
						break;
					case 22: 	// 东海证券 牛耀宗20170414
						parse_array[k][4] = obj.data.table[i][WT_JYS_DH]; 	// 东海特殊处理交易市场(2009)
						parse_array[k][4] = fnFunction("get_setcode_ex", 'user=' + cur_user + '\nscmc=' + parse_array[k][4] + '\n');				
						break;
					case 127:      // 东方证券 牛耀宗20170414
					case  26:	   // 光大证券 牛耀宗20170609
						parse_array[k][4] = obj.data.table[i][WT_SCMC]; 	//东方证券、光大证券市场名称(2171)					
						parse_array[k][4] = fnFunction("get_setcode_ex", 'user=' + cur_user + '\nscmc=' + parse_array[k][4] + '\n');					
						break;				
					case 33:	// 信达证券20170331 柜台市场转核新市场
						parse_array[k][4] = gt_2_hx_scdm[parse_array[i][4]];
						break;	
					default:
						break;
				}		
			}
			parse_array[k][5] = obj.data.table[i][WT_SJJG];               // 申购价格
			if (parse_array[k][5] == undefined || parse_array[k][5] == 0 || parse_array[k][5] == '') 
			{
				parse_array[k][5] = obj.data.table[i][WT_SGJG_YH]; 	// 申购价格
			}
			//申购价格券商主站新股信息数据特殊处理
			if(cur_ReqDest == "0")		
			{								
				switch (qs_id_num) 
				{			
					case 143:	// 国元证券 牛耀宗20170414				
						if (parse_array[k][5] == undefined || parse_array[k][5] == 0 || parse_array[k][5] == '') 
						{
							parse_array[k][5] = obj.data.table[i][WT_FXDJ]; 	//国元证券发行低价(2003)
						}				
						break;
					default:
						break;
				}
			}
			k++;	
		}
	}
	return parse_array;
}

/*
*可申购数量数组相应索引下标对应值的含义：
*股东账号：WT_GDZH(2106)
*额度：     WT_GP_KYYE(2121)

*参数说明:
*qs_id  		券商id
*str     		需要解析的可申购新股信息字符串
*cur_user  		当前用户登录信息(客户端再调用页面的入口函数中，会附带此信息)

*函数功能:
*解析可申购数量
*/
function parse_ksgsl(qs_id, str, cur_user) 
{
	var strdes = fun_str_replace(str);
	write_html_log('parse_ksgsl' + strdes);
	var strToObj = new Function("return" + strdes)();
	
	var strAdapter = fn_reply(strToObj, 'parse_ksgsl');
	var obj = new Function("return" + strAdapter)();
	var parse_array = new Array();
	if (strAdapter.indexOf('code') < 0 || strAdapter.indexOf('data') < 0 || obj.code == undefined || obj.code == "-1" || obj.data == undefined) 
	{
		return parse_array;
	}
	parse_array[0] = obj.data.zqdm;
	parse_array[1] = obj.data.valvol;
	parse_array[2] = obj.data.push_reply;
	parse_array[3] = strToObj.local.gdzh; //股东账户
	parse_array[4] = strToObj.reply.ret_msg;
	return parse_array;
}

function parse_qsbksgsl(qs_id, str, cur_user) 
{
	var strdes = fun_str_replace(str);
	write_html_log('parse_qsbksgsl' + strdes);
	var strToObj = new Function("return" + strdes)();
	
	var strAdapter = fn_reply(strToObj, 'parse_qsbksgsl');
	var obj = new Function("return" + strAdapter)();
	var parse_array = new Array();
	if (strAdapter.indexOf('code') < 0 || strAdapter.indexOf('data') < 0 || obj.code == undefined || obj.code == "-1" || obj.data == undefined) 
	{
		return parse_array;
	}
	parse_array[0] = obj.data.zqdm;
	parse_array[1] = parseInt(obj.data.valvol, 10).toString();  //消除可申购数量的小数点
	parse_array[2] = obj.data.push_reply;
	return parse_array;
}

/*
*已申购数量数组相应索引下标对应值的含义：
*证券代码： WT_ZQDM(2102)
*已申购数量： WT_GP_WTSL(2126)

*参数说明:
*qs_id  		券商id
*str     		需要解析的可申购新股信息字符串
*cur_user  		当前用户登录信息(客户端再调用页面的入口函数中，会附带此信息)

*函数功能:
*解析已申购数量
*/
function parse_ywtsl(qs_id, str, cur_user) 
{
	var strdes = fun_str_replace(str);
	write_html_log('parse_ywtsl' + strdes);
	var strToObj = new Function("return" + strdes)();
	var strAdapter = fn_reply(strToObj, 'parse_ywtsl');
	var obj = new Function("return" + strAdapter)();
	var parse_array = new Array();
	var strObj = window.JSON.stringify(obj);
	var qsid = parseInt(qs_id);
	if (strAdapter.indexOf('code') < 0 || strAdapter.indexOf('data') < 0 || obj.code == undefined || obj.code == "-1" || obj.data == undefined || obj.data.table == undefined) 
	{
		return parse_array;
	}
	var k = 0; // 过滤废单， 重新划分下标
	for (var i = 0; i < obj.data.table.length; i++) 
	{	
		//查询qsid是否在需要特殊处理券商的表中，配置表见request.js , 以及判断是不是废单  20171207 NiWeiGuo
		if(g_qsid_cxwt_special[qsid] == 'qlwt' && obj.data.table[i]['2105'] != undefined)	
		{
			var exInfo = obj.data.table[i]['2105'];
			exInfo = exInfo.toString();
			if(exInfo.indexOf("废") == -1)	// indexof = -1 说明不是废单
			{
				parse_array[k] = new Array();
				parse_array[k][0] = obj.data.table[i][WT_ZQDM];
				parse_array[k][1] = parseInt(obj.data.table[i][WT_GP_WTSL], 10);	
				k++;
			}
			continue;
		}
		parse_array[i] = new Array();
		parse_array[i][0] = obj.data.table[i][WT_ZQDM];
		parse_array[i][1] = parseInt(obj.data.table[i][WT_GP_WTSL], 10);
	}
	return parse_array;
}

/*
*中签明细数组相应索引下标对应值的含义：
*证券代码：WT_ZQDM(2102)
*证券名称：WT_ZQMC(2103)
*中签数量：WT_ZQSL(2199)

*参数说明:
*qs_id  		券商id
*str     		需要解析的可申购新股信息字符串
*cur_user  		当前用户登录信息(客户端再调用页面的入口函数中，会附带此信息)

*函数功能:
*解析中签明细
*/
function parse_zqmx(qs_id, str, cur_user) 
{
	var strdes = fun_str_replace(str);
	write_html_log('parse_zqmx' + strdes);
	var strToObj = new Function("return" + strdes)();
	var strAdapter = fn_reply(strToObj, 'parse_zqmx');
	var obj = new Function("return" + strAdapter)();
	var parse_array = new Array();
	var strObj = window.JSON.stringify(obj);
	if (strAdapter.indexOf('code') < 0 || strAdapter.indexOf('data') < 0 || obj.code == undefined || obj.code == "-1" || obj.data == undefined || obj.data.table == undefined) 
	{
		return parse_array;
	}
	for (var i = 0; i < obj.data.table.length; i++) 
	{
		parse_array[i] = new Array();
		parse_array[i][0] = obj.data.table[i][WT_ZQDM];
		parse_array[i][1] = obj.data.table[i][WT_ZQMC];
		parse_array[i][2] = obj.data.table[i][WT_ZQSL];
		//parse_array[i][3] = obj.data.table[i][WT_ZQRQ];
	}

	return parse_array;
}

/*
*web配号数组相应索引下标对应值的含义：
*证券代码：  WT_ZQDM(2102)
*起始配号： WT_CJ_PH(2163) //没2163字段就取 WT_GP_CJBH(2130)
*成交笔数： WT_GP_SJSL(2164) //没2164字段就取 WT_GP_CJSL(2128), 没有2128取 WT_CJ_CJBS(2157)

*参数说明:
*qs_id  		券商id
*str     		需要解析的可申购新股信息字符串
*cur_user  		当前用户登录信息(客户端再调用页面的入口函数中，会附带此信息)

*函数功能:
*解析web配号
*/
function parse_webxgph(qs_id, str, cur_user)
 {
	var strdes = fun_str_replace(str);
	write_html_log('parse_webxgph' + strdes);
	var strToObj = new Function("return" + strdes)();
	var strAdapter = fn_reply(strToObj, 'parse_webxgph');
	var parse_array = new Array();
	var temp_str = "\"webph\":\"";
	var nposb = strAdapter.indexOf(temp_str);
	var npose = strAdapter.indexOf("\"}}");	
	var is_save = (nposb > 0) && (npose > 0) && (npose > nposb);
	if(!is_save)
	{
		return parse_array;
	}
	
	var webph = strAdapter.substr(nposb + temp_str.length,npose - nposb - temp_str.length);
	write_html_log('parse_webxgph' + webph);
	var objjson = new Function("return" + webph)();	
	for (var i = 0; i < objjson.length; i++)
	{
		parse_array[i] = new Array();
		parse_array[i][0] = objjson[i]['STOCKCODE']; 	// 证券代码
		parse_array[i][1] = objjson[i]['STOCKNAME']; 	// 证券名称
		parse_array[i][2] = objjson[i]['SGCODE']; 		// 申购代码
		parse_array[i][3] = objjson[i]['FXJG'];			// 申购价格
		parse_array[i][4] = objjson[i]['SGDATE']; 		// 申购日期
		parse_array[i][5] = objjson[i]['ZQH']; 			// 中签后几位
		parse_array[i][6] = objjson[i]['WSZQJGGGR']; 	// 缴款日期
	} //for
	
	return parse_array;
}

/*
*用户相关配号数组相应索引下标对应值的含义：
*证券代码：  WT_ZQDM(2102)
*起始配号： WT_CJ_PH(2163) //没2163字段就取 WT_GP_CJBH(2130)
*成交笔数： WT_GP_SJSL(2164) //没2164字段就取 WT_GP_CJSL(2128), 没有2128取 WT_CJ_CJBS(2157)

*参数说明:
*qs_id  		券商id
*str     		需要解析的可申购新股信息字符串
*cur_user  		当前用户登录信息(客户端再调用页面的入口函数中，会附带此信息)

*函数功能:
*解析用户相关配号
*/
function parse_xgph(qs_id, str, cur_user) 
{
	
	var strdes = fun_str_replace(str);
	write_html_log('parse_xgph' + strdes);
	var strToObj = new Function("return" + strdes)();
	var strAdapter = fn_reply(strToObj, 'parse_xgph');
	var obj = new Function("return" + strAdapter)();
	var parse_array = new Array();
	if (strAdapter.indexOf('code') < 0 || strAdapter.indexOf('data') < 0 || obj.code == undefined || obj.code == "-1" || obj.data == undefined || obj.data.table == undefined)
	{
		return parse_array;
	}
	for (var i = 0; i < obj.data.table.length; i++) 
	{
		parse_array[i] = new Array();
		parse_array[i][0] = obj.data.table[i][WT_ZQDM];
		parse_array[i][1] = obj.data.table[i][WT_CJ_PH];
		parse_array[i][2] = obj.data.table[i][WT_GP_SJSL];
		parse_array[i][3] = obj.data.table[i][WT_JYS];			// 市场
		//减少不必要的判断条件，举例 WT_GP_CJSL正确值 WT_GP_SJSL WT_CJ_CJBS 不正确值，不能对parse_array[i][2]判断0处理
		if (parse_array[i][1] == undefined )
		{
			parse_array[i][1] = obj.data.table[i][WT_GP_CJBH];
		}

		if (parse_array[i][2] == undefined )
		{
			parse_array[i][2] = obj.data.table[i][WT_GP_CJSL];
		}

		if (parse_array[i][2] == undefined )
		{
			parse_array[i][2] = obj.data.table[i][WT_CJ_CJBS];
		}
		
		if (parse_array[i][3] == undefined )
		{
			parse_array[i][3] = obj.data.table[i][WT_JYS_DH];
		}
		
		if (parse_array[i][3] == undefined )
		{
			parse_array[i][3] = obj.data.table[i][WT_JYS_YHXY];
		}
		
		if(parse_array[i][1] == undefined)
		{
			parse_array[i][1] = '';
			write_html_log(' parse_array[i][1] == undefined');
		}
		
		if(parse_array[i][2] == undefined)
		{
			parse_array[i][2] = '';
			write_html_log('parse_array[i][2] == undefined');
		}
		
		if (parse_array[i][2] != undefined)
		{
			//所有券商 成交笔数改为整数20170413
				var numcnt = parseInt(parse_array[i][2]);
				parse_array[i][2] = numcnt.toString();
		
		}
	}
	return parse_array;
}

/*
*一键申购数组相应索引下标对应值的含义：
*状态值
*申购信息

*参数说明:
*qs_id  		券商id
*str     		需要解析的可申购新股信息字符串
*cur_user  		当前用户登录信息(客户端再调用页面的入口函数中，会附带此信息)

*函数功能:
*解析用户相关配号
*/
function parse_yijiansg(qs_id, str, cur_user) 
{
	var strdes = fun_str_replace(str);
	write_html_log('parse_yijiansg' + strdes);

	var strToObj = new Function("return" + strdes)();
	var strAdapter = fn_reply(strToObj, 'parse_yijiansg');
	var obj = new Function("return" + strAdapter)();
	var parse_array = new Array();
	if (strAdapter.indexOf('code') < 0 || obj.code == undefined) 
	{
		parse_array[0] = "-1";
	} else 
	{
		parse_array[0] = obj.code;
	}

	if (strAdapter.indexOf('msg') < 0 || obj.msg == undefined) 
	{
		parse_array[1] = "数据为空字符串请确认";
	} else
	{
		parse_array[1] = obj.msg;
	}
	return parse_array;
}