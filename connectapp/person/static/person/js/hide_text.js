"use strict"

document.addEventListener('DOMContentLoaded', function() {
    const aboutContainer = document.querySelector('.about-container');
    if (aboutContainer) {
        const aboutText = aboutContainer.querySelector('.about');
        const readMoreBtn = aboutContainer.querySelector('.about-read-more-btn');
        const fadeOut = aboutContainer.querySelector('.about-fade-out');

        if (aboutContainer.scrollHeight > aboutContainer.clientHeight) {
            readMoreBtn.style.display = 'block';
            fadeOut.style.display = 'block';
        } else {
            readMoreBtn.style.display = 'none';
            fadeOut.style.display = 'none';
        }

        readMoreBtn.addEventListener('click', function() {
            if (aboutText.classList.contains('expanded')) {
                aboutText.classList.remove('expanded');
                aboutContainer.style.maxHeight = '270px';
                readMoreBtn.textContent = 'Читать далее';
                fadeOut.style.display = 'block';
            } else {
                aboutText.classList.add('expanded');
                aboutContainer.style.maxHeight = 'none';
                readMoreBtn.textContent = 'Свернуть';
                fadeOut.style.display = 'none';
            }
        });
    }
});

document.addEventListener('DOMContentLoaded', hidePostText);

function hidePostText() {
    const posts = document.querySelectorAll('.post-text-container');

    posts.forEach(post => {
        const textElement = post.querySelector('.post-text');
        const readMoreBtn = post.querySelector('.read-more-btn');
        const fadeOut = post.querySelector('.fade-out');

        if (post.scrollHeight > post.clientHeight) {
            readMoreBtn.style.display = 'block';
            fadeOut.style.display = 'block';
        } else {
            readMoreBtn.style.display = 'none';
            fadeOut.style.display = 'none';
            fadeOut.style.box_shadow = 'none';
        }

        readMoreBtn.addEventListener('click', function() {
            if (textElement.classList.contains('expanded')) {
                textElement.classList.remove('expanded');
                post.style.maxHeight = '500px';
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
