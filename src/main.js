import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App.vue'
import store from './store'
import OAuth from './components/OAuth'
import Route1 from './components/Route1'
import Route2 from './components/Route2'

Vue.config.productionTip = false

Vue.use(VueRouter)

// We are exporting it to use it in our actions (vuex)
export const router = new VueRouter({
  mode: 'history',
  routes: [
    { path: '/route1', component: Route1 },
    { path: '/route2', component: Route2 },
    { path: '/callback', component: OAuth }
  ]
})

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')