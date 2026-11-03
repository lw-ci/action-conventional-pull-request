const require_toString = require("../util/toString.js");
const require_regexMultiByte = require("../_internal/regexMultiByte.js");
const require_unicodeToArray = require("../_internal/unicodeToArray.js");
// src/compat/string/split.ts
function split(string, separator, limit) {
	const str = require_toString.toString(string);
	if (separator === "" && require_regexMultiByte.regexMultiByte.test(str)) return require_unicodeToArray.unicodeToArray(str).slice(0, limit === void 0 ? void 0 : limit >>> 0);
	return str.split(separator, limit);
}
exports.split = split;
