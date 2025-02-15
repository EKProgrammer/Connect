document.addEventListener('DOMContentLoaded', function() {
    const contextMenu = document.getElementById('likeContextMenu');
    const showLikedUsers = document.getElementById('showLikedUsers');
    const likedUsersModal = new bootstrap.Modal(document.getElementById('likedUsersModal'));
    const likedUsersList = document.querySelector('.liked-users-list');

    // Обработчик правого клика на кнопку лайка
    document.addEventListener('contextmenu', function(e) {
        const target = e.target.closest('.like-btn');
        if (target) {
            e.preventDefault();
            const postId = target.getAttribute('data-post-id');
            showContextMenu(e.pageX, e.pageY, postId);
        }
    });

    // Скрыть контекстное меню при клике вне его
    document.addEventListener('click', function() {
        hideContextMenu();
    });

    // Обработчик клика на пункт "Посмотреть список лайкнувших"
    showLikedUsers.addEventListener('click', function() {
        const postId = contextMenu.getAttribute('data-post-id');
        fetchLikedUsers(postId);
    });

    function showContextMenu(x, y, postId) {
        contextMenu.style.display = 'block';
        contextMenu.style.left = `${x}px`;
        contextMenu.style.top = `${y}px`;
        contextMenu.setAttribute('data-post-id', postId);
    }

    function hideContextMenu() {
        contextMenu.style.display = 'none';
    }

    function fetchLikedUsers(postId) {
        fetch(`/person/service/liked-users/${postId}/`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                likedUsersList.innerHTML = '';

                if (data && data.length > 0) {
                    data.forEach(user => {
                        const userElement = document.createElement('div');
                        userElement.classList.add('user-item');
                        userElement.innerHTML = `
                            <a href="/person/${user.username}/" class="user-link">
                                <img src="${user.avatar_url}" alt="${user.first_name}" class="user-avatar">
                                <div class="user-info">
                                    <span class="user-name">${user.first_name} ${user.last_name}</span>
                                    <span class="user-username">@${user.username}</span>
                                </div>
                            </a>
                        `;
                        likedUsersList.appendChild(userElement);
                    });
                } else {
                    const userElement = document.createElement('div');
                    userElement.innerHTML = `<span style="font-size: 1.25rem;">Список пуст</span>`;
                    likedUsersList.appendChild(userElement);
                }
                likedUsersModal.show();
            })
            .catch(error => {
                console.error('Error:', error);
                likedUsersList.innerHTML = '<p>Произошла ошибка при загрузке списка пользователей.</p>';
                likedUsersModal.show();
            });
    }
});
