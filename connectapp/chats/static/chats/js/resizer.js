document.addEventListener('DOMContentLoaded', function () {
    const resizer = document.getElementById('dragMe');
    const leftSide = resizer.previousElementSibling;

    let x = 0;
    let leftWidth = 0;

    const mouseDownHandler = function (e) {
        x = e.clientX;
        leftWidth = leftSide.getBoundingClientRect().width;

        document.addEventListener('mousemove', mouseMoveHandler);
        document.addEventListener('mouseup', mouseUpHandler);
    };

    const mouseMoveHandler = function (e) {
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
    };

    const mouseUpHandler = function () {
        document.removeEventListener('mousemove', mouseMoveHandler);
        document.removeEventListener('mouseup', mouseUpHandler);
    };

    resizer.addEventListener('mousedown', mouseDownHandler);
});
