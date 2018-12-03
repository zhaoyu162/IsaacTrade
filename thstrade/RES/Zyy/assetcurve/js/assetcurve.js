document.write('<script language=javascript src="../comm/adapter.js"></script>');
document.write('<script type="text/javascript" src="../comm/hxcomm.js"></script> ');
document.write('<script type="text/javascript" src="../comm/jquery-1.6.1.js"></script> ');
document.write('<script type="text/javascript" src="../comm/jquery.nicescroll.min.js"></script> ');

var STYLE_ZJGP_NUMBER_RED = ' style=\'color:#ff3b3b;font-size:12px;font-family:SimSun;border-top:1px solid #ffffff;'
var STYLE_ZJGP_NUMBER_GRAY = ' style=\'color:#787878;font-size:12px;font-family:SimSun;border-top:1px solid #ffffff;'
var STYLE_ZJGP_NUMBER_BLUE = ' style=\'color:#5767E3;font-size:12px;font-family:SimSun;border-top:1px solid #ffffff;'
var STYLE_ZJGP_NAME_RED = ' style=\'color:#ff3b3b;font-size:12px;font-family:SimSun;border-top:1px solid #ffffff;'
var STYLE_ZJGP_NAME_GRAY = ' style=\'color:#787878;font-size:12px;font-family:SimSun;border-top:1px solid #ffffff;'
var STYLE_ZJGP_NAME_BLUE = ' style=\'color:#5767E3;font-size:12px;font-family:SimSun;border-top:1px solid #ffffff;'
var STYLE_ZJGP_NUMBER_WHITE = ' style=\'color:#FFFFFF;font-size:12px;font-family:SimSun;border-top:1px solid #ffffff;'
var TEXT_ALIGN_LEFT = 'text-align:left;\' >'
var TEXT_ALIGN_CENTER = 'text-align:center;\' >'
var TEXT_ALIGN_RIGHT = 'text-align:right;\' >'
var TEXT_ALIGN_RIGHT_PRICE = 'text-align:right;'
var TEXT_ALIGN_RIGHT_ZDF = 'text-align:right;\' >'
var NORMAL_BK_COLOR = 'background-color:none\' >'
var CHANGE_BK_COLOR = 'background-color:#0072ff;\' >'

var g_nLeft = 0;
var g_nWidth = 346;

// 请求小财神协议，小财神未开通时会发该请求
function fn_cxXcsXy(strUserInfo)
{
	var arr_std = {};
	var arr_local = {};
	var arr_ext = {};
	
	arr_std['reqtype'] = "2318";
	arr_std['setcode'] = "";
	arr_std['refresh'] = "0";
	arr_std['cachedata'] = "0";
	arr_std['userkey'] = g_curUserInfo;
	
	arr_ext['cmd'] = "getfile";
	arr_ext['zdjy'] = "1";
	arr_ext['data'] = "xcsxy";
	
	fn_request(arr_std,arr_ext,arr_local);
}

function fn_cxXcsQx(strUserInfo)
{
	var arr_std = {};
	var arr_local = {};
	var arr_ext = {};
	
	arr_std['reqtype'] = "2318";
	arr_std['setcode'] = "";
	arr_std['refresh'] = "1";
	arr_std['cachedata'] = "0";
	arr_std['userkey'] = g_curUserInfo;
	
	arr_ext['zdjy'] = "1";
	arr_ext['cmd'] = "connect_xcs";
	arr_ext['type'] = "cx_zhxx";
	arr_ext['userid'] = g_userid;
	arr_ext['zjzh'] = g_zjzh;
	arr_ext['qsid'] = g_qsid;
	arr_ext['version'] = '1.0';
	arr_ext['terminal'] = '1';
	arr_ext['datatype'] = '';
	arr_ext['wtid'] = '0';
	arr_ext['xcs_from'] = '0';
	
	fn_request(arr_std,arr_ext,arr_local);
}

function OnReloadXcs()
{
	clearAllHideView();
	
	fn_cxXcsQx();
}

// 请求持仓数据
function fn_cxChiCang()
{
	var arr_std = {};
	var arr_local = {};
	var arr_ext = {};
	
	arr_std['reqtype'] = "1537";
	arr_std['setcode'] = "";
	arr_std['refresh'] = "0";
	arr_std['cachedata'] = "1";
	arr_std['userkey'] = g_curUserInfo;
	
	arr_local['jsonway'] = "1";
	
	fn_request(arr_std,arr_ext,arr_local);
}

// 请求成交数据
function fn_cxChenJiao()
{
	var arr_std = {};
	var arr_local = {};
	var arr_ext = {};
	
	arr_std['reqtype'] = "1538";
	arr_std['setcode'] = "";
	arr_std['refresh'] = "0";
	arr_std['cachedata'] = "1";
	arr_std['userkey'] = g_curUserInfo;
	
	arr_local['jsonway'] = "1";
	
	fn_request(arr_std,arr_ext,arr_local);
}

// 请求银行流水
function fn_cxYhls()
{
	var arr_std = {};
	var arr_local = {};
	var arr_ext = {};
	
	arr_std['reqtype'] = "1549";
	arr_std['cachedata'] = "1";
	arr_std['refresh'] = "1";
	arr_std['userkey'] = g_curUserInfo;
	arr_std['tablename'] = "xd_yhye_ls" + "__" + g_qsid;
	
	arr_ext['flag'] = "F";
	arr_ext['dataid'] = "yhye_ls";
	
	arr_local['jsonway'] = "1";
	
	fn_request(arr_std,arr_ext,arr_local);
}

// 请求资金数据
function fn_cxZiJin()
{
	var arr_std = {};
	var arr_local = {};
	var arr_ext = {};
	
	arr_std['reqtype'] = "5";
	arr_std['setcode'] = "";
	arr_std['refresh'] = "0";
	arr_std['cachedata'] = "1";
	arr_std['userkey'] = g_curUserInfo;
	
	fn_request(arr_std,arr_ext,arr_local);
}

