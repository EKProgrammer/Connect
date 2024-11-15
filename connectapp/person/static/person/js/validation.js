document.addEventListener('DOMContentLoaded', function() {
    const createPostForm = document.getElementById('create-post-form');
    const createPostTextarea = document.getElementById('create-post-textarea');
    const createPostButton = document.getElementById('create-post-button');
    const charCountSpan = document.getElementById('char-count');

    const editAboutForm = document.getElementById('edit-about-form');
    const editAboutTextarea = document.getElementById('edit-about-textarea');
    const editAboutButton = document.getElementById('edit-about-button');
    const aboutCharCountSpan = document.getElementById('about-char-count');

    function validateTextarea(textarea, button, charCountSpan, maxLength) {
        textarea.addEventListener('input', function() {
            const remainingChars = maxLength - this.value.length;
            charCountSpan.textContent = remainingChars;

            if (remainingChars < 0) {
                charCountSpan.style.color = 'red';
                button.disabled = true;
            } else {
                charCountSpan.style.color = '';
                button.disabled = false;
            }
        });
    }

    if (createPostForm && createPostTextarea && createPostButton && charCountSpan) {
        validateTextarea(createPostTextarea, createPostButton, charCountSpan, 5000);
    }

    if (editAboutForm && editAboutTextarea && editAboutButton && aboutCharCountSpan) {
        validateTextarea(editAboutTextarea, editAboutButton, aboutCharCountSpan, 100);
    }
});
