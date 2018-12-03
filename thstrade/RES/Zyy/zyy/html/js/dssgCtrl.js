var g_strUserkey = "";
var g_arrXgData = new Array();
var g_arrInfolog = new Array();	

// function:定时申购入口函数,调用定时申购的流程
// param:strUserInfo,用户的userkey
// param:arrXgInfo,已申购数量、可申购数量等新股信息
function DssgStart(strUserInfo, arrXgInfo)
{	
	write_html_log("**********dssg.js********DssgStart函数开始strUserInfo = " + strUserInfo + ";arrXgInfo = " + arrXgInfo);
	g_strUserkey = strUserInfo;
	g_arrXgData = arrXgInfo;

	InitSwitchCtrl();
	InitTimeCtrl();	
	write_html_log("**********dssg.js********DssgStart函数结束");	
}

// function:判断是否可申购
// param:arrXgInfo,新股信息
// rutrn true/false 
function IsXgSgPage(arrXgInfo)
{
	write_html_log("**********dssg.js********IsXgSgPage函数开始arrXgInfo = " + arrXgInfo);
	var bHasKsgsl = false;
	for(var nIndex = 0; nIndex < arrXgInfo.length; nIndex++)
	{
		var nXgDm = parseInt(arrXgInfo[nIndex][1]);
		var nXgKsgsl = parseInt(arrXgInfo[nIndex][2]);
		var nXgYsgsl = parseInt(arrXgInfo[nIndex][3]);
		if(nXgDm > 0 && nXgKsgsl - nXgYsgsl > 0)
		{
			bHasKsgsl = true;
		}
	}
	write_html_log("**********dssg.js********IsXgSgPage函数结束bHasKsgsl = " + bHasKsgsl);
	
	return bHasKsgsl;
}

// function:读取分析配置,来初始化开关控件的状态
function InitSwitchCtrl()
{
	write_html_log("**********dssg.js********InitSwitchCtrl函数开始");
	var strConfig = ReadDssgConfig();
	var arrDsConfig = ParseDssgConfig(strConfig);
	var nSwitchStatus = parseInt(arrDsConfig[0]);
	
	if (nSwitchStatus)
	{
		$(".switch").children("img.switch_test").attr("src", "images/switch_on.png");
		CBASRecord("定时申购");
	}
	else
	{
		$(".switch").children("img.switch_test").attr("src", "images/switch_off.png");
	}
	write_html_log("**********dssg.js********InitSwitchCtrl函数结束");
}

// function:读取分析配置,得到配置中的时间信息。初始化时间控件,判断开关状态若为true显示提示语
function InitTimeCtrl()
{
	write_html_log("**********dssg.js********InitTimeCtrl函数开始");
	var objTime = GetTimeInfo();
	var nSetHour = objTime["hour"];
	var nSetMin = objTime["min"];
	var nSwitchStatus = objTime["switch"];
	
	$("#hour").val(nSetHour);	
	if ($("#hour").val() == 9)
	{
		LoadMinOption(31, 59);
	}
	else
	{
		LoadMinOption(0, 59);
	}
	setTimeout(function()
	{
		$("#min").val(nSetMin);
	},0);
	if (nSwitchStatus)
	{
		SetPromptText(nSetHour, nSetMin);
	}	
	write_html_log("**********dssg.js********InitTimeCtrl函数结束");
}

// function:判断配置中开关状态若为true则使用配置中的时间,若为false则使用当前时间
// return 时间对象objRet
// objRet["switch"] 0或1
// objRet["hour"]	定时小时
// objRet["min"]	定时分钟
function GetTimeInfo()
{
	write_html_log("**********dssg.js********GetTimeInfo函数开始");
	var strConfig = ReadDssgConfig();
	var arrDsConfig = ParseDssgConfig(strConfig);	
	var objSetTime = {};
	var bHasCfg = (strConfig == "") ? false : true;
	var nSwitchStatus = parseInt(arrDsConfig[0]);
	if (bHasCfg)
	{
		objSetTime = AdjustCfgTime(parseInt(arrDsConfig[2]), parseInt(arrDsConfig[3]))
	}
	else
	{
		objSetTime = AdjustCurInitTime();
	}
	
	var objRet = objSetTime;
	objRet["switch"] = nSwitchStatus;
	write_html_log("**********dssg.js********GetTimeInfo函数结束objRet = " + objRet);
	
	return objRet;
}

