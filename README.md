# Vue, Vuex and Google OAuth 2.0 (Authorization Code + PKCE)

[![Greenkeeper badge](https://badges.greenkeeper.io/alpersonalwebsite/vue-oauth-authentication.svg)](https://greenkeeper.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-brightgreen.svg)](https://opensource.org/licenses/MIT)

This is an easy, basic and raw (no styles attached) example of **HOW to** implement
`OAuth 2.0` (Google) in `Vue` with a `Vuex store`, using the **Authorization Code
flow with PKCE**.

## Why PKCE, and why there is no client secret here

A single-page app is a **public client**. Everything it ships is readable by anyone
who opens devtools, and a `vue-cli-service build` inlines every `VUE_APP_*` value
into the bundle, so a `client_secret` placed in `.env` ends up in
`dist/js/app.*.js` and is served to every visitor. It is not a secret at that
point.

[PKCE](https://tools.ietf.org/html/rfc7636) replaces it:

1. Before redirecting, the app generates a random `code_verifier` and keeps it in
   `sessionStorage`.
2. It sends only `code_challenge` (the base64url SHA-256 of the verifier) and
   `code_challenge_method=S256` to Google.
3. When it redeems the authorization code, it presents the verifier.

Someone who intercepts the authorization code cannot exchange it, because they do
not have the verifier. No shared secret is involved, so nothing needs hiding in the
bundle.

The request also carries a random `state`, which is compared on the callback. That
is what stops an attacker feeding you a callback you never started
([RFC 6749 §10.12](https://tools.ietf.org/html/rfc6749#section-10.12)).

### What this demo still does not solve

The access token lives in `sessionStorage`. That is better than `localStorage` (it
is scoped to the tab and cleared when the tab closes) and the app honours
`expires_in`, so an expired token stops counting as a login. But **any XSS on the
page can read either one**. The only way to keep a token out of reach of JavaScript
is an `HttpOnly` cookie set by a backend, which would also be the right place to
run the token exchange. This repo is a frontend-only teaching example and does not
have one.

The routes are not guarded. `/route1` and `/route2` render for anyone; the login
state only changes what the header shows.

## Project setup

```shell
npm install
```

### Compiles and hot-reloads for development

```shell
npm run serve
```

### Compiles and minifies for production

```shell
npm run build
```

**On Node 17 or newer** the production build fails with
`ERR_OSSL_EVP_UNSUPPORTED`. That is webpack 4 (via `@vue/cli-service` 4) using an
MD4 hash that OpenSSL 3 no longer provides, not a problem with this code. The
dependencies here are deliberately left at their versions, so pass the flag
instead:

```shell
NODE_OPTIONS=--openssl-legacy-provider npm run build
```

### Lints and fixes files

```shell
npm run lint
```

Note that `no-console` is an **error** in production builds (see `.eslintrc.js`),
so a stray `console.log` fails `npm run build` while `npm run serve` is fine. The
failure only shows on a cold eslint cache, which means it shows in CI and on a
fresh clone but not necessarily on your second local build.

## Google's conf

1. Create `credentials`: https://console.developers.google.com/apis/credentials and
   select `OAuth client ID`
2. Configure consent screen (App example: `OAuth flow for Vue`) and save.
3. Select `Web Application`
4. For Authorized redirect URIs put: `http://localhost:8086/callback` (the `port`
   should match the port of your running server, ex: `8086`).
5. Copy `.env.example` to `.env` and fill in your client id. `.env` is already in
   `.gitignore`.

```
VUE_APP_GOOGLE_CLIENT_ID=*****.apps.googleusercontent.com
VUE_APP_GOOGLE_REDIRECT_URI=http://localhost:8086/callback
VUE_APP_GOOGLE_AUTH_URL=https://accounts.google.com/o/oauth2/v2/auth
VUE_APP_GOOGLE_TOKEN_URL=https://oauth2.googleapis.com/token
VUE_APP_GOOGLE_USER_INFO_URL=https://www.googleapis.com/oauth2/v3/userinfo
VUE_APP_GOOGLE_SCOPE=profile
```

There is **no `VUE_APP_GOOGLE_CLIENT_SECRET`**. If you are following an older
tutorial that asks for one, that tutorial is describing a confidential client (a
server), not a browser app.

The URLs no longer carry query fragments (`?`, `scope=profile&`,
`?access_token=`) the way they did in an earlier version of this file: the app
builds query strings with `URLSearchParams`, which encodes values properly, and
sends the token as an `Authorization: Bearer` header rather than in the URL.

## How the flow reads in the code

| File | Role |
| --- | --- |
| `src/api/pkce.js` | `code_verifier`, `code_challenge` (S256) and `state` generation |
| `src/api/google.js` | builds the authorize URL, validates the callback, redeems the code, fetches the profile |
| `src/store/modules/authorization.js` | Vuex state: token, user, error, plus expiry-aware storage |
| `src/components/OAuth.vue` | the `/callback` route; shows an error or navigates home |
