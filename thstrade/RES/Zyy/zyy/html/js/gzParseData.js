/*************************************************************************
 *	creator 	: @niuyaozong
 *	Function	: 国债逆回购页面数据解析,客户端返回数据均在此文件解析
 *	Date		：2017-12-12
 *************************************************************************/


/*******************************************************************
 * creator		: @niuyaozong
 * function		: 解析从自运营服务器查询的行情数据
 * Date			: 2017-12-12
 * parameter	: strParam : json字符串 格式:'{"local" : *, "reply" : *}' 
 * 				  local.reqStart : 请求开始时间戳
 * 				  reply.ret_code : 请求返回码 
 * 				  reply.ret_msg  : 请求返回信息 
 * 				  reply.data     : 请求返回国债行情数据 zqdm（证券代码），zxjg（最新价），mrjg1~mrjg5（买一~买五）
 * return		: 匿名json对象 obj : 日志数据
 * 				  jsonParam['retcode']   : 返回码 0成功，其他失败
 * 				  jsonParam['retmsg']    : 返回信息
 * 				  jsonParam['reqStart']  : 请求开始时间戳
 * 				  jsonParam['strParam']  : 请求原始返回数据
 * 				  array : 国债行情数据，二维数组，[i][0]（证券代码），[i][1]（最新价），[i][2]~[i][6]（买一~买五）
 * *****************************************************************/
function GZNHG_ParseHqDataFromZyy(strParam) 
{
	var strToObj = new Function("return " + strParam)();
	
	var retcode = strToObj.reply.ret_code;
	var retmsg = strToObj.reply.ret_msg;
	var jsonParam = {};
	var parse_array = new Array();
	
	jsonParam['retcode'] = retcode;
	jsonParam['retmsg'] = retmsg;
	jsonParam['strParam'] = window.JSON.stringify(strToObj);
	jsonParam['reqStart'] = strToObj.local.reqStart;	//请求开始时间戳
	
	if(strToObj.reply.data && strToObj.reply.data.indexOf('zqdm') != -1)	//校验数据
	{
		var ret_str = strToObj.reply.data;
		var re = new RegExp("\\\\","g");
		ret_str = ret_str.replace(re,"");
		var ObjBody = "";
		ObjBody = new Function("return " + ret_str)();

		for(var i = 0; i < ObjBody.length; i++ )
		{
			parse_array[i] = new Array();

			parse_array[i][0] =  ObjBody[i]['zqdm'];
			parse_array[i][1] =  ObjBody[i]['zxjg'];
			parse_array[i][2] =  ObjBody[i]['mrjg1'];
			parse_array[i][3] =  ObjBody[i]['mrjg2'];
			parse_array[i][4] =  ObjBody[i]['mrjg3'];
			parse_array[i][5] =  ObjBody[i]['mrjg4'];
			parse_array[i][6] =  ObjBody[i]['mrjg5'];
		}
		
		if(retmsg == '')
		{
			jsonParam['retmsg'] = '从自运营获取行情数据成功';
		}
	}
	else if(retmsg == '')	//数据异常
	{
		jsonParam['retmsg'] = '从自运营获取行情数据异常';
	}

	return {
			'obj' : jsonParam, 
			'array': parse_array
			};
}

/*******************************************************************
 * creator		: @niuyaozong
 * function		: 解析行情客户端推送行情数据
 * Date			: 2017-12-12
 * parameter	: strParam  : json字符串 格式:'{"zqdm" : *, "zxjg" : *, ...}' 
 * 				  zqdm      : 证券代码
 * 				  zxjg      : 最新价 
 * 				  mrj1~mrj5 : 买一价~买五价 
 * return       : jsonData  : json对象，证券代码，买一价~买五价
 * 				  jsonParam['zqdm']    : 证券代码
 * 				  jsonParam['zxjg']    : 最新价
 * 				  jsonParam['mrj1']~jsonParam['mrj5']  : 买一价~买五价
 * *****************************************************************/
