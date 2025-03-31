# Запуск тестов: python manage.py test person/tests/
from django.test import TestCase, Client
from django.urls import reverse
from django.core.files.uploadedfile import SimpleUploadedFile
from django.utils.timezone import now

from person.models import Post, PostImage, Comment
from users.models import User


class PostViewTest(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(username='testuser', password='password123')
        self.client.login(username='testuser', password='password123')

        self.post = Post.objects.create(user=self.user, text="Исходный текст", date=now())

        with open("./person/tests/test_image.png", "rb") as img:
            self.image = SimpleUploadedFile(
                name="test_image.png",
                content=img.read(),
                content_type="image/png"
            )

    def test_create_post(self):
        """Тест создания поста"""
        response = self.client.post(reverse('create_post'), {
            'text': 'Новый пост',
            'images': [self.image],
        }, format='multipart')

        self.assertEqual(response.status_code, 302)  # Проверяем редирект
        self.assertTrue(Post.objects.filter(text='Новый пост').exists())  # Проверяем, что пост создан

        post = Post.objects.get(text='Новый пост')
        self.assertEqual(post.user, self.user)  # Проверяем, что пост принадлежит пользователю
        self.assertTrue(PostImage.objects.filter(post=post).exists())  # Проверяем, что изображение загружено

    def test_edit_post(self):
        """Тест редактирования поста"""
        response = self.client.post(reverse('edit_post', args=[self.post.id]), {
            'text': 'Обновленный текст',
        })

        self.assertEqual(response.status_code, 302)  # Проверяем редирект
        self.post.refresh_from_db()
        self.assertEqual(self.post.text, 'Обновленный текст')  # Проверяем обновление текста

    def test_edit_post_with_images(self):
        """Тест редактирования поста с загрузкой изображений"""
        response = self.client.post(reverse('edit_post', args=[self.post.id]), {
            'text': 'Обновленный текст с фото',
            'images': [self.image],
        }, format='multipart')

        self.assertEqual(response.status_code, 302)  # Проверяем редирект
        self.post.refresh_from_db()
        self.assertEqual(self.post.text, 'Обновленный текст с фото')
        self.assertTrue(PostImage.objects.filter(post=self.post).exists())  # Проверяем, что изображение добавилось

    def test_delete_post(self):
        """Тест удаления поста"""
        response = self.client.post(reverse('delete_post', args=[self.post.id]))

        self.assertEqual(response.status_code, 302)  # Проверяем редирект
        self.assertFalse(Post.objects.filter(id=self.post.id).exists())  # Убеждаемся, что пост удален

    def test_like_post(self):
        """Тест для лайка поста"""
        response = self.client.post(reverse('like_post'), {'id': self.post.id})

        self.assertEqual(response.status_code, 200)  # Проверяем, что запрос успешен
        self.assertJSONEqual(response.content, {'likes_count': 1, 'liked': True})  # Проверяем, что лайк был поставлен
        self.post.refresh_from_db()
        self.assertIn(self.user, self.post.likes.all())  # Проверяем, что пользователь поставил лайк

    def test_unlike_post(self):
        """Тест для убирания лайка с поста"""
        # Сначала ставим лайк
        self.post.likes.add(self.user)

        response = self.client.post(reverse('like_post'), {'id': self.post.id})

        self.assertEqual(response.status_code, 200)  # Проверяем, что запрос успешен
        self.assertJSONEqual(response.content, {'likes_count': 0, 'liked': False})  # Проверяем, что лайк был убран
        self.post.refresh_from_db()
        self.assertNotIn(self.user, self.post.likes.all())  # Проверяем, что лайк убран

    def test_invalid_post_id(self):
        """Тест для случая с неверным post_id"""
        response = self.client.post(reverse('like_post'), {'id': 'invalid'})

        self.assertEqual(response.status_code, 400)  # Проверяем, что ошибка 400 (неверный ID)
        self.assertJSONEqual(response.content, {'error': 'Invalid post ID'})  # Проверяем правильный ответ


class AiTest(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(username='testuser', password='password123')
        self.client.login(username='testuser', password='password123')

        self.post = Post.objects.create(user=self.user, text="Тестовый пост", date=now())

    # Тесты для could_use_ai
    def test_no_subscription_and_no_left_requests(self):
        """Тест, если нет подписки и оставшихся попыток"""
        self.user.has_subscription = False
        self.user.ai_help_requests_left = 0
        self.user.save()

        response = self.client.get('/person/service/could_use_ai/')
        self.assertEqual(response.status_code, 200)
        self.assertJSONEqual(response.content, {"could_use_ai": False})  # Проверяем, что ответ "False", так как нет попыток

    def test_no_subscription_and_left_requests(self):
        """Тест, если нет подписки и есть оставшиеся попытки"""
        self.user.has_subscription = False
        self.user.ai_help_requests_left = 2
        self.user.save()

        response = self.client.get('/person/service/could_use_ai/')

        self.assertEqual(response.status_code, 200)
        self.assertJSONEqual(response.content, {"could_use_ai": True})  # Проверяем, что ответ "True", так как есть оставшиеся попытки

    def test_subscription_available(self):
        """Тест для пользователя с подпиской"""
        self.user.has_subscription = True
        self.user.save()

        response = self.client.get('/person/service/could_use_ai/')

        self.assertEqual(response.status_code, 200)
        self.assertJSONEqual(response.content, {"could_use_ai": True})  # Пользователь с подпиской всегда может использовать AI


class CommentTests(TestCase):
    def setUp(self):
        self.client = Client()

        # Создание тестового пользователя с учетом кастомной модели
        self.user = User.objects.create_user(
            first_name="Тест",
            last_name="Пользователь",
            username="testuser",
            email="tests@example.com",
            password="TestPass123"
        )
        self.client.login(email='tests@example.com', password='TestPass123')

        self.post = Post.objects.create(user=self.user, text="Тестовый пост", date=now())
        self.comment = Comment.objects.create(post=self.post, user=self.user, content='Тестовый комментарий')

    def test_create_comment(self):
        """Тест на создание нового комментария к посту."""
        response = self.client.post(reverse('post_detail', args=[self.post.id]), {
            'content': 'Новый тестовый комментарий'
        })
        self.assertEqual(response.status_code, 302)  # Проверяем редирект
        self.assertTrue(Comment.objects.filter(content='Новый тестовый комментарий').exists())

    def test_delete_comment(self):
        """Тест на удаление существующего комментария автором."""
        response = self.client.post(reverse('delete_comment', args=[self.comment.id]))
        self.assertEqual(response.status_code, 200)
        self.assertFalse(Comment.objects.filter(id=self.comment.id).exists())

    def test_edit_comment(self):
        """Тест на редактирование комментария его автором."""
        response = self.client.post(reverse('edit_comment', args=[self.comment.id]), {
            'content': 'Отредактированный тестовый комментарий'
        }, HTTP_X_REQUESTED_WITH='XMLHttpRequest')
        self.assertEqual(response.status_code, 200)
        self.comment.refresh_from_db()
        self.assertEqual(self.comment.content, 'Отредактированный тестовый комментарий')

    def test_edit_comment_not_author(self):
        """Тест на попытку редактирования комментария другим пользователем."""
        other_user = User.objects.create_user(username='otheruser', email='otheruser@example.com',
                                              password='otherpassword')
        self.client.login(email='otheruser@example.com', password='otherpassword')
        response = self.client.post(reverse('edit_comment', args=[self.comment.id]), {
            'content': 'Взломанный комментарий'
        })
        self.assertEqual(response.status_code, 200)
        self.comment.refresh_from_db()
        self.assertNotEqual(self.comment.content, 'Взломанный комментарий')
