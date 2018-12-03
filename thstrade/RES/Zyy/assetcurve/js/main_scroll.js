document.write('<script type="text/javascript" src="../comm/hxcomm.js"></script> ');

var nMouseBeginPos = 0;
var nVBarBeginTop = 0;

function InitScroll()
{
	var eleVBar = document.getElementById("vbar");

	unbind(document,"mouseup", mouseUp);
	unbind(eleVBar,"mousedown", mouseDown);
	unbind(document,"selectstart", selectstart);
	
	unbind(document, "mousemove", mouseMoved);
	if(isNeedSetCapture())
	{
		eleVBar.releaseCapture();
	}
	
	nMouseBeginPos = 0;
	nVBarBeginTop = 0;
	
	BindEvents();
	OnMouseWheel("frame");
}

function mouseMoved(e)
{
	var strDivId = "frame";
	var eleDiv = document.getElementById(strDivId);
	var eleVScroll = document.getElementById("vscroll");
	var eleVBar = document.getElementById("vbar");
	
	var evt = e || event;

	var nMouseEndPos = evt.clientY;
	var nVBarEndTop = nMouseEndPos - nMouseBeginPos + nVBarBeginTop;
	
	if(nVBarEndTop > (eleVScroll.offsetHeight - eleVBar.offsetHeight))
	{
		nVBarEndTop = eleVScroll.offsetHeight - eleVBar.offsetHeight;
	}
	if(nVBarEndTop <= 0)
	{
		nVBarEndTop = 0;
	}

	eleVBar.style.top = nVBarEndTop + "px";
	eleDiv.style.top = -nVBarEndTop * (eleDiv.offsetHeight / eleVScroll.offsetHeight) + "px";
	
	if(g_nWheelBeginPos != nVBarEndTop)
	{
		g_bScrolled = true;
	}
	
	g_nWheelBeginPos = nVBarEndTop;
}

function mouseDown(e) {
	var evt= e || event;
	
	var eleVBar = document.getElementById("vbar");
	
	nMouseBeginPos = evt.clientY;
	nVBarBeginTop = eleVBar.offsetTop;
	  
	bind(document,"mousemove", mouseMoved);
	if(isNeedSetCapture())
	{
		eleVBar.setCapture();
	}
}

function mouseUp(e) {
	var evt= e || event;
	
	var eleVBar = document.getElementById("vbar");
	
	g_bScrolled = false;
	
	unbind(document, "mousemove", mouseMoved);
	if(isNeedSetCapture())
	{
		eleVBar.releaseCapture();
	}
}

function selectstart()
{
	return false;
}

function mouseLeave()
{
	if(!g_bScrolled)
	{
		g_bScrolled = false;
		unbind(document, "mousemove", mouseMoved);
		
		if(isNeedSetCapture())
		{
			var eleVBar = document.getElementById("vbar");
			eleVBar.releaseCapture();
		}
	}
}

function BindEvents()
{
	var eleVBar = document.getElementById("vbar");

	bind(document,"mouseup", mouseUp);
	bind(eleVBar,"mousedown", mouseDown);
	bind(document,"selectstart", selectstart);

	document.getElementById("vscroll_ctrl_up").onclick = function(e)
	{
		var strDivId = "frame";
		var eleDiv = document.getElementById(strDivId);
		var eleVScroll = document.getElementById("vscroll");
		var eleVBar = document.getElementById("vbar");
		var nVBarBeginTop = eleVBar.offsetTop;
		var nVBarEndTop = nVBarBeginTop - g_nRowHeight * (eleVScroll.offsetHeight / eleDiv.offsetHeight);
		
		if(nVBarEndTop <= 0)
		{
			nVBarEndTop = 0;
		}
	
		eleVBar.style.top = nVBarEndTop + "px";
		eleDiv.style.top = -nVBarEndTop * (eleDiv.offsetHeight / eleVScroll.offsetHeight) + "px";
		g_nWheelBeginPos = nVBarEndTop;
	}

	document.getElementById("vscroll_ctrl_up").onmouseover = function()
	{
		this.style.background = "url('./images/ctrl_up_press.png') no-repeat";
	}
	document.getElementById("vscroll_ctrl_up").onmouseout = function()
	{
		this.style.background = "url('./images/ctrl_up_normal.png') no-repeat";
	}
	
	document.getElementById("vscroll_ctrl_down").onclick = function(e)
	{
		var strDivId = "frame";
		var eleDiv = document.getElementById(strDivId);
		var eleVScroll = document.getElementById("vscroll");
		var eleVBar = document.getElementById("vbar");
		var nVBarBeginTop = eleVBar.offsetTop;
		var nVBarEndTop = nVBarBeginTop + g_nRowHeight * (eleVScroll.offsetHeight / eleDiv.offsetHeight);
		
		if(nVBarEndTop >= (eleVScroll.offsetHeight - eleVBar.offsetHeight))
		{
			nVBarEndTop = eleVScroll.offsetHeight - eleVBar.offsetHeight;
		}
	
		eleVBar.style.top = nVBarEndTop + "px";
		eleDiv.style.top = -nVBarEndTop * (eleDiv.offsetHeight / eleVScroll.offsetHeight) + "px";
		g_nWheelBeginPos = nVBarEndTop;
	}

	document.getElementById("vscroll_ctrl_down").onmouseover = function()
	{
		this.style.background = "url('./images/ctrl_down_press.png') no-repeat";
	}
	document.getElementById("vscroll_ctrl_down").onmouseout = function()
	{
		this.style.background = "url('./images/ctrl_down_normal.png') no-repeat";
	}
}

