import request from '@/utils/request'

export function getLabels(params) {
  return request({
    url: '/admin/appTags/getQueryByPage',
    method: 'get',
    params
  })
}

export function getLabelList() {
  return request({
    url: '/admin/appTags/getLists',
    method: 'get'
  })
}

export function addLabel(data) {
  return request({
    url: '/admin/appTags/insertSelective',
    method: 'post',
    data
  })
}

export function updateLabel(data) {
  return request({
    url: '/admin/appTags/updateSelective',
    method: 'post',
    data
  })
}

export function deleteLabel(params) {
  return request({
    url: '/admin/appUsers/delete',
    method: 'get',
    params
  })
}

