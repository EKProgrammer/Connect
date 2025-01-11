"use strict"


// Обработчик для кнопки "Открыть чат ИИ"
document.addEventListener('click', function(event) {
    const activateAiChatButton = event.target.closest('[id^="activateAiChat"]');
    if (activateAiChatButton) {
        const modalId = activateAiChatButton.closest('.modal').id;
        const postId = modalId.replace('createPostModal', '').replace('editPostModal', '');
        const postFormContent = document.querySelector(`#postFormContent${postId}`);
        const aiChatContent = document.querySelector(`#aiChatContent${postId}`);
        const postFormFooter = document.querySelector(`#postFormFooter${postId}`);
        const aiChatFooter = document.querySelector(`#aiChatFooter${postId}`);

        const post_textarea = document.querySelector(`#${modalId} .modal-textarea`);
        update_last_message(post_textarea, postId);

        // Скрываем форму создания поста и её футер
        postFormContent.style.display = 'none';
        postFormFooter.style.display = 'none';

        // Показываем чат с ИИ и кнопку "Назад"
        aiChatContent.style.display = '';
        aiChatFooter.style.display = '';
    }
});


// Обработчик для кнопки "Назад"
document.addEventListener('click', function(event) {
    const backButton = event.target.closest('[id^="backButton"]');
    if (backButton) {
        const modalId = backButton.closest('.modal').id;
        const postId = modalId.replace('createPostModal', '').replace('editPostModal', '');
        const postFormContent = document.querySelector(`#postFormContent${postId}`);
        const aiChatContent = document.querySelector(`#aiChatContent${postId}`);
        const postFormFooter = document.querySelector(`#postFormFooter${postId}`);
        const aiChatFooter = document.querySelector(`#aiChatFooter${postId}`);

        // Скрываем чат с ИИ и кнопку "Назад"
        aiChatContent.style.display = 'none';
        aiChatFooter.style.display = 'none';

        // Показываем форму создания поста и её футер
        postFormContent.style.display = '';
        postFormFooter.style.display = '';
    }
});


// Изменение размера текстового поля для чата с ИИ
document.addEventListener('input', function(event) {
    const text_message_field = event.target.closest('[id^="textMessageField"]');
    if (text_message_field) {
        text_message_field.style.height = 'auto';
        text_message_field.style.height = `${text_message_field.scrollHeight}px`;

        if (text_message_field.scrollHeight > 150) {
            text_message_field.style.height = '150px';
            text_message_field.style.overflowY = 'auto'; // Включаем скроллбар при достижении 150px
        } else {
            text_message_field.style.overflowY = 'hidden'; // Скрываем скроллбар, если меньше 150px
        }
    }
});
