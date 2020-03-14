import { login, getInfo, updateInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const state = {
  token: getToken(),
  name: '',
  isAdmin: false
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_ROLE: (state, role) => {
    state.isAdmin = role === 'admin'
  },
  SET_UUID: (state, uuid) => {
    state.uuid = uuid
  }
}

const actions = {
  // user login
  login({ commit }, payload) {
    const { userCode, password } = payload
    return new Promise((resolve, reject) => {
      login({ userCode: userCode.trim(), password: password }).then(response => {
      // login({ username: userCode.trim(), password: password }).then(response => {
        const { uuid, token } = response
        commit('SET_UUID', uuid)
        commit('SET_TOKEN', token)
        setToken(response.token)

        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }, payload) {
    !payload && (payload = { uuid: state.uuid })
    return new Promise((resolve, reject) => {
      getInfo(payload).then(response => {
        if (!response) {
          reject('Verification failed, please Login again.')
        }
        const { userName, isAdmin } = response
        commit('SET_NAME', userName)
        commit('SET_ROLE', isAdmin)
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // update user info
  updateInfo({ commit, state }, payload) {
    payload.uuid = state.uuid
    return new Promise((resolve, reject) => {
      updateInfo(payload).then(_ => {
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_NAME', '')
      commit('SET_ROLE', false)
      removeToken()
      resetRouter()
      resolve()
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      removeToken()
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

