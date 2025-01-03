"use strict"

document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.main-nav-link');
    const indicator = document.querySelector('.nav-indicator');

    function setIndicator(el) {
        indicator.style.width = `${el.offsetWidth}px`;
        indicator.style.left = `${el.offsetLeft}px`;
    }

    navLinks.forEach(link => {
        if (link.classList.contains('active')) {
            setIndicator(link);
        }
    });

    // Если нет активной ссылки, прячем индикатор
    if (!document.querySelector('.main-nav-link.active')) {
        indicator.style.width = '0';
    }
});
