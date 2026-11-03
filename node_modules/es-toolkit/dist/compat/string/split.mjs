import { toString } from "../util/toString.mjs";
import { regexMultiByte } from "../_internal/regexMultiByte.mjs";
import { unicodeToArray } from "../_internal/unicodeToArray.mjs";
// src/compat/string/split.ts
function split(string, separator, limit) {
	const str = toString(string);
	if (separator === "" && regexMultiByte.test(str)) return unicodeToArray(str).slice(0, limit === void 0 ? void 0 : limit >>> 0);
	return str.split(separator, limit);
}
export { split };
