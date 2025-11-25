const { customAlphabet } = require("nanoid");
const VALID_CODE_RE = /^[A-Za-z0-9]{6,8}$/;
const nanoid = customAlphabet(
  "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
  6
);

/*---------- Used to generate unique code for an long_url ------------- */

function generateCode() {
  return nanoid();
}

/*---------- Used to validate unique code for an long_url ------------- */

function isValidCode(code) {
  return VALID_CODE_RE.test(code);
}

module.exports = { generateCode, isValidCode };