// function:调整配置中的时间,若配置中的时间不合理则置为和理智
// param:nCfgHour,配置中的小时
// param:nCfgMin,配置中的分钟
// rutrn:时间对象
function AdjustCfgTime(nCfgHour, nCfgMin)
{
	write_html_log("**********dssg.js********AdjustCfgTime函数开始nCfgHour = " + nCfgHour + ";nCfgMin = " + nCfgMin);
	var objTime = {};
	objTime["hour"] = nCfgHour;
	objTime["min"] = nCfgMin;
		
	var nTime = nCfgHour * 100 + nCfgMin;
	if ( nTime < 930)
	{
		objTime["hour"] = 9;
		objTime["min"] = 31;
	}
	else if ( nTime >= 1500)
	{
		objTime["hour"] = 14;
		objTime["min"] = 59;
	}
	write_html_log("**********dssg.js********AdjustCfgTime函数结束objTime = " + objTime);
	
	return objTime;
}

// function:调整当前时间,
// 1.当前时间在9:15-14:45之间的,控件中的时间为本地时间+15分钟
// 2.当前时间在9:15之前,时间置为9:30
// 3.当前时间在14:45之后,时间置为14:59
// return 时间对象
function AdjustCurInitTime()
{
	write_html_log("**********dssg.js********AdjustCurInitTime函数开始");
	var strCurDate = new Date();
	var nCurHour = strCurDate.getHours(); 	
	var nCurMin = strCurDate.getMinutes();
	var nSetHour = 0;
	var nSetMin = 0;
	var objTime = {};
	
	if ((nCurHour * 100 + nCurMin) >= 915 && (nCurHour * 100 + nCurMin) < 1445)
	{
		nSetMin = nCurMin + 15;
		if (nSetMin >= 60)
		{
			nSetMin = nSetMin - 60;
			nSetHour = nCurHour + 1;
		}
		else
		{
			nSetHour = nCurHour;
		}
	}
	else if ((nCurHour * 100+nCurMin) >= 1445)
	{
		nSetHour = 14;
		nSetMin = 59;
	}
	else if ((nCurHour * 100+nCurMin) < 915)
	{
		nSetHour = 9;
		nSetMin = 31;
	}
	
	objTime["hour"] = nSetHour;
	objTime["min"] = nSetMin;
	
	write_html_log("**********dssg.js********AdjustCurInitTime函数结束objTime = " + objTime);
	
	return objTime;
}

// function:加载分钟select控件选项
// param:nBeginNum,开始分钟数
// param:nEndNum,结束分钟数
function LoadMinOption(nBeginNum, nEndNum)
{
	write_html_log("**********dssg.js********LoadMinOption函数开始nBeginNum = " + nBeginNum + ";nEndNum = " + nEndNum);
	$("#min").empty();
	
	for (var i=nBeginNum; i<=nEndNum; i++)
	{
		var $item = '<option value=' + i + '>' + i + '</option>'
		$("#min").append($item);
	}
	write_html_log("**********dssg.js********LoadMinOption函数结束");
}

