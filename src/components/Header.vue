<template>
    <div>
      <a href="#" v-on:click="login">Log in with OAuth 2.0 Provider</a>
      |||
      <router-link to="/route1">Route 1</router-link>
      |||
      <router-link to="/route2">Route 2</router-link>
    </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'Header',
  methods: {
    ...mapActions(['login'])
  }
}
</script>