document.addEventListener('DOMContentLoaded', function() {
    const profileAbout = document.getElementById('profile_about');
    const profileCharCount = document.getElementById('profile_char_count');

    if (profileAbout && profileCharCount) {
        function updateProfileCounter() {
            const currentLength = profileAbout.value.length;
            const maxLength = 200;
            profileCharCount.textContent = `${currentLength} / ${maxLength}`;
            
            if (currentLength >= maxLength) {
                profileCharCount.classList.add('text-danger');
            } else {
                profileCharCount.classList.remove('text-danger');
            }
        }

        profileAbout.addEventListener('input', updateProfileCounter);
        updateProfileCounter();

        document.getElementById('editProfileBtn')?.addEventListener('click', function() {
            setTimeout(updateProfileCounter, 50);
        });
    }
});