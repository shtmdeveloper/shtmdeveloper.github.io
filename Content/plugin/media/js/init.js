function layer_media_init_func(layerid,params){
	var $curlayer=$('#'+layerid), _duration = -1;
	$('#wp-media-image_'+layerid).off('mouseover').mouseover(function (event) {
		if($curlayer.data('wopop_effects') && $curlayer.hasClass('now_effecting')){
			return;
		}
		var effect=$curlayer.data('wopop_imgeffects');
		var $this=$(this);
		var running=$this.data('run');
		if(effect && running!=1){
			var effectrole = effect['effectrole'];
			var dset = effect['dset']; 
			var effectel=$curlayer;
			if(effectrole=='dantu' &&  effect['effect']=="effect.rotation"){
				$curlayer.data('iseffectrotate',true);
				effectel=$curlayer.find('.wp-media_content');
			}else if(effectrole !='dantu' && dset && dset['effect']=="effect.rotation"){
				$curlayer.data('iseffectrotate',true);
				effectel=$curlayer.find('.wp-media_content'); 
			}
			
			effectel.setimgEffects(true,effect,1);
			
			if(effectrole !='dantu' && typeof(dset)!="undefined"){
				// fixed bug#5949
				if ($curlayer.hasClass('now_effecting')) {
					_duration = dset.duration;
					$curlayer.wopop_effect_command('stop');
				}
				var temp_effect = {};
				temp_effect['type'] = effect['type'];
				temp_effect['effectrole'] = 'dantu';
				temp_effect['effect'] = effect['dset']['effect'];
				temp_effect['duration'] =  effect['dset']['duration'];
				effectel.setimgEffects(true,temp_effect,1);
			}
		}
	});
	// fixed bug#5949
	$curlayer.mouseleave(function(e){
		var $target = $(this), _tt = parseInt(_duration);
		if (!isNaN(_tt) && _tt >= 0 && !$target.hasClass('now_effecting')) {
			var timer = setTimeout(function(){
				$target.showEffects();
				_duration = -1;
				clearTimeout(timer);
			}, _tt);
		}
	});

	var imgover=$('#wp-media-image_'+layerid).closest('.img_over');
	imgover.children('.imgloading').width(imgover.width()).height(imgover.height());
	imgover.css('position','relative');
	$('#'+layerid).layer_ready(function(){
		layer_img_lzld(layerid);
	});
	if(!params.isedit && !params.has_effects){
		if ($('#'+$('#'+layerid).attr('fatherid')).attr('type') == 'pop_up') {
			$('#wp-media-image_'+layerid).attr('src',params.img_src);
			$('#wp-media-image_'+layerid).parents('.img_over:first').children('.imgloading').remove();
		}
	}
	
}