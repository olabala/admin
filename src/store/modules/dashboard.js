import { getDataByDate, getDataByLabels } from '@/api/dashboard'

const state = {
}

const mutations = {
}

const actions = {
  getDataByDate({ commit }) {
    return new Promise((resolve, reject) => {
      getDataByDate().then(response => {
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },
  getDataByLabels({ commit }) {
    return new Promise((resolve, reject) => {
      getDataByLabels().then(response => {
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

