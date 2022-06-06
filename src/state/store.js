import Vue from 'vue'
import Vuex from 'vuex'

// import modules from './modules'
//
import notification from './notification/index'
import layout from './layout/index'
import auth from './appAuth/index'
import authfack from './authfack/index'
//
import softseguridad from './softseguridad/index'
import softadministracion from './softadministracion/index'
Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    notification,
    auth,
    authfack,
    layout,
    softseguridad,
    softadministracion,
  },
  // Enable strict mode in development to get a warning
  // when mutating state outside of a mutation.
  // https://vuex.vuejs.org/guide/strict.html
  strict: process.env.NODE_ENV !== 'production',
})

export default store

