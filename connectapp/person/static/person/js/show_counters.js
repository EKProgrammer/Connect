"use strict"

function updateCharCount(textarea, countSpan, maxLength) {
    countSpan.textContent = `${textarea.value.length} / ${maxLength}`;
    if (textarea.value.length == maxLength) {
        countSpan.classList.add('text-danger');
    } else {
        countSpan.classList.remove('text-danger');
    }
}

// Обновление счётчика при открытии модального окна "О себе"
const aboutTextarea = document.getElementById('id_about');
const aboutCountSpan = document.getElementById('aboutCharCount');
aboutTextarea.addEventListener('input', function() {
    updateCharCount(this, aboutCountSpan, 250);
});

// Для формы добавления и редактирования поста
document.addEventListener('input', function(event) {
    let editPostTextarea = event.target;
    if (editPostTextarea.classList === "text-message-field") {
        let editCountSpan = editPostTextarea.nextElementSibling;
        updateCharCount(editPostTextarea, editCountSpan, 5000);
    }
});

// Обновление счётчика при открытии модального окна
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
