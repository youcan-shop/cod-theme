!(function (e, t) {
	'object' == typeof exports && 'object' == typeof module
		? (module.exports = t())
		: 'function' == typeof define && define.amd
		? define([], t)
		: 'object' == typeof exports
		? (exports.NiceSelect = t())
		: (e.NiceSelect = t());
})(self, function () {
	return (() => {
		'use strict';
		var e = {
				d(t, i) {
					for (var o in i) e.o(i, o) && !e.o(t, o) && Object.defineProperty(t, o, { enumerable: !0, get: i[o] });
				},
				o: (e, t) => Object.prototype.hasOwnProperty.call(e, t),
				r(e) {
					'undefined' != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, { value: 'Module' }), Object.defineProperty(e, '__esModule', { value: !0 });
				},
			},
			t = {};
		function i(e) {
			var t = document.createEvent('MouseEvents');
			t.initEvent('click', !0, !1), e.dispatchEvent(t);
		}
		function o(e) {
			var t = document.createEvent('HTMLEvents');
			t.initEvent('change', !0, !1), e.dispatchEvent(t);
		}
		function s(e) {
			var t = document.createEvent('FocusEvent');
			t.initEvent('focusin', !0, !1), e.dispatchEvent(t);
		}
		function n(e) {
			var t = document.createEvent('FocusEvent');
			t.initEvent('focusout', !0, !1), e.dispatchEvent(t);
		}
		function d(e, t) {
			return e.getAttribute(t);
		}
		function r(e, t) {
			return !!e && e.classList.contains(t);
		}
		function l(e, t) {
			if (e) return e.classList.add(t);
		}
		function a(e, t) {
			if (e) return e.classList.remove(t);
		}
		e.r(t), e.d(t, { default: () => p, bind: () => h });
		var c = { data: null, searchable: !1 };
		function p(e, t) {
			(this.el = e),
				(this.config = Object.assign({}, c, t || {})),
				(this.data = this.config.data),
				(this.selectedOptions = []),
				(this.placeholder = d(this.el, 'placeholder') || this.config.placeholder || 'Select an option'),
				(this.dropdown = null),
				(this.multiple = d(this.el, 'multiple')),
				(this.disabled = d(this.el, 'disabled')),
				this.create();
		}
		function h(e, t) {
			return new p(e, t);
		}
		return (
			(p.prototype.create = function () {
				(this.el.style.display = 'none'), this.data ? this.processData(this.data) : this.extractData(), this.renderDropdown(), this.bindEvent();
			}),
			(p.prototype.processData = function (e) {
				var t = [];
				e.forEach((e) => {
					t.push({ data: e, attributes: { selected: !1, disabled: !1, optgroup: 'optgroup' == e.value } });
				}),
					(this.options = t);
			}),
			(p.prototype.extractData = function () {
				var e = this.el.querySelectorAll('option,optgroup'),
					t = [],
					i = [],
					o = [];
				e.forEach((e) => {
					if ('OPTGROUP' == e.tagName) var o = { text: e.label, value: 'optgroup' };
					else o = { text: e.innerText, value: e.value };
					var s = { selected: null != e.getAttribute('selected'), disabled: null != e.getAttribute('disabled'), optgroup: 'OPTGROUP' == e.tagName };
					t.push(o), i.push({ data: o, attributes: s });
				}),
					(this.data = t),
					(this.options = i),
					this.options.forEach(function (e) {
						e.attributes.selected && o.push(e);
					}),
					(this.selectedOptions = o);
			}),
			(p.prototype.renderDropdown = function () {
				var e = `<div class="${['yc-dropdown', d(this.el, 'class') || '', this.disabled ? 'disabled' : '', this.multiple ? 'has-multiple' : ''].join(' ')}" tabindex="${this.disabled ? null : 0}">
  <span class="${this.multiple ? 'multiple-options' : 'current'}"></span>
  <div class="yc-dropdown-dropdown">
  ${this.config.searchable ? '<div class="yc-dropdown-search-box">\n<input type="text" class="yc-dropdown-search" placeholder="Search..."/>\n</div>' : ''}
  <ul class="list"></ul>
  </div></div>
`;
				this.el.insertAdjacentHTML('afterend', e), (this.dropdown = this.el.nextElementSibling), this._renderSelectedItems(), this._renderItems();
			}),
			(p.prototype._renderSelectedItems = function () {
				if (this.multiple) {
					var e = '';
					'auto' == window.getComputedStyle(this.dropdown).width || this.selectedOptions.length < 2
						? (this.selectedOptions.forEach(function (t) {
								e += `<span class="current">${t.data.text}</span>`;
						  }),
						  (e = '' == e ? this.placeholder : e))
						: (e = this.selectedOptions.length + ' selected'),
						(this.dropdown.querySelector('.multiple-options').innerHTML = e);
				} else {
					var t = this.selectedOptions.length > 0 ? this.selectedOptions[0].data.text : this.placeholder;
					this.dropdown.querySelector('.current').innerHTML = t;
				}
			}),
			(p.prototype._renderItems = function () {
				var e = this.dropdown.querySelector('ul');
				this.options.forEach((t) => {
					e.appendChild(this._renderItem(t));
				});
			}),
			(p.prototype._renderItem = function (e) {
				var t = document.createElement('li');
				if (((t.innerHTML = e.data.text), e.attributes.optgroup)) t.classList.add('optgroup');
				else {
					t.setAttribute('data-value', e.data.value);
					var i = ['option', e.attributes.selected ? 'selected' : null, e.attributes.disabled ? 'disabled' : null];
					t.addEventListener('click', this._onItemClicked.bind(this, e)), t.classList.add(...i);
				}
				return (e.element = t), t;
			}),
			(p.prototype.update = function () {
				if ((this.extractData(), this.dropdown)) {
					var e = r(this.dropdown, 'open');
					this.dropdown.parentNode.removeChild(this.dropdown), this.create(), e && i(this.dropdown);
				}
			}),
			(p.prototype.disable = function () {
				this.disabled || ((this.disabled = !0), l(this.dropdown, 'disabled'));
			}),
			(p.prototype.enable = function () {
				this.disabled && ((this.disabled = !1), a(this.dropdown, 'disabled'));
			}),
			(p.prototype.clear = function () {
				(this.selectedOptions = []), this._renderSelectedItems(), this.updateSelectValue(), o(this.el);
			}),
			(p.prototype.destroy = function () {
				this.dropdown && (this.dropdown.parentNode.removeChild(this.dropdown), (this.el.style.display = ''));
			}),
			(p.prototype.bindEvent = function () {
				this.dropdown.addEventListener('click', this._onClicked.bind(this)),
					this.dropdown.addEventListener('keydown', this._onKeyPressed.bind(this)),
					this.dropdown.addEventListener('focusin', s.bind(this, this.el)),
					this.dropdown.addEventListener('focusout', n.bind(this, this.el)),
					window.addEventListener('click', this._onClickedOutside.bind(this)),
					this.config.searchable && this._bindSearchEvent();
			}),
			(p.prototype._bindSearchEvent = function () {
				var e = this.dropdown.querySelector('.yc-dropdown-search');
				e &&
					e.addEventListener('click', function (e) {
						return e.stopPropagation(), !1;
					}),
					e.addEventListener('input', this._onSearchChanged.bind(this));
			}),
			(p.prototype._onClicked = function (e) {
				if ((this.multiple ? this.dropdown.classList.add('open') : this.dropdown.classList.toggle('open'), this.dropdown.classList.contains('open'))) {
					var t = this.dropdown.querySelector('.yc-dropdown-search');
					t && ((t.value = ''), t.focus());
					var i = this.dropdown.querySelector('.focus');
					a(i, 'focus'),
						l((i = this.dropdown.querySelector('.selected')), 'focus'),
						this.dropdown.querySelectorAll('ul li').forEach(function (e) {
							e.style.display = '';
						});
				} else this.dropdown.focus();
			}),
			(p.prototype._onItemClicked = function (e, t) {
				var i = t.target;
				r(i, 'disabled') ||
					(this.multiple
						? r(i, 'selected')
							? (a(i, 'selected'), this.selectedOptions.splice(this.selectedOptions.indexOf(e), 1), (this.el.querySelector('option[value="' + i.dataset.value + '"]').selected = !1))
							: (l(i, 'selected'), this.selectedOptions.push(e))
						: (this.selectedOptions.forEach(function (e) {
								a(e.element, 'selected');
						  }),
						  l(i, 'selected'),
						  (this.selectedOptions = [e])),
					this._renderSelectedItems(),
					this.updateSelectValue());
			}),
			(p.prototype.updateSelectValue = function () {
				if (this.multiple) {
					var e = this.el;
					this.selectedOptions.forEach(function (t) {
						var i = e.querySelector('option[value="' + t.data.value + '"]');
						i && i.setAttribute('selected', !0);
					});
				} else this.selectedOptions.length > 0 && (this.el.value = this.selectedOptions[0].data.value);
				o(this.el);
			}),
			(p.prototype._onClickedOutside = function (e) {
				this.dropdown.contains(e.target) || this.dropdown.classList.remove('open');
			}),
			(p.prototype._onKeyPressed = function (e) {
				var t = this.dropdown.querySelector('.focus'),
					o = this.dropdown.classList.contains('open');
				if (32 == e.keyCode || 13 == e.keyCode) i(o ? t : this.dropdown);
				else if (40 == e.keyCode) {
					if (o) {
						var s = this._findNext(t);
						s && (a(this.dropdown.querySelector('.focus'), 'focus'), l(s, 'focus'));
					} else i(this.dropdown);
					e.preventDefault();
				} else if (38 == e.keyCode) {
					if (o) {
						var n = this._findPrev(t);
						n && (a(this.dropdown.querySelector('.focus'), 'focus'), l(n, 'focus'));
					} else i(this.dropdown);
					e.preventDefault();
				} else 27 == e.keyCode && o && i(this.dropdown);
				return !1;
			}),
			(p.prototype._findNext = function (e) {
				for (e = e ? e.nextElementSibling : this.dropdown.querySelector('.list .option'); e; ) {
					if (!r(e, 'disabled') && 'none' != e.style.display) return e;
					e = e.nextElementSibling;
				}
				return null;
			}),
			(p.prototype._findPrev = function (e) {
				for (e = e ? e.previousElementSibling : this.dropdown.querySelector('.list .option:last-child'); e; ) {
					if (!r(e, 'disabled') && 'none' != e.style.display) return e;
					e = e.previousElementSibling;
				}
				return null;
			}),
			(p.prototype._onSearchChanged = function (e) {
				var t = this.dropdown.classList.contains('open'),
					i = e.target.value;
				if ('' == (i = i.toLowerCase()))
					this.options.forEach(function (e) {
						e.element.style.display = '';
					});
				else if (t) {
					var o = RegExp(i);
					this.options.forEach(function (e) {
						var t = e.data.text.toLowerCase(),
							i = o.test(t);
						e.element.style.display = i ? '' : 'none';
					});
				}
				this.dropdown.querySelectorAll('.focus').forEach(function (e) {
					a(e, 'focus');
				}),
					l(this._findNext(null), 'focus');
			}),
			t
		);
	})();
});
