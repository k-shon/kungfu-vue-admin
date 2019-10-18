<template>
	<div>
		<div class="login-layout">
			<!--rules:element-ui中的表单验证规则; ref:vue中操作dom元素的引用，可用this.$ref.loginForm操作此form-->
			<el-form  autoComplete="on"
					:model="loginForm"
					:rules="loginRule"
					ref="loginForm"> 
				<el-form-item style="text-align: center;">
					<div style="line-height: 0px;padding: 0px;">
						<el-avatar :size="100" :src="avatarUrl"  ></el-avatar>
						<h2>功夫在线平台</h2>
					</div>
				</el-form-item>
				<el-form-item prop="username"> <!--prop一定要在el-form-item标签中，否则验证规则不生效-->
					<el-input prefix-icon="el-icon-user-solid"
							placeholder="请输入用户名" 
							v-model="loginForm.username" 
							autoComplete="on">  <!--prefix-icon:头部图标，参考element-ui的input;autoComplete:自动补全功能-->
					</el-input>
				</el-form-item>
				<el-form-item prop="password">
					<el-input prefix-icon="el-icon-lock" 
							placeholder="请输入密码" 
							v-model="loginForm.password" 
							show-password>
					</el-input>
				</el-form-item>
				<el-form-item prop="password2">
					<el-input prefix-icon="el-icon-lock" 
							placeholder="请再次输入密码" 
							v-model="loginForm.password2" 
							show-password>
					</el-input>
				</el-form-item>
				<el-form-item>
					<el-button round size="medium" style="width: 100%;" type="primary" @click.native.prevent="submitForm()">注册</el-button>
				 </el-form-item>
			</el-form>
		</div>
	</div>
</template>

<script>
	import avatar from '@/assets/logo.png';
	import {isValidUsername,isValidPassword} from '@/utils/validate';
	import { getPerson} from '@/api/person'
	import {register} from '@/api/login'
	import { Message } from 'element-ui'
	export default{
		name:'login',
		data(){
			const valiUsername=(rule,value,callback)=>{
				if(value===''){
					callback(new Error('用户名不能为空'))
				// }else if(!isValidUsername(value)){  //调用验证方法
				// 	callback(new Error('用户名不存在'))
				}else{
					callback()
				}
			};
			const valiPassword=(rule,value,callback)=>{
				if(value===''){
					callback(new Error('密码不能为空'))
				// }else if(!isValidPassword(value)){
				// 	callback(new Error('密码错误'))
				}else{
					callback()
				}
			};
			//验证两次密码是否一致
			const valiPasswordIsTrue=(rule,value,callback)=>{
				if(value===''){
					callback(new Error('请再次输入密码'))
				}else if(value!==this.loginForm.password){
					callback(new Error('两次输入密码不一致'))
				}else{
					callback()
				}
			};
			return{
				loginForm: {  //表单信息
				  username: '',
				  password: '',
				  password2:''
				},
				avatarUrl:avatar,  //头部图标地址
				loginRule:{
					username:[
						{required: true,validator:valiUsername,trigger:'blur'}
					],
					password:[
						{required: true,validator:valiPassword,trigger:'blur'}
					],
					password2:[
						{required: true,validator:valiPassword,trigger:'blur'},
						{required: true,validator:valiPasswordIsTrue,trigger:'blur'}
					]
				}
			}
		},
		methods:{
			submitForm:function(){
				this.$refs.loginForm.validate(valid => {  //调用表单的验证方法
					if(valid){
						register(this.loginForm.username,this.loginForm.password).then(res=>{
							Message({
							  message: '注册成功，请登录',
							  type: 'success',
							  duration: 3 * 1000
							})
							this.$router.push({path: '/login'})
						}).catch(res=>{
							Message({
							  message: res.msg,
							  type: 'error',
							  duration: 3 * 1000
							})
						})
						return true;
					}
				})
				return false;
			}
		}
	}
</script>

<style>
	.login-layout{
		position: absolute;
		left: 30%;
		right: 30%;
		width: 360px;
		top:20%;
		margin: 0 auto;
	}
</style>
