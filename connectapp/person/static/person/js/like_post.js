"use strict";

document.addEventListener('DOMContentLoaded', function() {
    const likeBtns = document.querySelectorAll('.like-btn');

    likeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const postId = this.dataset.postId;
            const likesCount = this.nextElementSibling;

            fetch('/person/like-post/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'X-CSRFToken': getCookie('csrftoken')
                },
                body: `id=${postId}`
            })
            .then(response => response.json())
            .then(data => {
                likesCount.textContent = data.likes_count;
                if (data.liked) {
                    this.classList.add('liked');
                } else {
                    this.classList.remove('liked');
                }
            });
        });
    });

    // Функция для получения CSRF-токена из куки
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
