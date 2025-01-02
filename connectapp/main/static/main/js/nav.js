"use strict"

document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.main-nav a');
    const indicator = document.querySelector('.nav-indicator');

    function setIndicator(el) {
        indicator.style.width = `${el.offsetWidth}px`;
        indicator.style.left = `${el.offsetLeft}px`;
    }

    navLinks.forEach(link => {
        link.addEventListener('mouseenter', (e) => {
            setIndicator(e.target);
        });

        link.addEventListener('mouseleave', () => {
            const activeLink = document.querySelector('.main-nav a.active');
            if (activeLink) {
                setIndicator(activeLink);
            } else {
                indicator.style.width = '0';
            }
        });

        if (link.classList.contains('active')) {
            setIndicator(link);
        }
    });

    // If no active link, hide the indicator
    if (!document.querySelector('.main-nav a.active')) {
        indicator.style.width = '0';
    }
});
