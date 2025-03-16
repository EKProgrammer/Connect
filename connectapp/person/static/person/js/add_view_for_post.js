document.addEventListener('DOMContentLoaded', function() {
    // Функция для отправки запроса на увеличение просмотров
    function sendViewRequest(postId) {
        fetch(`/person/service/add_view/${postId}/`, {
            method: 'GET',
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
    }

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

    // Настройка Intersection Observer
    const intersectionOptions = {
        root: null, // Используем viewport как область отслеживания
        rootMargin: '0px',
        threshold: 1.0 // Срабатывает, когда весь элемент виден
    };

    const intersectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const postId = entry.target.getAttribute('data-post-id');
                sendViewRequest(postId);
                observer.unobserve(entry.target);
            }
        });
    }, intersectionOptions);

    // Функция для подключения IntersectionObserver к новым постам
    function observeNewPosts() {
        const newPosts = document.querySelectorAll('.post-item:not([data-observed])');
        newPosts.forEach(post => {
            intersectionObserver.observe(post);
            post.setAttribute('data-observed', 'true'); // Помечаем пост как наблюдаемый
        });
    }

    // Наблюдаем за изменениями в DOM, чтобы подключать IntersectionObserver к новым постам
    const mutationObserver = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                observeNewPosts();
            }
        }
    });

    // Начинаем наблюдение за контейнером с постами
    const postsContainer = document.querySelector('.posts-list');
    if (postsContainer) {
        mutationObserver.observe(postsContainer, {
            childList: true,
            subtree: true
        });
    }

    observeNewPosts();
});
