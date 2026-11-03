const require_identity = require("../../function/identity.js");
const require_isArrayLike = require("../predicate/isArrayLike.js");
const require_iteratee = require("../util/iteratee.js");
const require_isIterateeCall = require("../_internal/isIterateeCall.js");
// src/compat/array/some.ts
/**
* Checks if there is an element in an array that matches the given predicate.
*
* Iteration is stopped once there is an element that matches `predicate`.
*
* @template T
* @param source The source to iterate over.
* @param [predicate=identity] The function invoked per iteration.
* If a property name or an object is provided it will be used to create a predicate function.
* @returns Returns `true` if any element passes the predicate check, else `false`.
*
* @example
* some([1, 2, 3, 4], n => n % 2 === 0);
* // => true
*
* some([{ a: 1 }, { a: 2 }, { a: 3 }], { a: 2 });
* // => true
*
* some([{ a: 1 }, { a: 2 }, { a: 3 }], ['a', 2]);
* // => true
*
* some([{ a: 1 }, { a: 2 }, { a: 3 }], 'a');
* // => true
*
* some({ a: 1, b: 2, c: 3 }, n => n % 2 === 0);
* // => true
*
* some({ a: { id: 1, name: 'Alice' }, b: { id: 2, name: 'Bob' } }, { name: 'Bob' });
* // => true
*
* some({ a: { id: 1, name: 'Alice' }, b: { id: 2, name: 'Bob' } }, ['name', 'Alice']);
* // => true
*
* some({ a: { id: 1, name: 'Alice' }, b: { id: 2, name: 'Bob' } }, 'name');
* // => true
*/
function some(source, predicate, guard) {
	var _predicate;
	if (!source) return false;
	if (guard && require_isIterateeCall.isIterateeCall(source, predicate, guard)) predicate = void 0;
	const doesMatch = require_iteratee.iteratee((_predicate = predicate) !== null && _predicate !== void 0 ? _predicate : require_identity.identity);
	if (!require_isArrayLike.isArrayLike(source)) {
		const keys = Object.keys(source);
		for (let i = 0; i < keys.length; i++) {
			const key = keys[i];
			if (doesMatch(source[key], key, source)) return true;
		}
		return false;
	}
	for (let i = 0; i < source.length; i++) if (doesMatch(source[i], i, source)) return true;
	return false;
}
exports.some = some;
