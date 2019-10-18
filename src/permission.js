import router from './router'
import {getToken} from '@/utils/auth'
import store from '@/store'

var whiteNameList = ['/login','/register']
router.beforeEach((to,from,next)=>{
	if(getToken()){  //如果有登录token
		if(to.path==='/login' || to.path==='/register'){
			next({path:'/'}) //直接访问
		}else{
			if(store.getters.roles.length ===0 ){ //还没有权限信息
				//登录成功，拉取用户信息获取权限
				next()
			}else{
				next() //登录成功，已经有权限信息
			}
		}
	}else{
		//还没登录过，没有token
		if(whiteNameList.indexOf(to.path)!==-1){
			next()  //如果是访问登录注册，直接跳过
		}else{
			next('/login')  //否则跳转到/login
		}
	}
})