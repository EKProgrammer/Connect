document.addEventListener("DOMContentLoaded", function () {
    const createGroupBtn = document.getElementById("create-group-btn");
    const chatWindow = document.getElementById("chat-window");
    const createGroupContainer = document.getElementById("create-group-container");
    const cancelGroupBtn = document.getElementById("cancel-group-btn");
    const dropdownMenu = document.getElementById("dropdown-menu"); 
    if (!createGroupBtn || !chatWindow || !createGroupContainer || !dropdownMenu) return;
    createGroupBtn.addEventListener("click", function () {
        chatWindow.style.display = "none";
        createGroupContainer.style.display = "flex";
        dropdownMenu.style.display = "none";
    });
    cancelGroupBtn?.addEventListener("click", function () {
        createGroupContainer.style.display = "none";
        chatWindow.style.display = "flex";
        dropdownMenu.style.display = "block"; 
    });
});
