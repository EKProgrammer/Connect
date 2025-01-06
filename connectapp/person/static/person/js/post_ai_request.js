"use strict"

document.addEventListener('DOMContentLoaded', function() {
    const aiHelpButtons = document.querySelectorAll('[id^="aiHelpButton"]');

    aiHelpButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modalId = this.closest('.modal').id;
            const prompt_textarea = document.getElementById(`textMessageField`);
            const prompt = prompt_textarea.value;
            const post_textarea = document.querySelector(`#${modalId} textarea`);
            const post_text = post_textarea.value;

            // Показываем индикатор загрузки
            this.disabled = true;
            prompt_textarea.value = '';
            const chat = document.getElementById('aiChatContent');
            chat.insertAdjacentHTML('beforeend', `
                <div class="message message-sent">
                    <div class="message-text">${prompt}</div>
                </div>
                <div class="message message-received">
                    <div class="loader-wrapper">
                        <div class="loader"></div>
                    </div>
                </div>
            `)

            // Отправляем запрос к API
            fetch('/person/post_generation', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCookie('csrftoken')
                },
                body: JSON.stringify({ prompt: prompt, post_text: post_text })
            })
            .then(response => response.json())
            .then(data => {
                const loader = document.querySelector('.loader-wrapper');
                if (loader) loader.remove();
                // Обновляем текстовое поле с полученным результатом
                textarea.value = data.response;
                const chat = document.getElementById('aiChatContent');
                chat.insertAdjacentHTML('beforeend', `<div class="message-text">${data.response}</div>`);
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Произошла ошибка при обращении к AI. Пожалуйста, попробуйте еще раз.');
            })
            .finally(() => {
                // Возвращаем кнопку в исходное состояние
                this.disabled = false;
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
