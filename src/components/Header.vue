<template>
    <div>
      <a href="#" v-on:click="login" v-if="!isLoggedIn">Log in with OAuth 2.0 Provider</a>
      <span v-else>{{ `Hello ${getUser}` }}</span>
      |||
      <router-link to="/route1">Route 1</router-link>
      |||
      <router-link to="/route2">Route 2</router-link>
      <span v-if="isLoggedIn">
        |||
        <a v-on:click="logout">Logout!</a>
      </span>
    </div>
</template>

<script>
import { mapActions, mapGetters} from 'vuex'

export default {
  name: 'Header',
  methods: {
    ...mapActions(['login', 'logout'])
  },
  computed: {
    ...mapGetters(['isLoggedIn', 'getUser'])
  }

}
</script>

<style scoped>
a {
  text-decoration: none;
  color: #000;
  font-weight: bold;
  cursor: pointer;
}
</style>