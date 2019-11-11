import qs from 'qs';
import axios from 'axios';

function login() {
  window.location =
    process.env.VUE_APP_GOOGLE_URL +
    process.env.VUE_APP_GOOGLE_SCOPE +
    'response_type=code&' +
    'client_id=' +
    process.env.VUE_APP_GOOGLE_CLIENT_ID +
    '&redirect_uri=' +
    process.env.VUE_APP_GOOGLE_REDIRECT_URI;
}

async function postGoogleCode(code) {
  const data = {
    code,
    client_id: process.env.VUE_APP_GOOGLE_CLIENT_ID,
    client_secret: process.env.VUE_APP_GOOGLE_CLIENT_SECRET,
    grant_type: 'authorization_code',
    access_type: 'offline',
    redirect_uri: process.env.VUE_APP_GOOGLE_REDIRECT_URI
  };

  // We need to decode the authorization code
  // From, ex, this... 4%2_9Klgdf... to 4/_9Klgdf

  const options = {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    data: decodeURIComponent(qs.stringify(data)),
    url: process.env.VUE_APP_GOOGLE_TOKEN_URL
  };

  try {
    return await axios(options);
  } catch (err) {
    console.error(err);
  }
}

async function requestToken(code) {
  try {
    return await postGoogleCode(code);
  } catch (err) {
    console.error(err);
  }
}

async function getUserInfo(token) {
  try {
    return await axios.get(
      `${process.env.VUE_APP_GOOGLE_USER_INFO_URI}${token}`
    );
  } catch (err) {
    console.error(err);
  }
}

export default {
  login,
  requestToken,
  getUserInfo
};
