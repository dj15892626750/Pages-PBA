require(["config"],function(){
	require(["jquery","template","cookie","cart_load"],function($,template){
		function Cart(){
			this.cart=[];
			// 配置 cookie 自动在JS值与JSON值之间转换
			$.cookie.json = true;
			this.render();
			this.addListener();
		}
		
		$.extend(Cart.prototype,{
			render(){
				const cart=this.cart=$.cookie("cart")||[];
				if(cart.length==0){
					$(".empty").removeClass("hidden");
					$(".container").addClass("hidden");
				}
				else{
					$(".empty").addClass("hidden");
					$(".container").removeClass("hidden");
				}
				//将数据渲染到页面
				const html=template("cart-template",{cart:cart});
				$(".cart-list").prepend(html);
			},
			addListener(){
				//加、减数量
				$(".cart-list").on("click",".add, .dec",$.proxy(this.countAddOrReduce, this));
				// 输入修改数量
				$(".cart-list").on("blur",".count",$.proxy(this.countAddOrReduce, this));
				//删除
				$(".cart-list").on("click",".del",$.proxy(this.deleteGoods, this));
				//全选
				$("#all").on("click",this.checkAllHander);
				//部分选中
				$(".cart-list").on("click",".che-prod",$.proxy(this.chkProdHandler, this));
				//事件，计算总金额
				$(".cart-list").on("click",".che-prod, .add, .dec, .del",$.proxy(this.calcTotalHandler, this));
				//删除选中的商品/清空购物车
				$(".result").on("click",".delete, .clear",$.proxy(this.deleteCheckGoods,this));
				//去结算
				$(".accounts").on("click",this.goAccounts);
				
			},
			
			//修改数量
			countAddOrReduce(event){
				const $src=$(event.target);
				// 所在行
				const $row=$src.parents(".goods");
				// 当前修改数量的商品id
				const _id=$row.find(".id").text();
				// 对应商品对象 
				const prod = this.cart.filter(curr=>curr.id==_id)[0];

				if($src.is(".add")){//加
					prod.amount++;
				}
				else if($src.is(".dec")){//减
					if(prod.amount<=1)
						return;
					prod.amount--;
				}
				else if($src.is(".count")){// 输入修改
					//获得输入的数量
					const num=$src.val();
					//验证是否符合数字合法格式
					const reg=/^[1-9]\d*$/;
					if(!reg.test(num)){
						$src.val(prod.amount);
						return;
					}
					prod.amount=Number(num);
				}
				//修改后保存cookie
				$.cookie("cart",this.cart,{expires:10,path:"/"});
				//显示修改后的商品数量
				$row.find(".count").val(prod.amount);
				// 显示修改后的小计金额
				$row.find(".subtotal").text((prod.price*prod.amount).toFixed(2));
			},
			
			//删除操作
			deleteGoods(event){
				//所在行
				const $row=$(event.target).parents(".goods");
				console.log($row);
				// 待删除商品的 id
				const id = $row.find(".id").text();
				// 将数组中当前删除的商品对象移除
				this.cart = this.cart.filter(curr=>curr.id!=id);
				// 将修改后的数组存回 cookie
				$.cookie("cart", this.cart, {expires: 10, path: "/"});
				// 页面DOM树中删除行
				$row.remove();
			},
			
			//全选
			checkAllHander(event){
				const status=$(event.target).prop("checked");
				$(".che-prod").prop("checked",status);
				//计算商品总金额
				let money=0;
				$(".che-prod:checked").each((index,element)=>{
					money+=Number($(element).parents(".goods").find(".subtotal").text());
				})
				$(".allprice").text(money.toFixed(2));
			},
			
			//部分选中
			chkProdHandler(){
				// 获取商品行前选中的复选框个数
				const count=$(".che-prod:checked").length;
				// 设置“全选”选中状态
				$("#all").prop("checked", count === this.cart.length);
			},
			
			//事件，计算总金额
			calcTotalHandler(){
				let sum=0;
				$(".che-prod:checked").each((index,element)=>{
					sum+=Number($(element).parents(".goods").find(".subtotal").text());
				})
				$(".allprice").text(sum.toFixed(2));
			},
			
			//删除选中的商品
			deleteCheckGoods(event){
				const $src=$(event.target);
				$(".che-prod:checked").each((index,element)=>{
					const $row=$(element).parents(".goods");
					const id=$row.find(".id").text();  
					if($src.is(".delete")){
						// 将数组中当前删除的商品对象移除
						this.cart = this.cart.filter(curr=>curr.id!=id);
						// 将修改后的数组存回 cookie
						$.cookie("cart", this.cart, {expires: 10, path: "/"});
						// 页面DOM树中删除行
						$row.remove();
					}
				});
				if($src.is(".clear")){
					this.cart=$.removeCookie("cart",{path:"/"});
					$(".empty").removeClass("hidden");
					$(".container").addClass("hidden");
				}
			},
			
			//去结算
			goAccounts(){
				const selectgoods=[];
				$(".che-prod:checked").each((index,element)=>{
					const $parent=$(element).parents(".goods");
					const currProduct={
						id:$parent.find(".id").text(),
						img:$parent.find(".imgs").find("img").attr("src"),
						title:$parent.find(".title").text(),
						price:$parent.find(".price").text(),
						amount:$parent.find(".amount").find(".count").val(),
						subtotal:$parent.find(".subtotal").text()
					};
					console.log(currProduct);
					selectgoods.push(currProduct);
				})
				
				if(selectgoods.length!=0){
					//将购物车商品保存进cookie
					$.cookie("selectgoods",selectgoods,{expires:10,path:"/"});
					location="/Pages-PBA/html/account.html";
				}
			}

			
			
			
		});
		new Cart();
	})
})