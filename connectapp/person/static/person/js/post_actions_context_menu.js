'use strict'


document.addEventListener('DOMContentLoaded', function() {
    const menuToggles = document.querySelectorAll('.post-actions-toggle');

    menuToggles.forEach(toggle => {
        toggle.addEventListener('click', function(event) {
            event.stopPropagation(); // Предотвращаем всплытие события
            const menuList = this.nextElementSibling;
            menuList.style.display = menuList.style.display === 'block' ? 'none' : 'block';
        });
    });

    document.addEventListener('click', function(event) {
        const isMenuToggle = event.target.closest('.post-actions-toggle');
        const isMenuList = event.target.closest('.post-actions-list');

        if (!isMenuToggle && !isMenuList) {
            document.querySelectorAll('.post-actions-list').forEach(menu => {
                menu.style.display = 'none';
            });
        }
    });
});

function copyToClipboard(button) {
    const url = button.getAttribute('data-url');
    navigator.clipboard.writeText(url).then(() => {
    }).catch(err => {
        console.error('Ошибка при копировании: ', err);
    });
}