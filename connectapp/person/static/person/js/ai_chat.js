"use strict"


function checkAiUsage() {
    return fetch('service/could_use_ai/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken'),
        },
    })
    .then(response => response.json())
    .then(data => data.could_use_ai);
}


function drop_scrollbar(postId) {
    const chatMessages = document.getElementById(`aiChatContent${postId}`);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}


document.addEventListener('click', async function(event) {
    const aiHelpButton = event.target.closest('[id^="aiHelpButton"]');
    if (aiHelpButton) {
        const postId = aiHelpButton.id.replace('aiHelpButton', '');
        const prompt_textarea = document.getElementById(`textMessageField${postId}`);
        const prompt = prompt_textarea.value;
        const backButton = document.getElementById(`backButton${postId}`);
        const chat = document.getElementById(`aiChatContent${postId}`);

        if (!prompt) {
            showWarning("Введите запрос ИИ");
            return;
        }

        const canUseAi = await checkAiUsage();
        if (!canUseAi) {
            chat.insertAdjacentHTML('beforeend', `
                <div class="message">        
                    <div class="message-part ai-help-error">
                        <div style="color: #ff4444;">Предупреждение</div>
                        <div class="message-text">Лимит запросов за сутки исчерпан. Для неограниченного иcпользования ИИ перейдите на <a href="/subscription">страницу оформления подписки</a>.</div>
                    </div>
                </div>
            `);
            drop_scrollbar(postId);
            return;
        }

        const current_post_message = document.querySelector(`#currentPostVersion${postId} .message-text`);
        let current_post_text;
        if (current_post_message) {
            current_post_text = current_post_message.textContent;
            document.getElementById(`currentPostVersion${postId}`).remove();
        } else {
            current_post_text = '';
        }

        // Показываем индикатор загрузки
        const aiHelpImg = aiHelpButton.querySelector('img');
        aiHelpImg.src = '/static/person/img/send_disabled.svg';
        aiHelpButton.disabled = true;
        const backImg = backButton.querySelector('img');
        backImg.src = '/static/person/img/back_arrow_disabled.svg';
        backButton.disabled = true;
        prompt_textarea.value = '';

        if (current_post_text) {
            chat.insertAdjacentHTML('beforeend', `
                <div class="message">
                    <div class="message-part post-response" style="border-radius: 10px 10px 0 0;">
                        <div style="color: #4a90e2;">Текст поста</div>
                        <div class="message-text">${current_post_text}</div>
                        <button type="button" class="copy-button copy-post-button">
                             <img src="/static/person/img/copy.svg" alt="Копировать пост" title="Копировать пост">
                        </button>
                    </div>
                    <div class="message-part user-prompt">
                        <div style="color: #cf28b9;">Запрос</div>
                        <div class="message-text">${prompt}</div>
                    </div>
                    <div class="message-part ai-answer">
                        <div class="loader-wrapper">
                            <div class="loader"></div>
                        </div>
                    </div>
                </div>
            `);
        } else {
            chat.insertAdjacentHTML('beforeend', `
                <div class="message">
                    <div class="message-part user-prompt" style="border-radius: 10px 10px 0 0;">
                        <div style="color: #cf28b9; border-radius: 10px 10px 0 0;">Запрос</div>
                        <div class="message-text">${prompt}</div>
                    </div>
                    <div class="message-part ai-answer">
                        <div class="loader-wrapper">
                            <div class="loader"></div>
                        </div>
                    </div>
                </div>
            `);
        }
        drop_scrollbar(postId);

        // Отправляем запрос к API
        const eventSource = new EventSource(`/person/service/post_generation?prompt=${encodeURIComponent(prompt)}&post_text=${encodeURIComponent(current_post_text)}`);

        const loader = document.querySelector('.loader-wrapper');
        if (loader) loader.remove();

        const messageBlocks = document.querySelectorAll('.message');
        const lastMessageBlock = messageBlocks[messageBlocks.length - 1];
        const aiAnswerBlock = lastMessageBlock.querySelector('.message-part.ai-answer');
        aiAnswerBlock.insertAdjacentHTML('beforeend', `
            <div style="color: #888888">Ответ ИИ</div>
            <div class="message-text"></div>
            <button type="button" class="copy-button copy-answer-button">
                 <img src="/static/person/img/copy.svg" alt="Копировать пост" title="Копировать пост">
            </button>
        `);

        eventSource.onmessage = function (event) {
            const data = JSON.parse(event.data);
            const messageText = aiAnswerBlock.querySelector('.message-text');
            // Добавляем текст без преобразования в HTML
            messageText.textContent += data.response;
            drop_scrollbar(postId);
        };

        eventSource.addEventListener('end', function () {
            // Генерация текста завершена
            eventSource.close();
            // Возвращаем кнопку в исходное состояние
            aiHelpImg.src = '/static/person/img/send.svg';
            aiHelpButton.disabled = false;
            backImg.src = '/static/person/img/back_arrow.svg';
            backButton.disabled = false;
        });

        eventSource.onerror = function () {
            eventSource.close();
            showError('Произошла ошибка при обращении к ИИ. Пожалуйста, попробуйте еще раз.');
            // Возвращаем кнопки в исходное состояние
            aiHelpImg.src = '/static/person/img/send.svg';
            aiHelpButton.disabled = false;
            backImg.src = '/static/person/img/back_arrow.svg';
            backButton.disabled = false;
        };
    }
});


function handleCopyButtonClick(button) {
    let content = '';
    if (button.classList.contains('copy-post-button')) {
        const postTextElement = button.closest('.message').querySelector('.message-part.post-response .message-text');
        content = postTextElement ? postTextElement.textContent : '';
    } else if (button.classList.contains('copy-answer-button')) {
        const answerTextElement = button.closest('.message').querySelector('.message-part.ai-answer .message-text');
        // Получаем текстовое содержимое, а не HTML
        content = answerTextElement ? answerTextElement.textContent : '';
    }

    const modal = document.querySelector('.modal.show')
    const post_textarea = document.querySelector(`#${modal.id} .modal-textarea`);
    post_textarea.value = content;

    let postCountSpan = modal.querySelector('.post-char-count');
    updateCharCount(post_textarea, postCountSpan, 5000);

    const postId = modal.id.replace('createPostModal', '').replace('editPostModal', '');
    update_last_message(post_textarea, postId);
    drop_scrollbar(postId);
}


function update_last_message(post_textarea, postId) {
    let current_post_message = document.getElementById(`currentPostVersion${postId}`);
    let chat = document.getElementById(`aiChatContent${postId}`);
    if (current_post_message) {
        current_post_message.remove();
        if (post_textarea.value) {
            const message_text = current_post_message.querySelector('.message-text');
            message_text.textContent = post_textarea.value;
        }
    }
    if (post_textarea.value) {
        chat.insertAdjacentHTML('beforeend', `
            <div class="message" id="currentPostVersion${postId}">
                <div class="message-part post-response" style="border-radius: 10px 10px 10px 10px;">
                <div style="color: #4a90e2;">Текст поста</div>
                <div class="message-text">${post_textarea.value}</div>
            </div>
        `);
    }
}


document.addEventListener('click', function(event) {
    const copyButton = event.target.closest('.copy-button');
    // Проверяем, была ли нажата кнопка .copy-button
    if (copyButton) {
        handleCopyButtonClick(copyButton);
    }
});
