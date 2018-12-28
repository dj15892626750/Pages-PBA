/* 加载头部和尾部 */
// 定义模块，复用
define(["jquery","cookie"],function($){
	// 构造函数
	function HeaderAndFooter(){
		this.init();
	}
	//扩展原型
	$.extend(HeaderAndFooter.prototype, {
		//初始化
		init(){
			this.loadHeader();
			this.loadFooter();
		},
		//加载头部
		loadHeader(){
			$.get("/Pages-PBA/html/cart-header.html",(data)=>{
				$("#container-header").html(data);
				// 头部内容加载完毕并渲染完成后，还需要添加交互
				this.headerHandler();
				this.addListener();
			});
		},
		// 加载尾部
		loadFooter(){
			$(".footer").load("/Pages-PBA/html/footer.html");
		},
		headerHandler(){
			// 用户登录信息显示
			this.showLoginUser();
		},
		showLoginUser() {
			const user = $.cookie("loginUser");
			let users="";
			if(user!=undefined){
				users=JSON.parse(user);
			}
			let html="";
			if (user) {
				html +='<li><a href="javascript:">欢迎:&nbsp;&nbsp;'+users+'</a></li>'
					+'<li><a href="javascript:" class="exit">退出</a></li>';
				$(".header-wrap ul li:lt(2)").remove();
				$(".header-wrap").find("ul").prepend(html);
				
			}else{
				html=`<li><a href="/Pages-PBA/html/login.html">登录</a></li>
					<li><a href="/Pages-PBA/html/register.html">注册</a></li>`;
				$(".header-wrap ul li:lt(2)").remove();
				$(".header-wrap").find("ul").prepend(html);	
			}
			
		},
		addListener(){
			$(".exit").on("click",this.exit);
		},
		//退出登录
		exit(){
			$.removeCookie("loginUser",{path:"/"});
			location="/Pages-PBA/";
		},
	});
	return new HeaderAndFooter();

})