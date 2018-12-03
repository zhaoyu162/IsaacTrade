var g_nRefreshTimes = 0;

function AdjustScrollPos()
{
	var strDivId = GetCurrentTable();
	var eleTable = document.getElementById(strDivId + "_condition_table");
	var eleRow = document.getElementById(strDivId + "_row");
	var eleContainer = document.getElementById(strDivId + "_container");
	var eleDiv = document.getElementById(strDivId);
	var eleVScrollContainer = document.getElementById("vscroll_container");
	var eleVScroll = document.getElementById("vscroll");
	var eleVCtrlDown = document.getElementById("vscroll_ctrl_down");
	var eleVCtrlUp = document.getElementById("vscroll_ctrl_up");
	var eleHScrollContainer = document.getElementById("hscroll_container");
	var eleHScroll = document.getElementById("hscroll");
	var eleHCtrlRight = document.getElementById("hscroll_ctrl_right");
	var eleHCtrlLeft = document.getElementById("hscroll_ctrl_left");
	
	var elePageCtrl = document.getElementById(strDivId + "_page_control_div")
	var nVAdjustment = 0;

	if(eleTable == null)
		return;
	
	var nTableItems = TB_GetDataByID(GetCurrentTable()).length;
	if(nTableItems > g_nMaxRows)
	{
		nVAdjustment = g_nPageCtrlHeight;
		elePageCtrl.style.display = "inline";
	}
	nTableItems = (g_tbPageIndex[strDivId] * g_nMaxRows > nTableItems ? (nTableItems - (g_tbPageIndex[strDivId] - 1) * g_nMaxRows) : g_nMaxRows);
	eleDiv.style.height = (nTableItems < g_nMaxRows ? nTableItems : g_nMaxRows) * (g_nRowHeight - 2) + (g_nTableHeadHeight - 2) - 1 + "px";
	eleDiv.style.width = eleTable.offsetWidth + "px";
	
	if(document.documentElement.clientHeight - g_nPageHeadHeight - nVAdjustment - (g_bHScroll ? g_nScrollWidth : 0) < g_nTableHeadHeight)
	{
		eleVScrollContainer.style.display = "none";
		eleHScrollContainer.style.display = "none";
		eleVCtrlDown.style.display = "none";
		eleVCtrlUp.style.display = "none";
		eleHCtrlLeft.style.display = "none";
		eleHCtrlRight.style.display = "none";
		elePageCtrl.style.display = "none";
		return;
	}
	eleContainer.style.height = document.documentElement.clientHeight - g_nPageHeadHeight - nVAdjustment + "px";
	
	if(eleDiv.offsetTop + eleDiv.offsetHeight < eleContainer.offsetHeight)
	{
		eleDiv.style.top = ((eleContainer.offsetHeight - eleDiv.offsetHeight < 0) ? (eleContainer.offsetHeight - eleDiv.offsetHeight) : 0) + "px";
	}
	if(document.documentElement.clientHeight < (g_nPageHeadHeight + (g_nTableHeadHeight - 2) + nTableItems * (g_nRowHeight - 2) + nVAdjustment))
	{
		g_bVScroll = true;
		eleVScrollContainer.style.height = eleContainer.offsetHeight + "px";
		eleVScrollContainer.style.display = "inline";
		eleVCtrlDown.style.display = "inline";
		eleVCtrlUp.style.display = "inline";
		eleVScroll.style.height = eleVScrollContainer.offsetHeight - 2 * g_nScrollCtrlWidth + "px";
		eleVCtrlDown.style.top = eleVScrollContainer.offsetHeight - g_nScrollCtrlWidth + "px"
	}
	else
	{
		g_bVScroll = false;
		eleVScrollContainer.style.display = "none";
		eleVCtrlDown.style.display = "none";
		eleVCtrlUp.style.display = "none";
	}
	
	if(document.documentElement.clientWidth <= (g_bVScroll ? g_nScrollWidth : 0))
	{
		eleHScrollContainer.style.display = "none";
		eleHCtrlLeft.style.display = "none";
		eleHCtrlRight.style.display = "none";
		eleContainer.style.borderBottom = "1px solid #DEDEDE";
	}
	if(document.documentElement.clientWidth <= elePageCtrl.offsetWidth)
	{
		elePageCtrl.style.display = "none";
	}
	eleContainer.style.width = document.documentElement.clientWidth - (g_bVScroll ? g_nScrollWidth : 0) + "px";
	
	if(eleDiv.offsetLeft + eleDiv.offsetWidth < eleContainer.offsetWidth)
	{
		eleDiv.style.left = ((eleContainer.offsetWidth - eleDiv.offsetWidth < 0) ? (eleContainer.offsetWidth - eleDiv.offsetWidth) : 0) + "px";
		eleRow.style.left = eleDiv.offsetLeft + "px";
	}
	if(document.documentElement.clientWidth < (eleTable.offsetWidth + (g_bVScroll ? g_nScrollWidth : 0)))
	{
		g_bHScroll = true;
		eleHScrollContainer.style.top = document.documentElement.clientHeight - nVAdjustment - g_nScrollWidth + "px";
		eleHScrollContainer.style.width = eleContainer.offsetWidth + "px";
		eleHScroll.style.width = eleContainer.offsetWidth - 2 * g_nScrollCtrlWidth + "px";
		eleHCtrlRight.style.left = eleContainer.offsetWidth - g_nScrollCtrlWidth + "px";
		eleHScrollContainer.style.display = "inline";
		eleHCtrlLeft.style.display = "inline";
		eleHCtrlRight.style.display = "inline";
		eleContainer.style.border = "0px";
	}
	else
	{
		g_bHScroll = false;
		eleHScrollContainer.style.display = "none";
		eleHCtrlLeft.style.display = "none";
		eleHCtrlRight.style.display = "none";
		eleContainer.style.borderBottom = "1px solid #DEDEDE";
	}
	
	if(g_bVScroll)
	{
		eleVScrollContainer.style.left = document.documentElement.clientWidth - g_nScrollWidth + "px";
		if(g_bHScroll)
		{
			eleVScrollContainer.style.height = eleVScrollContainer.offsetHeight - g_nScrollWidth + "px";
			eleVScroll.style.height = eleVScrollContainer.offsetHeight - 2 * g_nScrollCtrlWidth + "px";
			eleVCtrlDown.style.top = eleVScrollContainer.offsetHeight - g_nScrollCtrlWidth + "px"
		}		
	}
}