// function:创建定时申购页面入口函数,将新股信息和用户userkey记录到strParam中,并调用create_js函数创建定时申购页面
function CreateDssgPage()
{	
	write_html_log("**********dssg.js********CreateDssgPage函数开始");
	var strUrl = "RES\\Zyy\\zyy\\html\\dssg.html";
	var strIniPath = fnFunction("get_modulepath", "") + "RES\\Zyy\\zyy.ini";
	WriteConfig("dssg_cfg", "url", strUrl, strIniPath);
	var strXgInfoList = "[";
	for (var i = 0; i < g_arrXgData.length; i++)
	{
		var objXg = {};
		objXg["zqmc"] = g_arrXgData[i][0];
		objXg["sgdm"] = g_arrXgData[i][1];
		objXg["ksgsl"] = g_arrXgData[i][2];
		objXg["sgsl"] = g_arrXgData[i][3];
		objXg["scdm"] = g_arrXgData[i][4];
		objXg["sgjg"] = g_arrXgData[i][5];
		var strXg = $.toJSON(objXg);
		if (i < g_arrXgData.length-1)
		{
			strXgInfoList = strXgInfoList + strXg + ",";
		}
		else if (i == g_arrXgData.length-1)
		{
			strXgInfoList = strXgInfoList + strXg;
		}
	}
	strXgInfoList = strXgInfoList + "]";

	var objCreateData = {
		"type": "dssg",
		"userkey": g_strUserkey,
		"url": strUrl,
		"extra_data": strXgInfoList
	};	
	var strParam = $.toJSON(objCreateData);
	write_html_log("**********dssg.js********CreateDssgPage函数结束,return fnFunction('create_js', " + strParam + ")");
	
	return fnFunction("create_js", strParam);
}

// function:销毁页面
function DestroyDssgPage()
{
	write_html_log("**********dssg.js********DestroyDssgPage函数开始");
	var objDestroyData = {
		"type": "dssg",
		"userkey":g_strUserkey
	};
	var strParam = $.toJSON(objDestroyData);
	write_html_log("**********dssg.js********DestroyDssgPage函数结束,return fnFunction('destroy_js', " + strParam + ")");
	return fnFunction("destroy_js", strParam);
}

// function:监听hour的select的change事件
function OnHourCtlChanged()
{	
	write_html_log("**********dssg.js********OnHourCtlChanged函数开始");
	var nSetHour = $("#hour").val();
	var nSetMin = $("#min").val();
	var nSwitchStatus = GetSwitchStatus();
	
	if (nSetHour == 9)
	{
		LoadMinOption(31,59);
	}
	else
	{
		LoadMinOption(0,59);
	}
	
	nSetMin = ResetMinCtrl(nSetHour, nSetMin);	

	ResetDssgPage();
	if (nSwitchStatus)
	{
		SetPromptText(nSetHour, nSetMin);
	}
	write_html_log("**********dssg.js********OnHourCtlChanged函数结束");
}

// function:重新设置分钟控件
// param:nHour,之前控件中小时
// param:nMinute,之前控件中分钟
// return 分钟控件重载后返回值
function ResetMinCtrl(nHour, nMinute)
{
	write_html_log("**********dssg.js********ResetMinCtrl函数开始nHour = " + nHour + ",nMinute = " + nMinute);
	var nSetMin = nMinute;
	if (nHour == 9 && nMinute < 30)
	{
		nSetMin = 31;
	}
	$("#min").val(nSetMin);
	write_html_log("**********dssg.js********ResetMinCtrl函数结束nSetMin = " + nSetMin);
	
	return nSetMin;
}

// function:监听min的select的change事件
function OnMinCtlChanged()
{
	write_html_log("**********dssg.js********OnMinCtlChanged函数开始");
	var nSetHour = $("#hour").val();
	var nSetMin = $("#min").val();
	var nSwitchStatus = GetSwitchStatus();

	ResetDssgPage();
	if (nSwitchStatus)
	{
		SetPromptText(nSetHour, nSetMin);
	}
	write_html_log("**********dssg.js********OnMinCtlChanged函数结束");
}

