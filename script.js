document.addEventListener('DOMContentLoaded', () => {
	const html = document.documentElement;
	const prismThemeLink = document.getElementById('prism-theme');
	const themeToggle = document.querySelector('.theme-toggle');
	const themeToggleIcon = document.querySelector('.theme-toggle i')
	const menuToggle = document.querySelector('.menu-toggle');
	const menuToggleIcon = document.querySelector('.menu-toggle i');
	const nav = document.querySelector('nav');
	const navLinks = document.querySelectorAll('.nav-links li a');
	const sections = document.querySelectorAll('main.container, section.container[id]');
	const textEl = document.querySelector('.text');
	const video = document.querySelector('.main-video');
	const themeSelect = document.querySelector('.prism-theme-select');
	function setTheme(mode) {
		if (mode === 'light') {
			html.classList.add('light-mode');
			themeToggleIcon.classList.replace('fa-cloud-moon', 'fa-cloud-sun');
			prismThemeLink.href = 'libs/prism/1.30.0/themes/prism-one-light.css';
		} else {
			html.classList.remove('light-mode');
			themeToggleIcon.classList.replace('fa-cloud-sun', 'fa-cloud-moon');
			prismThemeLink.href = 'libs/prism/1.30.0/themes/prism-one-dark.css';
		};
		localStorage.setItem('theme', mode);
	};
	themeToggle.addEventListener('click', () => {
		const isLight = html.classList.contains('light-mode');
		setTheme(isLight ? 'dark' : 'light');
	});
	const saved = localStorage.getItem('theme') || 'dark';
	setTheme(saved);
	let menuState = 'closed';
	function openMenu() {
		if (menuState === 'open') return;
		nav.classList.remove('closing');
		nav.classList.add('active');
		menuToggleIcon.classList.replace('fa-bars', 'fa-xmark');
		menuState = 'open';
	};
	function closeMenu() {
		if (menuState === 'closed' || menuState === 'closing') return;
		nav.classList.add('closing')
		menuToggleIcon.classList.replace('fa-xmark', 'fa-bars');
		menuState = 'closing';
	};
	nav.addEventListener('transitionend', (e) => {
		if (e.propertyName === 'opacity' && menuState === 'closing') {
			nav.classList.remove('active', 'closing');
			menuState = 'closed';
		};
	});
	menuToggle.addEventListener('click', () => {
		if (menuState === 'open') {
			closeMenu();
		} else if (menuState === 'closed') {
			openMenu();
		};
	});
	document.addEventListener('click', (e) => {
		if (menuState === 'open') {
			if (!nav.contains(e.target) && !menuToggle.contains(e.target)) {
				closeMenu();
			};
		};
	});
	navLinks.forEach(link => {
		link.addEventListener('click', () => {
			if (window.innerWidth <= 768 && menuState === 'open') {
				closeMenu();
			};
		});
	});
	const sectionMap = new Map();
	const observer = new IntersectionObserver(entries => {
		entries.forEach(entry => {
			if (entry.isIntersecting) {
				const id = entry.target.getAttribute('id');
				sectionMap.set(id, entry.intersectionRatio);
			} else {
				const id = entry.target.getAttribute('id');
				sectionMap.delete(id);
			};
		});
		if (sectionMap.size > 0) {
			let visibleId = [...sectionMap.entries()].sort((a, b) => b[1] - a[1])[0][0];
			navLinks.forEach(link => {
				link.classList.toggle('active', link.getAttribute('href') === `#${visibleId}`);
			});
		};
	}, {
		threshold: Array.from({ length: 11 }, (_, i) => i / 10)
	});
	sections.forEach(section => observer.observe(section));
	function typingEffect(el, words, typingSpeed = 100, erasingSpeed = 100, delayBetweenWords = 2000) {
		let wordIndex = 0;
		let charIndex = 0;
		let isTyping = true;
		function type() {
			const currentWord = words[wordIndex];
			if (isTyping) {
				if (charIndex < currentWord.length) {
					el.textContent += currentWord[charIndex];
					charIndex++;
					setTimeout(type, typingSpeed);
				} else {
					isTyping = false;
					setTimeout(type, delayBetweenWords);
				};
			} else {
				if (charIndex > 0) {
					el.textContent = currentWord.slice(0, charIndex - 1);
					charIndex--;
					setTimeout(type, erasingSpeed);
				} else {
					isTyping = true;
					wordIndex = (wordIndex + 1) % words.length;
					setTimeout(type, 500);
				};
			};
		};
		type();
	};
	if (textEl) {
		typingEffect(textEl, ['', 'Dikzz Coder', 'Mas Dika', 'Dikzz Lonnely', 'Dika']);
	};
	if (video) {
		document.body.addEventListener('click', () => {
			video.muted = false;
			video.play();
		}, { once: true });
	};
	const themeMap = {
		'one dark': 'prism-one-dark.css',
		'pojoaque': 'prism-pojoaque.css',
		'night owl': 'prism-night-owl.css',
		'xonokai': 'prism-xonokai.css',
		'z-touch': 'prism-z-touch.css',
		'darcula': 'prism-darcula.css',
		'dracula': 'prism-dracula.css',
		'holi theme': 'prism-holi-theme.css',
		'synthwave 84': 'prism-synthwave84.css',
		'shades of purple': 'prism-shades-of-purple.css',
		'vs code dark plus': 'prism-vsc-dark-plus.css',
		'gruvbox dark': 'prism-gruvbox-dark.css',
		'coldark dark': 'prism-coldark-dark.css',
		'material dark': 'prism-material-dark.css',
		'atom dark': 'prism-atom-dark.css',
		'vs': 'prism-vs.css',
		'gruvbox light': 'prism-gruvbox-light.css',
		'coldark cold': 'prism-coldark-cold.css',
		'material light': 'prism-material-light.css',
		'one light': 'prism-one-light.css'
	};
	if (themeSelect) {
		themeSelect.addEventListener('change', () => {
			const selected = themeSelect.value.toLowerCase();
			const filename = themeMap[selected];
			if (filename) {
				prismThemeLink.href = `libs/prism/1.30.0/themes/${filename}`;
				localStorage.setItem('selectedPrismTheme', filename);
			};
		});
		const savedTheme = localStorage.getItem('selectedPrismTheme');
		if (savedTheme) {
			prismThemeLink.href = `libs/prism/1.30.0/themes/${savedTheme}`;
			const found = Object.entries(themeMap).find(([k, v]) => v === savedTheme);
			if (found) themeSelect.value = found[0];
		};
	};
});