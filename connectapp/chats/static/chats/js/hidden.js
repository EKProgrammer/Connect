document.addEventListener("DOMContentLoaded", function () {
    const createGroupBtn = document.getElementById("create-group-btn");
    const chatWindow = document.getElementById("chat-window");
    const createGroupContainer = document.getElementById("create-group-container");
    const cancelGroupBtn = document.getElementById("cancel-group-btn");
    const dropdownMenu = document.getElementById("dropdown-menu");
    const chatNameWindow = document.querySelector(".chat-name-window");
    const chatMessages =  document.getElementById("chat-messages");
    const chatMessageField = document.querySelector(".chat-window form");
    if (!createGroupBtn || !chatWindow || !createGroupContainer || !dropdownMenu ||
        !chatNameWindow || !chatMessages || !chatMessageField) return;

    createGroupBtn.addEventListener("click", function () {
        chatNameWindow.style.display = "none";
        chatMessages.style.display = "none";
        chatMessageField.style.display = "none";
        createGroupContainer.style.display = "block";
        dropdownMenu.style.display = "none";
    });
    cancelGroupBtn?.addEventListener("click", function () {
        chatNameWindow.style.display = "block";
        chatMessages.style.display = "block";
        chatMessageField.style.display = "block";
        createGroupContainer.style.display = "none";
        dropdownMenu.style.display = "block"; 
    });
});
