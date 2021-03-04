# Vue, Vuex and Google OAuth 2.0

[![Greenkeeper badge](https://badges.greenkeeper.io/alpersonalwebsite/vue-oauth-authentication.svg)](https://greenkeeper.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-brightgreen.svg)](https://opensource.org/licenses/MIT)

This is an easy, basic and raw (no styles attached) example of **HOW to** implement `OAuth 2.0` (Google) in `Vue` with `Vuex store` and `localStorage` to persist the `token`.

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm serve
```

### Compiles and minifies for production
```
npm build
```

### Lints and fixes files
```
npm lint
```

## Google's conf

1. Create `credentials`: https://console.developers.google.com/apis/credentials and select `OAuth client ID`
2. Configure consent screen (App example: `OAuth flow for Vue`) and save.
3. Select `Web Application`
4. For Authorized URIs put: `http://localhost:8086/callback` (`port` should match the port of your running server. ex: `8086`).
5. Add to your `.env` or `environment variables` the following `data` (**and exclude `.env` from version control in your `.gitignore`**)

```
VUE_APP_GOOGLE_CLIENT_ID=*****.apps.googleusercontent.com
VUE_APP_GOOGLE_CLIENT_SECRET==*****
VUE_APP_GOOGLE_URL=https://accounts.google.com/o/oauth2/v2/auth?
VUE_APP_GOOGLE_REDIRECT_URI=http://localhost:8086/callback
VUE_APP_GOOGLE_USER_INFO_URI=https://www.googleapis.com/oauth2/v1/userinfo?access_token=
VUE_APP_GOOGLE_TOKEN_URL=https://www.googleapis.com/oauth2/v4/token
VUE_APP_GOOGLE_SCOPE=scope=profile&
```