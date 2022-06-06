// import actions
import userAction from './actions/user'
import monedaAction from './actions/moneda'
import tipoCambioAction from './actions/tipo_cambio'
import conversionAction from './actions/conversion'

const actions = {
  ...userAction,
  ...monedaAction,
  ...tipoCambioAction,
  ...conversionAction,
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
