import { getLabels, addLabel, updateLabel, deleteLabel } from '@/api/labels'

const state = {
}

const mutations = {
}

const actions = {
  getLabels({ commit, state }, payload = {}) {
    return new Promise((resolve, reject) => {
      getLabels(payload).then(response => {
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },

  addLabel({ commit }, payload) {
    return new Promise((resolve, reject) => {
      addLabel(payload).then(response => {
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },

  updateLabel({ commit, state }, payload) {
    return new Promise((resolve, reject) => {
      updateLabel(payload).then(response => {
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },

  deleteLabel({ commit, state }, payload) {
    return new Promise((resolve, reject) => {
      deleteLabel(payload).then(response => {
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