function GZNHG_ParseHqDataFromHq(strParam)
{
	var jsonParam = window.JSON.parse(strParam);
	var jsonData = {};
	jsonData["zqdm"] = jsonParam["zqdm"];
	jsonData["zxjg"] = jsonParam["zxjg"];
	jsonData["mrj1"] = jsonParam["mrj1"];
	jsonData["mrj2"] = jsonParam["mrj2"];
	jsonData["mrj3"] = jsonParam["mrj3"];
	jsonData["mrj4"] = jsonParam["mrj4"];
	jsonData["mrj5"] = jsonParam["mrj5"];
	
	return jsonData;
}
/*******************************************************************
 * creator		: @牛耀宗
 * function		: 解析委托返回数据
 * Date			: 2017-12-12
 * parameter	: strParam : json字符串 格式:'{"local" : *, "reply" : *}' 
 * 				  local.reqStart : 请求开始时间戳
 * 				  local.htbh     : 合同编号
 * 				  local.gdzh     : 股东账号
 * 				  local.kyzj     : 可用资金
 * 				  local.wtData   : 委托数据（证券名称_证券代码_市场代码_委托价格_委托数量_委托金额）
 * 				  reply.ret_code : 请求返回状态码 
 * 				  reply.ret_msg  : 请求返回信息 
 * return		: jsonParam : json对象; 
 * 				  jsonParam['retcode']   : 返回码 0成功，其他失败
 * 				  jsonParam['retmsg']    : 返回信息
 * 				  jsonParam['reqStart']  : 请求开始时间戳
 * 				  jsonParam['strParam']  : 请求原始返回数据
 * 				  jsonParam['htbh']      : 合同编号
 * 				  jsonParam['gdzh']      : 股东账号
 * 				  jsonParam['wtData']    : 委托数据（证券名称_证券代码_市场代码_委托价格_委托数量_委托金额）
 * *****************************************************************/
function GZNHG_ParseWtData(strParam)
{
	var strToObj = new Function("return " + strParam)();
	
	var retcode = strToObj.reply.ret_code;
	var retmsg = strToObj.reply.ret_msg;
	var jsonParam = {};
	
	jsonParam['retcode'] = retcode;
	jsonParam['retmsg'] = retmsg;
	jsonParam['reqStart'] = strToObj.local.reqStart;
	jsonParam['gdzh'] = strToObj.local.gdzh;		//股东账号
	jsonParam['wtData'] = strToObj.local.wtData;	//委托数据
	jsonParam['strParam'] = window.JSON.stringify(strToObj);	//回调入参
	
	if(retcode == "0" && retmsg == '')	//retcode 表示委托成功
	{
		jsonParam['retmsg'] = '委托成功';
	}
	else if(retmsg == '')
	{
		jsonParam['retmsg'] = '委托数据异常';
	}
	
	jsonParam['htbh'] = strToObj.reply.htbh || '';	//合同编号
	
	return  jsonParam;
}
/*******************************************************************
 * creator		: @niuyaozong
 * function		: 解析从自运营服务器查回的国债信息
 * Date			: 2017-12-12
 * parameter	: strParam : json字符串 格式:'{"local" : *, "reply" : *}' 
 * 				  local.reqStart : 请求开始时间戳
 * 				  reply.ret_code : 请求返回状态码 
 * 				  reply.ret_msg  : 请求返回信息 
 * 				  reply.data     : 请求返回国债行情数据 STOCKCODE（股票代码），STOCKNAME（股票名称），SETNAME（显示名称），SETCODE（市场代码），sxfDays（手续费天数），zjzyDays（资金占用天数）
 * return		: 匿名json对象 obj : 日志数据; 
 * 				  jsonParam['retcode']   : 返回码 0成功，其他失败
 * 				  jsonParam['retmsg']    : 返回信息
 * 				  jsonParam['reqStart']  : 请求开始时间戳
 * 				  jsonParam['strParam']  : 请求原始返回数据
 * 				  array : 国债信息数据，二维数组，[i][0]（股票代码），[i][1]（股票名称），[i][2]（显示名称），[i][3]（市场代码）[i][4]（手续费天数），[i][5]（资金占用天数）
 * *****************************************************************/