// 返回的json串去掉回车
function fun_str_replace(str)
{
	var strdes = str;
	strdes = strdes.replace(/\n/g,' ');
	strdes = strdes.replace(/\r/g,' ');
	strdes = strdes.replace(/\/n/g,' ');
	strdes = strdes.replace(/\/r/g,' ');
	return strdes;
}

function fun_hqdata_replace(str)
{
	var strdes = str;
	strdes = fun_str_replace(strdes);
	strdes = strdes.replace(/\t/g,' ');
	strdes = strdes.replace(/\"/g,' ');
	return strdes;
}

// 请求返回的数据解析，解析完毕后刷新数据
function fun_refresh_by_data(obj, fn_name)
{
	switch(fn_name)
	{
		case '1537':
		case '1547':
			if(g_bDataReady == 2)
			{
				fun_refresh_chicang(obj);
			}
			break;
		case '1538':
		{
			if(g_bDataReady > 0)
			{
				if(g_bDataReady == 1)
				{
					fn_cxChiCang();
					g_bDataReady = 2;
				}
				fun_refresh_chengjiaoTable(obj);
			}
		}
			break;
		case '2318':
			fun_refresh_Zjqx(obj);
			break;
		case '1549':
		{
			SendYhlsLogToServer(obj);
			
			fn_cxChenJiao();
			g_bDataReady = 1;
		}
		default:
			break;
	}
}

// 上传银行流水日志
function SendYhlsLogToServer(obj)
{
	if(obj && obj.reply && obj.reply.ret_code)
	{
		if(obj.reply.ret_code != '0')
		{
			var strMsg = '';
			if(obj.reply.ret_msg)
			{
				strMsg = obj.reply.ret_msg;
			}

			SendLogToServer('DT_CX_YHLS', '-1', strMsg, '');
		}
		else
		{
			if(obj.reply.table && obj.reply.table.body)
			{
				var strCbasData = 'd_yhls_czlb='
				
				for(var i = 0; i < obj.reply.table.body.length; i++)
				{
					if(obj.reply.table.body[i].xd_2109 && strCbasData.indexOf(obj.reply.table.body[i].xd_2109) < 0)
					{
						strCbasData += obj.reply.table.body[i].xd_2109 + ';';
					}
				}
			}
			
			SendLogToServer('DT_CX_YHLS', '0', '查银行流水成功', strCbasData);
		}
	}
}


function fun_refresh_chicang(obj)
{
	if(!obj || !obj.reply)
	{
		return;
	}
	
	if(obj.reply.ret_code)
	{
		if(obj.reply.ret_code != '0')
		{
			var strMsg = '';
			if(obj.reply.ret_msg)
			{
				strMsg = obj.reply.ret_msg;
			}

			SendLogToServer('DT_CX_CC', '-1', strMsg, '');
			return;
		}
	}
	
	var objLoad = document.getElementById('load-all');
	objLoad.style.display = 'none';
	
	if(g_bVisible != '1' && g_bFirst == 0)
	{
		return;
	}
	
	var strZijin = fnFunction('get_zijin', g_curUserInfo);
	var strDes = fun_str_replace(strZijin);
	var strToObj = new Function('return' + strDes)();
	
	var fZSZ = 0.0;
	var fZZC = 0.0;
	
	var fCCYK = 0.0;
	var fDrykTotal = 0.0;
	
	if(strToObj)
	{
		if(strToObj.gpsz)
		{
			fZSZ = parseFloat(strToObj.gpsz).toFixed(2);
		}
		
		if(strToObj.zzc)
		{
			fZZC = parseFloat(strToObj.zzc).toFixed(2);
		}
	}
	
	if(!obj.reply.table || !obj.reply.table.body)
	{
		if(g_bFirst)
		{
			fnDrawDrZJQX(g_bFirst);
			startanimateCurve();
			g_bFirst = 0;
		}
		
		$('#zjgp').html('');
		
		if(IsIE6Expor())
		{
			$('#frame').niceScroll().resize();
		}
		else
		{
			document.getElementById('frame').style.top = '0px';
			ResizeVBar();
		}
		
		g_nStockCount = 0;
	}
	else
	{
		g_nStockCount = obj.reply.table.body.length;
		
		if(g_nStockCount > 20)
		{
			clearInterval(g_timerId);
			
			clearAllHideView();
			initData();

			document.getElementById("hide-over-stock").style.display = 'block';
			
			if(IsIE6Expor())
			{
				$('#frame').niceScroll().resize();
			}
			else
			{
				document.getElementById('frame').style.top = '0px';
				ResizeVBar();
			}
			
			return;
		}
		
		var html = '';
		var tableBodyHtml = [];

		
		var extra = obj.reply.table.extra;
		var chengjiaoObj = g_chengjiaoObj;
		
		var strCodeList = '';
		
		var nBuyCount,fBuyPrice;
		var nSellCount,fSellPrice;
		var strTProfit;
		var mapStrPft = {};
		
		for(var i = 0; i < g_nStockCount; i++)
		{
			nBuyCount = 0;
			fBuyPrice = 0.0;
			nSellCount = 0;
			fSellPrice = 0.0;
			strTProfit = '';
			
			var arrBody = obj.reply.table.body[i];
			
			var xd_2124 = (parseFloat(arrBody.xd_2124)).toFixed(3);
			var xd_2122 = (parseFloat(arrBody.xd_2122)).toFixed(3);
			var xd_2147 = (parseFloat(arrBody.xd_2147)).toFixed(2);
			var xd_2125 = (parseFloat(arrBody.xd_2125)).toFixed(2);
			
			var strMarket = arrBody.xd_2171;
			if(!strMarket)
			{
				strMarket = arrBody.xd_2108;
			}
			
			var strZcsxParam = 'market=' + strMarket + '\ncode=' +  arrBody.xd_2102;
			
			var bEnableZcsx = fnFunction('get_zcsx_status', strZcsxParam);
			
			strCodeList += arrBody.xd_2102 + '|';
			
			var fPre = arrBody.xd_2102 + '_pre';
			var strZdf = arrBody.xd_2102 + '_zdfd';
			
			var strGpye;
			
			if(typeof(arrBody.xd_2164) != 'undefined')
			{
				strGpye = arrBody.xd_2164;
			}
			else
			{
				strGpye = arrBody.xd_2117;
			}
			
			var nGpye = parseInt(strGpye);
			var fDrxj = parseFloat(arrBody.xd_2124);
			
			fPre = parseFloat(extra[fPre]);
			
			if(fPre && bEnableZcsx != '0')
			{
				strZdf = ((fDrxj - fPre)/fPre) * 100;
				strZdf = strZdf.toFixed(3);
				strZdf = parseFloat(strZdf).toFixed(2);
				strZdf += '%'
				
				var fDryk = 0.0;
				if(typeof(chengjiaoObj)!= 'undefined' && chengjiaoObj != null)
				{
					for(var j = 0; j < chengjiaoObj.reply.table.body.length; j++)
					{
						var arrChenjiaoBody = chengjiaoObj.reply.table.body[j];
						if(typeof(arrChenjiaoBody) == 'undefined')
						{
							continue;
						}	
						
						if(arrBody.xd_2102 == arrChenjiaoBody.xd_2102)
						{
							var strCzlb = arrChenjiaoBody.xd_2109;
							var nCjsl = parseInt(arrChenjiaoBody.xd_2128);
							var fCjjg = parseFloat(arrChenjiaoBody.xd_2129)
							
							if(fCjjg < 0.01 || nCjsl < 1)
							{
								continue;
							}
							
							if(strCzlb.indexOf('撤') >= 0)
							{
								continue;
							}
							
							if(strCzlb.indexOf('卖') >= 0)
							{
								fDryk += nCjsl * ((fCjjg - fPre) * 1000);
								nSellCount += nCjsl;
								fSellPrice += fCjjg * nCjsl;
							}
							else
							{
								nGpye -= nCjsl;
								fDryk += nCjsl * ((fDrxj - fCjjg) * 1000);
								nBuyCount += nCjsl;
								fBuyPrice +=  fCjjg * nCjsl;
							}
						}
					}	
				}
				
				fDryk += nGpye * ((fDrxj - fPre) * 1000);
				fDrykTotal += fDryk;
				fDryk = (fDryk/1000).toFixed(2);
			}
			else
			{
				strZdf = '0.00%';
				fDryk = 0.00;
			}
			
			fDryk = parseFloat(fDryk).toFixed(2);
			
			var strNumberStyle,strNameStyle,stylePrice;
			if(xd_2147 > 0)
			{
				strNumberStyle = stylePrice = STYLE_ZJGP_NUMBER_RED;
				strNameStyle = STYLE_ZJGP_NAME_RED;
			}
			else if(xd_2147 < 0)
			{
				strNumberStyle = stylePrice = STYLE_ZJGP_NUMBER_BLUE;
				strNameStyle = STYLE_ZJGP_NAME_BLUE;
			}
			else
			{
				strNumberStyle = stylePrice = STYLE_ZJGP_NUMBER_GRAY;
				strNameStyle = STYLE_ZJGP_NAME_GRAY;
			}
			
			var bkPriceCol = NORMAL_BK_COLOR;
			if(g_ccObj && g_ccObj[i] && g_ccObj[i].cells && g_ccObj[i].cells[3])
			{
				var fNowPrice = parseFloat(g_ccObj[i].cells[3].innerHTML);
				if(fNowPrice != parseFloat(xd_2124))
				{
					bkPriceCol = CHANGE_BK_COLOR;
					stylePrice = STYLE_ZJGP_NUMBER_WHITE;
				}
			}
			
			var strPriceHtml;
			if(bUseCefBrowser)
			{
				strPriceHtml = '<th' +  stylePrice + TEXT_ALIGN_RIGHT_PRICE + bkPriceCol + xd_2124 + '&nbsp' + '</th>';
			}
			else
			{
				strPriceHtml = '<th' +  stylePrice + TEXT_ALIGN_RIGHT_PRICE + bkPriceCol + xd_2124 + '&nbsp;&nbsp' + '</th>';
			}
			
			var strClsName = 'tprofit' + i;
			var strPft = '';
			
			if(nBuyCount > 0 && nSellCount > 0)
			{
				var nMinCount = nBuyCount <= nSellCount ? nBuyCount : nSellCount;
				var fTProfit = (fSellPrice / nSellCount - fBuyPrice / nBuyCount) * nMinCount;
				strTProfit = 'T+0收益:' + fTProfit.toFixed(2);
				strPft = strTProfit;
				if(bUseCefBrowser)
				{
					strTProfit = '<img src=\'img/tprofit.png\' class=\'' + strClsName + '\'></img>';
					mapStrPft[strClsName] = strPft;
				}
				else
				{
					strTProfit = '<img src=\'img/tprofit.png\' title=\' ' + strTProfit + '\' style=\'text-align:center;font-size:0px;padding-bottom:3px\'></img>';
				}
				
			}
			
			var trHtml = [
				'<tr ' + (arrBody.xd_2102 == g_curSelCode ? ' style=\'background-color:#96d2ff\'' : ' style=\'background-color:none\'') +
				' ondblclick=\'OnDblClickGpEvent(this)\'  onmouseenter=\'OnMouseOverGpEvent(this)\' onclick=\'OnClickGpEvent(this)\' onmouseleave=\'OnMouseLeaveGpEvent(this)\'>',
					'<th' +  strNumberStyle + TEXT_ALIGN_CENTER + arrBody.xd_2102 + '</th>',
					'<th' +  strNameStyle + TEXT_ALIGN_LEFT + arrBody.xd_2103 + '</th>',
					'<th' +  strNumberStyle + TEXT_ALIGN_RIGHT_ZDF + strZdf + '&nbsp' + '</th>',
					strPriceHtml,
					'<th' +  strNumberStyle + TEXT_ALIGN_RIGHT  + xd_2122 + '</th>',
					'<th' +  strNumberStyle + TEXT_ALIGN_RIGHT  + parseInt(strGpye) + '</th>',
					'<th' +  strNumberStyle + TEXT_ALIGN_RIGHT  + fDryk +'</th>',
					'<th style=\'border-top:1px solid #ffffff\'>' + (strTProfit.length > 0 ? strTProfit : '') + '</th>',
					'<th' +  strNumberStyle + TEXT_ALIGN_RIGHT  + xd_2147 + '</th>',
					'<th' +  strNumberStyle + TEXT_ALIGN_RIGHT  + xd_2125 + '</th>',
					'<th style=\'text-align:center;border-top:1px solid #ffffff\'></th>',
				'</tr>'
			];
			
			tableBodyHtml.push(trHtml.join(''));
			
			fCCYK += (parseFloat(arrBody.xd_2147)) * 1000;
		}
		
		fDrykTotal = (fDrykTotal/1000).toFixed(2);
		
		fCCYK = (fCCYK/1000).toFixed(2);
		
		$('#zjgp').html(tableBodyHtml.join(''));
		
		if(bUseCefBrowser)
		{
			for(key in mapStrPft)
			{
				$('.'+key).tinytooltip({message: mapStrPft[key]});
			}
		}
		
		if(g_strCodeList != strCodeList)
		{
			g_strCodeList = strCodeList;
			
			var zjgpObj = document.getElementById("zjgp");
			
			if(zjgpObj.rows)
			{
				g_ccObj = zjgpObj.rows;
			}
			
			if(IsIE6Expor())
			{
				$('#frame').niceScroll().resize();
			}
			else
			{
				
				ResizeVBar();
			}
		}
		
		if(g_bFirst)
		{
			showEcharts();
			g_bFirst = 0;
		}
	}
	showAllElement(true);
	
	fun_refresh_background(fCCYK, fDrykTotal, fZSZ, fZZC);
	
	document.getElementById("zjzl-ccyk").innerHTML = parseFloat(fCCYK).toFixed(2);
	document.getElementById("zjzl-dryk").innerHTML = parseFloat(fDrykTotal).toFixed(2);
	document.getElementById("zjzl-zsz").innerHTML = parseFloat(fZSZ).toFixed(2);
	document.getElementById("zjzl-zzc").innerHTML = parseFloat(fZZC).toFixed(2);
	
}

function showEcharts()
{
	fnDrawDrZJQX(true);
	startanimateCurve();
}

function startanimateCurve()
{
	g_nLeft = 262;
	
	document.getElementById("refresh-curve").style.width = g_nWidth + 'px';
	
	document.getElementById("refresh-curve").style.left = g_nLeft + 'px';
	document.getElementById("refresh-curve").style.display = 'block';
	
	clearInterval(g_animateTimerId);
	g_animateTimerId = setInterval('animateCurve()',100);
}

function animateCurve()
{
	g_nLeft += 100;
	var nWidth;
	
	
	document.getElementById("refresh-curve").style.left = g_nLeft + 'px';
	nWidth = parseInt(document.getElementById("refresh-curve").style.width);
	nWidth -= 100;
	
	if(nWidth <= 0)
	{
		clearInterval(g_animateTimerId);
		document.getElementById("refresh-curve").style.display = 'none';
	}
	else
	{
		document.getElementById("refresh-curve").style.width = nWidth + 'px';
	}
}

function showAllElement(bShow)
{
	var strShow;
	if(bShow)
	{
		strShow = 'visible';
	}
	else
	{
		strShow = 'hidden';
	}
	
	document.getElementById("zjzl-ccyk").style.visibility = strShow;
	document.getElementById("zjzl-dryk").style.visibility = strShow;
	document.getElementById("zjzl-zsz").style.visibility = strShow;
	document.getElementById("zjzl-zzc").style.visibility = strShow;
	
	document.getElementById("zjzl-ccyk-text").style.visibility = strShow;
	document.getElementById("zjzl-dryk-text").style.visibility = strShow;
	document.getElementById("zjzl-zsz-text").style.visibility = strShow;
	document.getElementById("zjzl-zzc-text").style.visibility = strShow;
	
	document.getElementById("zjzl-username").style.visibility = strShow;
	
	document.getElementById("dr").style.visibility = strShow;
	document.getElementById("jsst").style.visibility = strShow;
	
	document.getElementById("zjqx-username").style.visibility = strShow;
	document.getElementById("zjqx-username-line").style.visibility = strShow;
	document.getElementById("zjqx-stock").style.visibility = strShow;
	document.getElementById("zjqx-stock-line").style.visibility = strShow;
	
	document.getElementById("nav-drop-btn").style.visibility = strShow;
}

// 刷新账户总览数据
function fun_refresh_background(fCCYK, fDrykTotal, fZSZ, fZZC)
{
	var fAbsZZC = Math.abs(parseFloat(fZZC));
	var fAbsCCYK = Math.abs(parseFloat(fCCYK));
	var fAbsMax = fAbsZZC > fAbsCCYK ? fAbsZZC : fAbsCCYK;
	if(!fAbsMax)
	{
		fAbsMax = fAbsZZC;
	}
	
	if(fAbsMax == 0)
	{
		fAbsMax = 1;
	}
	
	if(parseFloat(fCCYK) < 0)
	{
		document.getElementById("zjzl-ccyk").style.color = '#5767E3';
	}
	else if(parseFloat(fCCYK) > 0)
	{
		document.getElementById("zjzl-ccyk").style.color = '#ff3b3b';
	}
	else
	{
		document.getElementById("zjzl-ccyk").style.color = '#515050';
	}
	
	if(parseFloat(fDrykTotal) < 0)
	{
		document.getElementById("zjzl-dryk").style.color = '#5767E3';
	}
	else if(parseFloat(fDrykTotal) > 0)
	{
		document.getElementById("zjzl-dryk").style.color = '#ff3b3b';
	}
	else
	{
		document.getElementById("zjzl-dryk").style.color = '#515050';
	}
	
	if(parseFloat(fZSZ) < 0)
	{
		document.getElementById("zjzl-zsz").style.color = '#5767E3';
	}
	else if(parseFloat(fZSZ) > 0)
	{
		document.getElementById("zjzl-zsz").style.color = '#ff3b3b';
	}
	else
	{
		document.getElementById("zjzl-zsz").style.color = '#515050';
	}
	
	if(parseFloat(fZZC) < 0)
	{
		document.getElementById("zjzl-zzc").style.color = '#5767E3';
	}
	else if(parseFloat(fZZC) > 0)
	{
		document.getElementById("zjzl-zzc").style.color = '#ff3b3b';
	}
	else
	{
		document.getElementById("zjzl-zzc").style.color = '#515050';
	}
}

// 刷新成交表数据
function fun_refresh_chengjiaoTable(obj)
{
	if(!obj || !obj.reply)
	{
		return;
	}
	
	if(obj.reply.ret_code)
	{
		if(obj.reply.ret_code != '0')
		{
			var strMsg = '';
			if(obj.reply.ret_msg)
			{
				strMsg = obj.reply.ret_msg;
			}

			SendLogToServer('DT_CX_CJ', '-1', strMsg, '');
			return;
		}
	}
	
	if(!obj.reply.table || !obj.reply.table.body)
	{
		g_chengjiaoObj = null;
		return;
	}
	
	g_chengjiaoObj = obj;
}

// 30日资金曲线返回数据解析
function fun_refresh_Zjqx(obj)
{
	if(!obj || !obj.reply || !obj.reply.cmd)
	{
		return;
	}
	
	var strCmd = obj.reply.cmd;
	
	if(strCmd == 'query_Index')
	{
		clearAllHideView();
		if(!obj.reply.data)
		{
			fn_getXcsDataFailed();
		}
		
		fun_refresh_Index(obj.reply.data);
	}
	else if(strCmd == 'query_asset')
	{
		clearAllHideView();
		if(!obj.reply.data)
		{
			fn_getXcsDataFailed();
		}
		
		fun_refresh_asset(obj.reply.data);
	}
}

// 30日指数数据解析
function fun_refresh_Index(strData)
{
	if(g_jsstSzzs.length > 0)
	{
		return;
	}
	
	if(!strData)
	{
		fn_getXcsDataFailed();
		return;
	}
	
	var strToObj = strData;
	if(typeof(strToObj) != 'object')
	{
		strToObj = new Function('return' + strData)();
	}

	if(!strToObj.error_code || strToObj.error_code != '0' || !strToObj.ex_data)
	{
		if(strToObj.error_code)
		{
			if(strToObj.error_code != '0')
			{
				var strMsg = '';
				if(strToObj.error_msg)
				{
					strMsg = strToObj.error_msg;
				}

				SendLogToServer('DT_CX_JSSRZS', '-1', strMsg, '');
			}
		}
		
		fn_getXcsDataFailed();
		return;
	}
	
	var szzsObj = strToObj.ex_data.szzs;
	if(!szzsObj || szzsObj.length < 1)
	{
		fn_getXcsDataFailed();
		return;
	}
	
	var nStartTime = parseInt(fn_getMonthsDate(1));
	var dataObj = [];
	
	for(var i = 0; i < szzsObj.length; i++)
	{
		var nTime = parseInt(szzsObj[i].time);
		
		if(nTime >= nStartTime)
		{
			dataObj.push(szzsObj[i]);
		}
	}
	if(dataObj.length > 0)
	{
		g_jsstSzzs[0] = 0.0;
		g_jsstCybzs[0] = 0.0;
		g_jsstSzzs2[0] = 0.0;
		g_jsstDate.push(dataObj[0].time);
	}
	
	for(var i = 1; i < dataObj.length; i++)
	{
		var tmpData = 0.0;
		tmpData = (parseFloat(dataObj[i].szzs) - parseFloat(dataObj[0].szzs)) / parseFloat(dataObj[0].szzs);
		
		g_jsstSzzs.push((tmpData * 100).toFixed(2));
		
		tmpData = (parseFloat(dataObj[i].cybzs) - parseFloat(dataObj[0].cybzs)) / parseFloat(dataObj[0].cybzs);
		g_jsstCybzs.push((tmpData * 100).toFixed(2));
		
		tmpData = (parseFloat(dataObj[i].szzs2) - parseFloat(dataObj[0].szzs2)) / parseFloat(dataObj[0].szzs2);
		g_jsstSzzs2.push((tmpData * 100).toFixed(2));
		
		g_jsstDate.push(dataObj[i].time);
	}
	
	g_jsstDataLen = g_jsstDate.length;
	
	fnRefreshChart();
}

// 30日资金数据解析
function fun_refresh_asset(strData)
{
	if(g_jsstZjqx.length > 0)
	{
		return;
	}
	
	if(!strData)
	{
		fn_getXcsDataFailed();
		return;
	}
	
	var strToObj = strData;
	if(typeof(strToObj) != 'object')
	{
		strToObj = new Function('return' + strData)();
	}

	if(!strToObj.error_code || strToObj.error_code != '0' || !strToObj.ex_data)
	{
		if(strToObj.error_code)
		{
			if(strToObj.error_code != '0')
			{
				var strMsg = '';
				if(strToObj.error_msg)
				{
					strMsg = strToObj.error_msg;
				}

				SendLogToServer('DT_CX_JSSRZJ', '-1', strMsg, '');
			}
		}
		
		fn_getXcsDataFailed();
		return;
	}
	
	var mrykObj = strToObj.ex_data.mryk;
	if(!mrykObj || mrykObj.length < 1)
	{
		fn_getXcsDataFailed();
		return;
	}
	
	var nStartTime = parseInt(fn_getMonthsDate(1));
	var dataObj = [];
	
	for(var i = 0; i < mrykObj.length; i++)
	{
		var nTime = parseInt(mrykObj[i].time);
		
		if(nTime >= nStartTime)
		{
			dataObj.push(mrykObj[i]);
		}
	}
	
	if(dataObj.length > 0)
	{
		g_jsstZjqx[0] = 0.0;
	}
	
	var nBaseIndex = 0;
	if(parseFloat(dataObj[nBaseIndex].zzc) == 0)
	{
		nBaseIndex = 1;
	}
	
	for(var i = 1; i < dataObj.length; i++)
	{
		var fZzc = dataObj[i].zzc;
		if(parseFloat(fZzc) == 0)
		{
			nBaseIndex = i + 1;
			g_jsstZjqx.push(0.0);
		}
		else
		{
			tmpData = (parseFloat(dataObj[i].zzc) - parseFloat(dataObj[nBaseIndex].zzc)) / parseFloat(dataObj[nBaseIndex].zzc);
		
			g_jsstZjqx.push((tmpData * 100).toFixed(3));
		}
	}
	
	if(nBaseIndex < dataObj.length)
	{
		g_fJsstPre = dataObj[nBaseIndex].zzc;
	}
	else
	{
		g_fJsstPre = 0;
	}
	
	fnRefreshChart();
}

// 小财神未开通时，点击开通时的响应
function OnOpenXcs()
{
	g_xcsStatus = fnFunction('get_module_statue', 'module=xcs\nuser=' +g_curUserInfo);
	
	g_xcsStatus = parseInt(g_xcsStatus);
	
	var nXcsMode = fnFunction('get_authorization', 'func_id=11\nuser=' +g_curUserInfo);
	
	nXcsMode = parseInt(nXcsMode);
	
	if(nXcsMode < 0)
	{
		g_xcsStatus = -2;
	}
	
	if(g_xcsStatus == 0)
	{
		fn_cxXcsXy(g_curUserInfo);
	}
	else
	{
		HandleXcsStatus(g_xcsStatus);
	}
}

// 小财神未开通时，点击取消时的响应
function OnCloseOpenXcs()
{
	initDrzjqx();
	
	fnRefreshChart();
}

function clearAllHideView()
{
	document.getElementById("hide-drzjqx").style.display="none";
	document.getElementById("hide-drzjqx-connectfailed").style.display="none";
	document.getElementById("hide-drzjqx-loadfailed").style.display="none";
	document.getElementById("hide-drzjqx-notsupport").style.display="none";
	document.getElementById("hide-drzjqx-loading").style.display="none";
	document.getElementById("hide-drzjqx-getfailed").style.display="none";
}

function initDrzjqx()
{
	clearAllHideView();
	
	$('#J_timeRange li').removeClass('cur');
	$('#dr').addClass('cur');
	
	g_curLi = 'dr';
	
	document.getElementById("drzjqx-head").innerHTML = '当日资金曲线';
}

// 小财神状态处理函数：-2不支持小财神功能， -1小财神数据获取失败，0小财神未开通，1-3小财神更新中，4小财神更新成功，4以上小财神更新失败
function HandleXcsStatus(nStatus)
{
	clearAllHideView();
	
	if(g_curLi != 'jsst')
	{
		return;
	}

	g_xcsStatus = nStatus;
	
	if(nStatus == -1)
	{
		fn_getXcsDataFailed();
	}
	else if(nStatus == -2)
	{
		document.getElementById("hide-drzjqx-notsupport").style.display="block";
		
	}
	else if(nStatus == 0)
	{
		document.getElementById("hide-drzjqx").style.display="block";
	}
	else if(nStatus > 0 && nStatus <4)
	{
		document.getElementById("hide-drzjqx-loading").style.display="block";
	}
	else if(nStatus == 4)
	{
		if(g_jsstSzzs.length < 1)
		{
			fn_cxZczs(g_curUserInfo);
			document.getElementById("hide-drzjqx-loading").style.display="block";
		}
		
		if(g_jsstZjqx.length < 1)
		{
			document.getElementById("hide-drzjqx-loading").style.display="block";
			fn_cxZc(g_curUserInfo);
		}
	}
	else if(nStatus > 4 && nStatus < 10)
	{
		SendLogToServer('DT_CX_XCS', '-1', '小财神更新失败', 'd_xcs_st=' + g_xcsStatus);
		
		document.getElementById("hide-drzjqx-loadfailed").style.display="block";
	}
	else if(nStatus >= 10)
	{
		if(g_jsstSzzs.length < 1)
		{
			fn_cxZczs(g_curUserInfo);
			document.getElementById("hide-drzjqx-loading").style.display="block";
		}
		
		if(g_jsstZjqx.length < 1)
		{
			document.getElementById("hide-drzjqx-loading").style.display="block";
			fn_cxZc(g_curUserInfo);
		}
	}
}

function fn_getXcsDataFailed()
{
	SendLogToServer('DT_CX_XCS', '-1', '小财神数据获取失败', 'd_xcs_st=' + g_xcsStatus);
		
	document.getElementById("hide-drzjqx-connectfailed").style.display="block";
}

// 查询30指数数据
function fn_cxZczs(strUserInfo)
{
	var strStartTime = fn_getMonthsDate(1);
	var strEndTime = fn_getMonthsDate(0);
	
	var arr_std = {};
	var arr_local = {};
	var arr_ext = {};
	
	arr_std['reqtype'] = "2318";
	arr_std['setcode'] = "";
	arr_std['refresh'] = "1";
	arr_std['cachedata'] = "0";
	arr_std['userkey'] = g_curUserInfo;
	
	arr_ext['cmd'] = "query_Index";
	arr_ext['zdjy'] = "1";
	arr_ext['starttime'] = strStartTime;
	arr_ext['endtime'] = strEndTime;
	arr_ext['command'] = 'getCondition';
	arr_ext['type'] = 'single';
	arr_ext['qsid'] = g_qsid;
	arr_ext['userid'] = g_userid;
	arr_ext['zjzh'] = g_zjzh;
	
	fn_request(arr_std,arr_ext,arr_local);
}

// 查询30资金曲线数据
function fn_cxZc(strUserInfo)
{
	var strStartTime = fn_getMonthsDate(1);
	var strEndTime = fn_getMonthsDate(0);
	
	var arr_std = {};
	var arr_local = {};
	var arr_ext = {};
	
	arr_std['reqtype'] = "2318";
	arr_std['setcode'] = "";
	arr_std['refresh'] = "1";
	arr_std['cachedata'] = "0";
	arr_std['userkey'] = g_curUserInfo;
	
	arr_ext['cmd'] = "query_asset";
	arr_ext['zdjy'] = "1";
	arr_ext['starttime'] = strStartTime;
	arr_ext['endtime'] = strEndTime;
	arr_ext['command'] = 'getAssetTotal';
	arr_ext['type'] = 'single';
	arr_ext['qsid'] = g_qsid;
	arr_ext['userid'] = g_userid;
	arr_ext['zjzh'] = g_zjzh;

	
	fn_request(arr_std,arr_ext,arr_local);
}

// 取近30日的起始日期和截止日期
function fn_getMonthsDate(nBeforeMonth)
{
	var myData = new Date();
	myData.setDate(myData.getDate() - 1);
	myData.setMonth(myData.getMonth() - nBeforeMonth);
	
	var strDate = myData.getFullYear().toString();
	
	var month = myData.getMonth() + 1;
	if (month >= 1 && month <= 9) 
	{
		month = "0" + month;
	}
	
	strDate += month;
	var date = myData.getDate();
	if (date >= 0 && date <= 9) 
	{
		date = "0" + date;
	}
	
	strDate += date;
	
	return strDate;
}

// 股票列表双击响应
function OnDblClickGpEvent(obj)
{
	if(!obj)
	{
		return;
	}
	
	var strPrice = obj.cells.item(3).innerHTML;
	strPrice = strPrice.replace(/[^0-9.]*/g,'');
	
	var strCmd = 'menu_id=162\n';
	strCmd += 'code=' + obj.cells.item(0).innerHTML + '\n';
	strCmd += 'price=' + strPrice + '\n';
	strCmd += 'market=' + obj.cells.item(10).innerHTML + '\n';
	strCmd += 'amount=' + obj.cells.item(5).innerHTML;
	
	SendCBAS(6, '1|DIALOG|资金曲线页面|165|双击持仓股');
	
	fnFunction('menu_jump_ex', strCmd);
}

// 股票列表单击响应
function OnClickGpEvent(obj)
{
	SendCBAS(6, '1|DIALOG|资金曲线页面|165|单击持仓股');
}

// 股票列表悬浮响应
function OnMouseOverGpEvent(obj)
{
	if(!obj)
	{
		return;
	}
	
	if(g_ccObj)
	{
		for(var i = 0; i < g_ccObj.length; i++)
		{
			g_ccObj[i].style.backgroundColor = '';
		}
	}
	
	g_curSelCode = obj.cells.item(0).innerHTML;
	obj.style.backgroundColor = '#96d2ff';
	obj.style.cursor = 'pointer';
}

function OnMouseLeaveGpEvent(obj)
{
	if(!obj)
	{
		return;
	}
	
	g_curSelCode = '';
	obj.style.backgroundColor = '';
	obj.style.cursor = '';
}

function OnMouseHoverSwitch(obj)
{
	if(!obj)
	{
		return;
	}
	
	obj.style.backgroundColor = '#96d2ff';
	obj.style.cursor = 'pointer';
}

function OnMouseLeaveSwitch(obj)
{
	if(!obj)
	{
		return;
	}
	
	obj.style.backgroundColor = '';
	obj.style.cursor = '';
}

// 页面点击响应，通知给dlg
function OnPageClickEvent()
{
	fnFunction('change_dlg_mode', 'mode=independent');
	
	var evt = window.event;

	if(evt.srcElement)
	{
		if(evt.srcElement.id == 'nav-drop-btn')
		{
			var obj = document.getElementById('nav-drop')
			obj.style.display = obj.style.display == 'block' ? 'none' : 'block';
		}
		else
		{
			var obj = document.getElementById('nav-drop')
			obj.style.display = 'none';
		}
	}
}

function OnPageMouseLeave()
{
	fnFunction('change_dlg_mode', 'mode=hide');
	
	mouseLeave();
}

// 设置当日横坐标时间点
function initTimeXAxis()
{
	var nHour = 9;
	var nMin = 30;
	var nCount = 121;
	
	g_xAxisValue.splice(0, g_xAxisValue.length);
	
	setTimeXAxis(nHour, nMin, nCount);
	
	nHour = 13;
	nMin = 0;
	nCount = 122;
	
	setTimeXAxis(nHour, nMin, nCount);
}

// 设置时间段内的时间点
function setTimeXAxis(nHour, nMin, nCount)
{
	var strTime;
	var date = new Date();
	
	date.setHours(nHour);
	date.setMinutes(nMin);
	
	while(nCount--)
	{
		nHour = date.getHours();
		nHour = parseInt(nHour);
		
		if(nHour >= 1 && nHour <=9)
		{
			nHour = '0' + nHour;
		}
		
		nMin = date.getMinutes();
		date.setMinutes(nMin + 1);
		
		nMin = parseInt(nMin);
		
		if(nMin >= 0 && nMin <=9)
		{
			nMin = '0' + nMin;
		}
		
		strTime = nHour + ':' + nMin;
		g_xAxisValue.push(strTime);
	}
}

function OnReloadData()
{
	if(g_curLi == 'jsst')
	{
		HandleXcsStatus(g_xcsStatus);
	}
	else
	{
		clearAllHideView();
		document.getElementById("hide-drzjqx-loading").style.display="block";
		fnDrawDrZJQX(true);
	}
}
	

function fn_requestlog(arrLogParam,bNeedEncode,bSendWhenConExit)
{
	var arr_ext = {};
	var arr_std = {};
	var arr_local = {};
	
	if(!arguments[1])
	{
		bNeedEncode = false;
	}
	
	if(!arguments[2])
	{
		bSendWhenConExit = false;
	}
	
	arr_std['reqtype'] 	 = "2318";			
	arr_std['setcode'] 	 = "";									
	arr_std['refresh'] 	 = "1";
	arr_std['cachedata'] 	 = "1";
	arr_std['userkey']   	 = g_curUserInfo;
	
	if(bSendWhenConExit)
	{
		arr_std['sendwhenexitreq'] 	 = "1";
	}
	
	arr_ext['cmd'] = "cbas_ipo_log";	
	arr_ext['xd_local_notify_req'] = "1";
	
	arr_ext['logtype'] = "asset_log";
	arr_ext['zjzh'] = g_zjzh;
	
	if(bNeedEncode)
	{
		arr_ext['encode'] = '1';
	}
	
	arr_ext['module']	 = 'ZJQX';
	arr_ext['datatype']	 = arrLogParam[0];
	arr_ext['pkgver']	 = g_pkgVer;
	arr_ext['retcode']	 = arrLogParam[1];
	arr_ext['retmsg'] 	 = arrLogParam[2];
	arr_ext['cbasdata'] 	 = arrLogParam[3];
	arr_ext['qsid'] 	 = g_qsid
	arr_ext['userkey']	 = g_curUserInfo;
	arr_ext['ldatetime'] = get_cur_date() + clientTimeZone();
	arr_local['html_callback'] = 'fn_callback_ipolog';
	arr_local['destination']   = "1";
	fn_request(arr_std,arr_ext,arr_local);
}

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

function SendCBAS(formatKind, strParam)
{
	switch(formatKind)
	{
		case 6:
			{
				var arrParam = strParam.split('|');
				if(arrParam.length == 5)
				{
					var cbasObj = {};
					cbasObj['evt_type'] = arrParam[0];
					cbasObj['format'] = formatKind.toString();
					cbasObj['str1'] = arrParam[1];
					cbasObj['str2'] = arrParam[2];
					cbasObj['str3'] = arrParam[3];
					cbasObj['str4'] = arrParam[4];
					
					var strCbas = JSON.stringify(cbasObj);
					
					fnFunction('set_cbas', strCbas);
				}
			}
			break;
		default:
			break;
	}
}

function SendLogToServer(param1,param2,param3,param4,bNeedEncode)
{
	var logParam = [];
	
	if(!arguments[1])
	{
		bNeedEncode = false;
	}
	
	logParam.push(param1);
	logParam.push(param2);
	logParam.push(param3)
	logParam.push(param4);
	
	fn_requestlog(logParam, bNeedEncode, true);
}

function CalTickCount()
{
	var dateEnd = new Date();
	var dateInterval = dateEnd - g_dateStart;
	g_dateCount += dateInterval;
	var hour = Math.floor(dateInterval/(3600*1000));
	var leave = dateInterval%(3600*1000);
	var minute = Math.floor(leave/(60*1000));
	leave = leave%(60*1000);
	var second = Math.floor(leave/1000);
	g_strInterval += hour + ':' + minute + ':' + second + ':' + leave%1000 + ';';
}

function SendUserAction(bNeedEncode)
{
	if(!arguments[1])
	{
		bNeedEncode = false;
	}
	
	var strMsg = '';
	strMsg += 'd_dksc=' + g_strInterval + '|';
	
	var array_param = new Array();
	array_param = g_strInterval.split(';');
	
	strMsg += 'd_dkcs=' + (array_param.length -1) + '|';
	
	var hour = Math.floor(g_dateCount/(3600*1000));
	var leave = g_dateCount%(3600*1000);
	var minute = Math.floor(leave/(60*1000));
	leave = leave%(60*1000);
	var second = Math.floor(leave/1000);
	var strInterval = hour + ':' + minute + ':' + second + ':' + leave%1000;
	strMsg += 'd_dkzsc=' + strInterval + '|';
	
	strMsg += 'd_ccsl=' + g_nStockCount + '|';
	
	if(bUseCefBrowser)
	{
		strMsg += 'd_llqnh=cef';
	}
	else
	{
		strMsg += 'd_llqnh=ie';
	}
	
	SendLogToServer('DT_USER_ACTION', '0', '用户操作日志', strMsg, bNeedEncode);
}

function IsIE6Expor()
{
	var isIE=!!window.ActiveXObject;
	var isIE6=isIE&&!window.XMLHttpRequest;
	if(isIE6)
	{
		return true;
	}
	
	return false;
}