function AdjustPageCtrlPos()
{
	var strDivId = GetCurrentTable();
	var eleContainer = document.getElementById(strDivId + "_container");
	var elePageCtrl;
	if(strDivId == "not_triggered_div")
	{
		elePageCtrl = document.getElementById("not_triggered_div_page_control_div");
	}
	else if(strDivId == "triggered_div")
	{
		elePageCtrl = document.getElementById("triggered_div_page_control_div");
	}
	else if(strDivId == "invalid_div")
	{
		elePageCtrl = document.getElementById("invalid_div_page_control_div");
	}

	elePageCtrl.style.top = document.documentElement.clientHeight - 30 + "px";
	if(g_bHScroll)
	{
		elePageCtrl.style.left = eleContainer.offsetWidth - elePageCtrl.offsetWidth - 5 + "px";		
	}
	else
	{
		elePageCtrl.style.left = eleContainer.offsetWidth - elePageCtrl.offsetWidth - 17 + "px";		
	}
}

function AdjustPos(bReset)
{
	var eleContainer;
	eleContainer = document.getElementById("not_triggered_div_container");
	eleContainer.style.border = "0px";
	eleContainer = document.getElementById("triggered_div_container");
	eleContainer.style.border = "0px";
	eleContainer = document.getElementById("invalid_div_container");
	eleContainer.style.border = "0px";

	g_bResetScroll = bReset;
	AdjustScrollPos();
	ResizeHBar();
	ResizeVBar();
	AdjustBtnPos();
	AdjustPageCtrlPos();
}

