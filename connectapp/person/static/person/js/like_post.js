"use strict";


document.addEventListener('click', function(event) {
    const like_btn = event.target.closest('.like-btn');
    if (like_btn) {
        console.log(like_btn);
        const postId = like_btn.dataset.postId;
        const likesCount = like_btn.nextElementSibling;

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
                like_btn.classList.add('liked');
            } else {
                like_btn.classList.remove('liked');
            }
        });
    }
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
