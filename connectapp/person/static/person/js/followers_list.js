document.addEventListener('DOMContentLoaded', function() {
    const followersCount = document.getElementById('followersCount');
    const followersModal = new bootstrap.Modal(document.getElementById('followersModal'));
    const followersList = document.querySelector('.followers-list');

    followersCount.addEventListener('click', function() {
        fetchFollowers();
    });

    function fetchFollowers() {
        fetch('/person/service/followers/')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                followersList.innerHTML = '';

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
                        followersList.appendChild(userElement);
                    });
                } else {
                    const userElement = document.createElement('div');
                    userElement.innerHTML = `<span style="font-size: 1.25rem;">У вас нет подписчиков</span>`;
                    followersList.appendChild(userElement);
                }
                followersModal.show();
            })
            .catch(error => {
                console.error('Error:', error);
                followersList.innerHTML = '<p>Произошла ошибка при загрузке списка подписчиков.</p>';
                followersModal.show();
            });
    }
});
