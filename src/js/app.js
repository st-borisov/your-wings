import * as flsFunctions from "./modules/functions.js";

flsFunctions.isWebp();

import Swiper from 'swiper';
import { Autoplay, EffectFade, Navigation, Pagination, Thumbs } from 'swiper/modules';


document.addEventListener('DOMContentLoaded', () => {
	document.querySelectorAll('.reviews-content').forEach((root) => {
		const sliderEl = root.querySelector('.reviews-slider');
		if (!sliderEl) return;

		const wrapper = sliderEl.querySelector('.swiper-wrapper');
		if (!wrapper || wrapper.children.length === 0) return;

		new Swiper(sliderEl, {
			modules: [Pagination, Navigation],
			slidesPerView: 2,
			spaceBetween: 10,
			speed: 600,
			watchOverflow: true,
			pagination: {
				el: root.querySelector('.reviews-slider__pagination'),
				clickable: true,
			},
			navigation: {
				prevEl: root.querySelector('.reviews-slider-bottom__arrow-prev'),
				nextEl: root.querySelector('.reviews-slider-bottom__arrow-next'),
			},
		});
	});
});

class ItcTabs {
	constructor(target, config) {
		const defaultConfig = {};
		this._config = Object.assign(defaultConfig, config);
		this._elTabs = typeof target === 'string' ? document.querySelector(target) : target;

		// Используем :scope для выбора только прямых потомков
		this._elButtons = this._elTabs.querySelectorAll(':scope > .tabs__nav > .tabs__btn');
		this._elPanes = this._elTabs.querySelectorAll(':scope > .tabs__content > .tabs__pane');

		this._eventShow = new Event('tab.itc.change');
		this._init();
		this._events();
	}
	_init() {
		this._elTabs.setAttribute('role', 'tablist');
		this._elButtons.forEach((el, index) => {
			el.dataset.index = index;
			el.setAttribute('role', 'tab');
			if (this._elPanes[index]) {
				this._elPanes[index].setAttribute('role', 'tabpanel');
			}
		});
	}
	show(elLinkTarget) {
		const elPaneTarget = this._elPanes[elLinkTarget.dataset.index];
		const elLinkActive = this._elTabs.querySelector(':scope > .tabs__nav > .tabs__btn_active');
		const elPaneShow = this._elTabs.querySelector(':scope > .tabs__content > .tabs__pane_show');

		if (elLinkTarget === elLinkActive || !elPaneTarget) {
			return;
		}
		if (elLinkActive) {
			elLinkActive.classList.remove('tabs__btn_active');
		}
		if (elPaneShow) {
			elPaneShow.classList.remove('tabs__pane_show');
		}
		elLinkTarget.classList.add('tabs__btn_active');
		elPaneTarget.classList.add('tabs__pane_show');
		this._elTabs.dispatchEvent(this._eventShow);
		elLinkTarget.focus();
	}
	showByIndex(index) {
		const elLinkTarget = this._elButtons[index];
		if (elLinkTarget) {
			this.show(elLinkTarget);
		}
	}
	_events() {
		this._elTabs.addEventListener('click', (e) => {
			const target = e.target.closest('.tabs__btn');
			if (target && Array.from(this._elButtons).includes(target)) {
				e.preventDefault();
				this.show(target);
			}
		});
	}
}
const tabs = document.querySelectorAll('.tabs');
tabs.forEach(tab => {
	new ItcTabs(tab);
});

/* accordion */
const accordions = document.querySelectorAll('.accordion');

class ItcAccordion {
	constructor(target, config) {
		this._el = typeof target === 'string' ? document.querySelector(target) : target;
		const defaultConfig = {
			alwaysOpen: true,
			duration: 350
		};
		this._config = Object.assign(defaultConfig, config);
		this.addEventListener();
	}
	addEventListener() {
		this._el.addEventListener('click', (e) => {
			const elHeader = e.target.closest('.accordion__header');
			if (!elHeader) {
				return;
			}
			if (!this._config.alwaysOpen) {
				const elOpenItem = this._el.querySelector('.accordion__item_show');
				if (elOpenItem) {
					elOpenItem !== elHeader.parentElement ? this.toggle(elOpenItem) : null;
				}
			}
			this.toggle(elHeader.parentElement);
		});
	}
	show(el) {
		const elBody = el.querySelector('.accordion__body');
		if (elBody.classList.contains('collapsing') || el.classList.contains('accordion__item_show')) {
			return;
		}
		elBody.style['display'] = 'block';
		const height = elBody.offsetHeight;
		elBody.style['height'] = 0;
		elBody.style['overflow'] = 'hidden';
		elBody.style['transition'] = `height ${this._config.duration}ms ease`;
		elBody.classList.add('collapsing');
		el.classList.add('accordion__item_slidedown');
		elBody.offsetHeight;
		elBody.style['height'] = `${height}px`;
		window.setTimeout(() => {
			elBody.classList.remove('collapsing');
			el.classList.remove('accordion__item_slidedown');
			elBody.classList.add('collapse-body');
			el.classList.add('accordion__item_show');
			elBody.style['display'] = '';
			elBody.style['height'] = '';
			elBody.style['transition'] = '';
			elBody.style['overflow'] = '';
		}, this._config.duration);
	}
	hide(el) {
		const elBody = el.querySelector('.accordion__body');
		if (elBody.classList.contains('collapsing') || !el.classList.contains('accordion__item_show')) {
			return;
		}
		elBody.style['height'] = `${elBody.offsetHeight}px`;
		elBody.offsetHeight;
		elBody.style['display'] = 'block';
		elBody.style['height'] = 0;
		elBody.style['overflow'] = 'hidden';
		elBody.style['transition'] = `height ${this._config.duration}ms ease`;
		elBody.classList.remove('collapse');
		el.classList.remove('accordion__item_show');
		elBody.classList.add('collapsing');
		window.setTimeout(() => {
			elBody.classList.remove('collapsing');
			elBody.classList.add('collapse-body');
			elBody.style['display'] = '';
			elBody.style['height'] = '';
			elBody.style['transition'] = '';
			elBody.style['overflow'] = '';
		}, this._config.duration);
	}
	toggle(el) {
		el.classList.contains('accordion__item_show') ? this.hide(el) : this.show(el);
	}
}

if (accordions.length > 0) {
	accordions.forEach(accordion => {
		new ItcAccordion(accordion, {
			alwaysOpen: false,
		});
	});
}


