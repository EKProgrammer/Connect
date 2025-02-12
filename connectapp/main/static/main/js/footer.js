"use strict"

document.addEventListener('DOMContentLoaded', function() {
    function updateFooterPosition() {
        const mainContainer = document.querySelector('main');
        const footer = document.querySelector('footer');

        const mainStyles = getComputedStyle(mainContainer);
        const marginLeft = parseInt(mainStyles.marginLeft, 10);

        footer.style.left = `${mainContainer.clientWidth + marginLeft + 30}px`;
    }

    updateFooterPosition();

    window.addEventListener('resize', updateFooterPosition);
});

