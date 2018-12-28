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
			$.get("/Pages-PBA/html/header.html",(data)=>{
				$("#container-header").html(data);
				// 头部内容加载完毕并渲染完成后，还需要添加交互
				this.headerHandler();
				this.addListener();
				this.changeList();//导航栏切换
			});
		},
		// 加载尾部
		loadFooter(){
			$(".footer").load("/Pages-PBA/html/footer.html");
		},
		headerHandler(){
			// 用户登录信息显示
			this.showLoginUser();
			// 搜索提示
			$(".search #txt").on("keyup", this.suggestHandler);
			$(".suggest").on("click", "div", (event) => {
				$(".search #txt").val($(event.target).text());
				// 隐藏提示
				$(".suggest").hide(); // $(".suggest")[0].style.display = "none"
			});
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
		// 搜索提示
		suggestHandler(event){
			const
				word = $(event.target).val(), // 从文本框中获取输入值
				url = `https://suggest.taobao.com/sug?code=utf-8&q=${word}&callback=?`; // jsonp接口URL
			// jsonp跨域请求淘宝建议接口
			$.getJSON(url, (data) => {
				let html = "";
				data.result.forEach((curr) => {
					html += `<div>${curr[0]}</div>`;
				});
				$(".suggest").show().html(html);
			});
		},
		addListener(){
			$(".exit").on("click",this.exit);
			$("#cart").on("click",this.isLogin);
		},
		//退出登录
		exit(){
			$.removeCookie("loginUser",{path:"/"});
			location="/Pages-PBA/";
		},
		changeList(){
			let _url=location.pathname+location.search;
            $('.nav ul a').each((curr,element)=>{
                if($(element).attr('href')==_url) {
                    $(element).parents("li").addClass("active");
                    $(element).parents("li").siblings().removeClass("active");
                }
            });
		},
		isLogin(){
			const user = $.cookie("loginUser");
			console.log(user)
			if(user=="" || user==undefined){
				location="/Pages-PBA/html/login.html";
			}else{
				location="/Pages-PBA/html/cart.html";
			}
		}
	});
	return new HeaderAndFooter();

})