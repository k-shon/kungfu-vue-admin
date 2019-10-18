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
				<el-form-item>
					<el-button round size="medium" style="width: 100%;" type="primary" @keyup.enter="submitForm" @click.native.prevent="submitForm()">登录</el-button>
				 </el-form-item>
			</el-form>
			<router-link to="/register"><el-button type="text">去注册<i class="el-icon-arrow-right el-icon--right"></i></el-button></router-link>
		</div>
	</div>
</template>

<script>
	import avatar from '@/assets/logo.png';
	import {isValidUsername,isValidPassword} from '@/utils/validate';
	import { getPerson} from '@/api/person'
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
			return{
				loginForm: {  //表单信息
				  username: '',
				  password: '',
				},
				avatarUrl:avatar,  //头部图标地址
				loginRule:{
					username:[
						{required: true,validator:valiUsername,trigger:'blur'}
					],
					password:[
						{required: true,validator:valiPassword,trigger:'blur'}
					]
				}
			}
		},
		methods:{
			/**
			 * state负责存储整个应用的状态数据，要注意在入口文件main.js注入store对象，就可以在根组件下的子组件使用this.$store.state获取状态了。
				mutation里面写着改变状态数据的方法（一定要写在这里），mutation是同步事件要注意，里面的方法不能写异步的，组件中触发一个mutation的方法store.commit(mutationName)。
				action也是一个改变状态数据的事件，但不同的是action改变状态是通过调用mutation来实现的，注意action是个异步事件。直接触发action就使用this.$store.dispatch(actionName)。
			 */
			submitForm:function(){
				this.$refs.loginForm.validate(valid => {  //调用表单的验证方法
					if(valid){
						this.$store.dispatch('Login',this.loginForm).then(()=>{
							this.$router.push({path: '/'})
						}).catch(()=>{
							Message({
							  message: "登录失败",
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
