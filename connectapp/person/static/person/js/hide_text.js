"use strict"

document.addEventListener('DOMContentLoaded', hidePostText);

function hidePostText() {
    const posts = document.querySelectorAll('.post-content');

    posts.forEach(post => {
        const textElement = post.querySelector('.post-text');
        const readMoreBtn = post.querySelector('.read-more-btn');
        const fadeOut = post.querySelector('.fade-out');

        setTimeout(() => {
            if (post.scrollHeight > post.clientHeight) {
                readMoreBtn.style.display = 'block';
                fadeOut.style.display = 'block';
            } else {
                readMoreBtn.style.display = 'none';
                fadeOut.style.display = 'none';
                fadeOut.style.boxShadow = 'none';
            }
        }, 0);

        readMoreBtn.addEventListener('click', function() {
            if (textElement.classList.contains('expanded')) {
                textElement.classList.remove('expanded');
                post.style.maxHeight = '300px';
                readMoreBtn.textContent = 'Читать далее';
                fadeOut.style.display = 'block';
            } else {
                textElement.classList.add('expanded');
                post.style.maxHeight = 'none';
                readMoreBtn.textContent = 'Свернуть';
                fadeOut.style.display = 'none';
            }
        });
    });
}
