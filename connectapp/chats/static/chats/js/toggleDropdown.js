document.addEventListener("DOMContentLoaded", function() {
    const chatIcon = document.getElementById("group-icon");
    const dropdownMenu = document.getElementById("dropdown-menu");

    chatIcon.addEventListener("click", function(event) {
        dropdownMenu.classList.toggle("show");
        event.stopPropagation();
    });

    document.addEventListener("click", function(event) {
        if (!dropdownMenu.contains(event.target) && event.target !== chatIcon) {
            dropdownMenu.classList.remove("show");
        }
    });
});
