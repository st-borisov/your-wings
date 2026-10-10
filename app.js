import * as flsFunctions from "./modules/functions.js";

flsFunctions.isWebp();

import Swiper from 'swiper';
import { Autoplay, EffectFade, Navigation, Pagination, Thumbs } from 'swiper/modules';
//import gsap from 'gsap';
//import ScrollTrigger from 'gsap/dist/ScrollTrigger.min.js';
import $ from "jquery";
import 'jquery-ui/ui/widgets/checkboxradio.js';
import 'jquery-ui/ui/widgets/slider.js';

/* jquery-ui */
$(function () {
	$(".checkbox-privacy input").checkboxradio();
	/* $(".select select").selectmenu(); */
});

/* Плавный скролл по ссылкам меню */
const smoothLinks = document.querySelectorAll('a[href^="#"]');
for (let smoothLink of smoothLinks) {
	smoothLink.addEventListener('click', function (e) {
		e.preventDefault();
		const id = smoothLink.getAttribute('href');

		document.querySelector(id).scrollIntoView({
			behavior: 'smooth',
			block: 'start'
		});
	});
};

const scrolled = document.querySelector('.header');
if (scrolled) {
	let lastScroll = 0;
	window.addEventListener('scroll', function () {
		const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
		if (currentScroll > 50) {
			scrolled.classList.add('header-scrolled');
		} else {
			scrolled.classList.remove('header-scrolled');
		}
		lastScroll = currentScroll;
	});
}

const sliderDesc = document.querySelector('.project-slider__desc-mob');
const remToPx = parseFloat(getComputedStyle(document.documentElement).fontSize);
const scrollDistance = 60 * remToPx;
window.addEventListener('scroll', function () {
	const scrollY = window.pageYOffset || document.documentElement.scrollTop;

	if (scrollY >= scrollDistance) {
		sliderDesc.classList.add('project-slider__desc--fixed');
	} else {
		sliderDesc.classList.remove('project-slider__desc--fixed');
	}
});

/* Код на меню */
const burger = document.querySelector('.header-burger');
const body = document.querySelector('body');
const header = document.querySelector('.header');
const menuLinks = document.querySelectorAll('.header-burger-content__menu a');
if (burger) {
	burger.addEventListener("click", function (e) {
		body.classList.toggle('fixed');
		burger.classList.toggle('fixed');
		header.classList.toggle('fixed');
	});
}

menuLinks.forEach(link => {
	link.addEventListener('click', function () {
		body.classList.remove('fixed');
		burger.classList.remove('fixed');
		header.classList.remove('fixed');
	});
});

/* Код на фильтр */
const openFilter = document.querySelector('.catalog-filter__mob');
const monFilter = document.querySelector('.catalog-filter');

if (openFilter && monFilter && window.innerWidth < 992) {
	openFilter.addEventListener("click", function (e) {
		monFilter.classList.toggle('open-filter');
	});
}

/* слайдер */
let pageRem = window.innerWidth / 1440 * 16;
let swiper = null;
let timer = null;

function windowResize() {
	pageRem; // 1rem is 16px
	if (swiper) {
		if (timer) {
			clearTimeout(timer);
		}
		setTimeout(() => {
			swiper.params.spaceBetween;
			swiper.update();
		}, 400);
	}
}

window.addEventListener('resize', windowResize);

const swiper1 = new Swiper('.main-screen-slider', {
	modules: [Pagination, EffectFade, Autoplay],
	loop: true,
	speed: 600,
	slidesPerView: 1,
	pagination: {
		el: ".main-screen-slider__pagination",
		clickable: true,
	},
	effect: 'fade',
	autoplay: {
		delay: 3000,
	}
});

const swiper2 = new Swiper('.projects-slider__slider', {
	modules: [Pagination, Navigation],
	loop: true,
	speed: 600,
	slidesPerView: 3,
	spaceBetween: 20,
	pagination: {
		el: ".projects-slider__pagination",
		clickable: true,
	},
	navigation: {
		prevEl: ".projects-slider__prev",
		nextEl: ".projects-slider__next"
	},
	breakpoints: {
		0: {
			slidesPerView: 1,
		},
		577: {
			slidesPerView: 2,
		},
		993: {
			slidesPerView: 3,
		}
	}
});

// Инициализация слайдера эскизов
const swiperThumbs = new Swiper('.project-slider-thumbs', {
	spaceBetween: 20,
	slidesPerView: 3,
	freeMode: true,
	watchSlidesProgress: true,
	direction: 'vertical',
	breakpoints: {
		0: {
			direction: 'horizontal',
		},
		993: {
			direction: 'vertical',
		}
	}
});

// Инициализация основного слайдера
const swiperMain = new Swiper('.project-slider-main', {
	modules: [Thumbs],
	spaceBetween: 20,
	thumbs: {
		swiper: swiperThumbs,
	},
	loop: true,
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
			// Проверяем, что кнопка принадлежит именно этому экземпляру табов
			if (target && Array.from(this._elButtons).includes(target)) {
				e.preventDefault();
				this.show(target);
			}
		});
	}
}

