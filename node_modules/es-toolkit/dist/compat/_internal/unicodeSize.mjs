import { regexUnicode } from "./regexUnicode.mjs";
// src/compat/_internal/unicodeSize.ts
/**
* Counts the number of visible symbols (grapheme clusters) in a Unicode `string`.
*
* Ported from lodash to preserve identical behavior.
* @link https://github.com/lodash/lodash/blob/4.17.21-es/_unicodeSize.js
*/
function unicodeSize(str) {
	let result = 0;
	regexUnicode.lastIndex = 0;
	while (regexUnicode.test(str)) ++result;
	return result;
}
export { unicodeSize };
