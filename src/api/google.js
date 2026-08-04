import axios from 'axios';
import pkce from './pkce';

// sessionStorage, not localStorage: these are single-use, per-tab values, and a
// verifier left behind after the tab closes is only a liability.
const VERIFIER_KEY = 'oauth_code_verifier';
const STATE_KEY = 'oauth_state';

async function login() {
  const verifier = pkce.createCodeVerifier();
  const state = pkce.createState();
  const challenge = await pkce.createCodeChallenge(verifier);

  window.sessionStorage.setItem(VERIFIER_KEY, verifier);
  window.sessionStorage.setItem(STATE_KEY, state);

  // URLSearchParams encodes every value for us, so a scope with spaces or a
  // redirect URI with a query cannot break the URL.
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: process.env.VUE_APP_GOOGLE_CLIENT_ID,
    redirect_uri: process.env.VUE_APP_GOOGLE_REDIRECT_URI,
    scope: process.env.VUE_APP_GOOGLE_SCOPE,
    state,
    code_challenge: challenge,
    code_challenge_method: 'S256'
  });

  window.location = `${process.env.VUE_APP_GOOGLE_AUTH_URL}?${params}`;
}

// Reads the callback URL and returns the authorization code, or throws with a
// reason. Everything here is a security check, not parsing convenience:
// - `error` is what Google returns when the user declines consent
// - a missing state, or one that does not match what we stored, means this
//   callback was not started by this tab (RFC 6749 section 10.12)
function readCallback(href) {
  const params = new URL(href).searchParams;
  const error = params.get('error');

  if (error) {
    throw new Error(`Authorization failed: ${error}`);
  }

  const returnedState = params.get('state');
  const expectedState = window.sessionStorage.getItem(STATE_KEY);
  window.sessionStorage.removeItem(STATE_KEY);

  if (!expectedState || returnedState !== expectedState) {
    throw new Error('Authorization state mismatch, ignoring this callback');
  }

  const code = params.get('code');

  if (!code) {
    throw new Error('Authorization callback carried no code');
  }

  return code;
}

// No client_secret. A single-page app cannot keep one: everything it ships is
// readable in devtools, and a build inlines VUE_APP_* values into the bundle.
// PKCE replaces it, so the code can only be redeemed by whoever holds the
// verifier we generated for this login.
async function requestToken(code) {
  const verifier = window.sessionStorage.getItem(VERIFIER_KEY);
  window.sessionStorage.removeItem(VERIFIER_KEY);

  if (!verifier) {
    throw new Error('No PKCE verifier for this login, start again');
  }

  // axios serializes URLSearchParams as application/x-www-form-urlencoded and
  // sets the header itself. The previous version hand-encoded the body and then
  // ran decodeURIComponent over the whole string, which undid the encoding of
  // every value at once.
  const body = new URLSearchParams({
    code,
    client_id: process.env.VUE_APP_GOOGLE_CLIENT_ID,
    grant_type: 'authorization_code',
    redirect_uri: process.env.VUE_APP_GOOGLE_REDIRECT_URI,
    code_verifier: verifier
  });

  const response = await axios.post(
    process.env.VUE_APP_GOOGLE_TOKEN_URL,
    body
  );

  return response.data;
}

// The token goes in the Authorization header, never in the query string, where
// it would be recorded in browser history, Referer headers and server logs.
async function getUserInfo(token) {
  const response = await axios.get(process.env.VUE_APP_GOOGLE_USER_INFO_URL, {
    headers: { Authorization: `Bearer ${token}` }
  });

  return response.data;
}

export default {
  login,
  readCallback,
  requestToken,
  getUserInfo
};
