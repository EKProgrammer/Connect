// Держим скролбар в нижнем положении при обновлении страницы
document.addEventListener("DOMContentLoaded", function() {
    var chatMessages = document.getElementById("chat-messages");
    if (chatMessages) {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
});