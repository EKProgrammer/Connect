"use strict"

// Функция для изменения высоты текстового поля
function adjustTextareaHeight(textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;

    if (textarea.scrollHeight > 150) {
        textarea.style.height = '150px';
        textarea.style.overflowY = 'auto'; // Включаем скроллбар при достижении 150px
    } else {
        textarea.style.overflowY = 'hidden'; // Скрываем скроллбар, если меньше 150px
    }
}

const textarea = document.getElementById('textMessageField');
textarea.addEventListener('input', function() {
    adjustTextareaHeight(this);
});
