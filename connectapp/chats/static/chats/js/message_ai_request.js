"use strict"

document.addEventListener('DOMContentLoaded', function () {
    const aiHelpButton = document.getElementById('aiHelpButton');

    if (aiHelpButton) {
        aiHelpButton.addEventListener('click', function () {
            const textarea = document.querySelector('.text-message-field');
            const currentText = textarea.value;
            const chatId = this.getAttribute('data-chat-id');

            // Показываем индикатор загрузки
            this.disabled = true;
            this.querySelector('img').classList.add('rotate');

            // Отправляем запрос к API
            fetch('/chats/service/message_generation', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCookie('csrftoken')
                },
                body: JSON.stringify({ prompt: currentText, chat_id: chatId })
            })
            .then(response => response.json())
            .then(data => {
                // Обновляем текстовое поле с полученным результатом
                textarea.value = data.response;
                adjustTextareaHeight(textarea);
            })
            .catch(error => {
                console.error('Error:', error);
                showError('Произошла ошибка при обращении к AI. Пожалуйста, попробуйте еще раз.');
            })
            .finally(() => {
                // Возвращаем кнопку в исходное состояние
                this.disabled = false;
                this.querySelector('img').classList.remove('rotate');
            });
        });
    }

    // Функция для получения CSRF токена из cookies
    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
});