//--------windows events----------------------------
function OnWindowResize()
{
	AdjustPos(false);
}

function OnDocumentClicked()
{
	var eleMenu = document.getElementById("menu");
	eleMenu.style.display = "none";
}
//--------------------------------------------------

//--------tab events--------------------------------
function OnTabNotTriggered()
{
	SetCurrentTable("not_triggered_div");
	HideAllTables();
	HideAllPageControls();
	HideAllSmallBtns();
	ShowElement("not_triggered_div_container");
	ShowElement("not_triggered_div_row");
	ShowElement("not_triggered_div_page_control_div");
	ShowElement("btn_stop");
	ShowElement("btn_run");
	ShowElement("btn_modify");
	ShowElement("btn_delete");
	TP_InitUI("not_triggered_div_page_control_div");
	UpdateBtnStatus();
	AdjustPos(true);
}

function OnTabTriggered()
{
	SetCurrentTable("triggered_div");
	HideAllTables();
	HideAllPageControls();
	HideAllSmallBtns();
	ShowElement("triggered_div_container");
	ShowElement("triggered_div_row");
	ShowElement("triggered_div_page_control_div");
	ShowElement("btn_resend");
	TP_InitUI("triggered_div_page_control_div");
	UpdateBtnStatus();
	AdjustPos(true);
}

function OnTabInvalid()
{
	SetCurrentTable("invalid_div");
	HideAllTables();
	HideAllPageControls();
	HideAllSmallBtns();
	ShowElement("invalid_div_container");
	ShowElement("invalid_div_row");
	ShowElement("invalid_div_page_control_div");
	ShowElement("btn_resend");
	TP_InitUI("invalid_div_page_control_div");
	UpdateBtnStatus();
	AdjustPos(true);
}
//--------------------------------------------------

//--------button events--------------------------------
function OnBtnStopClick()
{
	var arrItems = GetStopableItems();
	for(var nIndex in arrItems)
	{
		var jsonItem = arrItems[nIndex];
		var jsonParam = {};
		jsonParam["userkey"] = g_strUserKey;
		jsonParam["htbh"] = jsonItem["htbh"];
		fn_Tjd_pause(jsonParam, "fnPauseCallback");
	}
}

function OnBtnRunClick()
{
	var arrItems = GetRunableItems();
	for(var nIndex in arrItems)
	{
		var jsonItem = arrItems[nIndex];
		var jsonParam = {};
		jsonParam["userkey"] = g_strUserKey;
		jsonParam["htbh"] = jsonItem["htbh"];
		fn_Tjd_active(jsonParam, "fnActiveCallback");
	}
}

function OnBtnModifyClick()
{
	var jsonItem = GetModifiableItem();
	if(jsonItem == null)
		return;
	
	var strWtlb = jsonItem["wtlb"];
	if(strWtlb != "1" && strWtlb != "2")
		return;
	
	var bBuy = ((strWtlb == "1") ? true : false);
	var arrParam = {};
	arrParam["type"] = "condition";
	arrParam["url"] = bBuy ? "buy_ui.html" : "sell_ui.html";
	var arrSubParam = {};
	arrSubParam["userkey"] = g_strUserKey;
	arrSubParam["flag"] = "modify";
	arrSubParam["main_hwnd"] = g_strHwnd;
	arrSubParam["htbh"] = jsonItem["htbh"];
	arrSubParam["cfrq"] = jsonItem["cfrq"];
	arrSubParam["name"] = bBuy ? "buyhtml" : "sellhtml";
	arrSubParam["id"] = "0";
	arrSubParam["condition_status"] = jsonItem["condition_status"];
	var strSubParam = window.JSON.stringify(arrSubParam);
	arrParam["param"] = strSubParam;
	
	var strParam = window.JSON.stringify(arrParam);
	fnFunction("create_js", strParam);
}

