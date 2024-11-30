document.addEventListener('DOMContentLoaded', function() {
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

    const imageInput = document.getElementById('{{ empty_post_form.image.id_for_label }}');
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

