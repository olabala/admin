import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/login',
    method: 'post',
    data
  })
}

export function getInfo(data) {
  return request({
    url: '/admin/appUsers/selectOneNew.do',
    method: 'post',
    data
  })
}

export function updateInfo(data) {
  return request({
    url: '/admin/appUsers/updateSelective',
    method: 'post',
    data
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}

