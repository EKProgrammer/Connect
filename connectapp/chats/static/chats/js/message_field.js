const textarea = document.querySelector('textarea');

textarea.addEventListener('input', function() {
    this.style.height = 'auto';
    // Устанавливаем новую высоту, исходя из контента
    this.style.height = `${this.scrollHeight}px`;

    if (this.scrollHeight > 150) {
        this.style.height = '150px';
        this.style.overflowY = 'auto'; // Включаем скроллбар при достижении 150px
    } else {
        this.style.overflowY = 'hidden'; // Скрываем скроллбар, если меньше 150px
    }
});
