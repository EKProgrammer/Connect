document.addEventListener("DOMContentLoaded", function () {
    function switchTab(tab) {
        document.querySelectorAll(".tabs .tab").forEach(tabElement => {
            tabElement.classList.remove("active");
        });

        document.getElementById(`tab-${tab}`).classList.add("active");

        document.getElementById("popularPosts").style.display = (tab === "popular") ? "block" : "none";
        document.getElementById("subscriptionsPosts").style.display = (tab === "subscriptions") ? "block" : "none";
    }

    // Проверяем localStorage, чтобы сохранить состояние вкладки при обновлении страницы
    const savedTab = localStorage.getItem("selectedTab") || "popular";
    switchTab(savedTab);

    document.getElementById("tab-popular").addEventListener("click", () => {
        switchTab("popular");
        localStorage.setItem("selectedTab", "popular");
    });

    document.getElementById("tab-subscriptions").addEventListener("click", () => {
        switchTab("subscriptions");
        localStorage.setItem("selectedTab", "subscriptions");
    });
});
