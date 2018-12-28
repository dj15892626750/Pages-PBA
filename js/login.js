require(["config"],function(){
	require(["jquery","load","cookie"],function($){
		function Login() {
			this.addListener();
			$.cookie.json=true;
		}
		$.extend(Login.prototype, {
			// 加载渲染热销商品
			addListener() {	
				$("#login-form").on("submit",this.loginHander);
			},
			loginHander(){
				// 获取登录信息
//				const data = $("#form-login").serialize();
				const remember=$("#remember").is(":checked");//复选框是否选中
				const data={
					username:$("#username").val(),
					password:$("#password").val(),
					remember:remember
				};
				$.post("http://localhost/pba-api/login.php",data,(res)=>{
					console.log(res);
					if(res.res_body.status==1){
						if(res.res_body.remember=="true"){
							$.cookie("loginUser", res.res_body.info.phone, {expires:7,path: "/"});
						}else{
							$.cookie("loginUser", res.res_body.info.phone, {path: "/"});
						}
						location="/";
					}
					else{
						$(".error").text(res.res_body.msg);
					}
				},"json");
				return false;
			}
		});

		new Login();
	});
});