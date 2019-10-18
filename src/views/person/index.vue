<template>
		<el-form ref="person" :model="person" class="form-container" label-width="80px">
			<el-card class="box-card">
			  <div slot="header" class="clearfix">
					<span>基本信息</span>
					<el-button style="float: right; padding: 3px 0" type="text" v-show="edit.isBaseEditShow" @click="baseEdit()">修改</el-button>
					<el-button style="float: right; padding: 3px 0" type="text" v-show="!edit.isBaseEditShow" @click="update('baseEdit')">保存</el-button>
					<el-button style="float: right; padding: 3px 0" type="text" v-show="!edit.isBaseEditShow" @click="baseClear()">清空</el-button>
					<el-button style="float: right; padding: 3px 0" type="text" v-show="!edit.isBaseEditShow" @click="baseCancel()">取消</el-button>
			  </div>
			   <div  class="text item">
				   <el-form-item style="margin-left: 70px;" @click.native.prevent="selectAvatar()">
					   <el-avatar v-if="person.avatar!=null" :size="90" :key="person.avatar" :src="person.avatar" alt="头像" style="cursor: pointer;" ></el-avatar>
					   <el-avatar v-else :size="90" alt="头像" style="cursor: pointer;" :key="person.avatar" :src="defaultAvatar"></el-avatar>
				   </el-form-item>
				   <input type="file" name="file" hidden="hidden" id="avatar" @change="avatarChange()" :disabled="edit.isBaseEdit" />
					<el-form-item label="真实姓名">
						<el-input v-model="person.nickname" size="small" class="my-input" :disabled="edit.isBaseEdit"></el-input>
					</el-form-item>
					<el-form-item label="性别">
						<el-input v-model="person.sex" size="small" class="my-input" :disabled="edit.isBaseEdit"></el-input>
					</el-form-item>
					<el-form-item label="年龄">
						<el-input v-model="person.age" size="small" class="my-input" :disabled="edit.isBaseEdit"></el-input>
					</el-form-item>
					<el-form-item label="身份证">
						<el-input v-model="person.idcard" size="small" class="my-input" :disabled="edit.isBaseEdit"></el-input>
					</el-form-item>
					<el-form-item label="手机号">
						<el-input v-model="person.mobileNumber" size="small" class="my-input" :disabled="edit.isBaseEdit"></el-input>
					</el-form-item>
					<el-form-item label="邮箱">
						<el-input v-model="person.email" size="small" class="my-input" :disabled="edit.isBaseEdit"></el-input>
					</el-form-item>
			   </div>
			</el-card>
		</el-form>
</template>

<script>
	import {uploadImageSingle} from '@/api/image';
	import {savePerson} from '@/api/person';
	import { Message } from 'element-ui'

	export default{
		name:'person',
		data(){
			return{
				defaultAvatar:'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1570773046879&di=0164a258a87ab4ffcd79ca4ac1673e8d&imgtype=0&src=http%3A%2F%2Fimg.zcool.cn%2Fcommunity%2F01786557e4a6fa0000018c1bf080ca.png',
				person:{
					id:'',
					avatar:'',
					nickname:'',  
					idcard:'',   //身份证
					mobileNumber:'',   //个人手机
					email:'',
					sex:'',
					age:''
				},
				edit:{
					isBaseEdit:true,
					isBaseEditShow:true
				},
				myself:this
			}
		},
		mounted() {	
			this.getPersonInfo()
		},
		methods:{
			/*获取个人信息*/
			getPersonInfo(){
				var p = JSON.parse(sessionStorage.getItem("person"))
				this.person.id = p.id
				this.person.avatar = p.avatar
				this.person.nickname = p.nickname
				this.person.idcard = p.idcard
				this.person.mobileNumber = p.mobileNumber
				this.person.email = p.email
				this.person.sex = p.sex
				this.person.age = p.age
			},
			/*保存更新的信息*/
			update(operate){
				var that = this  
				savePerson(this.person).then(res=>{
					this.baseEdit()
					//更新本地的个人信息
					sessionStorage.setItem("person",JSON.stringify(this.person))
				})
			},
			/*选择头像*/
			selectAvatar(){
				document.getElementById("avatar").click();
			},
			/*头像改变后将路径赋值显示*/
			avatarChange(){
				var formData = new window.FormData()   //创建一个表单信息
				formData.append("file",document.getElementById("avatar").files[0])
				uploadImageSingle(formData).then(res=>{
					this.person.avatar = res.data
				})
			},
			/*基本信息编辑*/
			baseEdit(){
				this.edit.isBaseEditShow = !this.edit.isBaseEditShow
				this.edit.isBaseEdit = !this.edit.isBaseEdit
			},
			/*基本信息清空*/
			baseClear(){
				this.person = {}
			},
			/*取消编辑*/
			baseCancel(){
				this.baseEdit();
				this.getPersonInfo()
			}
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
