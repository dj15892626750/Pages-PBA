require.config({
	baseUrl:"/Pages-PBA/",//webserver根目录
	paths:{
		jquery:"lib/jquery/jquery-1.12.4.min",//jQuery短名称
		load:"js/loadHeaderAndFooter",//加载头尾
		right:"js/right",//加载右边
		cart_load:"js/loadCartHeader",//购物车加载头尾
		template: "lib/art-template/template-web", // art-template
		autoplay: "lib/jquery-plugins/jquery.easyfader.min", // 轮播
		cookie:"lib/jquery-plugins/jquery.cookie",//cookie
		fly:"lib/jquery-plugins/jquery.fly.min",//fly抛物线
		zoom:"lib/jquery-plugins/jquery.elevateZoom-3.0.8.min",//放大镜
		code:"lib/jquery-plugins/jquery.code",//验证码
		bootstrap:"lib/bootstrap/js/bootstrap.min",//bootstrap
		popt:"lib/city/Popt",
		cityset:"lib/city/citySet",
		city:"lib/city/city.json",
	},
	shim: {
		fly: { // 这是jQuery插件，依赖于 jQuery 模块
			deps: ["jquery"]
		},
		zoom: {
			deps: ["jquery"]
		},
		autoplay:{
			deps:["jquery"]
		},
		bootstrap:{
			deps:["jquery"]
		},
	}

})