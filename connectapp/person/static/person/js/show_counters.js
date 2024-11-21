document.addEventListener('DOMContentLoaded', function() {
    function updateCharCount(textarea, countSpan, maxLength) {
        countSpan.textContent = `${textarea.value.length}/${maxLength}`;
        if (textarea.value.length == maxLength) {
            countSpan.classList.add('text-danger');
        } else {
            countSpan.classList.remove('text-danger');
        }
    }

    // Для формы "О себе"
    let aboutTextarea = document.getElementById('id_about');
    let aboutCountSpan = document.getElementById('about-char-count');
    if (aboutTextarea && aboutCountSpan) {
        aboutTextarea.addEventListener('input', function() {
            updateCharCount(this, aboutCountSpan, 250);
        });

        // Обновление счётчика при открытии модального окна
        let aboutModal = document.getElementById('editAboutModal');
        if (aboutModal) {
            aboutModal.addEventListener('shown.bs.modal', function() {
                updateCharCount(aboutTextarea, aboutCountSpan, 250);
            });
        }
    }

    // Для формы добавления поста
    let createPostModal = document.getElementById('createPostModal');
    if (createPostModal) {
        let postTextarea = createPostModal.querySelector('textarea');
        let postCountSpan = document.getElementById('create-post-char-count');
        if (postTextarea && postCountSpan) {
            postTextarea.addEventListener('input', function() {
                updateCharCount(this, postCountSpan, 5000);
            });
        }
    }

    // Для форм редактирования постов
    document.querySelectorAll('[id^="edit-post-form-"]').forEach(form => {
        let textarea = form.querySelector('textarea');
        let countSpan = form.querySelector('[id^="edit-post-char-count-"]');
        if (textarea && countSpan) {
            textarea.addEventListener('input', function() {
                updateCharCount(this, countSpan, 5000);
            });

            // Обновление счётчика при открытии модального окна
            let editModal = form.closest('.modal');
            if (editModal) {
                editModal.addEventListener('shown.bs.modal', function() {
                    updateCharCount(textarea, countSpan, 5000);
                });
            }
        }
    });
});
