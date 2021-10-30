function layer_new_navigation_vs7_func(params){
	var layer_id = params['layer_id'];
	window[layer_id+'_getSubMenuHoverCss'] = function(css_pro,type){
		var typeval=type;
		if(typeval == 1){
			var regex = "#nav_layer[0-9|a-z|A-Z]+\\s+ul+\\s+li+\\s+a:\\s*hover\\s*{\\s*"+css_pro+"\\s*:[^;]+";
		}else if(typeval == 2){
			var regex = "#nav_layer[0-9|a-z|A-Z]+\\s+ul\\s+li\\s*:\\s*hover\\s*{\\s*"+css_pro+"\\s*:[^;]+";
		}else if(typeval == 3){
			var regex = "#nav_layer[0-9|a-z|A-Z]+\\s+ul\\s+li\\s*{\\s*"+css_pro+"\\s*:[^;]+";
		}else{
			var regex = "#nav_layer[0-9|a-z|A-Z]+\\s+li\.wp_subtop>a:\\s*hover\\s*{\\s*"+css_pro+"\\s*:[^;]+";
		}
	 
		var navStyle = wp_get_navstyle(layer_id, 'datastys_');
		if(navStyle.length > 0)
		{
			var patt1 =new RegExp(regex,'i');
			var tmp = patt1.exec($.trim(navStyle));
			if(tmp)
			{
				return $.trim((tmp[0].match(/{[^:]+:[^;]+/)[0]).match(/:[^;]+/)[0].replace(':',''));
			}
		}
		navStyle = wp_get_navstyle(layer_id, 'datasty_');
		if(navStyle.length > 0)
		{
			if(typeval==1){
				var patt1 = new RegExp("#nav_layer[0-9|a-z|A-Z]+\\s+ul+\\s+li+\\s+a:\\s*hover\\s*{[^}]+}",'i');
			}else if(typeval == 2){
				var patt1 = new RegExp("#nav_layer[0-9|a-z|A-Z]+\\s+ul\\s+li\\s*:\\s*hover\\s*{[^}]+}",'i');
			}else if(typeval == 3){
				var patt1 = new RegExp("#nav_layer[0-9|a-z|A-Z]+\\s+ul\\s+li\\s*{[^}]+}",'i');
			}else{
				var patt1 = new RegExp("#nav_layer[0-9|a-z|A-Z]+\\s+li\.wp_subtop>a:\\s*hover\\s*{[^}]+}",'i');
			}
			var tmp = patt1.exec(navStyle);
			
			if(tmp)
			{
				var tmp1 = tmp[0].match(/{[^}]+}/)[0];
				var patt2 = new RegExp(css_pro+"\\s*:\\s*[^;]+;",'i');
				tmp = patt2.exec(tmp1);
				if(tmp) return $.trim(tmp[0].replace(/[^:]+:/,'').replace(';',''));
			}
		}

		return $.trim($("#nav_'+layer_id+' ul li a").css(css_pro));
	};
	
	$(function (){
		$("#nav_"+layer_id).children('li:last').css('border','none');

		$('#nav_'+layer_id).find('li').hover(function(){
			if(params.isedit){
				var resizehandle = parseInt($('#'+layer_id).children('.ui-resizable-handle').css('z-index'));
				if($(this).hasClass('wp_subtop')) $(this).parent().css('z-index',resizehandle+1);
			}

			//瀛愯彍鍗曟偓鍋滆儗鏅粦瀹氬湪a涓�
			if(!$(this).hasClass('wp_subtop'))
			{
				$(this).children('a').css('background-image',window[layer_id+'_getSubMenuHoverCss']('background-image',2));
				$(this).children('a').css('background-repeat',window[layer_id+'_getSubMenuHoverCss']('background-repeat',2));
				$(this).children('a').css('background-color',window[layer_id+'_getSubMenuHoverCss']('background-color',2));
				$(this).children('a').css('background-position',window[layer_id+'_getSubMenuHoverCss']('background-position',2));

				$(this).css({'background-image':'none','background-color':'transparent'});
			}

			if($(this).children('ul').length > 0)
			{
				$(this).children('ul').css('background-image',window[layer_id+'_getSubMenuHoverCss']('background-image',3));
				$(this).children('ul').css('background-repeat',window[layer_id+'_getSubMenuHoverCss']('background-repeat',3));
				$(this).children('ul').css('background-color',window[layer_id+'_getSubMenuHoverCss']('background-color',3));
				$(this).children('ul').css('background-position',window[layer_id+'_getSubMenuHoverCss']('background-position',3));

				$(this).children('ul').children('li').css({'background-image':'none','background-color':'transparent'});
			}

			//鏈€鍚庝竴涓彍鍗曞幓闄order-bottom
			$(this).children('ul').children('li:last').children('a').css('border','none');
			if(!$(this).hasClass('wp_subtop')) $(this).parent().children('li:last').children('a').css('border','none');
			
			$(this).children('ul').show();
			var type=$("#"+layer_id).find('.wp-new_navigation_content').attr('type');
			if(type==2){
				var self = $(this);
				var this_width = $('#nav_'+layer_id).outerWidth();		 
				$(this).children('.ddli').css("margin-left",(this_width-10)+"px");
				$("#"+layer_id).find('.ddli').hide();			
				$(this).children('.ddli').eq(0).slideDown();
			}
		},function(){
			$(this).children('ul').hide();
			if(!($.browser.msie && $.browser.version < 9)){
				if(params.isedit){
					var resizehandle = parseInt($('#'+layer_id).children('.ui-resizable-handle').css('z-index'));
					var isHover = true;
					$('#nav_'+layer_id).find('ul').each(function(){
						if($(this).css('display') != 'none') {isHover = false;return false;}
					});
					if(isHover) $(this).parent().css('z-index',resizehandle-1);
				}
			}
			$target = $(this);
			setTimeout(function(){
				$target.parent('ul').children('li:last').children('a').css('border','none');
			},10);
			var type=$("#"+layer_id).find('.wp-new_navigation_content').attr('type');
			if(type==2){
				$("#"+layer_id).find('.ddli').slideUp();
			}
		});
			
		var ulheight = 0;
		$('#nav_'+layer_id).children('li').each(function(){
			ulheight = ulheight + $(this).outerHeight(true);
		});

		$('#'+layer_id+',#'+layer_id+' .wp-new_navigation_content,#nav_'+layer_id).height(ulheight);
		
		$("#nav_"+layer_id).find('li').each(function(){
			var tmp_html = $(this).children('a').text();
			$(this).children('a').empty().append("<span class='sub1'>"+tmp_html+"</span>");
		});
		
		$("#nav_"+layer_id).find('li').hover(function(){
			if($(this).children('a').hasClass("sub")){			
				$(this).children('ul').children('li').each(function(){
					if($(this).children('a').hasClass("sub")){		
						$(this).children('a').children('span').height($(this).children('a').height());
					}				
				});
			}
		});
		
		$('.menu_'+params.menustyle+' #nav_'+layer_id).find('li').hover(function(){
			var direction=$("#"+layer_id).find('.nav1').attr('direction');
			var width = parseInt($(this).outerWidth());
			if(params.isedit){	
				$('.posblk[super="'+layer_id+'"]').hide();
			}
			if(direction==1){				
				$(this).children('ul').css('left','auto').css('right',(width)+'px');
			}else{
				$(this).children('ul').css('left','0px').css('right','auto');	
			}
			if($(this).parent().hasClass('navigation'))
			{
				$(this).children('a').css({'font-family':window[layer_id+'_getSubMenuHoverCss']("font-family",0),'font-size':window[layer_id+'_getSubMenuHoverCss']("font-size",0),'color':window[layer_id+'_getSubMenuHoverCss']("color",0),'font-weight':window[layer_id+'_getSubMenuHoverCss']("font-weight",0),'font-style':window[layer_id+'_getSubMenuHoverCss']("font-style",0)});
			}else{
				$(this).children('a').css({'font-family':window[layer_id+'_getSubMenuHoverCss']("font-family",1),'font-size':window[layer_id+'_getSubMenuHoverCss']("font-size",1),'color':window[layer_id+'_getSubMenuHoverCss']("color",1),'font-weight':window[layer_id+'_getSubMenuHoverCss']("font-weight",1),'font-style':window[layer_id+'_getSubMenuHoverCss']("font-style",1)});
			}

			//瀛愯彍鍗曚綅缃牴鎹富鑿滃崟楂樺害璋冩暣鍜屽瓙鑿滃崟宸﹁竟鍋忕Щ
			if($(this).hasClass('wp_subtop'))
			{
				$('#nav_'+layer_id+' .wp_subtop').removeClass("lihover").children('a').removeClass("ahover");
				$(this).children('ul').css('margin-top',-1*$(this).outerHeight()+'px');
				var parentul=$(this).parent('ul');
				var ulw=$(this).parent('ul').outerWidth(true);
				if(ulw==0){
					var ulw2 = $(this).parents('.wp-new_navigation_content').outerWidth(true);
					if(ulw2>0) ulw = ulw2;
				}
				if(parentul.is('#nav_'+layer_id)){
					var leftw=0;
					leftw+=parseInt($('#'+layer_id).find('.wp-new_navigation_content').css('padding-left'))||0;
					leftw+=parseInt($('#'+layer_id).find('.wp-new_navigation_content').css('border-left-width'))||0;
					ulw=ulw-leftw;
				}
				$(this).children('ul').css('margin-left',ulw+parseInt($(this).parent('ul').css('margin-left'))+'px');
			}
			else
			{
				if($(this).prev('li').length == 0)
				{ 
					$(this).children('ul').css('margin-top',-1*($(this).outerHeight()+parseInt($(this).css('margin-top'))+parseInt($(this).parent('ul').css('borderTopWidth'))+parseInt($(this).parent('ul').css('padding-top')))+'px');
					if($(this).children('ul').length > 0)
					{
						var offsetY = $(this).children('ul').offset().top - $(this).parent('ul').offset().top;
						if(offsetY != 0)
							$(this).children('ul').css('margin-top',parseInt($(this).children('ul').css('margin-top')) - offsetY);
					}
				}
				
				else $(this).children('ul').css('margin-top',-1*$(this).outerHeight()+'px');
				$(this).children('ul').css('margin-left',$(this).parent('ul').width()+'px');
			}
		},function(){
			if($(this).parent().hasClass('navigation'))
			{
				wp_showdefaultHoverCss(layer_id);
			}
			 $(this).children('a').attr("style",'');
		});
		wp_showdefaultHoverCss(layer_id);
		wp_removeLoading(layer_id);
	});
	
	window[params.menustyle+'_cssReplace'] = function(layer_id,oldCss,newCss){
		if($.trim(newCss).length == 0) alert('empty');
		var navStyle = $("#datastys_"+layer_id).text();
		navStyle = navStyle.replace(/<style[^>]*?>/i,'').replace(/<\/style>/i,'').replace(/(^\s*)|(\s*$)/g,"");
		navStyle = navStyle.replace(oldCss,'');
		navStyle += newCss;
		navStyle = navStyle.replace(/[\r\n]/g, " ").replace(/\s+/g, " "); 
		$("#datastys_"+layer_id).text(""+navStyle+"");

		var data=$("#datasty_"+layer_id).text();					
		get_plugin_css(layer_id,data+" "+navStyle);
	};
}