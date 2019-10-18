import request from '@/utils/request'
import Qs from 'qs'

/* info */
export function getPerson(user) {
  return request({
    url:'/person/findByUser',
    method:'post',
	data:Qs.stringify(user)
  })
}
/* info */
export function savePerson(person) {
  return request({
    url:'/person/save',
    method:'post',
		data:person
  })
}