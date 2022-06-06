// import actions
import documentTypeAction from './actions/document_type'
import indicationAction from './actions/indication'

const actions = {
  ...documentTypeAction,
  ...indicationAction,
}

const getters = {
}

const mutations = {
}
const state = {
}

export default {
  namespaced: true,
  actions,
  state,
  getters,
  mutations,
}
