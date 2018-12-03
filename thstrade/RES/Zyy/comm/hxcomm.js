/*
	核新客户端调用接口公共文件
*/

document.write('<script language=javascript src="./html/js/dssgCtrl.js"></script>');

//////////////////////////////////////////////////
// 客户端框架和JS接口调用
//////////////////////////////////////////////////
function fnIsOurCustomBrowser()
{ 
	if(window.external.CB_IsOurCustomBrowser != null)
	{
		return true;
	}
	else
	{
		return false;
	}
}

// 用一个变量检验是否是自定义浏览器.
bIsCustomBrowser = fnIsOurCustomBrowser();
bUseCefBrowser = false;
if(window.cefQuery)
{
	bUseCefBrowser = fnFunctionCef('CB_Function','is_use_cefbrowser');
}

if(!bUseCefBrowser && !bIsCustomBrowser)
{
	// 检查到不是自定义浏览器,你可以做一些处理例如转到其他页面
	// 这里只是警告
	alert('为了显示正常,你必须使用自定义浏览器.');
}

// 获取用户数据
function fnGetUserData(name)
{
	if(bIsCustomBrowser)
	{
		return window.external.CB_GetUserData(name);
	}
	return "";
}

// 获取用户数据函数
function fnGetUserDataEx(param1, param2)
{
	if(bIsCustomBrowser)
	{
		return window.external.CB_Function(param1, param2);
	}
	return "";
}

function fnCallFunction()
{
	// 在自定义浏览器里面调用C++函数
	if(bIsCustomBrowser)
	{
		window.external.CB_CustomFunction();
	}
}

function fnCallFunctionWithParams(str1, str2, type)
{
	// 在自定义浏览器里面调用带有参数的C++函数
	if(bIsCustomBrowser)
	{
		if (type == 'standard') // 调用接口标准请求
		{
			window.external.CB_Request(str1, str2);
			return
		}
		// 调用L扩展请求 默认为L-0
		window.external.CB_RequestDT(str1, str2);
	}
}

// 框架功能调用
function fnFunction(op, param)
{
	if(bUseCefBrowser)
	{
		return fnFunctionCef('CB_Function',op, param);
	}
	if(bIsCustomBrowser)
	{
		return window.external.CB_Function(op, param);
	}
	return "不支持该调用";
}

function fnFunctionCef(method,op, param)
{
	var xmlHttp = new XMLHttpRequest();
	var param = 'method=' + method + '@@@' + 'operate=' + op + '@@@' + 'param=' + param + '@@@';
		
	xmlHttp.open('POST', 'http://xiadan/', false);
	xmlHttp.send(param);
		
	return xmlHttp.responseText;
}

function fnRequest(op, param)
{
	if(bUseCefBrowser)
	{
		return fnFunctionCef('CB_Request',op, param);
	}
	if(bIsCustomBrowser)
	{
		return window.external.CB_Request(op, param);
	}
	return "不支持该调用";
}
function fnGetAccountBalance()
{
	if(bIsCustomBrowser)
	{
		return window.external.CB_DoGetZijin('');
	}
	return "不支持该调用";
}
// 按市场取股东账户
function fnGetGDZHBySetCode(setcode)
{
	return fnFunction("get_account", setcode);
}

function fnGetGDZH(strUserKey, strSetCode)
{
	write_html_log("**********hxcomm.js********fnGetGDZH函数开始IsDssgVersion() = " + IsDssgVersion());
	var bDssgVersion = IsDssgVersion();
	if (bDssgVersion)
	{
		var objParam = {};
		objParam["userkey"] = strUserKey;
		objParam["setcode"] = strSetCode;
		var strParam = window.JSON.stringify(objParam);
		
		return fnFunction("get_gdzh", strParam);
	}
	else
	{
		return fnGetGDZHBySetCode(strSetCode);
	}
}

// 设置窗口标题
function fnSetWinCaption(title)
{
	return fnFunction("set_caption", title);
}

// 菜单跳转
function fnMenuJump(menuid)
{
	fnFunction('send_message', "message=273\nparam1=" + menuid + '\n' );
}

// 打开接口返回多行数据转换为json数据功能
function fnEnableJson()
{
	fnFunction("enable_json", "1");
}

//查询最新价格
function fnGetHQPrice(param)
{
	return fnFunction('reg_push_hq_zxjg', param);
}

// 获得买卖盘信息
function fnGetHQMmp(param)
{
	return fnFunction('get_hq_mmp', param);
}

// Base64解码
function fnDecodeBase64ex(param)
{
	return fnFunction('decode_base64ex', param);
}

// Base64编码
function fnEncodeBase64ex(param)
{
	return fnFunction('encode_base64ex', param);
}

