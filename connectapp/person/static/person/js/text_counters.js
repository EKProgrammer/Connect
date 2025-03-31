"use strict"


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


// Модальные окна добавления и редактирования поста

// Обновление счётчика
function updateCharCount(textarea, countSpan, maxLength) {
    if (!textarea || !countSpan || !maxLength) {
        console.error('textarea or countSpan or maxLength is null');
        return;
    }
    countSpan.textContent = `${textarea.value.length} / ${maxLength}`;
    if (textarea.value.length === maxLength) {
        countSpan.classList.add('text-danger');
    } else {
        countSpan.classList.remove('text-danger');
    }
}

// Применяется при редактировании текстового поля
document.addEventListener('input', function(event) {
    let editPostTextarea = event.target;
    if (editPostTextarea && editPostTextarea.id && editPostTextarea.id.startsWith('id_text')) {
        let editCountSpan = editPostTextarea.nextElementSibling.nextElementSibling;
        updateCharCount(editPostTextarea, editCountSpan, 5000);
    }
});

// Применяется при открытии модального окна
document.addEventListener('shown.bs.modal',  function(event) {
    let modal = event.target;
    let editPostTextarea = modal.querySelector('textarea');
    let editCountSpan = modal.querySelector('.post-char-count');
    updateCharCount(editPostTextarea, editCountSpan, 5000);
});
