require(["config"],function(){
	require(["jquery","template","load","right","autoplay"], function($, template) {
		function Index() {
			this.loadHotProducts();
			this.addListener();
			this.autoPlay();
			$($(".pager_list").find("i")[0]).addClass("active");
		}
		$.extend(Index.prototype, {
			// 加载渲染热销商品
			loadHotProducts() {
				$.getJSON("http://rap2api.taobao.org/app/mock/120085/api/index", (data)=>{
					// var htmlstring = template("模板id", 待渲染数据data);
					//明星产品
					const starhtml = template("star-template", {star: data.res_body.star_prod})
					$(".star-prod").prepend(starhtml);
					//美妆香水
					const cosmhtml = template("cosmetics-template", {cosmetics: data.res_body.cosmetics_prod})
					$(".cosmetics-prod").prepend(cosmhtml);
					//养肤护肤
					const skinhtml = template("skin-template", {skin: data.res_body.skin_prod})
					$(".skin_prod").prepend(skinhtml);
					//当红名模
					const modelshtml = template("models-template", {models: data.res_body.models_prod})
					$(".models_prod").prepend(modelshtml);
					//工具洗护
					const toolshtml = template("tools-template", {tools: data.res_body.tools_prod})
					$(".tools_prod").prepend(toolshtml);
					//美容食品
					const foodhtml = template("food-template", {food: data.res_body.beauty_food})
					$(".food_prod").prepend(foodhtml);
				});	
				
			},
			
			addListener(){
				let html="";
				let len=0;
				$.getJSON("http://rap2api.taobao.org/app/mock/120085/api/category",(data)=>{
					console.log(data);
					
					$(".children").hover(function(){
						const children = $(this).find('.category-item');
						$(this).css("background","#f498fe");
						children.css("display","block");
						
						//初始化div.category-item
						children.empty();
						children.css("width","290px");
						
						if($(this).is(".daily-care")){
							html = template("daily-care-template", {daily: data.res_body.daily_care})
							len=data.res_body.daily_care.length;
						}
						else if($(this).is(".face-mask")){
							html = template("daily-care-template", {daily: data.res_body.face_mask})
							len=data.res_body.face_mask.length;
						}
						else if($(this).is(".makeup")){
							html = template("daily-care-template", {daily: data.res_body.makeup})
							len=data.res_body.makeup.length;
						}
						else if($(this).is(".eye-makeup")){
							html = template("daily-care-template", {daily: data.res_body.eye_makeup})
							len=data.res_body.eye_makeup.length;
						}
						else if($(this).is(".lipstick")){
							html = template("daily-care-template", {daily: data.res_body.lipstick})
							len=data.res_body.lipstick.length;
						}
						else if($(this).is(".makeup-remover")){
							html = template("daily-care-template", {daily: data.res_body.makeup_remover})
							len=data.res_body.makeup_remover.length;
						}
						else if($(this).is(".effect")){
							html = template("daily-care-template", {daily: data.res_body.effect})
							len=data.res_body.effect.length;
						}
						const num=(len%5)===0?Math.floor(len/5):Math.ceil(len/5);
						//设置容器的宽度
						children.css("width",$(".category-item").width()*num+"px");
						children.prepend(html);
						const _width=$(".category-child").width();
						$(".category-child").css("width",_width*num+"px");
					}).mouseleave(function() {
						const children = $(this).find('.category-item');
			            $(this).css("background","none");
			           children.css("display","none");
			           //初始化div.category-item
						children.empty();
						children.css("width","290px");
			       });
				});

			},
			
			//轮播图
			autoPlay(){
				$('#dowebok').easyFader();
			}
		});

		new Index();
	});
})