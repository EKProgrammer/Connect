document.addEventListener('click', function(event) {
    const button = event.target.closest('.like-btn');
    if (!button) {
        return;
    }
    const img = button.querySelector('img');

    if (button) {
        const postId = button.getAttribute('data-post-id');
        fetch('/person/service/like_post/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'X-CSRFToken': getCookie('csrftoken')
            },
            body: `id=${postId}`
        })
        .then(response => {
             if (response.status === 403) {
                // Пользователь не авторизован
                throw new Error('Для выполнения этого действия необходимо авторизоваться.');
            }
            if (!response.ok) {
                // Другие ошибки сервера
                throw new Error('Произошла ошибка при обработке запроса.');
            }
            return response.json();
        })
        .then(data => {
            button.classList.toggle('liked', data.liked);
            button.nextElementSibling.textContent = data.likes_count;
            img.src = data.liked
                ? '/static/person/img/like_red.svg'
                : '/static/person/img/like.svg';
        })
        .catch(error => {
            // Уведомляем пользователя об ошибке
            console.error(error.message);
        });
    }
});

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
