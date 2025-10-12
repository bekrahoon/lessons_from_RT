        // Массив пользователей
        const users = [
            {
                login: "admin",
                password: "12345",
                name: "Админ"
            },
            {
                login: "user1",
                password: "password",
                name: "Иван Петров"
            },
            {
                login: "ivan",
                password: "ivan123",
                name: "Иван Сидоров"
            },
            {
                login: "maria",
                password: "maria456",
                name: "Мария Сергеевна"
            },
            {
                login: "john",
                password: "john789",
                name: "Джон Смит"
            },
            {
                login: "test",
                password: "test123",
                name: "Тестовый пользователь"
            },
            {
                login: "alex",
                password: "alex999",
                name: "Александр"
            },
            {
                login: "olga",
                password: "olga111",
                name: "Ольга"
            }
        ];

        // Получаем элементы
        const loginForm = document.getElementById('loginForm');
        const loginInput = document.getElementById('login');
        const passwordInput = document.getElementById('password');
        const messageDiv = document.getElementById('message');
        const profileDiv = document.getElementById('profile');
        const userNameDiv = document.getElementById('userName');
        const logoutBtn = document.getElementById('logoutBtn');
        const loginFormDiv = document.querySelector('.login-form');

        // Обработчик формы
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const inputLogin = loginInput.value;
            const inputPassword = passwordInput.value;

            // Ищем пользователя в массиве методом find
            const user = users.find(u => u.login === inputLogin && u.password === inputPassword);

            if (user) {
                // Успешная авторизация
                messageDiv.textContent = '✓ Авторизация успешна!';
                messageDiv.className = 'message success';

                // Показываем профиль через 1 секунду
                setTimeout(() => {
                    loginFormDiv.style.display = 'none';
                    profileDiv.style.display = 'block';
                    userNameDiv.textContent = user.name;
                    logoutBtn.style.display = 'block';
                }, 800);

                // Очищаем форму
                loginForm.reset();
            } else {
                // Ошибка авторизации
                messageDiv.textContent = '✗ Неправильный логин или пароль!';
                messageDiv.className = 'message error';
                passwordInput.value = '';
            }
        });

        // Обработчик выхода
        logoutBtn.addEventListener('click', function() {
            loginFormDiv.style.display = 'block';
            profileDiv.style.display = 'none';
            messageDiv.className = 'message';
            loginForm.reset();
            loginInput.focus();
        });