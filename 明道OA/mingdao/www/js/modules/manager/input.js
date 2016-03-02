define(function(require, exports, module) {
	var $common = require('core/common');
	exports.forceCloseKeyboard = function(backCallback) {
		$common.switchOS(function() {}, function() {
			$('input').off('keydown').on('keydown', function(e) {
				e = (e) ? e : ((window.event) ? window.event : "")
				var keyCode = e.keyCode ? e.keyCode : (e.which ? e.which : e.charCode);
				if (keyCode == 13) {
					$(this).trigger('blur');
				}
			});
		});
	};
	exports.focus = function() {
		$('input').off('focus').on('focus', function(e) {
			var readonly = $(this).attr('readonly');
			if (readonly == undefined || readonly == 'undefined') {
				if (!$(this).hasClass('inputFocus')) {
					$(this).addClass('inputFocus');
				}
				if (!$(this).hasClass('alignleft')) {
					$(this).addClass('alignleft');
					$(this).removeAttr('placeholder');
				}
				var validatorEl = $(this).closest('.inner');
				if ($(validatorEl).hasClass('has-error')) {
					$(validatorEl).removeClass('has-error');
				}
			}
		});
		$('textarea').off('focus').on('focus', function(e) {
			if (!$(this).hasClass('inputFocus')) {
				$(this).addClass('inputFocus');
			}
			$(this).removeAttr('placeholder');

			var validatorEl = $(this).closest('.inner');
			if ($(validatorEl).hasClass('has-error')) {
				$(validatorEl).removeClass('has-error');
			}
		});
	};
	exports.blur = function(el, blurCallback, bind) {
		if (bind) {
			$(el).bind('blur', function(e) {
				if ($(this).hasClass('inputFocus')) {
					$(this).removeClass('inputFocus');
				}
				if (typeof blurCallback == 'function') {
					blurCallback(el, e);
				}
			});
		} else {
			$(el).off('blur').on('blur', function(e) {
				if ($(this).hasClass('inputFocus')) {
					$(this).removeClass('inputFocus');
				}
				if (typeof blurCallback == 'function') {
					blurCallback(el, e);
				}
			});
		}
	};
});