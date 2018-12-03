/*
	Kailash Nadh (http://kailashnadh.name)

	tinytooltip | March 2012
	A tiny tooltip plugin for jQuery

	Refactored on 15 September 2013

	License	:	MIT License
*/
(function($) {

	$.fn.tinytooltip = function(args) {

		// default options
		var options = {
			message: '',
			hover: true,
			classes: ''
		};
		if(args) {
			$.extend(options, args);
		}

		return this.each(function(){
			var me = $(this);

			var obj = document.getElementsByClassName('tinytooltip');
			for(var i = 0; i < obj.length; i++)
			{
				obj[i].style.display = 'none';
			}
			
			me.unbind();
			
			me.bind( (options.hover ? 'mouseover ' : '') + 'showtooltip', function() {
				if( me.data('tinyactive') ) {
					clearTimeout(me.timer);
					return;
				}
				me.data('tinyactive', 1);
				render(me);
			});
			me.bind( (options.hover ? 'mouseout ' : '') + 'hidetooltip', function() {
				clearTimeout(me.timer);

				me.timer = setTimeout(function() {
					me.data('tinyactive', '');
					destroy(me);
				}, 40);
			});
		});

		function render(me) {
			// parent's position
			var pos = me.offset();
			
			// tooltip html
			var tip = $('<span class="tinytooltip'+ (options.classes ? ' ' + options.classes : '') +'">');
				tip.append('<span class="arrow">');
				tip.append(
					$('<span class="message">').append( typeof options.message == "function" ? options.message.call(me, tip) : options.message )
				);

			tip.css('opacity', 0).hide();
			$('body').append(tip);

			// position the tooltip beside the parent
			tip.css('left', pos.left + 20);
			if(pos.top + tip.outerHeight() > document.body.clientHeight)
			{
				tip.css('top', document.body.clientHeight - tip.height() - 10);
			}
			else
			{
				tip.css('top', pos.top + me.outerHeight());
			}

			me.data('tinytooltip', tip);

			tip.show().animate({opacity: 1}, 200);
		}

		function destroy(me) {
			var tip = me.data('tinytooltip');

			if(tip) {
				tip.animate({opacity: 0}, 200, function() {
					$(this).remove();
				});
			}
		}
	};
	
	return this;
})(jQuery);
