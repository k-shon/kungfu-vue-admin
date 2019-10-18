<template>
	<div>
		<el-row class="chat-container">
			<!--联系人-->
			 <el-col :span="6" class="left-ul">
				 <el-form size="mini" class="search">
					 <el-form-item width="70px">
						 <el-input placeholder="搜索" prefix-icon="el-icon-search"></el-input>
					 </el-form-item>
				 </el-form>
				<el-tabs v-model="activeTag" @tab-click="selectTab" tab-position="top">
					<el-tab-pane label="联系人" name="first">
						<el-table
							  :data="friendTable"
							  style="width: 100%;height: 100%;"
							  :show-header="false"
							  :fit="false"
							  @row-click="selectToChat"
							  :empty-text="empty.contact"
							  :highlight-current-row="true">
							  <el-table-column prop="avatar" width="40">
								 <template slot-scope="scope">
									 <img v-if="scope.row.friend.avatar" :src="scope.row.friend.avatar" />
									 <img v-else :src="defaultAvatar.friend"/>
								 </template>
							  </el-table-column>
							  <el-table-column prop="name" width="212">
								  <template slot-scope="scope">{{scope.row.name}}</template>
							  </el-table-column>
							  <el-table-column prop="unRead">
								  <template slot-scope="scope">
									  <el-tag v-if="scope.row.unRead">{{scope.row.unRead}}</el-tag>
								  </template>
							  </el-table-column>
							</el-table>
					</el-tab-pane>
					<el-tab-pane label="群聊" name="second">
						<el-table
							  :data="groupTable"
							  style="width: 100%;height: 100%;"
							  :show-header="false"
							  :fit="false"
							  :empty-text="empty.group">
							  <el-table-column prop="avatar" width="40">
								 <template slot-scope="scope">
									 <img v-if="scope.row.friend.avatar" :src="scope.row.friend.avatar" />
									 <img v-else :src="defaultAvatar.group"/>
								 </template>
							  </el-table-column>
							  <el-table-column prop="name" width="200">
							  </el-table-column>
							  <el-table-column prop="message">
								  <template slot-scope="scope">
									  <el-tag v-if="scope.row.noRead>0">{{scope.row.noRead}}</el-tag>
								  </template>
							  </el-table-column>
							</el-table>
					</el-tab-pane>
				</el-tabs>
			 </el-col>
			 <!--聊天信息框-->
			 <el-col :span="18" class="right-ul">
				 <el-row style="height: 70%;margin-bottom: 10px;">
					 <chat-dialog  :chatMessage="chatMessage"  :person="person" :defaultAvatar="defaultAvatar"></chat-dialog>
				 </el-row>
				 <el-row style="height: 30%;">
					 <el-input type="textarea" :rows="6" v-model="message" placeholder="输入聊天内容"></el-input>
					 <el-button type="success" @click="sendMessage" size="medium" class="my-send-bt">发送</el-button>
				 </el-row>
			 </el-col>
		</el-row>
	</div>
</template>

