"use strict"

// Обновление счётчика
function updateCharCount(textarea, countSpan, maxLength) {
    countSpan.textContent = `${textarea.value.length} / ${maxLength}`;
    if (textarea.value.length === maxLength) {
        countSpan.classList.add('text-danger');
    } else {
        countSpan.classList.remove('text-danger');
    }
}

// Модальное окно редактирования поля "О себе"

// Применяется при редактировании текстового поля
const aboutTextarea = document.getElementById('id_about');
const aboutCountSpan = document.getElementById('aboutCharCount');
aboutTextarea.addEventListener('input', function() {
    updateCharCount(this, aboutCountSpan, 250);
});

// Применяется при открытии модального окна
document.addEventListener('click', function(event) {
    let editAboutBtn = event.target.closest('.edit-about-btn');
    if (editAboutBtn && editAboutBtn.id === 'editAboutBtn') {
        updateCharCount(aboutTextarea, aboutCountSpan, 250);
    }
});

// Модальные окна добавления и редактирования поста

// Применяется при редактировании текстового поля
document.addEventListener('input', function(event) {
    let editPostTextarea = event.target;
    if (editPostTextarea && editPostTextarea.id && editPostTextarea.id.startsWith('id_text')) {
        let editCountSpan = editPostTextarea.nextElementSibling;
        updateCharCount(editPostTextarea, editCountSpan, 5000);
    }
});

// Применяется при открытии модального окна
document.addEventListener('click', function(event) {
    let editPostButton = event.target.closest('.post-actions-btn[data-bs-toggle="modal"]');
    if (editPostButton) {
        let modalId = editPostButton.getAttribute('data-bs-target');
        let modal = document.querySelector(modalId);
        let editPostTextarea = modal.querySelector('textarea');
        let editCountSpan = modal.querySelector('.post-char-count');
        updateCharCount(editPostTextarea, editCountSpan, 5000);
    }
});
