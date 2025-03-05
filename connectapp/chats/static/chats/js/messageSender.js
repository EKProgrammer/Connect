// Отправляем форму при нажатии Enter
document.addEventListener("DOMContentLoaded", function () {
    const textArea = document.querySelector('.text-message-field');
    if (!textArea) {
        return;
    }
    const form = textArea.closest('form');
    textArea.addEventListener('keydown', function (event) {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            form.submit();
        }
    });
});
