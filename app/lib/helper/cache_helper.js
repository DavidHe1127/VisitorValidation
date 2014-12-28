/*
 ** Cached Data List
 * 
 * TEMP_USR - Save user after being created (registered) but before logging in
 * 
 */

var CacheHelper = function() {
	var cache = {};
	
	/*
	 * overwrite => true/false
	 */
	function setData(key, value, overwrite) {
		if (!overwrite && cache.hasOwnProperty(key)) {
			throw key + " already exists, caching abandoned";
		} else {
			cache[key] = value;
		}
	}

	function getData(key) {
		return cache[key];
	}
	
	function remove(key) {
		cache.hasOwnProperty(key) && delete cache[key];
	}
	
	function clear() {
		cache = null;
		cache = {};
	}

	return {
		setData : setData,
		getData : getData,
		remove : remove,
		clear : clear
	};

}();

module.exports = CacheHelper;
