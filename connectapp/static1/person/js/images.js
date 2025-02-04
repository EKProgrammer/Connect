"use strict"


// Обработка формы для добавления изображения для аватара
const avatarInput = document.getElementById('avatar');
const uploadBtn = document.getElementById('uploadAvatarBtn');
const avatarForm = document.getElementById('avatarForm');
uploadBtn.addEventListener('click', function() {
    avatarInput.click();
});
avatarInput.addEventListener('change', function() {
    if (this.files && this.files[0]) {
        avatarForm.submit();
    }
});


document.addEventListener('change', function(event) {
    // Обработка формы для добавления изображения для поста
    if (event.target.tagName === 'INPUT' && event.target.type === 'file') {
        const imageInput = event.target;
        const modal = imageInput.closest('.modal');
        const selectedImageName = modal.querySelector(`[id^="selectedImageName"]`);

        if (selectedImageName) {
            if (imageInput.files && imageInput.files[0]) {
                selectedImageName.textContent = imageInput.files[0].name;
            } else {
                selectedImageName.textContent = '';
            }
        }
    }
});
