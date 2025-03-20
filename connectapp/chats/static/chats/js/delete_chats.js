document.addEventListener("DOMContentLoaded", function () {
    const contextMenu = document.getElementById("chat-context-menu");
    let selectedChatId = null; 
    const deleteModal = document.getElementById("delete-chat-modal");
    const deleteForAllToggle = document.getElementById("delete-for-all-toggle");

    document.querySelectorAll(".chat-item").forEach(chatItem => {
        chatItem.addEventListener("contextmenu", function (event) {
            event.preventDefault();
            selectedChatId = this.dataset.chatId;
            showContextMenu(event.pageX, event.pageY);
        });
    });

    function showContextMenu(x, y) {
        contextMenu.style.display = "block";
        contextMenu.style.left = `${x}px`;
        contextMenu.style.top = `${y}px`;
    }

    document.addEventListener("click", function (event) {
        if (!contextMenu.contains(event.target)) {
            contextMenu.style.display = "none";
        }
    });

    document.getElementById("delete-chat-btn").addEventListener("click", function () {
        contextMenu.style.display = "none"; 
        deleteModal.style.display = "flex";

        deleteForAllToggle.checked = false; 
    });

    document.getElementById("cancel-delete-btn").addEventListener("click", function () {
        deleteModal.style.display = "none";
    });

    document.getElementById("confirm-delete-btn").addEventListener("click", function () {
        const deleteForAll = deleteForAllToggle.checked; 
        deleteChat(deleteForAll);
        deleteModal.style.display = "none";
    });

    function deleteChat(deleteForAll) {
        if (selectedChatId) {
            fetch(`/chats/delete/${selectedChatId}/`, {
                method: "POST",
                headers: {
                    "X-CSRFToken": getCSRFToken(),
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ delete_for_all: deleteForAll }) 
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    document.querySelector(`[data-chat-id="${selectedChatId}"]`).closest(".chat-item-container").remove();
                } else {
                    alert("Ошибка при удалении чата");
                }
            })
            .catch(error => console.error("Ошибка:", error));
        }
    }

    function getCSRFToken() {
        return document.querySelector("[name=csrfmiddlewaretoken]").value;
    }
});
