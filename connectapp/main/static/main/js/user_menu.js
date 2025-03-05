document.addEventListener('DOMContentLoaded', function() {
    const userAvatar = document.querySelector('.user-avatar-wrapper');
    const userDropdown = document.querySelector('.user-dropdown');
    
    // Закрытие меню при клике вне его
    document.addEventListener('click', function(event) {
        if (!userAvatar.contains(event.target) && userDropdown.style.display === 'block') {
            userDropdown.style.display = 'none';
        }
    });
    
    // Альтернативный способ открытия/закрытия меню (если hover не подходит)
    userAvatar.addEventListener('click', function(event) {
        event.stopPropagation();
        if (userDropdown.style.display === 'block') {
            userDropdown.style.display = 'none';
        } else {
            userDropdown.style.display = 'block';
        }
    });
});