import api from '../../api/google'

// sessionStorage rather than localStorage: the token is scoped to the tab and
// goes away when it closes, instead of sitting on disk indefinitely. Neither is
// safe against XSS, which can read both. Keeping a token out of JavaScript's
// reach altogether needs an HttpOnly cookie set by a backend, which this demo
// does not have; that tradeoff is spelled out in the README.
const TOKEN_KEY = 'oauth_token'
const EXPIRES_KEY = 'oauth_expires_at'
const USER_KEY = 'oauth_user'

function readStoredToken() {
  const token = window.sessionStorage.getItem(TOKEN_KEY)
  const expiresAt = Number(window.sessionStorage.getItem(EXPIRES_KEY))

  // A token past expires_in is no longer a login. The previous version kept
  // whatever was in storage forever, so isLoggedIn stayed true against a token
  // Google had already rejected.
  if (!token || !expiresAt || Date.now() >= expiresAt) {
    return null
  }

  return token
}

function clearStored() {
  window.sessionStorage.removeItem(TOKEN_KEY)
  window.sessionStorage.removeItem(EXPIRES_KEY)
  window.sessionStorage.removeItem(USER_KEY)
}

const state = {
  token: readStoredToken(),
  user: window.sessionStorage.getItem(USER_KEY),
  error: null
}

const getters = {
  isLoggedIn: state => !!state.token,
  getUser: state => state.user,
  getAuthError: state => state.error
}

const actions = {
  login: async ({ commit }) => {
    commit('setError', null)
    await api.login()
  },

  // Returns nothing and throws nothing: the component awaits it and then reads
  // getAuthError, so a failed login shows a message instead of an unhandled
  // rejection. The router is deliberately not imported here; importing main.js
  // from the store made the two modules circular, and navigation belongs to the
  // component anyway.
  continueOAuth: async ({ commit }, href) => {
    try {
      const code = api.readCallback(href)
      const tokens = await api.requestToken(code)

      if (!tokens || !tokens.access_token) {
        throw new Error('Token response carried no access_token')
      }

      const expiresIn = Number(tokens.expires_in) || 0
      const expiresAt = Date.now() + expiresIn * 1000

      const user = await api.getUserInfo(tokens.access_token)
      const name = (user && user.name) || 'unknown user'

      window.sessionStorage.setItem(TOKEN_KEY, tokens.access_token)
      window.sessionStorage.setItem(EXPIRES_KEY, String(expiresAt))
      window.sessionStorage.setItem(USER_KEY, name)

      commit('setToken', tokens.access_token)
      commit('setUser', name)
      commit('setError', null)
    } catch (err) {
      clearStored()
      commit('setToken', null)
      commit('setUser', null)
      commit('setError', err.message)
    }
  },

  logout: ({ commit }) => {
    clearStored()
    commit('setToken', null)
    commit('setUser', null)
    commit('setError', null)
  }
}

const mutations = {
  setToken: (state, token) => {
    state.token = token
  },
  setUser: (state, user) => {
    state.user = user
  },
  setError: (state, error) => {
    state.error = error
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
