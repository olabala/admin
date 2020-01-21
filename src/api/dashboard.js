import request from '@/utils/request'

export function getDataByDate() {
  return request({
    url: '/admin/index/getListGroupByDate',
    method: 'post'
  })
}

export function getDataByLabels() {
  return request({
    url: '/admin/index/getListGroupByTag',
    method: 'post'
  })
}
