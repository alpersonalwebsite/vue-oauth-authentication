import api from '../../api/google'

const state = {
  token: null
}

const getters = {
  isLoggedIn: state => !!state.token
}

const actions = {
  login: () => { 
    api.login()
  },
  continueOAuth: async ({ commit }, location) => {
    const code = location.href.match(/(?:code)\=([\S]*?)\&/)[1];
    const res = await api.requestToken(code)
    const token = res.data.access_token
    commit('setToken', token)
  },
  logout: ({ commit }) => {
    commit('setToken', null)
  }
}

const mutations = {
  setToken: (state, token) => {
    state.token = token
  }
} 

export default {
  state,
  getters,
  actions,
  mutations
}