// Decode Base 64 functions needed to decode JWT token returned by google.
// aotb function is being marked as deprecated
function base64urlDecode(str) {
  return Buffer.from(base64urlUnescape(str), 'base64').toString();
};

function base64urlUnescape(str) {
  str += Array(5 - str.length % 4).join('=');
  return str.replace(/\-/g, '+').replace(/_/g, '/');
}

export { base64urlDecode };