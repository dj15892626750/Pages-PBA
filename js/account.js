require(["config"],function(){
	require(["jquery","template","cookie","cart_load","bootstrap","popt","city","cityset"],function($,template){
		function Account(){
			this.goods=[];//商品
			this.address=[];//地址
			$.cookie.json = true;
			this.render();
			this.addListener();	
		}
		$.extend(Account.prototype,{
			
			render(){
				//加载商品
				const goods=this.goods=$.cookie("selectgoods")||[];
				const html=template("account-template",{goods:goods});
				$(".goods-list").prepend(html);
				const lis=$(".goods-list").find("li");
				let sum=0;
				lis.each((index,element)=>{
					sum+=Number($(element).find(".col-total").text());
				});
				$(".amount").text(lis.length+"件");
				$(".totalprice").text("￥"+sum.toFixed(2));
				let paymoney=Number(sum-$(".discount").text().slice(1));
				$(".pay-money").text("￥"+paymoney.toFixed(2));
				
				//加载地址
				const address=this.address=$.cookie("address")||[];
				console.log(address)
				
				const addr=template("address-template",{address:address});
				$(".address-body").prepend(addr);
			},
			
			addListener(){
				//选择地址
				$(".add-address").on("click",".address",this.SelectAddress);
				//选择地址
				$(".update-address").on("click",".address",this.SelectAddress);
				//添加地址
				$("#add-save").on("click",this.saveUserAddress);
				//删除地址
				$(".address-body").on("click",".del",$.proxy(this.deleteAddress,this));
				//点击修改地址
				$(".address-body").on("click",".upd",$.proxy(this.updateAddress,this));
				//修改后重新保存地址
				$("#update-save").on("click",this.updateSaveAddress);
				//选中送货地址
//				$(".address-body").on("click",".my-address",$.proxy(this.selectedAddress,this));
				const divs=$(".my-address");
				divs.each((index,element)=>{
					$(element).click(function(){
						$(this).addClass("sect");
						$(this).siblings().removeClass("sect");
						const 
							name=$(this).find("dt").text(),
							phone=$(this).find(".mobile").text(),
							addr=$(this).find(".adr").text(),
							adr_detail=$(this).find(".adr-det").text();
						const html=`<span>${name} ${phone}</span>
									<span>${addr} ${adr_detail}</span>`;
						$(".fl").html(html);
					})
				})
				
			},
			SelectAddress(e){
				SelCity(this,e);
			},
			
			//添加地址
			saveUserAddress(){
				let max_id=0;
				const address=this.address=$.cookie("address") || [];
				if(address.length!=0){
					address.forEach((curr)=>{
						if(curr.id>max_id){
							max_id=curr.id;
						}
					})
				}
				let id=Number(max_id);
				id++;
				let 
					name=$(".name").val(),
					phone=$(".phone").val(),
					hcity=$("#hcity").val(),//省
					hproper=$("#hproper").val(),//市
					harea=$("#harea").val(),//区
					address_detail=$(".address-detail").val(),
					zipcode=$(".add-address").find(".zipcode").val(),
					tag=$(".add-address").find(".tag").val();
				
				console.log(harea)
				if(name!="" && phone!="" && hcity!="" && hproper!="" && harea!="" && address_detail!=""){
					if(harea!=undefined){
						harea=harea.replace(/\s/g,"");
					}else{
						harea="";
					}
					const reg=/^1[34578]\d{9}$/;
					if(!reg.test(phone)){
						alert("请输入有效的手机号码");
						return false;
					}
					let html="";
					html=`<div class="address-item my-address">
							<dl>
								<dt>${name}</dt>
								<dd class="mobile">${phone}</dd>
								<dd class="adr">${hcity} ${hproper} ${harea}</dd>
								<dd class="adr-det">${address_detail}</dd>
							</dl>
							<input type="hidden" class="zipcode" value="${zipcode}" />
							<input type="hidden" class="tag" value="${tag}" />
							<div class="addr-handle">
								<i class="glyphicon glyphicon-pencil upd" data-toggle="modal" data-target="#updateModal"></i>
								<i class="glyphicon glyphicon-trash del"></i>
							</div>
						</div>`;
					$(".address-body").prepend(html);
					const curr={
						id:id,
						name:name,
						phone:phone,
						hcity:hcity,
						hproper:hproper,
						harea:harea,
						address_detail:address_detail,
						zipcode:zipcode,
						tag:tag
					};
					address.push(curr);
					//将地址保存进cookie
					$.cookie("address",address,{expires:10,path:"/"});
				}
				$("#addModal").modal("hide");
				$(".add-address")[0].reset();
			},
			
			//删除地址
			deleteAddress(event){
				const $src=$(event.target);
				const $parent=$src.parents(".my-address");
				const id=$parent.find(".id").val();
				// 将数组中将当前删除的商品对象移除
				this.address = this.address.filter(curr=>curr.id!=id);
				// 将修改后的数组存回 cookie
				$.cookie("address", this.address, {expires: 10, path: "/"});
				// 页面DOM树中删除行
				$parent.remove();
			},
			//点击修改地址
			updateAddress(event){
				const $src=$(event.target);
				const $parent=$src.parents(".my-address");
				console.log($parent)
				const 
					id=$parent.find(".id").val(),
					name=$parent.find("dt").text(),
					phone=$parent.find(".mobile").text(),
					addr=$parent.find(".adr").text(),
					adr_detail=$parent.find(".adr-det").text(),
					zipcode=$parent.find(".zipcode").val(),
					tag=$parent.find(".tag").val();
				
				$(".update-address").find(".id").val(id);
				$(".update-address").find(".name").val(name);
				$(".update-address").find(".phone").val(phone);
				$(".update-address").find(".address").val(addr);
				$(".update-address").find(".address-detail").val(adr_detail);
				$(".update-address").find(".zipcode").val(zipcode);
				$(".update-address").find(".tag").val(tag);
			},
			
			//修改后重新保存地址
			updateSaveAddress(){
				const 
					id=$(".update-address").find(".id").val(),
					name=$(".update-address").find(".name").val(),
					phone=$(".update-address").find(".phone").val(),
					adr_detail=$(".update-address").find(".address-detail").val(),
					zipcode=$(".update-address").find(".zipcode").val(),
					tag=$(".update-address").find(".tag").val();
					
				let hcity=$(".update-address").find("#hcity").val(),//省
					hproper=$(".update-address").find("#hproper").val(),//市
					harea=$(".update-address").find("#harea").val();//区
					
				if(hcity==undefined){
					hcity=$(".update-address").find(".address").val().split(" ")[0];
					hproper=$(".update-address").find(".address").val().split(" ")[1];
					harea=$(".update-address").find(".address").val().split(" ")[2];
				}
				
				//从cookie中获取地址列表
				const address=this.address=$.cookie("address")||[];
				// 对应商品对象 
				const prod = this.address.filter(curr=>curr.id==id)[0];

				prod.name=name;
				prod.phone=phone;
				prod.address_detail=adr_detail;
				prod.zipcode=zipcode;
				prod.tag=tag;
				prod.hcity=hcity;
				prod.hproper=hproper;
				prod.harea=harea;
				$.cookie("address",address,{expires:10,path:"/"});				
				//关闭模态框
				$("#updateModal").modal("hide");
				$(".update-address")[0].reset();
				location.reload();
				
				
			},
		});
		new Account();
	})
})