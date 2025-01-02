"use strict"

document.addEventListener('DOMContentLoaded', function() {
  const editButtons = document.querySelectorAll('.post-actions-btn[data-bs-target^="#editPostModal"]');
  const editPostText = document.getElementById('editPostText');

  editButtons.forEach(button => {
    button.addEventListener('click', function() {
      const postId = this.getAttribute('data-bs-target').replace('#editPostModal', '');

      fetch(`/edit_post/${postId}`)
        .then(response => response.json())
        .then(data => {
          editPostText.value = data.text;
          document.getElementById(`edit-post-modal-form-${postId}`).action = `/edit_post/${postId}`;
        });
    });
  });
});