function OnBtnResendClick()
{
	var jsonItem = GetResendableItems();
	if(jsonItem == null)
		return;
	
	var strWtlb = jsonItem["wtlb"];
	if(strWtlb != "1" && strWtlb != "2")
		return;
	var bBuy = ((strWtlb == "1") ? true : false);
	var arrParam = {};
	arrParam["type"] = "condition";
	arrParam["url"] = bBuy ? "buy_ui.html" : "sell_ui.html";
	var arrSubParam = {};
	arrSubParam["userkey"] = g_strUserKey;
	arrSubParam["flag"] = "resend";
	arrSubParam["main_hwnd"] = g_strHwnd;
	arrSubParam["htbh"] = jsonItem["htbh"];
	arrSubParam["cfrq"] = jsonItem["cfrq"];
	arrSubParam["name"] = bBuy ? "buyhtml" : "sellhtml";
	arrSubParam["id"] = "0";
	arrSubParam["condition_status"] = jsonItem["condition_status"];
	var strSubParam = window.JSON.stringify(arrSubParam);
	arrParam["param"] = strSubParam;
	
	var strParam = window.JSON.stringify(arrParam);
	fnFunction("create_js", strParam);
}

function OnBtnDeleteClick()
{
	var nCount = GetDeletableItems().length;
	if(nCount == 1)
	{
		MessageBox("确定删除该笔预埋单?", "confirm_cancel", "fnDelete");
	}
	else if(nCount > 1)
	{
		MessageBox("确定删除选中的" + nCount + "笔预埋单?", "confirm_cancel", "fnDelete");
	}
}

function fnDelete()
{
	var arrData = TB_GetDataByID("not_triggered_div");
	for(var nIndex in arrData)
	{
		var jsonItem = arrData[nIndex];
		if(jsonItem["bCheck"])
		{
			var jsonParam = {};
			jsonParam["userkey"] = g_strUserKey;
			jsonParam["htbh"] = jsonItem["htbh"];
			fn_Tjd_chedan(jsonParam, "fnCheDanCallback");
		}
	}
}

function OnBtnConditionBuyClick()
{
	var arrParam = {};
	arrParam["type"] = "condition";
	arrParam["url"] = "buy_ui.html";
	var arrSubParam = {};
	arrSubParam["userkey"] = g_strUserKey;
	arrSubParam["main_hwnd"] = g_strHwnd;
	arrSubParam["flag"] = "create";
	arrSubParam["id"] = "0";
	arrSubParam["name"] = "buyhtml";
	var strSubParam = window.JSON.stringify(arrSubParam);
	arrParam["param"] = strSubParam;
	
	var strParam = window.JSON.stringify(arrParam);
	fnFunction("create_js", strParam);
}

function OnBtnConditionSellClick()
{
	var arrParam = {};
	arrParam["type"] = "condition";
	arrParam["url"] = "sell_ui.html";
	var arrSubParam = {};
	arrSubParam["userkey"] = g_strUserKey;
	arrSubParam["main_hwnd"] = g_strHwnd;
	arrSubParam["flag"] = "create";
	arrSubParam["name"] = "sellhtml";
	arrSubParam["id"] = "0";
	var strSubParam = window.JSON.stringify(arrSubParam);
	arrParam["param"] = strSubParam;
	
	var strParam = window.JSON.stringify(arrParam);
	fnFunction("create_js", strParam);
}

function OnBtnConditionSettingClick()
{
	var jsonParam = {};
	jsonParam["type"] = "condition";
	jsonParam["url"] = "system_ui.html";
	var jsonSubParam = {};
	jsonSubParam["userkey"] = g_strUserKey;
	jsonSubParam["strBlockId"] = "";
	jsonSubParam["name"] = "system_uihtml";
	jsonSubParam["id"] = "0";
	var strSubParam = window.JSON.stringify(jsonSubParam);
	jsonParam["param"] = strSubParam;
	
	var strParam = window.JSON.stringify(jsonParam);
	fnFunction("create_js", strParam);
}
//--------------------------------------------------


