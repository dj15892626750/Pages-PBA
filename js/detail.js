require(["config"],function(){
	require(["jquery","template","load","right","cookie","fly","zoom"],function($,template){
		function Detail(){
			this.render();
			
			// 配置 cookie 自动在JS值与JSON值之间转换
			$.cookie.json = true;
			
		}
		$.extend(Detail.prototype,{
			
			render(){
				//获取当前待加载商品的id
				const _id=location.search.slice(location.search.lastIndexOf("=")+1);
				$.getJSON("http://rap2api.taobao.org/app/mock/120085/api/detail?id="+_id,(data)=>{
					const {title,desc,price,details,id,zoomImgs,colors}=data.res_body;
					const html=template("detail-img-template",{id,zoomImgs,title,desc,price,details,colors});
					$(".goods-info").prepend(html);
					// 放大镜
					$(".zoom-img").elevateZoom({
						gallery:'small-pic',//为缩放图像指定一组图库链接
						cursor: 'pointer',
						galleryActiveClass: 'action'
					}); 
					
					this.addListener();
					
					//商品详情
					const ds=template("details-template",{details:data.res_body.details});
					$(".pic-list").prepend(ds);	
					
				});
				
				$.getJSON("http://rap2api.taobao.org/app/mock/120085/api/hot",(d)=>{
					const hotGoods=template("hot-template",{hot:d.res_body.list});
					$(".hot").find("ul").prepend(hotGoods);
				});
			},
			
			//添加事件监听
			addListener(){
				
				$(".add-cart").on("click",this.addToCart);//加入购物车
				$(".color .sub a").on("click",this.chooseSpecs);//选择规格
				$(".amount").on("click",".dec, .add",this.countAddOrReduce);//数量加减
//				$(".amount").on("blur",".count",this.changeAmount);				
			},
			//加入购物车
  			addToCart(event){
				$(".color").find("span").hide();
				const parent=$(".goods-info");
				const currProduct={
					id:parent.find(".id").text(),
					img:parent.find(".zoom-img").attr("src"),
					title:parent.find("h1").text(),
					price:parent.find(".price").find("span").text(),
					spec:parent.find(".color").find(".sub").find(".cho").text(),
					amount:parent.find(".amount").find(".sub").find(".count").val()
				};
				console.log(currProduct);
				//判断是否选中商品规格
				if(currProduct.spec==""){
					$(".color").find("span").css("display","block");
					return false;
				}
				
				//获取cookie中已保存的购物车商品数组
				const cart=$.cookie("cart") || [];
				const has=cart.some((curr)=>{
					if(curr.id===currProduct.id){
						cart.amount++;
						return true;
					}
					return false;
				});
				//如果未选购过
				if(!has){
					cart.push(currProduct);
				}
				//将购物车商品保存进cookie
				$.cookie("cart",cart,{expires:10,path:"/"});
				
				//保存成功，抛物线效果
				const end=$("#cart").offset();//终点坐标
				const start={
					top:event.pageY-$(window).scrollTop(),
					left:event.pageX
				};
				
				const src=$(".zoom-img").attr("src");

				const flyer = $("<div></div>").css({
						width: 20,
						height: 20,
						background: "url("+src+")"
				});
				
				end.top -= $(window).scrollTop();
				flyer.fly({
					start,
					end,
					onEnd() {
						this.destroy();
					}
				});
				return false;
			},
			//选择商品规格
			chooseSpecs(event){
				$(this).addClass("cho").siblings().removeClass("cho");
			},
			
			
			//数量加或者减
			countAddOrReduce(event){
				let _num=$(".count").val();				
				const $src=$(event.target);
				if($src.attr("class")=="add"){
					_num++;
				}
				else if($src.attr("class")=="dec"){
					if(_num<=1){
						return;
					}
					_num--;
				}
				$(".count").val(_num);				
				
			},
			
			
			changeAmount(event){
				const $src=$(event.target);
				const _amount = $src.val();
				console.log(_amount);
				// 判断是否符合数字合法格式
				const reg = /^[1-9]\d*$/;
				if (!reg.test(_amount)) {
					console.log($src)
					$src.val(_num);
					console.log(_num);
					return;
				}
			}
		});
		new Detail();
	})
})