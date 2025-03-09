'use strict'


document.addEventListener('click', function(event) {
    // Проверяем, был ли клик по кнопке .post-actions-toggle
    const toggle = event.target.closest('.post-actions-toggle');
    if (toggle) {
        event.stopPropagation(); // Предотвращаем всплытие события
        const menuList = toggle.nextElementSibling;
        menuList.style.display = menuList.style.display === 'block' ? 'none' : 'block';
    } else {
        // Закрываем все открытые меню, если клик был вне кнопки
        const openMenus = document.querySelectorAll('.post-actions-list[style="display: block;"]');
        openMenus.forEach(menu => {
            menu.style.display = 'none';
        });
    }
});
