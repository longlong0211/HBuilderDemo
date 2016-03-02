window.delayimg = (function(window, document, undefined) {

	'use strict';

	var store = [],
		nodes,
		offset,
		throttle,
		content,
		poll;

	var _inView = function(el) {
		var coords = el.getBoundingClientRect();
		return (((coords.top >= 0 && coords.left >= 0 && coords.top) <= (window.innerHeight || document.documentElement.clientHeight) + parseInt(offset))&&coords.bottom+40>0&&coords.width+coords.height>0);
	};

	var _pollImages = function() {
		for (var i = store.length; i--;) {
			var thisI = store[i];
			if (_inView(thisI)) {
				if (thisI.getAttribute('data-delay-background') !== null) {
					thisI.style.opacity=1;
					thisI.style.backgroundImage = "url(" + thisI.getAttribute('data-delay-background') + ")";
					thisI.removeAttribute('data-delay-background');
		        }
		        else {
					thisI.src = thisI.getAttribute('data-delay');
					thisI.style.opacity=1;
					thisI.onload = function() {
						thisI.removeAttribute('data-delay');
						thisI.removeAttribute('height');
						thisI.parentNode.style.backgroundColor='transparent';
			        }
		        }
				store.splice(i, 1);
			}
		}
	};

	var _throttle = function() {
		clearTimeout(poll);
		poll = setTimeout(_pollImages, throttle);
		if(store.length<=0)
			content.removeEventListener('scroll', _throttle);
	};

	var init = function(opts) {
		store=[];
		nodes = document.querySelectorAll('img[data-delay],[data-delay-background]');
		var opts = opts || {};
		offset = opts.offset || 0;
		throttle = opts.throttle || 250;
		content = opts.content || window;

		for (var i = 0; i < nodes.length; i++) {
			store.unshift(nodes[i]);
		}
		_throttle();
		content.addEventListener('scroll', _throttle, false);
	};
	
	var render = function(){
		store = [];
		nodes = document.querySelectorAll('img[data-delay],[data-delay-background]');
		for (var i = 0; i < nodes.length; i++) {
			store.unshift(nodes[i]);
		}
		_throttle();
		content.addEventListener('scroll', _throttle, false);
	};

	return {
		init: init,
		render: render
	};

})(window, document);