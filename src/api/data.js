import request from '@/utils/request'

export function getData(params) {
  return request({
    url: '/admin/appMobile/getQueryByPage.do',
    method: 'get',
    params
  })
}

export function addData(data) {
  return request({
    url: '/admin/appMobile/insertSelective',
    method: 'post',
    data
  })
}

export function updateData(data) {
  return request({
    url: '/admin/appMobile/updateSelective',
    method: 'post',
    data
  })
}

export function deleteData(params) {
  return request({
    url: '/admin/appMobile/delete',
    method: 'get',
    params
  })
}

export function getTemplate() {
  return request({
    url: '/admin/appMobile/download',
    method: 'get',
    responseType: 'arraybuffer'
  })
}

export function downloadData(params) {
  return request({
    url: '/admin/appMobile/downloadBySearch',
    method: 'get',
    params,
    responseType: 'arraybuffer'
  })
}

export function uploadData(data) {
  return request({
    url: '/admin/appMobile/upload',
    method: 'post',
    data,
    headers: {
      'content-type': 'multipart/form-data'
    }
  })
}

