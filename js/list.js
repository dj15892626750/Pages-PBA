require(["config"],function(){
	require(["jquery","template","load","right","bootstrap"],function($,template){
		function List() {
			this.loadHotProducts();
			this.addListener();
		}
		$.extend(List.prototype, {
			// 加载渲染热销商品
			loadHotProducts() {
				//获取第一页内容渲染页面
				this.findByPage(1);
				
				$.getJSON("http://rap2api.taobao.org/app/mock/120085/api/list", (data)=>{
					console.log(data)
					//获得总数据进行分页
					const total=data.res_body.list.length;
					const totalPages=Math.ceil(total/20);
					//动态生成分页
					let pages=`<li class="disabled">
							      <a href="javascript:" aria-label="Previous">
							        <span aria-hidden="true">&laquo;</span>
							      </a>
							    </li>`;
					for (var i=1;i<=totalPages;i++) {
						pages+=`<li><a href="javascript:">${i}</a></li>`;
					}
					pages+=`<li>
						      <a href="javascript:" aria-label="Next">
						        <span aria-hidden="true">&raquo;</span>
						      </a>
						    </li>`;
					$(".pagination").prepend(pages);
					$(".pagination li:nth-child(2)").addClass("active");
				});				
			},
			//按页查找
			findByPage(page){
				page=page|| 1;
				let list=[];
				const pageSize=20;
				let x=(page-1)*pageSize;

				$.getJSON("http://rap2api.taobao.org/app/mock/120085/api/list", (data)=>{
					for (let i in data.res_body.list) {
						if(i>=x && i<page*pageSize){
							list.push(data.res_body.list[i]);
						}
					}
					const html = template("list-template", {products: list})
					$(".goods-list-show").find("ul").html(html);
				})
			},
			addListener(){
				$(".pagination").on("click","a",$.proxy(this.changePages,this));
			},
			changePages(event){
				const $src=$(event.target);
				const page=$src.text();
				//按页查找
				this.findByPage(page);
				$src.parents("li").addClass("active");
				$src.parents("li").siblings().removeClass("active");
			}
		});

		new List();
	});
});