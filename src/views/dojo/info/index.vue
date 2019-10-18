<template>
		<el-form ref="dojoForm" :model="dojoForm" class="form-container" label-width="80px">
			<el-card class="box-card">
			  <div slot="header" class="clearfix">
					<span>基本信息</span>
					<el-button style="float: right; padding: 3px 0" type="text" v-show="edit.isBaseEditShow" @click="baseEdit(myself)">修改</el-button>
					<el-button style="float: right; padding: 3px 0" type="text" v-show="!edit.isBaseEditShow" @click="update('baseEdit')">保存</el-button>
					<el-button style="float: right; padding: 3px 0" type="text" v-show="!edit.isBaseEditShow" @click="baseClear()">清空</el-button>
			  </div>
			   <div  class="text item">
					<el-form-item label="真实姓名">
						<el-input v-model="dojoForm.person.nickname" size="small" class="my-input" :disabled="edit.isBaseEdit"></el-input>
					</el-form-item>
					<el-form-item label="身份证">
						<el-input v-model="dojoForm.person.idcard" size="small" class="my-input" :disabled="edit.isBaseEdit"></el-input>
					</el-form-item>
					<el-form-item label="手机号">
						<el-input v-model="dojoForm.person.mobileNumber" size="small" class="my-input" :disabled="edit.isBaseEdit"></el-input>
					</el-form-item>
					<el-form-item label="邮箱">
						<el-input v-model="dojoForm.person.email" size="small" class="my-input" :disabled="edit.isBaseEdit"></el-input>
					</el-form-item>
			   </div>
			</el-card>
			<el-card class="box-card">
			  <div slot="header" class="clearfix">
					<span>武馆信息</span>
					<el-button style="float: right; padding: 3px 0" type="text" v-show="edit.isDojoEditShow" @click="dojoEdit(myself)">修改</el-button>
					<el-button style="float: right; padding: 3px 0" type="text" v-show="!edit.isDojoEditShow" @click="update('dojoEdit')">保存</el-button>
					<el-button style="float: right; padding: 3px 0" type="text" v-show="!edit.isDojoEditShow" @click="dojoClear()">清空</el-button>
			  </div>
			  <div  class="text item">
					<el-form-item label="武馆名称">
						<el-input v-model="dojoForm.dojoName" size="small" class="my-input" :disabled="edit.isDojoEdit"></el-input>
					</el-form-item>
					<el-form-item label="报名价格">
						<el-input v-model="dojoForm.dojoApplyPrice" size="small" class="my-input" :disabled="edit.isDojoEdit"></el-input>
					</el-form-item>
					<el-form-item label="武馆简介">
						<el-input v-model="dojoForm.dojoIntro" size="small" class="my-input" :disabled="edit.isDojoEdit"></el-input>
					</el-form-item>
					<el-form-item label="武馆类别">
						<el-input v-model="dojoForm.dojoType" size="small" class="my-input" :disabled="edit.isDojoEdit"></el-input>
					</el-form-item>
					<el-form-item label="联系电话">
						<el-input v-model="dojoForm.mobileNumber" size="small" class="my-input" :disabled="edit.isDojoEdit"></el-input>
					</el-form-item>
					<el-form-item label="武馆地址">
						<el-input v-model="dojoForm.dojoAddress" size="small" class="my-input" :disabled="edit.isDojoEdit"></el-input>
					</el-form-item>
					<el-form-item label="相关配图">
						<el-input v-model="dojoForm.photoList" size="small" class="my-input" :disabled="edit.isDojoEdit"></el-input>
					</el-form-item>
					<el-form-item label="武馆证书">
						<el-input v-model="dojoForm.certificate" size="small" class="my-input" :disabled="edit.isDojoEdit"></el-input>
					</el-form-item>
			  </div>
			</el-card>
		</el-form>
</template>

<script>
	import {getDojo,updateDojo} from '@/api/dojo';
	import { Message } from 'element-ui'

	export default{
		name:'info',
		data(){
			return{
				dojoForm:{ 
					id:1,
					dojoPortrait:'', //头像
					person:{
						id:'',
						nickname:'',  
						idcard:'',   //身份证
						mobileNumber:'',   //个人手机
						email:''
					},
					mobileNumber:'',  //武馆联系方式
					dojoName:'',
					dojoApplyPrice:'',
					dojoIntro:'',
					dojoType:'',
					dojoAddress:'',
					photoList:'',  //相册
					certificate:''  //证书
				}, 
				edit:{
					isBaseEdit:true,
					isBaseEditShow:true,
					isDojoEdit:true,
					isDojoEditShow:true,
				},
				myself:this
			}
		},
		mounted() {
			//从后台获取武馆信息
			getDojo(1).then(res=>{
				var dojo =  res.data
				this.$data.dojoForm.person.id = dojo.person.id
				this.$data.dojoForm.person.nickname = dojo.person.nickname
				this.$data.dojoForm.person.idcard = dojo.person.idcard
				this.$data.dojoForm.person.mobileNumber = dojo.person.mobileNumber
				this.$data.dojoForm.person.email = dojo.person.email
				this.$data.dojoForm.mobileNumber = dojo.mobileNumber
				this.$data.dojoForm.dojoName = dojo.dojoName
				this.$data.dojoForm.dojoApplyPrice = dojo.dojoApplyPrice
				this.$data.dojoForm.dojoIntro = dojo.dojoIntro
				this.$data.dojoForm.dojoType = dojo.dojoType
				this.$data.dojoForm.dojoAddress = dojo.dojoAddress
			})
		},
		methods:{
			/*保存更新的信息*/
			update(operate){
				var that = this  //保存this对象，因为调用updateDojo后,this指向windows，而不是vue
				updateDojo(that.$data.dojoForm).then(res=>{
					console.log("this:"+that)
					if(res.status === 200){
						Message({
						  message: '保存成功',
						  type: 'success',
						  duration: 3 * 1000
						})
						console.log("options:"+that.$options)
						//不可编辑
						if(operate === 'baseEdit'){
							that.$options.methods.baseEdit(that)
						}else{
							that.$options.methods.dojoEdit(that)
						}
					}else{
						Message({
						  message: res.data.msg,
						  type: 'error',
						  duration: 3 * 1000
						})
					}
				})
			},
			/*基本信息编辑*/
			baseEdit(self){
				console.log(self.$data)
				self.$data.edit.isBaseEditShow = !self.$data.edit.isBaseEditShow
				self.$data.edit.isBaseEdit = !self.$data.edit.isBaseEdit
			},
			/*武馆信息编辑*/
			dojoEdit(self){
				self.$data.edit.isDojoEditShow = !self.$data.edit.isDojoEditShow
				self.$data.edit.isDojoEdit = !self.$data.edit.isDojoEdit
			},
			/*基本信息清空*/
			baseClear(){
				this.$data.dojoForm.person = {}
			},
			/*武馆信息清空*/
			dojoClear(){
				this.$data.dojoForm = {person:this.$data.dojoForm.person}
			},
			
		}
	}
</script>

<style>
	
   .my-input{
	   width:280px;
   }
  .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }

  .box-card {
	  margin-bottom: 20px;
    width: 780px;
  }
</style>
