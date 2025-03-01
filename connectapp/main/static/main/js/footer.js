"use strict"

document.addEventListener('click', function(event) {
    const footer = document.getElementById('verticalFooter');
    const button = document.getElementById('toggle-footer-btn');

    // Проверяем, был ли клик сделан вне кнопки и футера
    if (!button.contains(event.target) && !footer.contains(event.target)) {
        footer.style.display = 'none';
    }
});

document.getElementById('toggle-footer-btn').addEventListener('click', function(event) {
    const footer = document.getElementById('verticalFooter');

    if (footer.style.display === 'none' || footer.style.display === '') {
        footer.style.display = 'block';
    } else {
        footer.style.display = 'none';
    }

    // Останавливаем всплытие события, чтобы клик по кнопке не скрывал футер
    event.stopPropagation();
});
