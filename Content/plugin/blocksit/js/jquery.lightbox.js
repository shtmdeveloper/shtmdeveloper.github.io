(function($) {
	$.fn.lightBox = function(settings) {
		settings = jQuery.extend({
			overlayBgColor: 		'#000',		
			overlayOpacity:			0.8,		
			fixedNavigation:		false,		
			imageLoading:			'images/lightbox-ico-loading.gif',		
			imageBtnPrev:			'images/lightbox-btn-prev.gif',			
			imageBtnNext:			'images/lightbox-btn-next.gif',			
			imageBtnClose:			'images/lightbox-btn-close.gif',		
			imageBlank:				'images/lightbox-blank.gif',			
			containerBorderSize:	10,			
			containerResizeSpeed:	400,		
			txtImage:				'Image',	
			txtOf:					'of',		
			keyToClose:				'c',		
			keyToPrev:				'p',		
			keyToNext:				'n',		
			imageArray:				[],
			activeImage:			0
		},settings);
		var jQueryMatchedObj = this; 
		
		function _initialize() {
			_start(this,jQueryMatchedObj); 
			return false; 
		}
		
		function _start(objClicked,jQueryMatchedObj) {
			$('embed, object, select').css({ 'visibility' : 'hidden' });
			_set_interface();
			settings.imageArray.length = 0;
			settings.activeImage = 0;
			if ( jQueryMatchedObj.length == 1 ) {
				settings.imageArray.push(new Array(objClicked.getAttribute('href'),objClicked.getAttribute('title')));
			} else {
				for ( var i = 0; i < jQueryMatchedObj.length; i++ ) {
					settings.imageArray.push(new Array(jQueryMatchedObj[i].getAttribute('href'),jQueryMatchedObj[i].getAttribute('title')));
				}
			}
			while ( settings.imageArray[settings.activeImage][0] != objClicked.getAttribute('href') ) {
				settings.activeImage++;
			}
			_set_image_to_view();
		}
		function _set_interface() {
			$('#scroll_container').append('<div id="jquery-overlay"></div><div id="jquery-lightbox"><div id="lightbox-container-image-box"><div id="lightbox-container-image"><img id="lightbox-image"><div style="" id="lightbox-nav"><a href="#" id="lightbox-nav-btnPrev"></a><a href="#" id="lightbox-nav-btnNext"></a></div><div id="lightbox-loading"><a href="#" id="lightbox-loading-link"><img src="' + settings.imageLoading + '"></a></div></div></div><div id="lightbox-container-image-data-box"><div id="lightbox-container-image-data"><div id="lightbox-image-details"><span id="lightbox-image-details-caption"></span><span id="lightbox-image-details-currentNumber"></span></div><div id="lightbox-secNav"><a href="#" id="lightbox-secNav-btnClose"><img src="' + settings.imageBtnClose + '"></a></div></div></div></div>');	
			var arrPageSizes = ___getPageSize();
			$('#jquery-overlay').css({
				backgroundColor:	settings.overlayBgColor,
				opacity:			settings.overlayOpacity,
				width:				arrPageSizes[0],
				height:				arrPageSizes[1]
			}).fadeIn();
			var arrPageScroll = ___getPageScroll();
			$('#jquery-lightbox').css({
				top:	arrPageScroll[1] + (arrPageSizes[3] / 10),
				left:	arrPageScroll[0]
			}).show();
			$('#jquery-overlay,#jquery-lightbox').click(function() {
				_finish();									
			});
			$('#lightbox-loading-link,#lightbox-secNav-btnClose').click(function() {
				_finish();
				return false;
			});
			$(window).resize(function() {
				var arrPageSizes = ___getPageSize();
				$('#jquery-overlay').css({
					width:		arrPageSizes[0],
					height:		arrPageSizes[1]
				});
				var arrPageScroll = ___getPageScroll();
				$('#jquery-lightbox').css({
					top:	arrPageScroll[1] + (arrPageSizes[3] / 10),
					left:	arrPageScroll[0]
				});
			});
		}
		
		function _set_image_to_view() { 
			$('#lightbox-loading').show();
			if ( settings.fixedNavigation ) {
				$('#lightbox-image,#lightbox-container-image-data-box,#lightbox-image-details-currentNumber').hide();
			} else {
				$('#lightbox-image,#lightbox-nav,#lightbox-nav-btnPrev,#lightbox-nav-btnNext,#lightbox-container-image-data-box,#lightbox-image-details-currentNumber').hide();
			}
			var objImagePreloader = new Image();
			objImagePreloader.onload = function() {
				$('#lightbox-image').attr('src',settings.imageArray[settings.activeImage][0]);
				_resize_container_image_box(objImagePreloader.width,objImagePreloader.height);
				objImagePreloader.onload=function(){};
			};

			objImagePreloader.src = settings.imageArray[settings.activeImage][0];
		};
		
		function _resize_container_image_box(intImageWidth,intImageHeight) {
			var intCurrentWidth = $('#lightbox-container-image-box').width();
			var intCurrentHeight = $('#lightbox-container-image-box').height();
			var intWidth = (intImageWidth + (settings.containerBorderSize * 2)); 
			var intHeight = (intImageHeight + (settings.containerBorderSize * 2)); 
			var intDiffW = intCurrentWidth - intWidth;
			var intDiffH = intCurrentHeight - intHeight;
			$('#lightbox-container-image-box').animate({ width: intWidth, height: intHeight },settings.containerResizeSpeed,function() { _show_image(); });
			if ( ( intDiffW == 0 ) && ( intDiffH == 0 ) ) {
				if ( $.browser.msie ) {
					___pause(250);
				} else {
					___pause(100);	
				}
			} 
			$('#lightbox-container-image-data-box').css({ width: intImageWidth });
			$('#lightbox-nav-btnPrev,#lightbox-nav-btnNext').css({ height: intImageHeight + (settings.containerBorderSize * 2) });
		};
		
		function _show_image() {
			$('#lightbox-loading').hide();
			var $lightbox = $('#lightbox-image');
			$lightbox.fadeIn(function() {
				_show_image_data();
				_set_navigation();
			});
			//explain:该插件使用页如果使用了全屏滚动插件后该图片节点的fadeIn,slideDown方法并不会生效原因还未深究，现在采用如果该节点没有显示由直接显示,author:fpf,date:2015/3/17,action:modify;
			if($lightbox.css('display')=='none'){$lightbox.show();$('#lightbox-container-image-data-box').show();}
			_preload_neighbor_images();
		};
		
		function _show_image_data() {
			$('#lightbox-container-image-data-box').slideDown('fast');
			$('#lightbox-image-details-caption').hide();
			if ( settings.imageArray[settings.activeImage][1] ) {
				$('#lightbox-image-details-caption').html(settings.imageArray[settings.activeImage][1]).show();
			}
			if ( settings.imageArray.length > 1 ) {
				$('#lightbox-image-details-currentNumber').html(settings.txtImage + ' ' + ( settings.activeImage + 1 ) + ' ' + settings.txtOf + ' ' + settings.imageArray.length).show();
			}		
		}
		
		function _set_navigation() {
			$('#lightbox-nav').show();
			$('#lightbox-nav-btnPrev,#lightbox-nav-btnNext').css({ 'cursor':'default' ,'background' : 'transparent url(' + settings.imageBlank + ') no-repeat' });
			if ( settings.activeImage != 0 ) {
				if ( settings.fixedNavigation ) {
					$('#lightbox-nav-btnPrev').css({'cursor':'url("'+settings.cursorBtnPrev+'"),default'/*, 'background' : 'url(' + settings.imageBtnPrev + ') left 15% no-repeat'*/ })
						.unbind()
						.bind('click',function() {
							if(settings.activeImage>0){
								settings.activeImage = settings.activeImage - 1;
								_set_image_to_view();
							}
							return false;
						});
				} else {
					$('#lightbox-nav-btnPrev').unbind().hover(function() {
						$(this).css({ 'cursor':'url("'+settings.cursorBtnPrev+'"),default'/*,'background' : 'url(' + settings.imageBtnPrev + ') left 15% no-repeat'*/ });
					},function() {
						$(this).css({'cursor':'default' /*,'background' : 'transparent url(' + settings.imageBlank + ') no-repeat'*/ });
					}).show().bind('click',function() {
						if(settings.activeImage>0){
							settings.activeImage = settings.activeImage - 1;
							_set_image_to_view();
						}
						return false;
					});
				}
			}else{
				$('#lightbox-nav-btnPrev').bind('click',function(){return false;});
			}
			if ( settings.activeImage != ( settings.imageArray.length -1 ) ) {
				if ( settings.fixedNavigation ) {
					$('#lightbox-nav-btnNext').css({ 'cursor':'url("'+settings.cursorBtnNext+'"),default'/*,'background' : 'url(' + settings.imageBtnNext + ') right 15% no-repeat'*/ })
						.unbind()
						.bind('click',function() {
							if(settings.activeImage<settings.imageArray.length-1){
								settings.activeImage = settings.activeImage + 1;
								_set_image_to_view();
							}
							return false;
						});
				} else {
					$('#lightbox-nav-btnNext').unbind().hover(function() {
						$(this).css({'cursor':'url("'+settings.cursorBtnNext+'"),default'/*, 'background' : 'url(' + settings.imageBtnNext + ') right 15% no-repeat'*/ });
					},function() {
						$(this).css({ 'cursor':'default'/* ,'background' : 'transparent url(' + settings.imageBlank + ') no-repeat'*/});
					}).show().bind('click',function() {
						if(settings.activeImage<settings.imageArray.length-1){
							settings.activeImage = settings.activeImage + 1;
							_set_image_to_view();
						}
						return false;
					});
				}
			}else{
				$('#lightbox-nav-btnNext').bind('click',function(){return false;});
			}
			_enable_keyboard_navigation();
		}
		
		function _enable_keyboard_navigation() {
			$(document).keydown(function(objEvent) {
				_keyboard_action(objEvent);
			});
		}
		
		function _disable_keyboard_navigation() {
			$(document).unbind();
		}
		
		function _keyboard_action(objEvent) {
			if ( objEvent == null ) {
				keycode = event.keyCode;
				escapeKey = 27;
			} else {
				keycode = objEvent.keyCode;
				escapeKey = objEvent.DOM_VK_ESCAPE;
			}
			key = String.fromCharCode(keycode).toLowerCase();
			if ( ( key == settings.keyToClose ) || ( key == 'x' ) || ( keycode == escapeKey ) ) {
				_finish();
			}
			if ( ( key == settings.keyToPrev ) || ( keycode == 37 ) ) {
				if ( settings.activeImage != 0 ) {
					settings.activeImage = settings.activeImage - 1;
					_set_image_to_view();
					_disable_keyboard_navigation();
				}
			}
			if ( ( key == settings.keyToNext ) || ( keycode == 39 ) ) {
				if ( settings.activeImage != ( settings.imageArray.length - 1 ) ) {
					settings.activeImage = settings.activeImage + 1;
					_set_image_to_view();
					_disable_keyboard_navigation();
				}
			}
		}
		
		function _preload_neighbor_images() {
			if ( (settings.imageArray.length -1) > settings.activeImage ) {
				objNext = new Image();
				objNext.src = settings.imageArray[settings.activeImage + 1][0];
			}
			if ( settings.activeImage > 0 ) {
				objPrev = new Image();
				objPrev.src = settings.imageArray[settings.activeImage -1][0];
			}
		}
		
		function _finish() {
			$('#jquery-lightbox').remove();
			$('#jquery-overlay').fadeOut(function() { $('#jquery-overlay').remove(); });
			$('embed, object, select').css({ 'visibility' : 'visible' });
		}
		
		function ___getPageSize() {
			var container=$('#scroll_container_bg');
			var arrayPageSize = new Array(container.width(),container.height(),$(window).width(),$(window).height());
			return arrayPageSize;
		};
		
		function ___getPageScroll() {
			var container=$('#scroll_container');
			var arrayPageScroll = new Array(0, Math.max($(window).scrollTop(), container.scrollTop()));
			return arrayPageScroll;
		};
		 
		 function ___pause(ms) {
			var date = new Date(); 
			curDate = null;
			do { var curDate = new Date(); }
			while ( curDate - date < ms);
		 };
		return this.unbind('click').click(_initialize);
	};
})(jQuery); 