function OnSwitchClickMain(strPageinfo)
{
	var nSwitchStatus = GetSwitchStatus() ; //获取开关控件状态 开1 关0 
	if ( strPageinfo == 'ysg')   //已申购界面
	{
		if (nSwitchStatus == 0)  //开关 开 的情况下(点击之后 由 0 ——>1  读到的是0  实际是要变成1了)
		{ 
			$("#alert_text").show();
			$("#result_text").hide();
		}
		else if($("#alert_text").is(":visible"))  //开关关闭
		{
			$("#alert_text").hide();
			$("#result_text").show();
			SetResultPrompt(g_curUserInfo);
		}
	}
	OnSwitchClick(strPageinfo);
}
// function:checkbox点击事件
function OnSwitchClick(strPageinfo)
{	
	write_html_log("**********dssg.js********OnSwitchClick函数开始");
	
	WriteDssgConfig(1 - GetSwitchStatus());
	var nSetHour = $("#hour").val();
	var nSetMin = $("#min").val();
	var nSwitchStatus = GetSwitchStatus();
	if (nSwitchStatus == 1)
	{	
		$(".switch").children("img.switch_test").attr('src', "images/switch_off.png");
		if (strPageinfo != 'ysg')    //在已申购页面不重写
		{
			$(".under_foot").children("p.cr").html("");
		}
		AdvancePrompt();
		
		UploadLog('CLOSE_SWITCHCONTROL' ,'0' , '关闭定时申购','', 'DSSG');
		InitLogData();
		
		DestroyDssgPage();
	}
	else if (nSwitchStatus == 0)
	{
		CBASRecord("定时申购");
		$(".switch").children("img.switch_test").attr('src', "images/switch_on.png");
		$("#caption").remove();
		//$("#caption").remove();
		SetPromptText(nSetHour, nSetMin);
		
		var strUserSetTime = RecordSetLog();  //读取用户设置的时间
		g_cbasdata = 'f_dssg=' + strUserSetTime;//f_dssg=1,用户设置时间
		UploadLog('SET_SWITCHCONTROL', '0', '开启定时申购', g_cbasdata, 'DSSG');
		InitLogData();
		
		CreateDssgPage();
	}
	
	OpenPrompt();
	write_html_log("**********dssg.js********OnSwitchClick函数结束");
}

// function:分析定时申购数据
// param:从配置文件中读取到的配置
// return arrDsConfig
// arrDsConfig[0] 开关状态 0或1
// arrDsConfig[1] 定时时间 例如945
// arrDsConfig[2] 定时小时 例如9
// arrDsConfig[3] 定时分钟 例如45
function ParseDssgConfig(strConfig)
{
	write_html_log("**********dssg.js********ParseDssgConfig函数开始strConfig = " + strConfig);
	var arrDsConfig = new Array();
	arrDsConfig = strConfig.split(',');	
	var nSwitchStatus = parseInt(arrDsConfig[0]);
	
	if (arrDsConfig.length == 2)
	{
		var nTime = parseInt(arrDsConfig[1]);
		if (nTime < 930)
		{
			nTime = 931;
		}
		else if (nTime >= 1500)
		{
			nTime = 1459;
		}		
		var nDsHour = parseInt(nTime / 100);
		var nDsMin = nTime % 100;
		arrDsConfig[2] = nDsHour;
		arrDsConfig[3] = nDsMin;
	}
	
	write_html_log("**********dssg.js********ParseDssgConfig函数结束arrDsConfig = " + arrDsConfig);
		
	return arrDsConfig;
}

// function:写定时申购配置
// param:nSwitchStatus,开关状态
function WriteDssgConfig(nSwitchStatus)
{	
	write_html_log("**********dssg.js********WriteDssgConfig函数开始");
	var nSetHour = $("#hour").val();
	var nSetMin = $("#min").val();
	var nTime = 100 * nSetHour + parseInt(nSetMin);
	var strValue = nSwitchStatus + ',' + nTime; 
	var strPath = fnFunction("get_modulepath", "") + "RES\\Zyy\\zyy.ini";
	WriteConfig("dssg_cfg", g_strUserkey, strValue, strPath);
	write_html_log("**********dssg.js********WriteDssgConfig函数结束");
}

// function:读取定时申购配置
// return strCfg
// strCfg 例如"1,1010"
function ReadDssgConfig()
{
	write_html_log("**********dssg.js********ReadDssgConfig函数开始");
	var strPath = fnFunction("get_modulepath", "") + "RES\\Zyy\\zyy.ini";
	var strCfg = ReadConfig("dssg_cfg", g_strUserkey, "", strPath);
	write_html_log("**********dssg.js********ReadDssgConfig函数结束strCfg = " + strCfg);

	return strCfg;
}

