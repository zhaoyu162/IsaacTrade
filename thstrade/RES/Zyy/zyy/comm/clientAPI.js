/***********************************************************************
公共函数：封装客户端接口
***********************************************************************/

// function:读配置
// param:strSection,配置文件中的节,如[dssg_cfg]
// param:strKey,配置中的键
// param:strValue,配置中的值
// param:strPath,配置文件所在路径
// return strValue
function ReadConfig(strSection, strKey, strDefault, strPath)
{
	var objReadData = {
		"section": strSection,
		"key": strKey,
		"default": strDefault,
		"file_path": strPath
	};	
	var param = $.toJSON(objReadData);
	var strConfig = fnFunction("read_cfg", param);
		
	return strConfig;
}

// function:写配置
// param:strSection,配置文件中的节,如[dssg_cfg]
// param:strKey,配置中的键
// param:strValue,配置中的值
// param:strPath,配置文件所在路径
function WriteConfig(strSection, strKey, strValue, strPath)
{
	var objWriteData = {
		"section": strSection,
		"key": strKey,
		"value": strValue,
		"file_path": strPath
	};
	var param = $.toJSON(objWriteData);
	var strConfig = fnFunction("write_cfg", param);
	
	return strConfig;
}

// function:设置定时器
// param:uTimerId,定时器ID
// param:uTimerElapse,定时器时间间隔
function SetTimer(uTimerId, uTimerElapse)
{
	var jsonParam = {};
	jsonParam["timer_id"] = uTimerId.toString();
	jsonParam["timer_elapse"] = uTimerElapse.toString();
	var strParam = window.JSON.stringify(jsonParam);
	return fnFunction("set_timer", strParam);
}

// function:销毁定时器
// param:uTimerId,定时器ID
function KillTimer(uTimerId)
{
	fnFunction("kill_timer", uTimerId.toString());
}

