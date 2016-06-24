(function(window, $){
	window.$alertSlider = {
		data : {
			$slider : 
				[
					'<div class="picture-slider">',
						'<div class="mask"></div>',
						'<span class="btn prev"></span>',
						'<span class="btn next"></span>',
						'<span class="close">x</span>',
						'<ul>{slideritem}</ul>',
					'</div>'
				].join(""),
			$sliderItem : 
				[
					'<li>',
						'<div class="item">',
							'<img src="{picsrc}" alt="">',
							'<a target="_blank" href="{picsrc}">查看原图（{picwidth}x{picheight}）&gt;</a>',
						'</div>',
					'</li>'
				].join(""),
			$picture : [],
			current : 0,
			$window : {
				width : $(window).width(),
				height : $(window).height()
			}
		},
		init : function(){
			$alertSlider.initData();
			$alertSlider.initEvent();
		},
		initData : function(){
			var slider = "";
			$(".picture-cont img").each(function(index, element){
				var $img  = $(this),
					style = "",
					_tpl  = $alertSlider.data.$sliderItem,
					$item = {
						width : parseInt($img.attr("data-width"), 10),
						height : parseInt($img.attr("data-height"), 10),
						src : $img.attr("data-src"),
						show : $alertSlider.calcShowSize(parseInt($img.attr("data-width"), 10), parseInt($img.attr("data-width"), 10))
					};
				
				$alertSlider.data.$picture.push($item);
				style = [
					"width:" , $item.show.width, "px",
					"height:" , $item.show.height, "px",
					"margin-left:" , - $item.show.width * 0.5, "px",
					"margin-top:" , - $item.show.height * 0.5, "px"
				].join(""),
				
				slider += _tpl.replace(/{picsrc}/g, $item.src)
						  .replace(/{picwidth}/g, $item.width)
						  .replace(/{picheight}/g, $item.height);
			});
			
			$alertSlider.data.$slider = $alertSlider.data.$slider.replace(/{slideritem}/g, slider);
		},
		initEvent : function(){
			$(window).on("resize", function(){
				$alertSlider.data.$window = {
					width : $(window).width(),
					height : $(window).height()
				}
			});
			
			$(".picture-cont img").on("click", function(){
				if($(".picture-slider").length != 0){return;}
				$($alertSlider.data.$slider).appendTo("body");
				$alertSlider.data.current = $(this).index();
				$alertSlider.resetSlider();
				
				var $item = $(".picture-slider li").eq($alertSlider.data.current).find(".item");
				
				$item.css({
					"width" : $alertSlider.data.$picture[$alertSlider.data.current].show.width * 0.4,
					"height" : $alertSlider.data.$picture[$alertSlider.data.current].show.height * 0.4,
					"margin-left" : - $alertSlider.data.$picture[$alertSlider.data.current].show.width * 0.5 * 0.4,
					"margin-top" : - $alertSlider.data.$picture[$alertSlider.data.current].show.height * 0.5 * 0.4
				});
				setTimeout(function(){
					$(".picture-slider").addClass("show");
					$item.css({
						"width" : $alertSlider.data.$picture[$alertSlider.data.current].show.width,
						"height" : $alertSlider.data.$picture[$alertSlider.data.current].show.height,
						"margin-left" : - $alertSlider.data.$picture[$alertSlider.data.current].show.width * 0.5,
						"margin-top" : - $alertSlider.data.$picture[$alertSlider.data.current].show.height * 0.5
					})
				}, 0);
			});
			
			$(document).on("click", ".picture-slider li,.picture-slider .close", function(e){
				$(".picture-slider").remove();
			});
			$(document).on("click", ".picture-slider .prev", function(){
				$alertSlider.data.current --;
				if($alertSlider.data.current < 0){
					$alertSlider.data.current = $alertSlider.data.$picture.length - 1;
				}
				$(".picture-slider ul").css({"left" : - $alertSlider.data.$window.width * $alertSlider.data.current});
			});
			$(document).on("click", ".picture-slider .next", function(){
				$alertSlider.data.current ++;
				if($alertSlider.data.current > $alertSlider.data.$picture.length - 1){
					$alertSlider.data.current = 0;
				}
				$(".picture-slider ul").css({"left" : - $alertSlider.data.$window.width * $alertSlider.data.current});
			});
			$(document).on("click", ".picture-slider .item a", function(e){
				e.stopPropagation();
			});
			$(document).on("click", ".picture-slider .item", function(e){
				e.stopPropagation();
				$(".picture-slider .next").trigger("click");
			});
		},
		resetSlider : function(){
			if($(".picture-slider").length != 0){
				$(".picture-slider ul").css({"width" : $alertSlider.data.$window.width * $alertSlider.data.$picture.length, "left" : - $alertSlider.data.$window.width * $alertSlider.data.current});
				$(".picture-slider li").css({"width" : $alertSlider.data.$window.width});
				
				$alertSlider.calcPicSize();
			}
		},
		calcShowSize : function(width, height){
			if(width >= $alertSlider.data.$window.width || height >= $alertSlider.data.$window.height){
				if($alertSlider.data.$window.width / $alertSlider.data.$window.height >= width / height){
					width = $alertSlider.data.$window.height / height * width * 0.8;
					height = $alertSlider.data.$window.height * 0.8;
				}else{
					height = $alertSlider.data.$window.width / width * height * 0.8;
					width = $alertSlider.data.$window.width * 0.8;
				}
			}
			return {
				width : width,
				height : height
			}
		},
		calcPicSize : function(){
			for(var item in $alertSlider.data.$picture){
				var $item = $alertSlider.data.$picture[item];
				var $show = $alertSlider.calcShowSize($item.width, $item.height);
				
				$alertSlider.data.$picture[item].show = $show;
				
				$(".picture-slider li").eq(item).find(".item").css({
					"width" : $show.width,
					"height" : $show.height,
					"margin-left" : - $show.width * 0.5,
					"margin-top" : - $show.height * 0.5
				});
			}
		}
	};
}(window, jQuery));