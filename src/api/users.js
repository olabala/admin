import request from '@/utils/request'

export function getUsers(data) {
  return request({
    url: '/admin/appUsers/getQueryByPageNew',
    method: 'post',
    data
  })
}

export function addUser(data) {
  return request({
    url: '/admin/appUsers/saveUsersAndTags',
    method: 'post',
    data
  })
}

export function updateUser(data) {
  return request({
    url: '/admin/appUsers/updateUsersAndTags',
    method: 'post',
    data
  })
}
export function deleteUser(params) {
  return request({
    url: '/admin/appUsers/delete',
    method: 'get',
    params
  })
}