// 调用弹出消息窗口
function fnShowMsgBox(msg)
{
	fnFunction("show_messagebox", msg);
}

// 调用弹出确认/取消窗口
function fnShowYesNoMsgBox(msg)
{
	return fnFunction("show_yesno", msg);
}

// 调用显示显示大量数据带滚动条的窗口
// msg格式为："caption=value1\nbigmsg=value2\ntext=value3\nshow_yesno=value4\nyes_text=value5\nno_text=value6\n"
// 其中bigmsg设为1，显示大量文本
// show_yesno设为1，显示按钮
// text为需要显示的文本，需要进行base64编码
function fnShowBigMsgBox(msg, caption, url, show_yesno, yes_text, no_text, show_check, check_text, check_relation)
{
	if (typeof msg == 'undefined') msg = "";
	if (typeof caption == 'undefined') caption = "";
	if (typeof url == 'undefined') url = "";
	if (typeof show_yesno == 'undefined') show_yesno = "1";
	if (typeof yes_text == 'undefined') yes_text = "确　定";
	if (typeof no_text == 'undefined') no_text = "取　消";
	if (typeof show_check == 'undefined') show_check = "0";
	if (typeof check_text == 'undefined') check_text = "阅读并同意协议内容";
	if (typeof check_relation == 'undefined') check_relation = "1";
	return fnFunction("show_bigmsg", "bigmsg=1\nshow_yesno="+ show_yesno + "\ntext="  + msg + "\ncaption=" + caption + "\nyes_text=" + yes_text + "\nno_text=" + no_text + "\nurl=" + url + "\nshow_check=" + show_check + "\ncheck_text=" + check_text + "\ncheck_relation=" + check_relation + "\n");
}

function fnOnHideDialog()
{
	fnFunction("show_messagebox_ex", "hide=1\n");
}

// 调用弹出异步对话框
function fnAsyncMessageBox(msg, callback_func, show_yesno)
{
	if (typeof show_yesno == 'undefined')
		show_yesno = '1';
	return fnFunction("show_messagebox_ex", "prompt=" + msg + "\nshow_yesno=" + show_yesno + "\nshow_modal=0\ncallback=" + callback_func + "\n");
}

// 调用获取客户端配置信息
// section	段名
// key		配置变量名
// defaultValue 默认值
function fnGetConfigData(section, key, defaultValue)
{
	if(bIsCustomBrowser)
	{
		return window.external.CB_GetProfile(section, key, defaultValue);
	}
	return "";
}

// 调用设置xiadan.ini
// section	段名
// key		配置变量名
// defaultValue 默认值
function fnSetConfigData(section, key, defaultValue)
{
	if(bIsCustomBrowser)
	{
		window.external.CB_WriteProfile(section, key, defaultValue);
	}
	return "";
}

//////////////////////////////////////////////////
// 纯JS公共函数
//////////////////////////////////////////////////
// 得到页面的大小
function GetPageSize() {
	var scrW, scrH;
	if(window.innerHeight && window.scrollMaxY) {
		// Mozilla
		scrW = window.innerWidth + window.scrollMaxX;
		scrH = window.innerHeight + window.scrollMaxY;
	} else if(document.body.scrollHeight > document.body.offsetHeight){
		// all but IE Mac
		scrW = document.body.scrollWidth;
		scrH = document.body.scrollHeight;
	} else if(document.body) { // IE Mac
		scrW = document.body.offsetWidth;
		scrH = document.body.offsetHeight;
	}

	var winW, winH;
	if(window.innerHeight) { // all except IE
		winW = window.innerWidth;
		winH = window.innerHeight;
	} else if (document.documentElement 
		&& document.documentElement.clientHeight) {
		// IE 6 Strict Mode
		winW = document.documentElement.clientWidth; 
		winH = document.documentElement.clientHeight;
	} else if (document.body) { // other
		winW = document.body.clientWidth;
		winH = document.body.clientHeight;
	}

	// for small pages with total size less then the viewport
	var pageW = (scrW<winW) ? winW : scrW;
	var pageH = (scrH<winH) ? winH : scrH;

	return {PageW:pageW, PageH:pageH, WinW:winW, WinH:winH};
}

// 得到页面的的滚动大小
function GetPageScroll() {
	var x, y;
	if(window.pageYOffset) {
	// all except IE
		y = window.pageYOffset;
		x = window.pageXOffset;
	} else if(document.documentElement 
	&& document.documentElement.scrollTop) {
	// IE 6 Strict
		y = document.documentElement.scrollTop;
		x = document.documentElement.scrollLeft;
	} else if(document.body) {
	// all other IE
		y = document.body.scrollTop;
		x = document.body.scrollLeft; 
	}
	return {X:x, Y:y};
}

