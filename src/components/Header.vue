<template>
    <div>
      <a href="#" v-on:click="login">Log In with OAuth 2.0 Provider</a>
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