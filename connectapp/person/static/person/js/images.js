document.addEventListener('DOMContentLoaded', function() {
    // Обработка формы для добавления изображения для аватара
    const avatarInput = document.getElementById('avatar');
    const uploadBtn = document.getElementById('uploadAvatarBtn');
    const avatarForm = document.getElementById('avatarForm');

    if (uploadBtn && avatarInput) {
        uploadBtn.addEventListener('click', function() {
            avatarInput.click();
        });
    }

    if (avatarInput && avatarForm) {
        avatarInput.addEventListener('change', function() {
            if (this.files && this.files[0]) {
                avatarForm.submit();
            }
        });
    }

    // Обработка формы для добавления изображения для поста
    const imageInput = document.getElementById('id_image');
    const selectedImageName = document.getElementById('selected-image-name');

    if (imageInput && selectedImageName) {
        imageInput.addEventListener('change', function() {
            if (this.files && this.files[0]) {
                selectedImageName.textContent = this.files[0].name;
            } else {
                selectedImageName.textContent = '';
            }
        });
    }
});

