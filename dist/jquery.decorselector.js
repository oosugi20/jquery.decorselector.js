/*! jquery.decorselector.js (git@github.com:oosugi20/jquery.decorselector.js.git)
* 
 * lastupdate: 2013-12-09
 * version: 0.1.0
 * author: Makoto OOSUGI <oosugi20@gmail.com>
 * License: MIT
 */
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
		this._prepareElms();
		this._eventify();
		this._updateSelected();
		this.$currentSelected = this.$selected;
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

		// create virtual list
		var list = '<ul class="ui-decorselector-list">';
		this.$el.find('option').each(function () {
			var $this = $(this);
			list += '<li class="ui-decorselector-item" data-decorselector-value="' + $this.val() + '"><a href="#">' + $this.text() + '</a></li>';
		});
		list += '</ul>';

		this.$list = $(list).appendTo(this.$wrap).hide();
		this.$item = this.$list.find('.ui-decorselector-item');
	};

	/**
	 * _eventify
	 */
	fn._eventify = function () {
		var _this = this;
		this.$wrap.on('click', '.ui-decorselector-results', $.proxy(this._toggleList, this));
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
					_this.$selected.attr('selected', false);
					_this.$selected.prev().attr('selected', true);
					_this._updateSelected();
					break;
				case arrow.right:
					//..
					break;
				case arrow.down:
					if (_this.$list.is(':hidden')) {
						_this._openList();
					} else {
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
		this.$item.on('focus', 'a', function (e) {
			_this._closeList();
		});

		this.$el.on('change', function () {
			console.log('change');
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
	};


	/**
	 * _openList
	 */
	fn._openList = function () {
		this.$list.show();
		this.$results.focus();
	};

	/**
	 * _closeList
	 */
	fn._closeList = function () {
		this.$list.hide();
		this.$results.focus();
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
