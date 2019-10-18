import request from '@/utils/request'
import Qs from 'qs'

/* info */
export function getFriend(id) {
  return request({
    url:'/friend/get',
    method:'post',
	data:Qs.stringify(id)
  })
}

export function getChatMessage(ids) {
  return request({
    url:'/chatMessage/get',
    method:'post',
		data:Qs.stringify(ids)
  })
}

export function sendMessage(chatMessage) {
  return request({
    url:'/chatMessage/send',
    method:'post',
		data:chatMessage
  })
}
/* 将消息设为已读 */
export function setRead(ids) {
  return request({
    url:'/chatMessage/read',
    method:'post',
		data:Qs.stringify(ids)
  })
}