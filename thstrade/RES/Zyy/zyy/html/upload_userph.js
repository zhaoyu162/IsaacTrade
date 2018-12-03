document.write('<script language=javascript src="./hxcomm.js"></script>');
document.write('<script language=javascript src="./request.js"></script>');
document.write('<script language=javascript src="./sginfo.js"></script>');

/*
 *g_arrayInitialpeihaoValue[xg_num][0] 证券代码
 *g_arrayInitialpeihaoValue[xg_num][1] 起始配号
 *g_arrayInitialpeihaoValue[xg_num][2] 成交笔数
*/
var g_arrayInitialpeihaoValue = new Array();	//用户配号数据

var g_upload_once = 0;	//调用一次页面最多只上传两次，失败不再上传 
var g_userphdata = '';	//按上传格式存储用户配号数据
/*
* 函数功能说明：
* 1、查询当前用户相关配号的回调处理函数
* 2、将获取数据，存在g_arrayInitialpeihaoValue
* 
*------------------------------------------------------
*步骤说明:
*数据处理：	解析入口参数和数据，
*/
function fn_UserPeihao(getpeihaoValuestr) 
{	
	var strdes = fun_str_replace(getpeihaoValuestr);
	var strToObj = new Function("return" + strdes)();
	var log_str = window.JSON.stringify(strToObj);
	g_xginfolog_ext[7] = log_str;	//查用户配号返回数据，记录日志使用
	
	// 东海配号问题，有配号数量没有配号
	write_html_log('中签预查询fn_callback_UserPeihao() data:' + getpeihaoValuestr);
	var array_xgpeihaoValue = parse_xgph(g_qsid, getpeihaoValuestr, g_curUserInfo);	//用户配号初始数据
	for(var index = 0; index < array_xgpeihaoValue.length; index++)
	{
		g_arrayInitialpeihaoValue[index] = new Array();	//保存用户配号数据
		g_arrayInitialpeihaoValue[index][0] = array_xgpeihaoValue[index][0];	// 证券代码
		g_arrayInitialpeihaoValue[index][1] = array_xgpeihaoValue[index][1];	// 起始配号
		
		// 平安等证券，配号查询列"成交数量"取值错误问题 20170519 增加券商143,302
		// 信达证券(33) 中投证券(57) 平安证券(59) 安信证券(83) 国元证券(143) 申万宏源-宏源(302) 华融证券(347)
		if(g_qsid == '33' || g_qsid == '57' || g_qsid == '59' || g_qsid == '83' || g_qsid == '143' || g_qsid == '302' || g_qsid == '347')
		{
			var sc = (array_xgpeihaoValue[index][0]).toString().charAt(0);			// 股票代码的第一位数字
			
			if(parseInt(sc) == 3 || parseInt(sc) == 0)			// 3,0开头的是深圳市场
			{
				array_xgpeihaoValue[index][2] = array_xgpeihaoValue[index][2] / 500; 
				array_xgpeihaoValue[index][2] = array_xgpeihaoValue[index][2].toString();
			}
			else			// 如果是上海市场
			{
				array_xgpeihaoValue[index][2] = array_xgpeihaoValue[index][2] / 1000; 
				array_xgpeihaoValue[index][2] = array_xgpeihaoValue[index][2].toString();
			}
		}
		g_arrayInitialpeihaoValue[index][2] = array_xgpeihaoValue[index][2];	// 配号数量
	}	
	write_html_log('fn_callback_UserPeihao() 起始配号解析以后的起始配号数字长度：' + g_arrayInitialpeihaoValue.length );
	
	/*
	格式：配号代码1|起始配号|配号数量||配号代码2|起始配号|配号数量||配号代码3|。。依次类推
    例子：300396|6002978|5||300397|600029855|3
	*/
	var qsph = '';
	var sign_index = 0;
	var tableArray = [];
	var qsphFlag = false; 
	var cjslFlag = false;
	var qsid = parseInt(g_qsid); 
	//组成json串格式
	for(var i = 0; i < g_arrayInitialpeihaoValue.length; i++)
	{
		qsph = g_arrayInitialpeihaoValue[i][1];
		sign_index = qsph.indexOf(':');		//起始配号由':'分隔符分隔		
		g_arrayInitialpeihaoValue[i][1] = qsph.substring(sign_index + 1);
		// 起始配号不为空，起始配号不为0，可转化为整数 若为undefined sginfo.js中处理已转为空字符串
		if(parseInt(g_arrayInitialpeihaoValue[i][1]) != '' && g_arrayInitialpeihaoValue[i][1] != '0' && !isNaN(parseInt(g_arrayInitialpeihaoValue[i][1])))
		{
			qsphFlag = true;
		}
		//成交数量不为0，可转化为整数,若为空字符串或undefined sginfo.js中处理已转为NaN 
		if(parseInt(g_arrayInitialpeihaoValue[i][2]) != '0' && !isNaN(parseInt(g_arrayInitialpeihaoValue[i][2])))
		{
			cjslFlag = true;    
		}      
		if(qsphFlag && cjslFlag)
		{
			if(qsid == 131)//中金证券 |费用划转
			{
				sign_index = qsph.indexOf('|');
				if(sign_index != -1) //找到'|'
				{
					g_arrayInitialpeihaoValue[i][1] = qsph.substring(0,sign_index); 
				}
			}
            
			tableArray.push({
							"zqdm":g_arrayInitialpeihaoValue[i][0],
							"cj_ph":g_arrayInitialpeihaoValue[i][1],
							"gp_cjsl":g_arrayInitialpeihaoValue[i][2]
							});
		}
	}
	g_xginfolog[0] = "DT_YCX_XGPH";
	//无用户配号
	if(tableArray.length == 0) //包括有配号记录但配号数量为0情况
	{
		g_xginfolog[2] = '-1';
		g_xginfolog[3] = '未查询到用户配号';
		//只有用户配号数量为0但仍有配号记录才记录查用户配号请求数据,返回数据
		if(g_arrayInitialpeihaoValue.length == 0) 
		{
			g_xginfolog[4] = g_userphdate;	//记录查用户配号日期
		}	
		else
		{
			g_xginfolog[3] = '用户配号异常';
			g_xginfolog[4] = g_xginfolog_ext[6] + '||' + g_xginfolog_ext[7];	
		}
		fn_requestlog(g_xginfolog);
		fnSetConfigData('XGSG',g_curUserInfo,GetDateStr(0));//设置key，当天下次不再查询	
		return;
	}
	else
	{
		if(tableArray.length < g_arrayInitialpeihaoValue.length)
		{
			g_xginfolog[2] = '-1';
			g_xginfolog[3] = '异常配号上传';
			g_xginfolog[4] = g_xginfolog_ext[6] + '||' + g_xginfolog_ext[7];
			fn_requestlog(g_xginfolog);
		}
		g_userphdata = window.JSON.stringify(tableArray);
		g_upload_once++;	//上传第一次 g_upload_once = 1;
		g_callbackName = 'fn_callback_upload_userphdata';
		fn_uploadUserph(g_callbackName,g_userphdata);	//将用户的起始配号上传
	}
}

