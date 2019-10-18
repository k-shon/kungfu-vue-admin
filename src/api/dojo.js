import request from '@/utils/request'

/* info */
export function getDojo(id) {
  return request({
    url:'/dojo/'+id,
    method:'get',
  })
}
export function updateDojo(dojo) {
  return request({
    url:'/dojo/update',
    method:'post',
	data:dojo
  })
}

/* member */
export function getAllMember() {
  return request({
    url:'/member/findAll',
    method:'get',
  })
}
export function updateMember(member) {
  return request({
    url:'/member/update',
    method:'post',
		data:member
  })
}
export function deleteMember(id) {
  return request({
    url:'/member/delete',
    method:'post',
	data:{
		id:id
	}
  })
}
