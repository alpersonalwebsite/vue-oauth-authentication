// PKCE (RFC 7636) and the OAuth `state` parameter.
//
// A single-page app is a "public client": everything it ships is readable by
// anyone who opens devtools, so it cannot hold a client secret. PKCE replaces
// the secret with a per-login proof: we keep a random `code_verifier` locally,
// send only its SHA-256 hash (`code_challenge`) to the authorization endpoint,
// and present the verifier when redeeming the code. An attacker who intercepts
// the authorization code cannot redeem it without the verifier.

const VERIFIER_BYTES = 32;

function randomUrlSafeString(byteLength) {
  const bytes = new Uint8Array(byteLength);
  window.crypto.getRandomValues(bytes);
  return base64UrlEncode(bytes);
}

// base64url per RFC 4648 §5: the base64 alphabet with -/_ and no padding.
function base64UrlEncode(bytes) {
  let binary = '';
  bytes.forEach(byte => {
    binary += String.fromCharCode(byte);
  });
  return window
    .btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

// A code_verifier is a high-entropy random string, not a hash of anything.
export function createCodeVerifier() {
  return randomUrlSafeString(VERIFIER_BYTES);
}

// The S256 challenge method: base64url(SHA256(ascii(verifier))). Plain is also
// allowed by the RFC but defeats the point, since the verifier would travel in
// the authorization request.
export async function createCodeChallenge(verifier) {
  const digest = await window.crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(verifier)
  );
  return base64UrlEncode(new Uint8Array(digest));
}

// `state` is a separate defence: it is echoed back on the callback and compared,
// so a callback the user did not initiate is rejected (RFC 6749 section 10.12).
export function createState() {
  return randomUrlSafeString(16);
}

export default {
  createCodeVerifier,
  createCodeChallenge,
  createState
};
