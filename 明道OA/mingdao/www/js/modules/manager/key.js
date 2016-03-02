define(function(require, exports, module) {
	exports.backButton = function(backCallback) {
		if ( typeof backCallback == 'function') {
			plus.key.addEventListener('backbutton', backCallback, false);
		}
	};
});
