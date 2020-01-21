import request from '@/utils/request'

export function getDepts() {
  return request({
    url: '/admin/appDept/getLists',
    method: 'get'
  })
}

export function addDept(data) {
  return request({
    url: '/admin/appDept/insertSelective',
    method: 'post',
    data
  })
}

export function updateDept(data) {
  return request({
    url: '/admin/appDept/updateSelective',
    method: 'post',
    data
  })
}
export function deleteDept(params) {
  return request({
    url: '/admin/appDept/delete',
    method: 'get',
    params
  })
}
