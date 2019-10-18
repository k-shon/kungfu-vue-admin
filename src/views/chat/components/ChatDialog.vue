<template>
	<div>
		<template>
			<ul v-show="chatMessage.length>0" class="chat-ul" ref="chatul" id="chatul">
				<li v-for="item in chatMessage">
					<el-row v-if="item.toPerson.id===person.id" class="friend" type="flex" justify="start">
						<el-col :span="1">
							<img v-if="item.fromPerson.avatar" :src="item.fromPerson.avatar" class="img">
							<img v-else :src="defaultAvatar.friend" class="img">
						</el-col>
						<el-col :span="10" style="margin-left: 15px;">
							<div class="msg">
								<span>{{item.context}}</span>
							</div>	
						</el-col>
						<el-col :span="1">
							<div v-loading="item.loading" element-loading-spinner="el-icon-loading"  style="line-height: 80px;"></div>
						</el-col>
					</el-row>
					<el-row v-else class="me" type="flex" justify="end">
						<el-col :span="1" :offset="12">
							<div v-loading="item.loading" element-loading-spinner="el-icon-loading"  style="line-height: 80px;"></div>
						</el-col>
						<el-col :span="10" >
							<div class="msg" >
								<span>{{item.context}}</span>
							</div>	
						</el-col>
						<el-col :span="1" style="padding-left: 10px;">
							<img v-if="item.fromPerson.avatar" :src="item.fromPerson.avatar" class="img">
							<img v-else :src="defaultAvatar.friend" class="img">
						</el-col>
					</el-row>
				</li>
			</ul>
		</template>
	</div>
</template>

<script>
	export default{
		name:'chatDialog',
		props:{
			chatMessage:{  //聊天记录
			  type: Array
			},
			person:{}, //自己的信息
			defaultAvatar:{}  //默认头像
		},
		watch:{
			//聊天记录改变时触发滚动条方法
			chatMessage(){
				console.log(this.chatMessage)
				this.scrollToBottom()
			}
		},
		mounted(){
			this.scrollToBottom()
		},
		methods:{
			//滚动条置于底部
			scrollToBottom(){
				this.$nextTick(() => {
		             var div = document.getElementById('chatul')
		             div.scrollTop = div.scrollHeight
			     })
			}
		}
	}
</script>

<style scoped="scoped">
	.chat-ul{
		overflow-y: scroll;
		height: 490px;
	}
	.chat-ul li{
		list-style: none;
		width: 100%;
	}
	.chat-ul li div{
		margin-bottom: 5px;
	}
	.chat-ul li img{
		border-radius: 50%;
		width:40px;
		height: 40px;
	}
	.chat-ul li .msg{
		border-radius: 20px;
		box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
		background-color:#cdcdcd ;
		padding: 10px;
	}
	.friend{
	}
	.me{
		margin-right: 50px;
	}
</style>
