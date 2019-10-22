import Vuex from 'vuex'
import Vue from 'vue'
import authorization from './modules/authorization'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    authorization
  }
})