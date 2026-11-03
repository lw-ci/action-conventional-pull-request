const require_regexUnicode = require("./regexUnicode.js");
// src/compat/_internal/unicodeSize.ts
/**
* Counts the number of visible symbols (grapheme clusters) in a Unicode `string`.
*
* Ported from lodash to preserve identical behavior.
* @link https://github.com/lodash/lodash/blob/4.17.21-es/_unicodeSize.js
*/
function unicodeSize(str) {
	let result = 0;
	require_regexUnicode.regexUnicode.lastIndex = 0;
	while (require_regexUnicode.regexUnicode.test(str)) ++result;
	return result;
}
exports.unicodeSize = unicodeSize;