// function:得到开关控件当前开关状态
// return 0或1
function GetSwitchStatus()
{
	write_html_log("**********dssg.js********GetSwitchStatus函数开始");
	var strImage = $(".switch").children("img.switch_test").attr('src');
	write_html_log("**********dssg.js********GetSwitchStatus函数结束");
	return ((strImage == "images/switch_on.png") ? 1 : 0);
}

// function:设置提示语
// param:定时设置小时
// param:定时设置分钟
function SetPromptText(nSetHour, nSetMin)
{
	write_html_log("**********dssg.js********SetPromptText函数开始");
	var strNotice = '<p id="alert_text" class="cr">您已设置定时申购，客户端将在' + nSetHour + "：" + ((nSetMin>=10) ? nSetMin : ('0' + nSetMin)) + "为您申购新股</p>";
	$("#alert_text").children("p.cr").html(strNotice);
	write_html_log("**********dssg.js********SetPromptText函数结束");
}

// function:重置定时申购页面
function ResetDssgPage()
{
	write_html_log("**********dssg.js********ResetDssgPage函数开始");
	var nSwitchStatus = GetSwitchStatus();
	WriteDssgConfig(GetSwitchStatus());
	if (nSwitchStatus == 1)
	{
		var strUserSetTime = RecordSetLog();  //读取用户设置的时间
		g_cbasdata = 'f_dssg=' + strUserSetTime; // f_dssg =用户设置的时间
		UploadLog("MODIFY_HMCONTROL", '0', "修改定时时间", g_cbasdata, 'DSSG');
		InitLogData();
		
		CreateDssgPage();
	}
	write_html_log("**********dssg.js********ResetDssgPage函数结束");
}

// function:弹出"注意"提示框
function OpenPrompt()
{
	write_html_log("**********dssg.js********ResetDssgPage函数开始");
	$("div[rel*=leanModal]").leanModal(); 
	write_html_log("**********dssg.js********ResetDssgPage函数结束");
}

// function:版本号控制
function DssgVersionControl()
{
	if (!IsDssgVersion())
	{
		return ;
	}
	
	$('.ver_control').css({
		"display" : "block"
	});
	write_html_log("**********dssg.js********DssgVersionControl函数开始");
}

// function:读取配置,设置申购结束后的提示语
// param:用户的userkey
function SetResultPrompt(strUserInfo)
{
	write_html_log('**********dssg.js********SetResultPrompt函数开始');
	var strCurDssgStatus = ReadCurDssgStatus(strUserInfo);
	if (strCurDssgStatus == "")
	{
		return ;
	}
	var arrCurDssgStatus = ParseCurDssgStatus(strCurDssgStatus);
	var strCurDate = new Date();
	var nCurYear = strCurDate.getFullYear();
	var nCurMonth = strCurDate.getMonth() + 1;
	var nCurDay = strCurDate.getDate();
	if (arrCurDssgStatus[0] == nCurYear && arrCurDssgStatus[1] == nCurMonth && arrCurDssgStatus[2] == nCurDay)
	{
		var nTime = parseInt(arrCurDssgStatus[3]);
		var nHour = parseInt(nTime/100);
		var nMin = parseInt(nTime%100);	
		write_html_log('**********' + strNotice);
		var strNotice = '<p id="result_text" class="cr">客户端已在' + nHour + ":" + ((nMin>=10) ? nMin : ('0' + nMin)) + "为您申购新股</p>";
		$("#result_text").children("p.cr").html(strNotice);
	}
	write_html_log('**********dssg.js********SetResultPrompt函数结束');
}

// function:得到当前该账户是否在本机上已经申购过
// param:用户的userkey
// return 配置中所记录的数据 例如"2017,5,5,1111"
function ReadCurDssgStatus(strUserInfo)
{
	write_html_log('**********dssg.js********ReadCurDssgStatus函数开始');
	var strPath = fnFunction("get_modulepath", "") + "RES\\Zyy\\zyy.ini";
	var strKey = strUserInfo + ",last_sg";
	write_html_log('**********dssg.js********strKey = ' + strKey);
	write_html_log('**********dssg.js********ReadCurDssgStatus函数开始');
	return ReadConfig("dssg_cfg", strKey, "",strPath);
}