function GZNHG_ParseGzInfoFromZyy(strParam)
{
	var strToObj = new Function("return " + strParam)();
	
	var retcode = strToObj.reply.ret_code;
	var retmsg = strToObj.reply.ret_msg;
	var jsonParam = {};
	var parse_array = new Array();
	
	jsonParam['retcode'] = retcode;
	jsonParam['retmsg'] = retmsg;
	jsonParam['reqStart'] = strToObj.local.reqStart;
	jsonParam['strParam'] = window.JSON.stringify(strToObj);
	
	if(strToObj.reply.data && strToObj.reply.data.indexOf('SETNAME') != -1 )	//未找到'SETNAME'
	{
		var ret_str = strToObj.reply.data;
		var re = new RegExp("\\\\","g");
		ret_str = ret_str.replace(re,"");
		var ObjBody = new Function("return " + ret_str)();
		
		for(var i = 0; i < ObjBody.length; i++ )
		{
			parse_array[i] = new Array();
			//股票代码,股票名称,显示名称,市场代码,手续费天数,资金占用天数
			parse_array[i][0] = ObjBody[i]['STOCKCODE'];
			parse_array[i][1] = ObjBody[i]['STOCKNAME'];
			parse_array[i][2] = ObjBody[i]['SETNAME'];
			parse_array[i][3] = ObjBody[i]['SETCODE'];
			parse_array[i][4] = ObjBody[i]['sxfDays'];
			parse_array[i][5] = ObjBody[i]['zjzyDays'];
			
			$('#' + g_gpxx[i]).text(ObjBody[i]['STOCKCODE'] + " " + ObjBody[i]['STOCKNAME']);
			$('#' + g_cjqx[i]).text(ObjBody[i]['SETNAME']);
		}
		
		if(retmsg == '')
		{
			jsonParam['retmsg'] = '获取国债信息成功';
		}
	}
	else if(retmsg == '')	//数据异常
	{
		jsonParam['retmsg'] = '获取国债信息异常';
	}

	return {
			'obj' : jsonParam, 
			'array': parse_array
			};
}
/*******************************************************************
 * creator		: @niuyaozong
 * function		: 解析查可用资金返回数据
 * Date			: 2017-12-12
 * parameter	: strParam : json字符串 格式:'{"local" : *, "reply" : *}' 
 * 				  local.reqStart : 请求开始时间戳
 * 				  reply.ret_code : 请求返回码 
 * 				  reply.ret_msg  : 请求返回信息 
 * 				  reply.availablemoney     : 请求返回可用资金 
 * return		: jsonParam : json对象，
 * 				  jsonParam['retcode']   : 返回码 0成功，其他失败
 * 				  jsonParam['retmsg']    : 返回信息
 * 				  jsonParam['reqStart']  : 请求开始时间戳
 * 				  jsonParam['kyzj']      : 可用资金 四舍五入保留两位有效小数
 * 				  jsonParam['strParam']  : 请求原始返回数据
 *****************************************************************/
function GZNHG_ParseZiJin(strParam)
{
	var strToObj = new Function("return " + strParam)();
	
	var retcode = strToObj.reply.ret_code;
	var retmsg = strToObj.reply.ret_msg;
	var strZijin = strToObj.reply.availablemoney || '';
	
	var jsonParam = {};
	jsonParam['retcode'] = retcode;
	jsonParam['retmsg'] = retmsg;
	jsonParam['reqStart'] = strToObj.local.reqStart;
	jsonParam['strParam'] = window.JSON.stringify(strToObj);
	
	if(strZijin)	//''为false
	{
		jsonParam['kyzj'] = parseFloat(strZijin).toFixed(2);
		
		if(retmsg == '')
		{
			jsonParam['retmsg'] = '获取可用资金成功';
		}
	}
	else if(retmsg == '')	//数据异常
	{
		jsonParam['retmsg'] = '获取可用资金异常';
	}

	return jsonParam;
}

