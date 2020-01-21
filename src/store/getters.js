const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  name: state => state.user.name,
  isAdmin: state => state.user.isAdmin
  // dateData: state => state.dashboard.dateData,
  // labelsData: state => state.dashboard.labelsData
}
export default getters
