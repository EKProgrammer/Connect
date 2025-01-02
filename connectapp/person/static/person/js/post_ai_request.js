"use strict"

document.addEventListener('DOMContentLoaded', function() {
    const aiHelpButtons = document.querySelectorAll('[id^="aiHelpButton"]');

    aiHelpButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modalId = this.closest('.modal').id;
            const textarea = document.querySelector(`#${modalId} textarea`);
            const currentText = textarea.value;

            // Показываем индикатор загрузки
            this.disabled = true;
            this.querySelector('img').classList.add('rotate');

            // Отправляем запрос к API
            fetch('/person/post_generation', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCookie('csrftoken')
                },
                body: JSON.stringify({ prompt: currentText })
            })
            .then(response => response.json())
            .then(data => {
                // Обновляем текстовое поле с полученным результатом
                textarea.value = data.response;
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Произошла ошибка при обращении к AI. Пожалуйста, попробуйте еще раз.');
            })
            .finally(() => {
                // Возвращаем кнопку в исходное состояние
                this.disabled = false;
                this.querySelector('img').classList.remove('rotate');
            });
        });
    });

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
