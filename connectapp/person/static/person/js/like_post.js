document.addEventListener('click', function(event) {
    const button = event.target.closest('.like-btn');
    if (button) {
        const postId = button.getAttribute('data-post-id');
        fetch('like_post/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'X-CSRFToken': getCookie('csrftoken')
            },
            body: `id=${postId}`
        })
        .then(response => response.json())
        .then(data => {
            button.classList.toggle('liked', data.liked);
            button.nextElementSibling.textContent = data.likes_count;
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