//--------table events--------------------------------
function OnCheckItemClick(strParentId, nIndex)
{
	var bCheck = false;
	var arrData = TB_GetDataByID(strParentId);
	for(var i in arrData)
	{
		var jsonData = arrData[i];
		var nDataIndex = nIndex + (g_tbPageIndex[strParentId] - 1) * g_nMaxRows - 1;
		if(nDataIndex == i && (GetTableIdByStatus(jsonData["condition_status"]) == strParentId))
		{
			bCheck = jsonData["bCheck"];
			jsonData["bCheck"] = !bCheck;
			bCheck = jsonData["bCheck"];
		}
	}
	
	var strImgID = strParentId + "_condition_row" + nIndex + "_checkbox_img";
	var eleImg = document.getElementById(strImgID);
	eleImg.src = bCheck ? "images/main_check.png" : "images/main_uncheck.png";
	var strRowID = strParentId + "_condition_row" + nIndex;
	var eleRow = document.getElementById(strRowID);
	eleRow.className = "table_row " + (bCheck ? "selected" : "unselected");
	
	UpdateBtnStatus();
}

function OnRowDbClick(jsonParam)
{
	var arrParam = {};
	arrParam["type"] = "condition";
	arrParam["url"] = "detail_ui.html";
	var arrSubParam = {};
	arrSubParam["userkey"] = g_strUserKey;
	arrSubParam["htbh"] = jsonParam["htbh"];
	arrSubParam["cfrq"] = jsonParam["cfrq"];
	arrSubParam["name"] = "detailhtml";
	arrSubParam["id"] = "0";
	arrSubParam["condition_status"] = jsonParam["condition_status"];
	var strSubParam = window.JSON.stringify(arrSubParam);
	arrParam["param"] = strSubParam;
	
	var strParam = window.JSON.stringify(arrParam);
	fnFunction("create_js", strParam);
}

function OnRowMouseUp(strParentId, jsonData)
{
	if(event.button != 2)
		return;
	
	var arrData = TB_GetDataByID(strParentId);
	for(var nIndex in arrData)
	{
		var jsonItem = arrData[nIndex];
		var eleRowItem = document.getElementById(strParentId + "_condition_row" + jsonItem["nIndex"]);
		if(eleRowItem == null)
			continue;
		
		if(eleRowItem.className == "table_row selected_blue")
		{
			eleRowItem.className = "table_row selected";
		}
	}
	
	var eleRow = document.getElementById(strParentId + "_condition_row" + jsonData["nIndex"]);
	if(eleRow.className != "table_row selected_blue")
	{
		jsonData["bCheck"] = true;
	}
	
	var eleImg = document.getElementById(strParentId + "_condition_row" + jsonData["nIndex"] + "_checkbox_img");
	eleImg.src = jsonData["bCheck"] ? "images/main_check.png" : "images/main_uncheck.png";
	eleRow.className = "table_row " + (jsonData["bCheck"] ? "selected_blue" : "unselected");
	UpdateBtnStatus();
	
	var nLeft = event.clientX;
	var nHeight = event.clientY;
	
	var bRunning = IsConditionRunning(jsonData["condition_status"]);
	var funcStop = function(){OnMenuStopClick(jsonData);};
	var funcContinue = function(){OnMenuContinueClick(jsonData);};
	var funcChange = function(){OnMenuChangeClick(jsonData);};
	var funcResend = function(){OnMenuResendClick(jsonData);};
	var funcDelete = function(){OnMenuDeleteClick(jsonData);};
	if(strParentId == "not_triggered_div")
	{
		var arrItems = new Array();
		arrItems.push(TM_CreateItemData(0, bRunning ? "stop_monitor" : "continue_monitor",
										bRunning ? "images/menu_stop.png" : "images/menu_continue.png",
										bRunning ? "暂停监控" : "继续监控", bRunning ? funcStop : funcContinue));
		arrItems.push(TM_CreateItemData(1, "modify", "images/menu_change.png", "修改订单", funcChange));
		arrItems.push(TM_CreateItemData(2, "delete", "images/menu_delete.png", "删除订单", funcDelete));
		TM_Constructor("menu", arrItems);
	}
	else if(strParentId == "triggered_div" || strParentId == "invalid_div")
	{
		var arrItems = new Array();
		arrItems.push(TM_CreateItemData(0, "modify", "images/menu_change.png", "重发订单", funcResend));
		TM_Constructor("menu", arrItems);
	}
	
	var eleMenu = document.getElementById("menu");
	eleMenu.style.left = nLeft + "px";
	if(document.documentElement.clientHeight - nHeight > eleMenu.offsetHeight)
	{
		eleMenu.style.top = nHeight + "px";
	}
	else
	{
		eleMenu.style.top = nHeight - eleMenu.offsetHeight + "px";
	}
}
//--------------------------------------------------