// 获取key=value\n格式的值
function getFieldValue(source, field)
{
	var tmp = source.match(field + "=(.+)");
	if(tmp != null)
		return tmp[1];
	return "";
}

// 默认排序函数
function changeSort_func(sortname, sortorder, colModel, dataSource, grid)
{
	var collen = colModel.length;
	var number_type = false;
	for (var i=0; i<collen; i++) {
		var col = colModel[i];
		if (col.name == sortname && column_type[col.type]) {
			number_type = true;
			break;
		}
	}
	
	var header = typeof dataSource.header == 'object' ? dataSource.header : {};
	// sort data
	dataSource.rows.sort(function(p1, p2) {
		var index = header[sortname];
		var value1 = p1.cell[sortname], value2 = p2.cell[sortname];
		if (typeof value1 == 'undefined') value1 = p1.cell[index]; 
		if (typeof value2 == 'undefined') value2 = p2.cell[index]; 
		// 如果是数字类型的，直接判断数字
		if (number_type)
		{
			value1 = parseFloat(value1);
			value2 = parseFloat(value2);
		}
		if(value1 == value2)
			return 0
		var ret = value1 > value2;
		if (sortorder == 'asc')
			if (ret) return 1
			else return -1
		else
			if (ret) return -1
			else return 1
	});
	grid.addData();
}

// 包装一层函数,调用绘制表格
function fnFlexigrid(selector, p)
{
	//  处理dataSource数据
	if (p.dataSource)
	{		
		var data = {};
		data.rows = p.dataSource;
		p.dataSource = data;
	}
	// 循环colModel，设置默认值
	$.each(p.colModel, function(key, cm) {
		// 设置默认宽度为display的字符长
		if (typeof cm.width == 'undefined')
		{
			cm.width = cm.display.length * 12;
		}
		// 默认支持排序
		if (cm.sortable !== false)
		{
			cm.sortable = true;
		}
		// 如果类型为数值型则靠右对齐
		if (cm.type && column_type[cm.type])
		{
			cm.align = 'right';
			// 浮点型设置默认格式化函数
			if (cm.format !== false && (cm.type == 'double' || column_type[cm.type] == 'double'))
				cm.format = formatCol_func;			
		}
	})
	// 设置默认排序函数
	if (p.sortable !== false && !p.onChangeSort)
		p.onChangeSort = changeSort_func;
	
	// 设置flexigrid属性
	$(selector).flexigrid(p);
}

// 转换客户端表结构中的对齐到js中
function fnGetAlign(num)
{
	var ret = 'center';
	switch(num)
	{	
		case "128":
			ret = 'right';
			break;
		case "0":
			ret = 'left';
			break;
	}
	return ret;
}

var numReg = /^[-\d\.]+$/; 
// 格式化函数 这里只用到格式成固定精度，在生成表头的时候根据配置设置
function formatCol_func(val, p) {
	if (typeof val == 'undefined') return '';
	if (!numReg.test(val)) return val;
	//~ alert(val + '\r\n' + (Math.round(parseFloat(val)*100)/100).toFixed(p));
	return parseFloat(val).toFixed(p);
}
// 从客户端返回数据中得到表头
function fnGetGridColModel(data, obj)
{
	var format_func = formatCol_func;
	if (obj && obj.format_func)
		format_func = obj.format_func;
	var colModel = new Array();
	var len = data.header.length;
	//~ alert('data.header.length:' + len)
	for (var i=0; i<len; i++)
	{
		var header = data.header[i];
		var col = {
			display : header.caption,
			name : header.id,
			width : header.width * 6,
			sortable : true,
			hide : header.visible == '1' ? false : true,
			//~ summary : header.summary,
			type : header.type,
			precision : header.decimal,
			// 类型为浮点数才格式化
			format : column_type[header.type] == 'double' ? format_func : false,
			align : align_type[header.align]
		}
		colModel.push(col);
	}
	
	return colModel;
}

// 转换返回数据到flex格式，从客户端生成的表的json结构转换到数据源的结构
function fnChangeData2Flex(data)
{
	var new_data = {};
	var rows = new Array();
	var len = data.table.length;
	for(var i=0; i<len; i++)
	{
		var row = {};
		row.cell = data.table[i];
		row.id = i;
		rows.push(row);
	}
	new_data.rows = rows;
	new_data.total = rows.length;
	new_data.page = 1;
	return new_data
}

// 客户端列属性
var column_type = 
{
	'12288' : 'long',
	'20480' :	'double',
	'long' : true,
	'double' : true
}

// 对齐属性
var align_type =
{
	'0' : 'left',
	'64' : 'center',
	'128' : 'right'
}