//err_code = 0 上传成功 其他上传失败
//上传用户配号的回调处理函数
function fn_upload_userphdata(upload_userph_list)
{
	write_html_log('fn_callback_userphdata()' + upload_userph_list);
	var strdes = fun_str_replace(upload_userph_list);
	var strToObj = new Function("return" + strdes)();
	g_xginfolog[0] = "DT_YCX_XGPH";
	g_xginfolog[2] = strToObj.reply.err_code;
	g_xginfolog[3] = strToObj.reply.err_msg;
	if(parseInt(strToObj.reply.err_code))
	{
		//上传用户配号失败记录用户配号,请求数据,返回数据
		g_xginfolog[4] = g_userphdata + '||' +  g_xginfolog_ext[6] + '||' + g_xginfolog_ext[7];
		fn_requestlog(g_xginfolog);
	}
	if(g_upload_once != 2 && parseInt(strToObj.reply.err_code))	//第一次上传失败，上传第二次
	{
		write_html_log('fn_callback_upload_userphdata err_code is'+ strToObj.reply.err_code +'fn_callback_upload_userphdata err_msg is '+ strToObj.reply.err_msg);
		g_upload_once++;	//上传第二次 g_upload_once = 2;
		g_callbackName = 'fn_callback_upload_userphdata';
		fn_uploadUserph(g_callbackName,g_userphdata);
		return; //防止第二次才上传成功 重复调用新股申购页面
	}
	if(!parseInt(strToObj.reply.err_code))	//只有上传成功  才设置key
	{	
		g_xginfolog[4] = g_userphdate + '||' + g_userphdata;
		fn_requestlog(g_xginfolog);
		fnSetConfigData('XGSG',g_curUserInfo,GetDateStr(0));	//设置key 下面走新股申购逻辑	
	}
}
