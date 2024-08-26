document.addEventListener('DOMContentLoaded', function () {
	function setDateTime() {
		// получаем все элементы с тегом time на странице
		const timeItems = document.querySelectorAll('time');

		if (timeItems) {
			timeItems.forEach(time => {
				// из каждого timeItems получаем attribute datatime
				const dataTime = time.getAttribute('datetime');
				console.debug(dataTime);

				// Создание объекта Date из значения атрибута datetime
				const dateObject = new Date(dataTime);

				const day = dateObject.getDate();
				const month = dateObject.getMonth(); // Получение месяца 0-11
				const year = dateObject.getFullYear();

				// массив месяцев сокращенно
				const monthNamesShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

				// Получение месяца словом по index из массива
				const monthWordShort = monthNamesShort[month];
				console.debug(monthWordShort);

				// записываем в нужном формате (30.Jun.2022) дату в <time>...</time>
				time.textContent = `${day}.${monthWordShort}.${year}`;
			});
		}
	}
	setDateTime();

	//=======================================================
	function themeColor() {
		// HTML
		const htmlBlock = document.documentElement;

		// Получаем сохраненную тему
		const saveUserTheme = localStorage.getItem('user-theme');

		// Определяем текущую системную тему
		let systemTheme;
		if (window.matchMedia) {
			systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
		}
		console.debug('systemTheme:', systemTheme);
		console.debug('saveUserTheme:', saveUserTheme);

		// Функция для применения системной темы
		function applySystemTheme() {
			// Удаляем все классы темы
			htmlBlock.classList.remove('dark', 'light');

			// Если есть сохраненная тема и она отличается от системной
			if (saveUserTheme && saveUserTheme !== systemTheme) {
				// Удаляем сохраненную тему из localStorage
				localStorage.removeItem('user-theme');
				// Устанавливаем класс в соответствии с системной темой
				htmlBlock.classList.add(systemTheme);
			} else if (!saveUserTheme) {
				// Если сохраненной темы нет, устанавливаем системную тему и сохраняем ее
				htmlBlock.classList.add(systemTheme);
				localStorage.setItem('user-theme', systemTheme);
			} else {
				// Если сохраненная тема совпадает с системной, применяем сохраненную тему
				htmlBlock.classList.add(saveUserTheme);
			}
			setAriaLabel();
		}

		// Слушатель изменений системных настроек
		window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
			// Определяем новую системную тему
			systemTheme = e.matches ? 'dark' : 'light';
			applySystemTheme();
		});

		// Изменение темы по клику
		const themeButton = document.querySelector('.action__theme');
		if (themeButton) {
			themeButton.addEventListener('click', function () {
				changeTheme(true);
			});
		}

		// Устанавливаем класс темы
		function setThemeClass() {
			if (saveUserTheme) {
				htmlBlock.classList.add(saveUserTheme);
			} else {
				htmlBlock.classList.add(systemTheme);
			}
			setAriaLabel();
		}

		// Добавляем класс темы
		setThemeClass();

		// Функция установки aria-label для кнопки смены темы
		function setAriaLabel() {
			if (themeButton) {
				if (htmlBlock.classList.contains('dark')) {
					themeButton.setAttribute('aria-label', 'Switch to light theme');
				} else {
					themeButton.setAttribute('aria-label', 'Switch to dark theme');
				}
			}
		}

		// Функция изменения темы
		function changeTheme(saveTheme = false) {
			let currentTheme = htmlBlock.classList.contains('light') ? 'light' : 'dark';
			let newTheme = currentTheme === 'light' ? 'dark' : 'light';

			htmlBlock.classList.remove(currentTheme);
			htmlBlock.classList.add(newTheme);

			if (saveTheme) {
				localStorage.setItem('user-theme', newTheme);
			}
			setAriaLabel();
		}
	}

	themeColor();
});
