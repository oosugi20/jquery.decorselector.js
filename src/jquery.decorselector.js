;(function ($, window, undefiend) {
'use script';

var MODULE_NAME = 'Decorselector';
var PLUGIN_NAME = 'decorselector';
var Module;


/**
 * Module
 */
Module = function (element, options) {
	this.el = element;
	this.$el = $(element);
	this.options = $.extend({
	}, options);
};

(function (fn) {
	/**
	 * init
	 */
	fn.init = function () {
		var _this = this;
		this._prepareElms();
		this._createVirtualList();
		this.controllDisabled();
		this._eventify();
		this._updateSelected();
		this.$currentSelected = this.$selected;
		this.width = (function () {
			var w = 0;
			_this.$item.each(function () {
				w = Math.max(w, $(this).width());
			});
			return w;
		})();
		this.$result.width(this.width);
		this.$list.find('.ui-decorselector-label').width(this.width);
		this.$list.hide();
	};

	/**
	 * _prepareElms
	 */
	fn._prepareElms = function () {
		this.$option = this.$el.find('option');
		this.$wrap = this.$el.wrap('<div class="ui-decorselector"/>').parent();
		this.$results = $('<a href="#" class="ui-decorselector-results"/>');
		this.$result = $('<span class="ui-decorselector-result"/>').appendTo(this.$results);
		this.$arrow = $('<span class="ui-decorselector-arrow">↓</span>').appendTo(this.$results);
		this.$results.appendTo(this.$wrap);
	};

	/**
	 * _createVirtualList
	 */
	fn._createVirtualList = function () {
		var hasOptgroup = !!(this.$el.has('optgroup').length);
		var list = '<ul class="ui-decorselector-list">';

		if (hasOptgroup) {
			this.$el.find('optgroup').each(function () {
				var $this = $(this);
				list += '<li class="ui-decorselector-group">';
				list += '<dfn class="ui-decorselector-label">' + $this.attr('label') + '</dfn>';
				list += '<ul class="ui-decorselector-groupitems">';
				$this.find('option').each(function () {
					var $opt = $(this);
					list += '<li class="ui-decorselector-item" data-decorselector-value="' + $opt.val() + '"><a href="#">' + $opt.text() + '</a></li>';
				});
				list += '</ul></li>';
			});
		} else {
			this.$el.find('option').each(function () {
				var $this = $(this);
				list += '<li class="ui-decorselector-item" data-decorselector-value="' + $this.val() + '"><a href="#">' + $this.text() + '</a></li>';
			});
			list += '</ul>';
		}

		this.$list = $(list).appendTo(this.$wrap);
		this.$item = this.$list.find('.ui-decorselector-item');
	};

	/**
	 * controllDisabled
	 */
	fn.controllDisabled = function () {
		if (this.$el.prop('disabled')) {
			this.$wrap.addClass('disabled');
		} else {
			this.$wrap.removeClass('disabled');
		}
	};

	/**
	 * _eventify
	 */
	fn._eventify = function () {
		var _this = this;
		this.$wrap.on('click', '.ui-decorselector-results', function (e) {
			e.preventDefault();
			if (!_this.$el.prop('disabled')) {
				_this._toggleList();
			}
		});
		this.$wrap.on('click', '.ui-decorselector-item a', function (e) {
			var $item = $(this).parent();
			e.preventDefault();
			_this.$option.attr('selected', false);
			_this.$option.filter('[value="' + $item.attr('data-decorselector-value') + '"]').attr('selected', true);
			_this._updateSelected();
			_this.$currentSelected = _this.$selected;
			_this._closeList();
			_this.$el.trigger('change');
		});
		this.$wrap.on('keydown', 'a', function (e) {
			var keyCode = e.keyCode || e.which;
			var arrow = {left: 37, up: 38, right: 39, down: 40 };

			switch (keyCode) {
				case arrow.left:
					//..
					break;
				case arrow.up:
					e.preventDefault();
					if (_this.$list.is(':hidden')) {
						_this._openList();
					} else if (_this.$selected.prev().length) {
						_this.$selected.attr('selected', false);
						_this.$selected.prev().attr('selected', true);
						_this._updateSelected();
					}
					break;
				case arrow.right:
					//..
					break;
				case arrow.down:
					e.preventDefault();
					if (_this.$list.is(':hidden')) {
						_this._openList();
					} else if (_this.$selected.next().length) {
						_this.$selected.attr('selected', false);
						_this.$selected.next().attr('selected', true);
						_this._updateSelected();
					}
					break;
				case 27: // Esc
					if (_this.$list.is(':visible')) {
						_this.$selected.attr('selected', false);
						_this.$currentSelected.attr('selected', true);
						_this._updateSelected();
						_this._closeList();
					}
					break;
				case 9: // Tab
					if (_this.$list.is(':visible')) {
						e.preventDefault();
						_this.$selected.attr('selected', false);
						_this.$currentSelected.attr('selected', true);
						_this._updateSelected();
						_this._closeList();
					}
					break;
				case 13: // Enter
					e.preventDefault();
					if (_this.$list.is(':visible')) {
						_this._closeList();
						_this.$currentSelected = _this.$selected;
						_this.$el.trigger('change');
					}
					//..
					break;
			}
		});
		this.$results.on('focus blur', function (e) {
			switch (e.type) {
				case 'focus':
					_this.$wrap.removeClass('blur');
					_this.$wrap.addClass('focus');
					break;
				case 'blur':
					_this.$wrap.removeClass('focus');
					_this.$wrap.addClass('blur');
					break;
			}
		});
		this.$wrap.on('click', function (e) {
			e.stopPropagation();
		});
		$(document).on('click', function (e) {
			if (_this.$list.is(':visible')) {
				_this.$list.hide();
				_this.$wrap.removeClass('opened');
			}
		});
	};

	/**
	 * _updateSelected
	 */
	fn._updateSelected = function () {
		this.$selected = this.$option.filter(':selected');
		this._selectedText = this.$selected.text();
		this._selectedValue = this.$el.val();
		this.$item.removeClass('selected');
		this.$item.filter('[data-decorselector-value="' + this._selectedValue + '"]').addClass('selected').find('a');
		this.$result.text(this._selectedText);
		if (this._selectedValue) {
			this.$wrap.addClass('selected');
		} else {
			this.$wrap.removeClass('selected');
		}
	};


	/**
	 * _openList
	 */
	fn._openList = function () {
		this.$list.show();
		this.$results.focus();
		this.$wrap.addClass('opened');
	};

	/**
	 * _closeList
	 */
	fn._closeList = function () {
		this.$list.hide();
		this.$results.focus();
		this.$wrap.removeClass('opened');
	};

	/**
	 * _toggleList
	 */
	fn._toggleList = function (event) {
		if (event) {
			event.preventDefault();
		}
		if (this.$list.is(':hidden')) {
			this._openList();
		} else {
			this._closeList();
		}
	};

})(Module.prototype);


// set jquery.fn
$.fn[PLUGIN_NAME] = function (options) {
	return this.each(function () {
		var module;
		if (!$.data(this, PLUGIN_NAME)) {
			module = new Module(this, options);
			$.data(this, PLUGIN_NAME, module);
			module.init();
		}
	});
};

// set global
$[MODULE_NAME] = Module;

})(jQuery, this);
