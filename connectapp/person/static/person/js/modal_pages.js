document.addEventListener('DOMContentLoaded', function() {
    const aiHelpButton = document.getElementById('activateAiChat');
    const backButton = document.getElementById('backButton');
    const postFormContent = document.getElementById('postFormContent');
    const aiChatContent = document.getElementById('aiChatContent');
    const postFormFooter = document.getElementById('postFormFooter');
    const backButtonContent = document.getElementById('aiChatFooter');

    // Обработчик для кнопки "Открыть чат ИИ"
    aiHelpButton.addEventListener('click', function() {
        // Скрываем форму создания поста и её футер
        postFormContent.style.display = 'none';
        postFormFooter.style.display = 'none';

        // Показываем чат с ИИ и кнопку "Назад"
        aiChatContent.style.display = '';
        backButtonContent.style.display = '';
    });

    // Обработчик для кнопки "Назад"
    backButton.addEventListener('click', function() {
        // Скрываем чат с ИИ и кнопку "Назад"
        aiChatContent.style.display = 'none';
        backButtonContent.style.display = 'none';

        // Показываем форму создания поста и её футер
        postFormContent.style.display = '';
        postFormFooter.style.display = '';
    });
});