//--------menu events--------------------------------
function OnMenuStopClick(jsonItem)
{
	var jsonParam = {};
	jsonParam["userkey"] = g_strUserKey;
	jsonParam["htbh"] = jsonItem["htbh"];
	fn_Tjd_pause(jsonParam, "fnPauseCallback");
}

function OnMenuContinueClick(jsonItem)
{
	var jsonParam = {};
	jsonParam["userkey"] = g_strUserKey;
	jsonParam["htbh"] = jsonItem["htbh"];
	fn_Tjd_active(jsonParam, "fnActiveCallback");
}

function OnMenuChangeClick(jsonItem)
{
	var strWtlb = jsonItem["wtlb"];
	if(strWtlb != "1" && strWtlb != "2")
		return;
	
	var bBuy = ((strWtlb == "1") ? true : false);
	var arrParam = {};
	arrParam["type"] = "condition";
	arrParam["url"] = bBuy ? "buy_ui.html" : "sell_ui.html";
	var arrSubParam = {};
	arrSubParam["userkey"] = g_strUserKey;
	arrSubParam["flag"] = "modify";
	arrSubParam["main_hwnd"] = g_strHwnd;
	arrSubParam["htbh"] = jsonItem["htbh"];
	arrSubParam["cfrq"] = jsonItem["cfrq"];
	arrSubParam["id"] = "0";
	arrSubParam["name"] = bBuy ? "buyhtml" : "sellhtml";
	arrSubParam["condition_status"] = jsonItem["condition_status"];
	var strSubParam = window.JSON.stringify(arrSubParam);
	arrParam["param"] = strSubParam;
	
	var strParam = window.JSON.stringify(arrParam);
	fnFunction("create_js", strParam);
}

function OnMenuResendClick(jsonItem)
{
	var strWtlb = jsonItem["wtlb"];
	if(strWtlb != "1" && strWtlb != "2")
		return;
	
	var bBuy = ((strWtlb == "1") ? true : false);
	var arrParam = {};
	arrParam["type"] = "condition";
	arrParam["url"] = bBuy ? "buy_ui.html" : "sell_ui.html";
	var arrSubParam = {};
	arrSubParam["userkey"] = g_strUserKey;
	arrSubParam["flag"] = "resend";
	arrSubParam["main_hwnd"] = g_strHwnd;
	arrSubParam["htbh"] = jsonItem["htbh"];
	arrSubParam["cfrq"] = jsonItem["cfrq"];
	arrSubParam["name"] = bBuy ? "buyhtml" : "sellhtml";
	arrSubParam["id"] = "0";
	arrSubParam["condition_status"] = jsonItem["condition_status"];
	var strSubParam = window.JSON.stringify(arrSubParam);
	arrParam["param"] = strSubParam;
	
	var strParam = window.JSON.stringify(arrParam);
	fnFunction("create_js", strParam);
}