// function:分析ReadCurDssgStatus()函数中读取到的配置
// param:strCurDssgStatus 例如"2017,5,5,1111"
// return arrCurDssgStatus
// arrCurDssgStatus[0] 年
// arrCurDssgStatus[1] 月
// arrCurDssgStatus[2] 日
// arrCurDssgStatus[3] 时间
function ParseCurDssgStatus(strCurDssgStatus)
{
	write_html_log('**********dssg.js********ParseCurDssgStatus函数strCurDssgStatus = ' + strCurDssgStatus);
	return strCurDssgStatus.split(',');
}

// function:鼠标移动到'x'时背景色变为红色
function OnAddBackground()
{
	$(".close_div").css({
		"width": "22px",
		"height": "22px",
		"background": "red",
		"position": "absolute",
		"left": "311px"
	});
}

// function:鼠标移出'x'时背景色恢复
function OnDefaultBackground()
{
	$(".close_div").css({
		"width": "22px",
		"height": "22px",
		"background": "#4084d5",
		"position": "absolute",
		"left": "311px"
	});
}

// function:解决"9:30..."提示语与定时申购提示语冲突
function AdvancePrompt()
{
	write_html_log("**********dssg.js********AdvancePrompt函数开始");
	$("#caption").detach();
	var curDate = new Date();
	var curHours = curDate.getHours(); 		
	var curMinutes = curDate.getMinutes();	
	
	if(curHours == 9 && curMinutes < 30)
	{
		$(".footer").append('<div id = "caption" color = "red"><center><font color = "red">为了保证您申购成功，请尽量在9：30分以后进行申购</font></center></div>');
	}
	write_html_log("**********dssg.js********AdvancePrompt函数结束");
}

// function:埋点函数
function CBASRecord(strText)
{
	var objCBAS = {};
	objCBAS["evt_type"] = "1";
	objCBAS["format"] = "6";
	objCBAS["str1"] = "MAINMENU";
	objCBAS["str2"] = "一键申购";
	objCBAS["str3"] = "3";
	objCBAS["str4"] = strText;
	var strCBAS = window.JSON.stringify(objCBAS);
	fnFunction("set_cbas", strCBAS);
}

// 判断版本号
function IsDssgVersion()
{
	write_html_log("**********dssgCtrl.js********IsDssgVersion函数");
	var strVersion = "E065.18.93.100";
	var arrVersion = strVersion.split('.');
	var strCurVersion = fnFunction("get_xiadan_version", "");
	var arrCurVersion = strCurVersion.split('.');
	if(arrCurVersion.length != 4)
	{
		return false;
	}
	
	if(arrCurVersion[0] == arrVersion[0])
	{
		if(parseInt(arrCurVersion[1]) < parseInt(arrVersion[1]))
		{
			return false;
		}	
		if((parseInt(arrCurVersion[2]) < parseInt(arrVersion[2])) && (parseInt(arrCurVersion[1]) == parseInt(arrVersion[1])))
		{
			return false;
		}		
		if((parseInt(arrCurVersion[3]) < parseInt(arrVersion[3])) && (parseInt(arrCurVersion[2]) == parseInt(arrVersion[2])) && (parseInt(arrCurVersion[1]) == parseInt(arrVersion[1])))
		{
			return false;
		}
	}
	
	return true;
}


function GetLocalTime()
{
	var date = new Date();
	var strYear = date.getFullYear();
	var strMonth = date.getMonth() + 1;
	var strDay = date.getDate();
	var strHour = date.getHours();
	var strMin = date.getMinutes();
	var strSecond = date.getSeconds();
	return strYear + "-" + strMonth + "-" + strDay + " " + strHour + ":" + strMin + ":" + strSecond;
}

function RecordSetLog()
{
	var strDssgLog = '';
	var nSetHour = $("#hour").val();
	var nSetMin = $("#min").val();
	strDssgLog = '1,' + nSetHour + nSetMin;  //用户设置的时间
	return strDssgLog;
}

