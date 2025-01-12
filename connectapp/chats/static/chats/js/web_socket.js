const chatId = "{{ chat.id }}";
const userId = "{{ request.user.id }}";
const username = "{{ request.user.username }}";
const chatSocket = new WebSocket(
    'ws://' + window.location.host + '/ws/chat/' + chatId + '/'
);

// Обработка входящих сообщений
chatSocket.onmessage = function(e) {
    const data = JSON.parse(e.data);
    const chatMessages = document.getElementById('chat-messages');

    // Создаем новый элемент сообщения
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');
    if (data.user_id == userId) {
        messageElement.classList.add('message-sent');
        messageElement.innerHTML = `
            <div class="message-text">${data.message}</div>
            <span class="message-sent-time">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        `;
    } else {
        messageElement.classList.add('message-received');
        messageElement.innerHTML = `
            <div class="message-text">${data.message}</div>
            <span class="message-received-time">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        `;
    }

    // Добавляем сообщение в конец списка
    chatMessages.appendChild(messageElement);

    // Прокручиваем вниз
    chatMessages.scrollTop = chatMessages.scrollHeight;
};

// Обработка закрытия соединения
chatSocket.onclose = function(e) {
    console.error('Chat socket closed unexpectedly');
};

// Отправка сообщения через WebSocket
document.getElementById('chat-form').onsubmit = function(e) {
    e.preventDefault();
    const messageInput = document.getElementById('chat-message-input');
    const message = messageInput.value;

    if (message) {
        chatSocket.send(JSON.stringify({
            'message': message,
            'user_id': userId
        }));
        messageInput.value = '';
    }
};

// Отправка сообщения по нажатию Enter
document.getElementById('chat-message-input').onkeydown = function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        document.getElementById('chat-form').dispatchEvent(new Event('submit'));
    }
};
