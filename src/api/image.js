import request from '@/utils/request'
import Qs from 'qs'

/* info */
export function uploadImageSingle(file) {
  return request({
    url:'/imgUpload/single',
    method:'post',
	data:file
  })
}