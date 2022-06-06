// import actions
import authAction from './actions/auth'
import profileAction from './actions/profile'
import userAction from './actions/user'
import helperAction from './actions/helper'
import rolction from './actions/rol'
import serviceAction from './actions/service'
import typeResourceAction from './actions/typeResource'
import resourceAction from './actions/resource'
import permissionsAction from './actions/permissions'
import contractAction from './actions/contract'
import contractUserAction from './actions/contract_user'
import contractServiceAction from './actions/contract_service'

const actions = {
  ...authAction,
  ...profileAction,
  ...userAction,
  ...helperAction,
  ...rolction,
  ...serviceAction,
  ...typeResourceAction,
  ...resourceAction,
  ...permissionsAction,
  ...contractAction,
  ...contractUserAction,
  ...contractServiceAction,
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
