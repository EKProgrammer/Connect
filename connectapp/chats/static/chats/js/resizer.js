document.addEventListener('DOMContentLoaded', function () {
    const resizer = document.getElementById('dragMe');
    const leftSide = resizer.previousElementSibling;

    let x = 0;
    let leftWidth = 0;

    // Функция для установки cookie
    function setCookie(name, value, days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        const expires = "expires=" + date.toUTCString();
        document.cookie = name + "=" + value + ";" + expires + ";path=/; Secure; SameSite=Strict";
    }

    // Функция для получения cookie
    function getCookie(name) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }

    const savedWidth = getCookie('chatLeftWidth');
    if (savedWidth) {
        leftSide.style.width = savedWidth + 'px';
    }

    const mouseDownHandler = function(e) {
        x = e.clientX;
        leftWidth = leftSide.getBoundingClientRect().width;

        document.addEventListener('mousemove', mouseMoveHandler);
        document.addEventListener('mouseup', mouseUpHandler);
    };

    const mouseMoveHandler = function(e) {
        const dx = e.clientX - x;
        let newLeftWidth = leftWidth + dx;

        const minLeftWidth = 200;
        if (newLeftWidth < minLeftWidth) {
            newLeftWidth = minLeftWidth;
        }

        const container = document.querySelector(".container-chats");
        const computedStyle = window.getComputedStyle(container);
        const padding = parseFloat(computedStyle.paddingLeft);
        const containerWidth = container.clientWidth - 2 * padding;
        const resizerWidth = resizer.clientWidth;
        const minRightWidth = 400;
        if (newLeftWidth > containerWidth - minRightWidth - resizerWidth) {
            newLeftWidth = containerWidth - minRightWidth - resizerWidth;
        }

        leftSide.style.width = `${newLeftWidth}px`;

        // Сохранение ширины в cookie
        setCookie('chatLeftWidth', newLeftWidth, 7); // Сохраняем на 7 дней
    };

    const mouseUpHandler = function(e) {
        document.removeEventListener('mousemove', mouseMoveHandler);
        document.removeEventListener('mouseup', mouseUpHandler);
    };

    resizer.addEventListener('mousedown', mouseDownHandler);
});
