document.addEventListener("DOMContentLoaded", function () {
    const panelHeader = document.querySelector(".chat-name-window");
    const chatWindow = document.getElementById("chat-messages"); 
    const inputArea = document.querySelector(".input-area"); 
    const chatInfoPanel = document.getElementById("chat-info-panel"); 
    const chatNameLine = document.querySelector(".chat-name-line");

    if (panelHeader) {
        panelHeader.addEventListener("click", function () {
            const currentDisplay = window.getComputedStyle(chatInfoPanel).display;
            if (currentDisplay === "none" || currentDisplay === "") {
                chatInfoPanel.style.display = "block";
                chatWindow.style.display = "none"; 
                inputArea.style.display = "none"; 
                panelHeader.style.display = "none"; 
                if (chatNameLine) chatNameLine.style.display = "none";
            } else {
                chatInfoPanel.style.display = "none";
                chatWindow.style.display = "block"; 
                inputArea.style.display = "block"; 
            }
        });
    }
});
