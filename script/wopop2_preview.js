function wp_viewPicOnlineActual(imgDom)
{
	var imgShow = function (outerdiv, innerdiv, bigimg, _this){ 
    var src = _this.attr("src");//鑾峰彇褰撳墠鐐瑰嚮鐨刾img鍏冪礌涓殑src灞炴€� 
    $(bigimg).attr("src", src);//璁剧疆#bigimg鍏冪礌鐨剆rc灞炴€� 
      /*鑾峰彇褰撳墠鐐瑰嚮鍥剧墖鐨勭湡瀹炲ぇ灏忥紝骞舵樉绀哄脊鍑哄眰鍙婂ぇ鍥�*/ 
        console.log('1111', $("<img/>"))
    $("<img/>").attr("src", src).load(function(e){
        console.log('eeeeee',e,$(this))
      var windowW = $(window).width();//鑾峰彇褰撳墠绐楀彛瀹藉害 
      var windowH = $(window).height();//鑾峰彇褰撳墠绐楀彛楂樺害 
      var realWidth = this.width;//鑾峰彇鍥剧墖鐪熷疄瀹藉害 
      var realHeight = this.height;//鑾峰彇鍥剧墖鐪熷疄楂樺害 
      var imgWidth, imgHeight; 
      var scale = 0.8;//缂╂斁灏哄锛屽綋鍥剧墖鐪熷疄瀹藉害鍜岄珮搴﹀ぇ浜庣獥鍙ｅ搴﹀拰楂樺害鏃惰繘琛岀缉鏀� 
      if(realHeight>windowH*scale) {//鍒ゆ柇鍥剧墖楂樺害 
        imgHeight = windowH*scale;//濡傚ぇ浜庣獥鍙ｉ珮搴︼紝鍥剧墖楂樺害杩涜缂╂斁 
        imgWidth = imgHeight/realHeight*realWidth;//绛夋瘮渚嬬缉鏀惧搴� 
        if(imgWidth>windowW*scale) {//濡傚搴︽墧澶т簬绐楀彛瀹藉害 
          imgWidth = windowW*scale;//鍐嶅瀹藉害杩涜缂╂斁 
        } 
      } else if(realWidth>windowW*scale) {//濡傚浘鐗囬珮搴﹀悎閫傦紝鍒ゆ柇鍥剧墖瀹藉害 
        imgWidth = windowW*scale;//濡傚ぇ浜庣獥鍙ｅ搴︼紝鍥剧墖瀹藉害杩涜缂╂斁 
              imgHeight = imgWidth/realWidth*realHeight;//绛夋瘮渚嬬缉鏀鹃珮搴� 
      } else {//濡傛灉鍥剧墖鐪熷疄楂樺害鍜屽搴﹂兘绗﹀悎瑕佹眰锛岄珮瀹戒笉鍙� 
        imgWidth = realWidth; 
        imgHeight = realHeight; 
      } 
      $(bigimg).css("width",imgWidth);//浠ユ渶缁堢殑瀹藉害瀵瑰浘鐗囩缉鏀� 
      var w = (windowW-imgWidth)/2;//璁＄畻鍥剧墖涓庣獥鍙ｅ乏杈硅窛 
      var h = (windowH-imgHeight)/2;//璁＄畻鍥剧墖涓庣獥鍙ｄ笂杈硅窛 
      $(innerdiv).css({"top":h, "left":w});//璁剧疆#innerdiv鐨則op鍜宭eft灞炴€� 
      $(outerdiv).fadeIn("fast");//娣″叆鏄剧ず#outerdiv鍙�.pimg 
    });
    $(outerdiv).click(function(){//鍐嶆鐐瑰嚮娣″嚭娑堝け寮瑰嚭灞� 
      $(this).fadeOut("fast"); 
    }); 
  }
  var dialog='<div id="outerdiv" style="position:fixed;top:0;left:0;background:rgba(0,0,0,0.7);z-index:9999;width:100%;height:100%;display:none;"><div id="innerdiv" style="position:absolute;"><img id="bigimg" style="border:5px solid #fff;" src="" /><div class="fm_prev_closenew" style="display: block; "><span>x</span></div></div>';
    $(dialog).appendTo('body');
  imgShow("#outerdiv", "#innerdiv", "#bigimg", imgDom);

console.log('aaaaaaaaaaaa,wp_viewPicOnlineActual,wp_viewPicOnlineActual')
}