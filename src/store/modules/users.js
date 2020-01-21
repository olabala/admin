import { getUsers, addUser, updateUser, deleteUser } from '@/api/users'

const state = {
}

const mutations = {
}

const actions = {
  getUsers({ commit, state }, payload = {}) {
    return new Promise((resolve, reject) => {
      getUsers(payload).then(response => {
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },

  addUser({ commit }, payload) {
    return new Promise((resolve, reject) => {
      addUser(payload).then(response => {
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },

  updateUser({ commit, state }, payload) {
    return new Promise((resolve, reject) => {
      updateUser(payload).then(response => {
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },

  deleteUser({ commit, state }, payload) {
    return new Promise((resolve, reject) => {
      deleteUser(payload).then(response => {
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

