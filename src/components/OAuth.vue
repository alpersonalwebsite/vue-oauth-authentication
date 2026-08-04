<template>
    <div>
      <p v-if="getAuthError">Sign-in failed: {{ getAuthError }}</p>
      <p v-else>Authenticating...</p>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'OAuth',
  computed: {
    ...mapGetters(['getAuthError'])
  },
  methods: {
    ...mapActions(['continueOAuth'])
  },
  // The navigation lives here rather than in the store action, so the store
  // does not have to import the router from main.js (which imports the store).
  async created() {
    await this.continueOAuth(window.location.href)

    if (!this.getAuthError) {
      this.$router.push('/')
    }
  }
}
</script>
