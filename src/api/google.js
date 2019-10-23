export default {
  login() {
    window.location =
    process.env.VUE_APP_GOOGLE_URL +
    process.env.VUE_APP_GOOGLE_SCOPE +
    process.env.VUE_APP_GOOGLE_REDIRECT_URI +
    'response_type=code&' +
    process.env.VUE_APP_GOOGLE_CLIENT_ID
  } 
}