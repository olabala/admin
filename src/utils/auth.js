import Cookies from 'js-cookie'

const TokenKey = 'token'
const Localstorage = window.localStorage

export function getToken() {
  return Localstorage.getItem(TokenKey)
}

export function setToken(token) {
  return Localstorage.setItem(TokenKey, token)
}

export function removeToken() {
  Cookies.remove('token')
  return Localstorage.removeItem(TokenKey)
}