function ResizeVBar()
{
	var eleDiv = document.getElementById("frame");
	var eleDivContainer = document.getElementById("frame_container");
	var eleVScroll = document.getElementById("vscroll");
	var eleVBar = document.getElementById("vbar");
	
	var nDivHeight = eleDiv.offsetHeight
	var nDivContainerHeight = eleVScroll.offsetHeight;
	var nVScrollHeight = eleVScroll.offsetHeight;
	
	if(nDivHeight <= nVScrollHeight)
	{
		document.getElementById("vscroll_container").style.visibility = "hidden";
	}
	else
	{
		eleVBar.style.height = parseInt(nVScrollHeight * (nDivContainerHeight / nDivHeight)) + "px";
		eleVBar.style.top = parseInt(nVScrollHeight * (-eleDiv.offsetTop / nDivHeight)) + "px";
		
		document.getElementById("vscroll_container").style.visibility = "visible";
	}
}
  
function ResizeHBar()
{
	var strDivId = "frame";
	var eleDiv = document.getElementById(strDivId);
	var eleDivContainer = document.getElementById(strDivId + "_container");
	var eleRow = document.getElementById(strDivId + "_row");
	var eleHScroll = document.getElementById("hscroll");
	var eleHBar = document.getElementById("hbar");
	
	if(g_bHScroll)
	{
		var nDivWidth = eleDiv.offsetWidth;
		var nDivContainerWidth = eleDivContainer.offsetWidth;
		var nHScrollWidth = eleHScroll.offsetWidth;
		var nLeftBegin = eleHBar.offsetLeft;
		
		eleHBar.style.width = parseInt(nHScrollWidth * (nDivContainerWidth / nDivWidth)) + "px";
		if(g_bResetScroll)
		{
			eleHBar.style.left = "0px";
			eleDiv.style.left = "0px";
			eleRow.style.left = "0px";
		}
		else
		{
			eleHBar.style.left = parseInt(nHScrollWidth * (-eleDiv.offsetLeft / nDivWidth)) + "px";	
		}
	}
}

function OnMouseWheel(strDivId)
{
 	var eleContainer = document.getElementById(strDivId + "_container");
	var eleDiv = document.getElementById(strDivId);
	var eleVScroll = document.getElementById("vscroll");
	var eleVBar = document.getElementById("vbar");
	
	var node = typeof eleContainer == "string" ? $(eleContainer) : eleContainer;
	var nWheelEndPos = 0, nWheelPos=0;
	if(node)
	{
		MouseWheel(node, function(nDelta){
			if(document.getElementById("vscroll_container").style.visibility == "hidden")
			{
				eleDiv.style.top = "0px";
				return;
			}
			
			if(!nDelta || typeof(nDelta) == 'undefined' || isNaN(nDelta))
			{
				return;
			}
			
			nWheelPos += nDelta;
			
			if(g_nWheelBeginPos >= 0)
			{
				nWheelEndPos = g_nWheelBeginPos;
				eleVBar.style.top = nWheelEndPos + "px";
				nWheelPos = g_nWheelBeginPos * 12;
				g_nWheelBeginPos = -1;
			}
			else
			{
				nWheelEndPos = nWheelPos / 12;
			}
			if(nWheelEndPos <= 0)
			{
				nWheelEndPos = 0;
				nWheelPos = 0;
			}
			if(nWheelEndPos >= (eleVScroll.offsetHeight - eleVBar.offsetHeight))
			{
				nWheelEndPos = (eleVScroll.clientHeight - eleVBar.offsetHeight);
				nWheelPos = (eleVScroll.clientHeight - eleVBar.offsetHeight) * 12;
			}
			
			if(eleVScroll.offsetHeight > 0)
			{
				eleVBar.style.top = nWheelEndPos + "px";
				eleDiv.style.top = -nWheelEndPos * (eleDiv.offsetHeight / eleVScroll.offsetHeight) + "px";
			}
		});
	}
}
 
function bind(obj, type, handler){
	var node = typeof obj == "string" ? $(obj) : obj;
	if(node.addEventListener)
	{
		node.addEventListener(type, handler, false);
	}
	else if(node.attachEvent)
	{
		node.attachEvent('on'+type,handler);
	}
	else
	{
		node['on' + type] = handler;
	}
}

function unbind(obj, type, handler){
	var node = typeof obj == "string" ? $(obj) : obj;
	if(node.removeEventListener)
	{
		node.removeEventListener(type, handler, false);
	}
	else if(node.detachEvent)
	{
		node.detachEvent('on'+type,handler);
	}
	else
	{
		node['on' + type] = null;
	}
}

function MouseWheel(obj, handler){
	var node = typeof obj == "string" ? $(obj) : obj;
	bind(node, 'mousewheel', function(event){
		var nDelta = -GetWheelDelta(event);
		handler(nDelta);
		if(document.all)
		{
			window.event.returnValue = false;
		}
		else
		{
			event.preventDefault();
		}
	});

	function GetWheelDelta(event){
		var e = event || window.event;
		return e.wheelDelta ? e.wheelDelta : e.detail * 40;
	}
}

function isNeedSetCapture(){
	var usrAgt = navigator.userAgent;
    var isIE = usrAgt.indexOf("compatible") > -1 && usrAgt.indexOf("MSIE") > -1;
	
    if (isIE) {
        var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
        reIE.test(usrAgt);
        var fIEVersion = RegExp["$1"];
		
        if (fIEVersion == 7) 
		{
			if(usrAgt.indexOf("Trident") < 0)
			{
				return true;
			}
		
			var reTrident = new RegExp("Trident/(\\S+)[);]");
			reTrident.test(usrAgt);
			
			var tridentVer = RegExp["$1"];
			
			if(parseInt(tridentVer) < 5)
			{
				return true;
			}
        }
    }
	
	return false;
   
}