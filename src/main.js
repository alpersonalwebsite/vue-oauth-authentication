import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App.vue'
import store from './store'
import Header from './components/Header'

Vue.config.productionTip = false

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  routes: [
    { path: '/oauth2/callback', component: Header }
  ]
})

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')