# vue-oauth-authentication

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn serve
```

### Compiles and minifies for production
```
yarn build
```

### Lints and fixes files
```
yarn lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

<!--
## FB
Convert your account into a Developer Account: https://developers.facebook.com/
Go to `My Apps` -> `Create App`
Provide your App's name and email
Click on `Create App Id`
Add `Facebook Login` and click on `Save Changes`
-->

## Google

Create credentials: https://console.developers.google.com/apis/credentials and select OAuth client ID
Configure consent screen (App example: `OAuth flow for Vue`) and save.
Select `Web Application`
For Authorized URIs put: `http://localhost:8081/callback`
Add to your `.env` the `client ID` and save the `client secret`