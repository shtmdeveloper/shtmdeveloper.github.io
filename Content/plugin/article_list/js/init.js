function layer_article_list_checkid_func(params){
	$(function(){
		var layer_id = "#"+params.layer_id;
		$(layer_id+' .articleid:not(.memberoff)').unbind('click.list_check').bind('click.list_check',function(event){
				event.preventDefault();
				var gourl = $(this).attr('href');
				var targettype = $(this).attr('target');
				_this = $(this);
				$.ajax({
					type: "POST",
					url: parseToURL('article_list','checkarticleid'),
		             data: {id:$(this).attr('articleid')},
		             dataType: "json",
		             async:false,
		             success: function(r){
			 				var islogin = params.islogin;
							if(r.code == -2  && !islogin){ //鏄細鍛� 
								if(!islogin){
									event.preventDefault();
									$LAB
									.script(relativeToAbsoluteURL("script/datepicker/custom_dialog.js"))
									 .wait(function(){
										show_custom_panel(parseToURL('userlogin','login_dialog'),{
											title:'Login',
											overlay:true,
											id:'wp_user_info'
										});
									});
								}
								return false;
							}else if(r.code == -1){ //涓嶆槸浼氬憳 
								ismember = false;
							}
							
							if(targettype == undefined && gourl != 'javascript:void(0);'){
								location.href=gourl;
							}else if(targettype != undefined && gourl != 'javascript:void(0);'){
								window.open(gourl,'','',true);
							}	
                      }
					})

		})

	})
}

function layer_article_list_init_func(param){
	if(!getSystemSession()){
		var $window=$(window);
		var layerid=param.layer_id;
		if($('#'+layerid).length&&$('#'+layerid).closest('#canvas,#site_footer').length){
			var $body = $('#scroll_container');
			var scrolTop = Math.max($(window).scrollTop(), $body.scrollTop());
		}
	}
	var layerid=param.layer_id;
	var articleStyle=param.articleStyle;
	window['set_thumb_'+layerid]=function(obj) {
		var callback=function(img){
				img.fadeIn('slow',function(){
					img.closest('li').find('.imgloading').remove();
				 });	
		}
		$(obj).each(function() {
			var img=$(this);
			callback(img);
		});      
	}
	if(articleStyle=='two_column'){
		$("#"+layerid).layer_ready(function(){
			var $p = $('ul:first li p', "#"+layerid);
			$p.width('auto');
			var maxW = Math.max.apply(Math, $p.map(function(){
				return $(this).outerWidth(true);
			}).toArray());
			$p.width(maxW);
		});
	}else{
		if (articleStyle === "skin3" || articleStyle === "ulist3") {
			$(function(){
				var maxliheight = 0,tmplayerid = "#"+layerid;
				if (tmplayerid.length == 1) return;var $tmpnode = $(tmplayerid+' li > .wp-new-article-style-c');
				maxliheight = Math.max.apply(null,$tmpnode.map(function(){return $(this).outerHeight();}).toArray());
				if (maxliheight) $tmpnode.height(maxliheight);
				// 鍙抽棿璺� 2014/03/17
				$(tmplayerid).bind("fixedmarginright", function(e, margin){
					var $target = $(this),$li = $target.find('li');
					if(margin != undefined) $li.css("margin-right", margin+'px');
					var $first = $li.filter(':first'),liwidth = $first.outerWidth(),
					mgnright = $._parseFloat($first.css("marginRight")),
					maxwidth = $target.children('.wp-article_list_content').width(),
					maxcols = Math.floor(maxwidth / (liwidth + mgnright));	 
					if(maxwidth >= maxcols * (liwidth + mgnright) + liwidth) maxcols += 1;
					for(var i = 1,licnt = $li.length; i <= licnt; i++){
						if (i % maxcols != 0) continue;
						if ((maxcols == 1) && (2*liwidth <= maxwidth)) continue;
						$li.filter(':eq('+(i - 1)+')').css("margin-right", '0');
					}
					$li = null;
				}).triggerHandler("fixedmarginright");
				// <<End
				tmplayerid = $tmpnode = null;
			});
		}

		if (articleStyle === "default" || articleStyle === "ulist2"|| articleStyle === "ylist2") {
		$(function(){
				var LID = layerid;
				$('#'+LID).bind("fixedliwidth", function(e, margin){

						$('#'+LID).find('li').each(function(){
								//set 01-right width
								var $PL = $('.article_list-'+LID),MAXW = $PL.outerWidth(),
								LW = $PL.find('li:first > .wp-new-article-style-01-left').outerWidth(true);
								$PL.find('li > .wp-new-article-style-01-right').css({"width": (MAXW - LW)+'px',"overflow": 'hidden',"word-wrap": 'break-word'});
								
								//set li width
								var self=$(this);var leftwidth=self.find('.wp-new-article-style-01-left').outerWidth();
								var rightwidth=self.find('.wp-new-article-style-01-right').outerWidth();
								//璁剧疆鏃堕棿鏃ユ湡瀹瑰櫒鐨勫搴︼紝璁剧疆涔嬪悗鏃犳硶娣诲姞鏂囩珷娴忚閲�
								if(articleStyle == "ylist2") $PL.find('li .time').parent('.tinubox').css({"width": (MAXW - LW)+'px'});
								$PL = null;
								if(articleStyle != "ylist2") self.css('width',(leftwidth+rightwidth+350)+'px');

						})

				}).triggerHandler("fixedliwidth");
		});
		}
	}
}

