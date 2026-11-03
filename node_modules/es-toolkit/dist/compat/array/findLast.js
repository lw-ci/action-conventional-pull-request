const require_identity = require("../../function/identity.js");
const require_range = require("../../math/range.js");
const require_isArrayLike = require("../predicate/isArrayLike.js");
const require_iteratee = require("../util/iteratee.js");
const require_toInteger = require("../util/toInteger.js");
// src/compat/array/findLast.ts
/**
* Finds the last item in an object that has a specific property, where the property name is provided as a PropertyKey.
*
* @template T
* @param collection - The array or object to search through.
* @param [_doesMatch=identity] - The criteria to match. It can be a function, a partial object, a key-value pair, or a property name.
* @param [fromIndex] - The index to start the search from, defaults to collection.length-1 for arrays or Object.keys(collection).length-1 for objects.
* @returns The last property value that has the specified property, or `undefined` if no match is found.
*
* @example
* // Using a property name
* const obj = { a: { id: 1, name: 'Alice' }, b: { id: 2 }, c: { id: 3, name: 'Bob' } };
* const result = findLast(obj, 'name');
* console.log(result); // { id: 3, name: 'Bob' }
*/
function findLast(collection, _doesMatch = require_identity.identity, fromIndex) {
	var _fromIndex;
	if (!collection) return;
	const keys = require_isArrayLike.isArrayLike(collection) ? require_range.range(0, collection.length) : Object.keys(collection);
	const length = keys.length;
	if (length === 0) return;
	fromIndex = require_toInteger.toInteger((_fromIndex = fromIndex) !== null && _fromIndex !== void 0 ? _fromIndex : length - 1);
	if (fromIndex < 0) fromIndex = Math.max(length + fromIndex, 0);
	else fromIndex = Math.min(fromIndex, length - 1);
	const doesMatch = require_iteratee.iteratee(_doesMatch);
	for (let i = fromIndex; i >= 0; i--) {
		const key = keys[i];
		const value = collection[key];
		if (doesMatch(value, key, collection)) return value;
	}
}
exports.findLast = findLast;
