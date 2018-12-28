require(["config"],function(){
	require(["jquery","load","cookie","code"],function($){
		function Register() {
			this.load();
			this.addListener();
			$.cookie.json=true;
		}
		$.extend(Register.prototype, {
			// 生成随机验证码
			load(){
			    $('.code-img').createCode({
			      len:6
			    });
			},
			addListener() {	
				//提交表单
				$(".reg-btn").on("click",this.registerHander);
				//验证表单数据
				$('#reg-form').on("blur",".username, .code, .phone-code, .password, .pwd-true",$.proxy(this.Verification,this));
				//发送短信验证码
				$(".send").on("click",this.sendMsm);
			},
			registerHander(){
				// 获取登录信息
				const 
					username=$(".username").val(),
					password=$(".password").val(),
					code=$(".code").val(),
					phone_code=$(".phone-code").val(),
					test_pwd=$(".pwd-true").val();
				if(username!=""&&password!=""&&code!=""&&phone_code!=""&&test_pwd!=""){
					const data={
						username:username,
						password:password
					};
					$.post("http://localhost/pba-api/register.php",data,(res)=>{
						console.log(res);
						if(res.res_body.status==1){
							$.cookie("loginUser", res.res_body.username, {expires:7,path: "/"});
							location="/";
						}else{
							$(".error").text(res.res_body.message);
							$(".error").css("display","inline-block");
						}
					},"json");
				}
				return false;
			},
			
			//验证表单数据
			Verification(event){
				const $src=$(event.target);
					
				//正则验证
				const 
					user_reg=/^1[34578]\d{9}$/,
					pwd_reg=/^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$).{6,20}$/;
				
				//验证手机号
				if($src.is(".username")){
					if(!user_reg.test($src.val())){
						$(".user_error").text("*请输入有效的手机号码");
						return false;
					}else{
						$(".user_error").text(" ");
					}
				}
				//验证码
				if($src.is(".code")){
					if($src.val().toLowerCase()!==$('.code-img').children('input').val().toLowerCase()){
				     	$(".code_error").text("*验证码输入错误");
				     	return false;
				    }else{
				    	$(".code_error").text(" ");
				    }
				}
				//密码
				if($src.is(".password")){
					if(!pwd_reg.test($src.val())){
						$(".pwd_error").text("*密码由6-18位字母、数字或下划线组成");
						return false;
					}else{
						$(".pwd_error").text(" ");
					}
				}
				//确认密码
				if($src.is(".pwd-true")){
					if($src.val()!=$(".password").val()){
						$(".test_pwd_error").text("*两次输入的密码不一致");
						return false;
					}else{
						$(".test_pwd_error").text(" ");
					}
				}
				
			},
			
			//发送短信验证码
			sendMsm(){
				const count=60;//间隔函数，1秒执行
				let InterValObj1;//timer变量，控制时间
				let curCount1;//当前剩余秒数
				curCount1 = count;
			    //设置button效果，开始计时
			    $(".send").attr("disabled", "true");
			    $(".send").val(+curCount1 + "秒再获取");
			    InterValObj1 =setInterval(()=>{
			    	if (curCount1 == 0) {
				        clearInterval(InterValObj1); //停止计时器
				        $(".send").removeAttr("disabled"); //启用按钮
				        $(".send").val("重新发送");
				    } else {
				        curCount1--;
				        $(".send").val(+curCount1 + "秒再获取");
				        if(curCount1<50){
				        	let Num=""; 
							for(let i=0;i<6;i++) 
							{ 
								Num+=Math.floor(Math.random()*10); 
							} 
							$(".phone-code").val(Num);
							clearInterval(InterValObj1); //停止计时器
							$(".send").val("获取手机验证码");
							
				        }
				    }
			    }, 1000); //启动计时器，1秒执行一次
			},
		});

		new Register();
	});
});
		