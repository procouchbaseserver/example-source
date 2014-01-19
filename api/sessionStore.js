/*!
 * connect-memcached
 * MIT Licensed
 */

var couchbase = require('couchbase');
var oneDay = 86400; // in seconds
function ensureCallback(fn) {
	return function() {
		fn && fn.apply(null, arguments);
	};
}

/**
 * Return the `CouchbaseStore` extending `connect`'s session Store.
 *
 * @param {object} connect
 * @return {Function}
 * @api public
 */
module.exports = function(connect) {
	var Store = connect.session.Store;

	/**
	 * Initialize CouchbaseStore with the given `options`.
	 *
	 * @param {Object} options
	 * @api public
	 */
	function CouchbaseStore(options) {
		options = options || {};
		Store.call(this, options);

		this.prefix = options.prefix || '';
		if (!options.client) {
			if (!options.host) {
				options.host = {};
			}

			options.client = new couchbase.Connection(options.host);
		}

		this.client = options.client;
	}

	CouchbaseStore.prototype.__proto__ = Store.prototype;

	/**
	 * A string prefixed to every memcached key, in case you want to share servers
	 * with something generating its own keys.
	 * @api private
	 */
	CouchbaseStore.prototype.prefix = '';

	/**
	 * Translates the given `sid` into a memcached key, optionally with prefix.
	 *
	 * @param {String} sid
	 * @api private
	 */
	CouchbaseStore.prototype.getKey = function getKey(sid) {
		return this.prefix + sid;
	};

	/**
	 * Attempt to fetch session by the given `sid`.
	 *
	 * @param {String} sid
	 * @param {Function} fn
	 * @api public
	 */
	CouchbaseStore.prototype.get = function(sid, fn) {
		sid = this.getKey(sid);

		this.client.get(sid, function(err, data) {
      if (err) { return fn(err, {}); }
			try {
				if (!data) {
					return fn();
				}
				fn(null, data.value));
			} catch (e) {
				fn(e);
			}
		});
	};

	/**
	 * Commit the given `sess` object associated with the given `sid`.
	 *
	 * @param {String} sid
	 * @param {Session} sess
	 * @param {Function} fn
	 * @api public
	 */
	CouchbaseStore.prototype.set = function(sid, sess, fn) {
		var maxAge = sess.cookie.maxAge;
		var ttl = typeof maxAge == 'number' ? maxAge / 1000 | 0 : 3600;

		client.set(sid, sess, {expiry: ttl}, fn);
	};

	/**
	 * Destroy the session associated with the given `sid`.
	 *
	 * @param {String} sid
	 * @param {Function} fn
	 * @api public
	 */
	CouchbaseStore.prototype.destroy = function(sid, fn) {
		sid = this.getKey(sid);
		this.client.remove(sid, ensureCallback(fn));
	};

	/**
	 * Fetch number of sessions.
	 *
	 * @param {Function} fn
	 * @api public
	 */
	CouchbaseStore.prototype.length = function(fn) {
		this.client.items(ensureCallback(fn));
	};

	/**
	 * Clear all sessions.
	 *
	 * @param {Function} fn
	 * @api public
	 */
	CouchbaseStore.prototype.clear = function(fn) {
		this.client.flush(ensureCallback(fn));
	};

	return CouchbaseStore;
};