<script>
	import {ChatDialog} from './components'
	import {getFriend,getChatMessage,sendMessage,setRead} from '@/api/chat'
	import Qs from 'qs'
	import { Message } from 'element-ui'
	export default{
		name:'index',
		components: {
			ChatDialog
		},
		data(){
			return{
				defaultAvatar:{
					friend:'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1570773046879&di=0164a258a87ab4ffcd79ca4ac1673e8d&imgtype=0&src=http%3A%2F%2Fimg.zcool.cn%2Fcommunity%2F01786557e4a6fa0000018c1bf080ca.png',
					group:'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1570773226840&di=c3fa724d81bed3e1a1e78cb09593b4c9&imgtype=0&src=http%3A%2F%2Fpic.90sjimg.com%2Fdesign%2F00%2F67%2F59%2F63%2F58e8ebdd5c471.png'
				},
				empty:{
					contact:'暂无联系人',
					group:'暂无群聊'
				},
				person:{},
				chatMessage:[], //总聊天记录，传递到ChatDialog页面
				currentSendChat:{  //当前聊天，用来发送消息
					fromPerson:{},
					toPerson:{},
					context:'',
					sendTime:''
				}, 
				 currentReceiveChat:{  //当前接收的消息，不一定是来自当前聊天的好友
				 	fromPerson:{},
				 	toPerson:{},
				 	context:'',
				 	sendTime:''
				 },
				message:'',
				activeTag: 'first',
				friendTable:[],
				groupTable:[],
				currentChatId:'',  //当前聊天id，非好友的id
				socket:''
			}
		},
		mounted(){
			this.person = JSON.parse(sessionStorage.getItem("person")) //获取本地个人信息
			getFriend(this.person).then(res=>{  //获取联系人
				this.friendTable = res.data 
				console.log(this.friendTable)
			})
			 //连接webSocket
			this.initWebSocket();
		},
		methods:{
			//选择联系人或群聊列表
			selectTab(tab, event) {
				console.log(tab, event);
			  },
			  //选择聊天联系人
			 selectToChat(row, event, column){
				 if(row.id == this.currentChatId){  //如果是点击当前聊天好友，则直接返回，不用请求数据
					 return;   
				 }
				 this.currentChatId = row.id
				 //设置当前聊天双方
				 this.currentSendChat.fromPerson = row.person
				 this.currentSendChat.toPerson = row.friend
				 //获取聊天信息
				 getChatMessage({fromPersonId:this.person.id,toPersonId:row.friend.id}).then(res=>{
					 this.chatMessage = res.data
				 })
				 //将未读消息清空
				 for(var i=0;i<this.friendTable.length;i++){
					 if(this.friendTable[i].friend.id == row.friend.id){
						 this.friendTable[i].unRead = 0;
						 break;
					 }
				 }
				 this.message=""  //清空输入框
			 },
			 initWebSocket(){
				 //连接webSocket
				 if ('WebSocket' in window) {
						// 实例化socket
					this.socket = new WebSocket('ws://localhost/socket/chat/'+this.person.id)
					// 监听socket连接
					this.socket.onopen = this.open
					// 监听socket错误信息
					this.socket.onerror = this.error
					// 监听socket消息
					this.socket.onmessage = this.getMessage
				   } else {
				 	alert('当前浏览器不支持websocket，无法建立聊天')
				   }
			 },
			 open: function () {
				console.log("socket连接成功")
			},
			error: function () {
				Message({
				  message: "webSocket出错",
				  type: 'error',
				  duration: 3 * 1000
				})
			},
			//获取消息
			getMessage: function (msg) {
				this.currentReceiveChat = eval('('+msg.data+')')
				this.isSendFromCurrentFriend();
			},
			//发送消息
			sendMessage: function () {
				if(this.currentSendChat.toPerson.id==undefined){
					Message({
					  message: "请选择聊天对象",
					  type: 'error',
					  duration: 3 * 1000
					})
				}else{
					this.currentSendChat.loading = false  //清空进度条再上传
					this.currentSendChat.sendTime = new Date()
					this.currentSendChat.context = this.message
					this.socket.send(JSON.stringify(this.currentSendChat))  //发送消息到后台
					this.currentSendChat.loading = true   //进度条一定要在发送之后
					this.chatMessage.push(this.currentSendChat) //将消息推送到聊天框
					this.chatMessage =  JSON.parse(JSON.stringify(this.chatMessage)) //对象是引用类型
					this.message=""
				}
			},
			close: function () {
				Message({
				  message: "请刷新浏览器连接webSocket",
				  type: 'error',
				  duration: 3 * 1000
				})
			},
			//判断接收的消息是否是当前聊天好友发送的
			isSendFromCurrentFriend(){
				/**
				 * Object.keys()把对象的key转换为数组， Object.values()把对象的值转换为数组
				 * let person = {name:"张三",age:25,address:"深圳",getName:function(){}}
					Object.keys(person) // ["name", "age", "address","getName"]
					Object.values(person) // ["张三", 25, "深圳","function"]
				 */
				//此消息是自己发送的
				if(this.currentReceiveChat.me == 1){ 
								//从后向前查找此消息（因为刚发的消息一般都是在最后面）
								for(var i=this.chatMessage.length-1;i>0;i--){
									if(this.currentReceiveChat.sendTime == this.chatMessage[i].sendTime
										&&this.currentReceiveChat.context == this.chatMessage[i].context){
										this.chatMessage[i].loading = false
										break;
									}
								}
				//未选择聊天或当前聊天不是发送信息的那个好友，则显示未读消息
				}else if(Object.values(this.currentSendChat).length !== 0 && this.currentReceiveChat.fromPerson.id != this.currentSendChat.toPerson.id){
					for(var i=0;i<this.friendTable.length;i++){
						if(this.currentReceiveChat.fromPerson.id == this.friendTable[i].friend.id){
							this.friendTable[i].unRead+=1;
							break;
						}
					}
				}else{  //如果当前聊天是来自当前正在聊天的好友，则显示消息，并且将消息设为已读
					this.chatMessage.push(this.currentReceiveChat)
					setRead({fromPersonId:this.currentReceiveChat.toPerson.id,toPersonId:this.currentReceiveChat.fromPerson.id}).then(res=>{
						console.log("已读")
					})
				}
			}
		}
	}
</script>

<style>
	.chat-container{
		height: 700px;
	}
	.left-ul{
		background: #eeeef2;
		border-right: 1px solid #99a9bf;
		border-bottom: 1px solid #99a9bf;
		height: 100%;
		line-height: 100%;
	}
	.left-ul img{
		border-radius: 50%;
		height:30px;
		width:30px
	}
	.search{
		margin-top: 10px;
		margin-left: 10px;
		margin-right: 10px;
	}
	/*重写tab的样式*/
	.el-tabs__nav{
		margin-left: 15px;
	}
	.right-ul{
		height: 100%;
	}
	/*重写textarea的样式*/
	.el-textarea__inner{
		border-radius: 0px;
		border-bottom: 0px;
		border-left: 0px;
		border-right: 0px;
	}
	.my-send-bt{
		position: absolute;
		right: 10px;
		bottom: 3px;
	}
	.chat-dialog-ul{
		list-style: none;
	}
	.chat-dialog-ul li{
		width:50px;
	}
</style>
