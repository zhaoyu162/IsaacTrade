/*////////////////////////////////
 * JQuery 模态对话框
 * Author: dongchengang@myhexin.com
 * Date: 2011-07-18
*/

$(document).ready(function(){
	// 创建遮罩层
	maskDiv = document.createElement("div");
	maskDiv.id = "mask_OverLay";
	$(maskDiv).addClass("mask_layer");
	
	$.ShowModalWindow = function(p){
		p = $.extend({
			caption : "提示",				// 对话框提示文字
			bodyHTML : '',					// 内部显示内容的HTML代码
			width : 400,
			height : 300,
			bindCheckbox : false,		// 是否有联动的checkbox和按钮绑定
			bindCheckboxLabel : false,	// 联动的checkbox显示的文字
			buttons : [{
				name : "确定",
				bindCheckbox : false,	// 该按钮是否有checkbox绑定
				onPress : divBox_close	// 按下按钮后执行的事件，默认关闭窗口
			}]
		}, p);
		// 整个ModalWidnow
		var modalLayer = document.createElement("div");
		modalLayer.id = "modalLayer";
		modalLayer.style.display="none";
		
		// 增加dialog窗口
		var modalDialog = document.createElement("div");
		modalDialog.id = "modal_dialog";
		$(modalDialog).addClass("modal_dialog");
		// 设置位置居中
		$(modalDialog).css('left', (window.innerWidth - p.width) / 2).css('top', (window.innerHeight - p.height) / 2);
		
		var win_caption = document.createElement('div');	// 标题
		var win_body = document.createElement('div');		// 内容
		var win_button = document.createElement('div');		// 按钮
		var win_bottom = document.createElement('div');		// 底边
		
		// 设置标题
		var innerCaption = document.createElement('div');
		innerCaption.innerText = p.caption;
		$(innerCaption).css('width', p.width - 30);
		$(win_caption).append(innerCaption).addClass("win_caption"); // 设定标题文字显示的宽度
		
		// 设置内容
		win_body.innerHTML = p.bodyHTML;
		$(win_body).addClass("win_body").css('height', p.height - 68); // 设定内容部分的高度
		// 设置 checkbox 按钮联动
		if (p.bindCheckbox === true)
		{
			// 添加一个checkbox
			var checkbox = document.createElement('input');
			checkbox.type = 'checkbox';
			
			$(checkbox).change(function(){
				var bbtn = $('.bindCheckBtn');
				if (this.checked == true)
					bbtn.removeAttr('disabled');
				else
					bbtn.attr('disabled', 'disabled');
			});
			// 增加一个 label
			var lbl = document.createElement('label');
			$(lbl).append(checkbox).append(p.bindCheckboxLabel);
			
			var bcb = document.createElement('p');
			$(bcb).css('text-align', 'center').append(lbl);
			$(win_body).append(bcb);
		}
		
		// 设置按钮
		$(win_button).addClass('win_buttons').css('text-align', 'center');
		if (p.buttons && p.buttons.length > 0)
		{
			var op_btns = p.buttons;
			// 生成按钮
			var len = op_btns.length;
			for (i=0;i<len;i++)
			{
				var btn_dom = document.createElement('input');
				btn_dom.type = "button";
				btn_dom.value = op_btns[i].name;
				
				var btn = $(btn_dom);
				btn.click(op_btns[i].onPress || divBox_close);
				// 设置绑定关联
				if (p.bindCheckbox === true && op_btns[i].bindCheckbox === true)
				{
					btn.addClass('bindCheckBtn').attr('disabled', 'disabled');
				}
				// 增加自定义按钮风格
				if (op_btns[i].addClass)
				{
					btn.addClass(op_btns[i].addClass);
				}
				$(win_button).append(btn_dom);
			}
		}
		else
		{
			// 生成一个按钮
			var btn = document.createElement('input');
			btn.value = "确定";
			btn.type = "button";
			$(btn).click(divBox_close);
			$(win_button).append(btn);
		}
		
		// 设置bottom
		$(win_bottom).addClass('win_bottom');
		
		// 添加到 modalDialog
		$(modalDialog).css('width', p.width).css('height', p.height);
		$(modalDialog).append(win_caption).append(win_body).append(win_button).append(win_bottom);
		
		// 增加到DOM
		$(modalLayer).append(modalDialog).append(maskDiv);
		
		$("body").append(modalLayer);
		modalLayer.style.display="block";
		
		// 动态计对话框的位置
		$(window).resize(function(){$(modalDialog).css('left', (window.innerWidth - p.width) / 2).css('top', (window.innerHeight - p.height) / 2);});
	}
});

// 移除窗口
function divBox_close()
{
	// 移除窗口dom节点
	$("#modalLayer").remove();
}