const require_regexUnicode = require("./regexUnicode.js");
// src/compat/_internal/unicodeToArray.ts
/**
* Splits a Unicode `string` into an array of its visible symbols (grapheme clusters).
*
* Ported from lodash to preserve identical behavior.
* @link https://github.com/lodash/lodash/blob/4.17.21-es/_unicodeToArray.js
*/
function unicodeToArray(str) {
	return str.match(require_regexUnicode.regexUnicode) || [];
}
exports.unicodeToArray = unicodeToArray;
