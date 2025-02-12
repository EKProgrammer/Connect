"use strict"

document.addEventListener('DOMContentLoaded', function() {
    let lastScrollTop = 0;
    const header = document.querySelector('.custom-header');
    const scrollThreshold = 100; // Минимальное расстояние прокрутки для срабатывания

    window.addEventListener('scroll', function() {
        let currentScrollTop = window.scrollY || document.documentElement.scrollTop;

        if (currentScrollTop > lastScrollTop && currentScrollTop > scrollThreshold) {
            // Прокрутка вниз
            header.classList.add('hidden');
        } else {
            // Прокрутка вверх
            header.classList.remove('hidden');
        }
        lastScrollTop = currentScrollTop <= 0 ? 0 : currentScrollTop; // Для мобильных или при отрицательной прокрутке
    }, false);
});

document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.main-nav-link');
    const indicator = document.querySelector('.nav-indicator');
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.querySelector('.main-nav');

    function setIndicator(el) {
        indicator.style.width = `${el.offsetWidth}px`;
        indicator.style.left = `${el.offsetLeft}px`;
        if (window.innerWidth < 600) {
            indicator.style.top = `${el.offsetTop + el.offsetHeight + 4}px`;
        } else {
            indicator.style.top = '';
        }
    }

    function updateIndicator() {
        navLinks.forEach(link => {
            if (link.classList.contains('active')) {
                setIndicator(link);
            }
        });
    }

    window.addEventListener('load', function() {
        updateIndicator();
    });
    window.addEventListener('resize', function() {
        updateIndicator();
    });

    // Если нет активной ссылки, прячем индикатор
    if (!document.querySelector('.main-nav-link.active')) {
        indicator.style.width = '0';
    }

    // Открытие бургер-меню
    menuToggle.addEventListener('click', function() {
        mainNav.classList.toggle('active');
        updateIndicator();
    });

    // Закрытие меню при клике вне навигации
    document.addEventListener('click', function (event) {
        if (!event.target.closest('.menu-toggle') && !event.target.closest('.main-nav')) {
            mainNav.classList.remove('active');
        }
    });
});
