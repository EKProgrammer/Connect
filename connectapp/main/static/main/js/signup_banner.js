// Script to handle closing the banner and storing the preference in localStorage
document.addEventListener('DOMContentLoaded', function() {
    const banner = document.getElementById('signupBanner');
    const closeButton = document.getElementById('closeBanner');

    const path = window.location.pathname;
    if (path === '/register' || path === '/') {
        banner.style.display = 'none';
    }

    closeButton.addEventListener('click', function() {
        banner.style.display = 'none';
    });
});
