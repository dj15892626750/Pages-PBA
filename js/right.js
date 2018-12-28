define(["jquery"],function($){
	function Right(){
		this.init();
	}
	$.extend(Right.prototype,{
		//初始化
		init(){
			this.loadRight();
		},
		//加载头部
		loadRight(){
			$.get("/Pages-PBA/html/right.html",(data)=>{
				$(".server-bar").html(data);
			});
			$('.server-bar').hover(function(){
	            	$(this).stop().animate({paddingRight:'122px'})
	    	}).mouseleave(function() {
	            $(this).stop().animate({paddingRight:'0px'});
	       });
		},
	});
	return new Right();
})