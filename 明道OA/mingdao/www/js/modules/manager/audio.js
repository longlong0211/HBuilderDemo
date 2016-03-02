define(function(require, exports, module) {
	exports.play = function(path) {
		if (path) {
			p = plus.audio.createPlayer('_www' + path);
			if (p) {
				p.play(function() {
				}, function() {
				});
			}
		}
	};
});
