document.addEventListener('DOMContentLoaded', function() {
    const aiHelpButton = document.getElementById('aiHelpButton');
    const postTextarea = document.querySelector('#create-post-modal-form textarea');

    aiHelpButton.addEventListener('click', function() {
        const currentText = postTextarea.value;

        // Показываем индикатор загрузки
        aiHelpButton.disabled = true;
        aiHelpButton.setAttribute('data', 'Загрузка...');

        // Отправляем запрос к API
        fetch('/person/api/chatgpt/', {
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
            postTextarea.value = data.response;
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Произошла ошибка при обращении к AI. Пожалуйста, попробуйте еще раз.');
        })
        .finally(() => {
            // Возвращаем кнопку в исходное состояние
            aiHelpButton.disabled = false;
            aiHelpButton.setAttribute('data', 'Помощь AI');
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
