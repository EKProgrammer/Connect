function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== "") {
        const cookies = document.cookie.split(";");
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + "=")) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

document.addEventListener("DOMContentLoaded", () => {
    const messagesContainer = document.getElementById("chat-messages");
    let currentMessage = null;
    const contextMenu = document.getElementById("context-menu");
    messagesContainer.addEventListener("contextmenu", (event) => {
        event.preventDefault();
        const target = event.target.closest(".message-sent");
        if (!target) return;

        currentMessage = target;
        contextMenu.style.top = `${event.pageY}px`;
        contextMenu.style.left = `${event.pageX}px`;
        contextMenu.style.display = "block";
    });

    document.addEventListener("click", (event) => {
        if (!event.target.closest("#context-menu")) {
            contextMenu.style.display = "none";
        }
    });

    document.getElementById("delete-message-btn").addEventListener("click", async () => {
        if (!currentMessage) return;
        const messageId = currentMessage.dataset.messageId;
        if (!confirm("Вы уверены, что хотите удалить это сообщение?")) return;

        try {
            const response = await fetch(`/chats/service/delete_message/${messageId}/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": getCookie("csrftoken"),
                },
                body: JSON.stringify({})
            });
            if (response.ok) {
                currentMessage.remove();
                contextMenu.style.display = "none";
                currentMessage = null;
            } else {
                alert("Ошибка удаления сообщения.");
            }
        } catch (error) {
            console.error("Ошибка при удалении сообщения:", error);
            alert("Произошла ошибка. Попробуйте позже.");
        }
    });

    document.getElementById("edit-message-btn").addEventListener("click", () => {
        const submitHandler = async (event) => {
            event.preventDefault();
            const newContent = textarea.value.trim();
            if (newContent === originalText) {
                alert("Изменений не внесено.");
                textarea.value = "";
                newSubmitButton.innerHTML = `<img src="/static/chats/img/send.svg" height="30px" width="30px">`;
                currentMessage = null;
                newSubmitButton.removeEventListener("click", submitHandler);
                return;
            }
    
            try {
                const response = await fetch("/chats/service/edit_message/", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "X-CSRFToken": getCookie("csrftoken"),
                    },
                    body: JSON.stringify({ message_id: messageId, new_content: newContent }),
                });
    
                if (response.ok) {
                    const result = await response.json();
                    messageText.textContent = result.new_content;
                    textarea.value = "";
                    adjustTextareaHeight(textarea);
                    newSubmitButton.innerHTML = `<img src="/static/chats/img/send.svg" height="30px" width="30px">`;
                    currentMessage = null;
                    newSubmitButton.removeEventListener("click", submitHandler);
                    location.reload();
                } else {
                    alert("Ошибка редактирования сообщения.");
                }
            } catch (error) {
                console.error("Ошибка при редактировании сообщения:", error);
                alert("Произошла ошибка. Попробуйте позже.");
            }
        };
        if (!currentMessage) return;
        const messageText = currentMessage.querySelector(".message-text");
        const messageId = currentMessage.dataset.messageId;
        const textarea = document.querySelector(".text-message-field");
        const submitButton = document.querySelector(".input-area-buttons button[type='submit']");
        textarea.value = messageText.textContent.trim();
        submitButton.innerHTML = `<img src="/static/chats/img/edit_ok.svg" height="30px" width="30px">`;
        const originalText = textarea.value.trim();
        const newSubmitButton = submitButton.cloneNode(true);
        submitButton.parentNode.replaceChild(newSubmitButton, submitButton);
        newSubmitButton.addEventListener("click", submitHandler);
        adjustTextareaHeight(textarea);
        newSubmitButton.addEventListener("click", submitHandler);
    });
});