// Инициализация
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

/* фильтр по площади */
/* $(function () {
	$(".catalog-filter-range").each(function () {
		var $range = $(this);
		var $fromInput = $range.find(".from");
		var $toInput = $range.find(".to");
		var $sliderRange = $range.find(".slider-range");

		var minValue = parseInt($fromInput.data("min"), 10);
		var maxValue = parseInt($toInput.data("max"), 10);

		var defaultFromValue = parseInt($sliderRange.data("value-from"), 10) || minValue;
		var defaultToValue = parseInt($sliderRange.data("value-to"), 10) || maxValue;

		$sliderRange.slider({
			range: true,
			min: minValue,
			max: maxValue,
			values: [defaultFromValue, defaultToValue],
			slide: function (event, ui) {
				$fromInput.val(ui.values[0]);
				$toInput.val(ui.values[1]);
			}
		});

		$fromInput.val($sliderRange.slider("values", 0));
		$toInput.val($sliderRange.slider("values", 1));

		$fromInput.on("input", function () {
			var fromValue = parseInt($(this).val(), 10);
			var toValue = parseInt($toInput.val(), 10);

			if (!isNaN(fromValue) && fromValue >= minValue && fromValue <= maxValue && fromValue <= toValue) {
				$sliderRange.slider("values", 0, fromValue);
			}
		});

		$toInput.on("input", function () {
			var toValue = parseInt($(this).val(), 10);
			var fromValue = parseInt($fromInput.val(), 10);

			if (!isNaN(toValue) && toValue >= minValue && toValue <= maxValue && toValue >= fromValue) {
				$sliderRange.slider("values", 1, toValue);
			}
		});
	});
}); */

document.addEventListener('DOMContentLoaded', () => {
	// 1. Находим все необходимые элементы
	const shareButton = document.getElementById('shareButton');
	const shareMenu = document.getElementById('shareMenu');
	const copyButton = document.getElementById('copyLinkButton');

	// 2. Проверяем, что все элементы существуют на странице
	if (!shareButton || !shareMenu || !copyButton) {
		console.warn('Элементы кнопки "Поделиться" не найдены. Скрипт не запущен.');
		return; // Прерываем выполнение, если чего-то не хватает
	}

	// 3. Проверяем, что внутри кнопки есть элемент с классом .share-text
	const textElement = shareButton.querySelector('.share-text');
	if (!textElement) {
		console.warn('Элемент .share-text не найден внутри кнопки. Скрипт не запущен.');
		return;
	}

	// 4. Если всё на месте — сохраняем исходный текст и продолжаем
	const originalText = textElement.textContent;

	const pageUrl = encodeURIComponent(window.location.href);
	const pageTitle = encodeURIComponent(document.title);

	// Открытие/закрытие меню
	function toggleMenu(event) {
		event.stopPropagation();
		shareMenu.classList.toggle('show');
	}

	// Закрытие меню при клике вне кнопки
	document.addEventListener('click', (event) => {
		if (!shareButton.contains(event.target)) {
			shareMenu.classList.remove('show');
		}
	});

	// Обработчик кликов по пунктам меню
	shareMenu.addEventListener('click', (event) => {
		const item = event.target.closest('[data-share]');
		if (item) {
			const network = item.dataset.share;
			let shareUrl = '';

			switch (network) {
				case 'vkontakte':
					shareUrl = `https://vk.com/share.php?url=${pageUrl}&title=${pageTitle}`;
					break;
				case 'telegram':
					shareUrl = `https://t.me/share/url?url=${pageUrl}&text=${pageTitle}`;
					break;
				case 'whatsapp':
					shareUrl = `https://api.whatsapp.com/send?text=${pageTitle}%20${pageUrl}`;
					break;
				case 'max':
					shareUrl = `https://max.ru/share?url=${pageUrl}&text=${pageTitle}`;
					break;
			}

			if (shareUrl) {
				window.open(shareUrl, '_blank', 'noopener,noreferrer');
			}
			shareMenu.classList.remove('show');
		}
	});

	// Копирование ссылки
	copyButton.addEventListener('click', async () => {
		try {
			await navigator.clipboard.writeText(window.location.href);
			textElement.textContent = 'Скопировано';
			showToast('Ссылка скопирована в буфер обмена');
			setTimeout(() => {
				textElement.textContent = originalText;
			}, 2000);
		} catch (err) {
			console.error('Ошибка копирования:', err);
			showToast('Не удалось скопировать ссылку');
		}
		shareMenu.classList.remove('show');
	});

	// Открытие меню по клику на кнопку
	shareButton.addEventListener('click', toggleMenu);

	// Функция уведомления
	function showToast(message) {
		const toast = document.createElement('div');
		toast.className = 'toast';
		toast.textContent = message;
		document.body.appendChild(toast);
		requestAnimationFrame(() => toast.classList.add('show'));
		setTimeout(() => {
			toast.classList.remove('show');
			setTimeout(() => toast.remove(), 300);
		}, 2000);
	}
});