function OnMenuDeleteClick(jsonItem)
{
	var jsonParam = {};
	jsonParam["userkey"] = g_strUserKey;
	jsonParam["htbh"] = jsonItem["htbh"];
	var strParam = window.JSON.stringify(jsonParam);

	MessageBox("确定删除该笔预埋单?", "confirm_cancel", "fnMenuDelete", strParam);
}

function fnMenuDelete(strParam)
{
	var jsonParam = window.JSON.parse(strParam);
	fn_Tjd_chedan(jsonParam, "fnCheDanCallback");
}
//--------------------------------------------------


//--------page control events--------------------------------
function OnPrePageBtnClicked(strParentId)
{
	var nCurPageIndex = g_arrPages[strParentId + "_cur_page_index"];
	TP_AdjustNumPages(strParentId, nCurPageIndex - 1);
}

function OnNextPageBtnClicked(strParentId)
{
	var nCurPageIndex = g_arrPages[strParentId + "_cur_page_index"];
	TP_AdjustNumPages(strParentId, nCurPageIndex + 1);
}

function OnNumBtnClicked(strParentId, nIndex)
{
	TP_AdjustNumPages(strParentId, nIndex);
}

function OnConfirmBtnClicked(strParentId)
{
	var eleInput = document.getElementById(strParentId + "_input");
	var nPageIndex = parseInt(eleInput.value, 10);
	if(isNaN(nPageIndex))
		return;
	
	var nMaxPages = g_arrPages[strParentId + "_max_pages"];
	if(nPageIndex < 1 || nPageIndex > nMaxPages)
		return;
	
	TP_AdjustNumPages(strParentId, nPageIndex);
}

function OnNumBtnMouseDown(strParentId, nIndex)
{
	TP_ReInitNumBtn(strParentId);
	var eleBtnText = document.getElementById(strParentId + "btn" + nIndex + "_text");
	var eleBtnImg = document.getElementById(strParentId + "btn" + nIndex + "_img");
	eleBtnImg.src = "images/page_num_press.png";
	eleBtnText.className = "page_num_btn_text_pos btn_page_text_white";
	g_arrPages[strParentId + "_cur_page_index"] = nIndex;
}

function OnNumBtnMouseUp(strParentId, nIndex)
{
	
}

function OnNumBtnMouseOver(strParentId, nIndex)
{
	if(g_arrPages[strParentId + "_cur_page_index"] == nIndex)
		return;
	
	var eleBtnText = document.getElementById(strParentId + "btn" + nIndex + "_text");
	var eleBtnImg = document.getElementById(strParentId + "btn" + nIndex + "_img");
	eleBtnImg.src = "images/page_num_hover.png";
	eleBtnText.className = "page_num_btn_text_pos btn_page_text_black";
}

function OnNumBtnMouseOut(strParentId, nIndex)
{
	if(g_arrPages[strParentId + "_cur_page_index"] == nIndex)
		return;
	
	var eleBtnText = document.getElementById(strParentId + "btn" + nIndex + "_text");
	var eleBtnImg = document.getElementById(strParentId + "btn" + nIndex + "_img");
	eleBtnImg.src = "images/page_num_normal.png";
	eleBtnText.className = "page_num_btn_text_pos btn_page_text_black";
}
//--------------------------------------------------

//-----------timer events  -------------------------
function fnOnTimer(strTimerId) 
{
	if(strTimerId == "100")
	{
		QueryOrders();
	}
	else if(strTimerId == "200")
	{
		g_nRefreshTimes++;
		if(g_nRefreshTimes <= 3)
		{
			QueryConditionOrders("");
		}
		else 
		{
			fnFunction("kill_timer", "200");
		}
	}
}
//--------------------------------------------------











