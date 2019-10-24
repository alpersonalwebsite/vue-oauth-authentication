<template>
    <div>
      Authenticating...
    </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'OAuth',
  methods: {
    ...mapActions(['continueOAuth'])
  },
  created() {
    this.continueOAuth(window.location)
  }
}
</script>