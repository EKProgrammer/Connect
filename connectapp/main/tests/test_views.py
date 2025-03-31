# Запуск тестов: python manage.py test main/tests/
from django.test import TestCase, Client
from django.urls import reverse
from django.contrib.auth import get_user_model

User = get_user_model()


class AuthViewsTest(TestCase):
    def setUp(self):
        self.client = Client()
        self.login_url = reverse("home")
        self.register_url = reverse("register")
        self.logout_url = reverse("logout")

        # Создание тестового пользователя с учетом кастомной модели
        self.user = User.objects.create_user(
            first_name="Тест",
            last_name="Пользователь",
            username="testuser",
            email="tests@example.com",
            password="TestPass123"
        )

    def test_index_redirects_authenticated_user(self):
        """Авторизованный пользователь должен быть перенаправлен на /feed/"""
        self.client.login(email="tests@example.com", password="TestPass123")
        response = self.client.get(self.login_url)
        self.assertRedirects(response, "/feed/")

    def test_index_login_valid_user(self):
        """Логин с правильными данными должен перенаправить на /feed/"""
        response = self.client.post(self.login_url, {"email": "tests@example.com", "password": "TestPass123"})
        self.assertRedirects(response, "/feed/")

    def test_index_login_invalid_user(self):
        """Логин с неверными данными должен возвращать ошибку"""
        response = self.client.post(self.login_url, {"email": "wrong@example.com", "password": "wrongpass"})
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "Неправильный логин или пароль")

    def test_register_redirects_authenticated_user(self):
        """Авторизованный пользователь при попытке регистрации перенаправляется на /feed/"""
        self.client.login(email="tests@example.com", password="TestPass123")
        response = self.client.get(self.register_url)
        self.assertRedirects(response, "/feed/")

    def test_register_valid_user(self):
        """Регистрация с корректными данными должна успешно создать пользователя"""
        response = self.client.post(
            self.register_url,
            {
                "first_name": "Новый",
                "last_name": "Пользователь",
                "username": "newuser",
                "email": "newuser@example.com",
                "password1": "NewPass123",
                "password2": "NewPass123",
            },
        )
        self.assertRedirects(response, "/person/")
        self.assertTrue(User.objects.filter(email="newuser@example.com").exists())

    def test_register_invalid_user(self):
        """Регистрация с несовпадающими паролями должна возвращать ошибку"""
        response = self.client.post(
            self.register_url,
            {
                "first_name": "Ошибка",
                "last_name": "Регистрации",
                "username": "failuser",
                "email": "failuser@example.com",
                "password1": "pass123",
                "password2": "otherpass",
            },
        )
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "Ошибка")  # Здесь уточни сообщение ошибки формы

    def test_logout_redirects_to_home(self):
        """Выход из системы должен перенаправлять на главную страницу"""
        self.client.login(email="tests@example.com", password="TestPass123")
        response = self.client.get(self.logout_url)
        self.assertRedirects(response, "/")