function layer_article_list_pager_func(param){
	$(function(){
		var ua = navigator.userAgent.toLowerCase() || '';
		var layerid = param.layer_id,$cstlayer = $('#'+layerid),
		$pglnker = $cstlayer.find('.wp-article_list_content .wp-pager_link');
		$pglnker.find('a').click(function(e,page){
			var urlhrf = $(this).attr("href");
			if(urlhrf.indexOf("##")>-1){
			e.preventDefault();
			var pageid = page||$(this).attr("href").replace("###",'');
			if(param.editmode == "1") $.method.article_list.refreshArticleList({"page":pageid,"layerid":layerid});	
			else {
				var dom = $cstlayer.find('.article_list_save_itemList'),
				params = {
				};
				var liststyle={"artliststyle":param.artliststyle}
				$.ajax({
					type: "GET",
					url: parseToURL("article_list","get_page"),
					data: {article_category:param.article_category_param,layer_id: layerid,page: pageid,article_category_more:param.article_category_more},
					success: function(data){
						var $layer = $("#"+layerid);
						var oldHeight = $layer.find('.article_list-'+layerid).height();
						$layer.children('.wp-article_list_content').before(data).remove();
						if(!ua.match(/chrome\/46/)){
							
						var this_dom = $('#'+layerid);
						this_dom.find(".wp-pager_link").css({'position':'relative','bottom':'auto','width':'100%'});
						if(!this_dom.data('not_need_heightadapt')) wp_heightAdapt($layer);
						var cheight = this_dom.find(".wp-article_content").height();
						var oulheight = this_dom.find(".article_list-"+layerid).height();
						var olkheight = this_dom.find(".wp-pager_link").outerHeight();                        
                        var fcontent = this_dom.find(".wp-article_list_content");
                        var botmag = parseInt(fcontent.css("border-bottom-width"))+parseInt(fcontent.css("padding-bottom"));
                    
						if(cheight>oulheight+olkheight &&!$layer.data('not_need_heightadapt')){
							this_dom.find(".wp-pager_link").css({'position':'absolute','bottom':botmag+'px','width':'100%'})
						}
							
							
						/**
						 * #淇鈥滃垎椤碘€濆悗楂樺害鍑虹幇寮傚父闂锛坆ug#4316锛�2015/11/17
						 * #鎻掍欢鍐呭楂樺害瀹為檯涓婃病鏈夐棶棰橈紝鍙洜鈥滃垎椤碘€濆尯鍩熷畾浣嶉棶棰樿€屽鑷寸殑閿欒
						 * bug(#4515)鍙戠幇妯″潡楂樺害灏忎簬鍐呭楂樺害瀵艰嚧鍒嗛〉闅愯棌
							 */
						var $C = $layer.children('.wp-article_list_content'),$W = $C.children('.article_list-'+layerid);
						var c_h = $C.height(),w_h = $W.height();
						if(c_h<w_h){$C.height($W.height())}
						}
						var pageskips = param.pageskip,product_listtop='';
						if(pageskips == 2){
							product_listtop = parseInt($cstlayer.offset().top+$('#scroll_container').scrollTop()-$('.full_column-fixed').height());
							setTimeout(function(){
								if(product_listtop){$('#scroll_container').scrollTop(product_listtop);}
							},50);
						}
					}
				});

				//杩斿洖娴忚鍣ㄩ《閮�
				var $scroll_container = $('#scroll_container');
				var pageskips = param.pageskip,product_listtop='';
				if(pageskips != 2){
					if(pageskips != 3){
                        $scroll_container.scrollTop(0);
                    }
				}
				if(pageskips == 2){
					product_listtop = parseInt($cstlayer.offset().top+$('#scroll_container').scrollTop()-$('.full_column-fixed').height());
					if(product_listtop){$scroll_container.scrollTop(product_listtop);}
				}
			}

			return false;
			}
		});
		// About input
		$pglnker.find(':input').each(function(i,dom){
			var $input = $(this),ent = pgid = '',fnc;
			switch($input.attr("type")) {
				case "text":
					ent = 'keyup';
					fnc = function(){
					pgid = this.value = this.value.replace(/(?:\b0|[^\d+])/i,'');
					//鍒嗛〉鐨剆tyle4鏍峰紡鐨剆kin4鐨偆锛岀偣鍑诲洖杞﹁烦杞埌鎸囧畾椤甸潰
					var keycode = event.keyCode;
					if (keycode == 13) {
						var pagerstyle = $pglnker.parent().nextAll('.article_list_save_itemList').attr('pagerstyle');
						var pstarr = pagerstyle.split('/'),pstyle = pstarr[0],pskin = pstarr[1];
						if (pstyle == 'style4' && pskin == 'skin4') {
							if (pgid.length && /^[1-9]{1}\d*$/.test(pgid)) {
								var maxpg = _int($pglnker.find('span.total').html());
								if(!maxpg) maxpg = 1;
								var pagelink=$pglnker.find('a:first');
								var urlhrf = pagelink.attr("href");
								if(urlhrf.indexOf("##")>-1){
										$pglnker.find('a').triggerHandler('click',[Math.min(pgid,maxpg)]);
								}else{
										urlhrf=urlhrf.replace(/\d+$/,Math.min(pgid,maxpg))
										location.href=urlhrf;
								}
							}
						}
					}
					function _int(numString){
						var number = parseInt(numString);
						if(isNaN(number)) return 0;
						return number;
					}
					return false;
					};
					break;
				case "button":
					ent = 'click';
					fnc = function(){
						if (pgid.length && /^[1-9]{1}\d*$/.test(pgid)) {
							var maxpg = _int($pglnker.find('span.total').html());
							if(!maxpg) maxpg = 1;
							var pagelink=$pglnker.find('a:first');
							var urlhrf = pagelink.attr("href");
							if(urlhrf.indexOf("##")>-1){
								$pglnker.find('a').triggerHandler('click',[Math.min(pgid,maxpg)]);
							}else{
								urlhrf=urlhrf.replace(/\d+$/,Math.min(pgid,maxpg))
								location.href=urlhrf;
							}
						}
						function _int(numString){
							var number = parseInt(numString);
							if(isNaN(number)) return 0;
							return number;
						}
						return false;
					};
					break;
			}
			if(fnc && $.isFunction(fnc)) $input[ent](fnc);
		});
	});
}