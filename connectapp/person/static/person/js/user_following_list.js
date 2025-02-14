document.addEventListener('DOMContentLoaded', function() {
    const followingCount = document.getElementById('userFollowingCount');
    const followingModal = new bootstrap.Modal(document.getElementById('UserFollowingModal'));
    const followingList = document.querySelector('.user-following-list');

    if (followingCount) {
        followingCount.addEventListener('click', function() {
            const username = this.getAttribute('data-username');
            if (username) {
                fetchFollowing(username);
            } else {
                console.error('Username not found');
            }
        });
    }

    function fetchFollowing(username) {
        fetch(`/person/service/following/${username}/`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                followingList.innerHTML = '';

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
                        followingList.appendChild(userElement);
                    });
                } else {
                    const userElement = document.createElement('div');
                    userElement.innerHTML = `<span style="font-size: 1.25rem;">Пользователь ни на кого не подписан</span>`;
                    followingList.appendChild(userElement);
                }
                followingModal.show();
            })
            .catch(error => {
                console.error('Error:', error);
                followingList.innerHTML = '<p>Произошла ошибка при загрузке списка подписок.</p>';
                followingModal.show();
            });
    }
});
