"use strict"

let page = 2; // Начинаем с второй страницы
let isLoading = false;
let pageEnded = false;
const offset = 300;

function loadMore() {
    if (pageEnded) return;

    const loadMoreBlock = document.querySelector(".load-more");
    if (!loadMoreBlock || isLoading) return;

    const loadMoreBlockPos = loadMoreBlock.getBoundingClientRect().top + window.scrollY;
    const loadMoreBlockHeight = loadMoreBlock.offsetHeight;

    if (window.scrollY > (loadMoreBlockPos + loadMoreBlockHeight) - window.innerHeight - offset) {
        getContent();
    }
}

async function getContent() {
    isLoading = true;
    const loadMoreBlock = document.querySelector(".load-more");
    if (!loadMoreBlock) return;

    if (!document.querySelector('.loader')) {
        loadMoreBlock.insertAdjacentHTML(
            'beforeend',
            '<div class="loader-wrapper"><div class="loader"></div></div>'
        );
    }
    loadMoreBlock.classList.add('loading');

    try {
        const response = await fetch(`load_more_posts_other_user/?page=${page}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();

        if (data.posts.length > 0) {
            const postsList = document.querySelector('.posts-list');
            data.posts.forEach(post => {
                const postHtml = `
                    <div class="post-item">
                        <div class="d-flex justify-content-between align-items-center">
                            <p class="post-date mb-0">${post.date}</p>
                        </div>
                        <div class="post-text-container">
                            <p class="post-text" id="post-text-${post.id}">${post.text}</p>
                            <div class="fade-out"></div>
                            <a class="read-more-btn" id="read-more-btn-${post.id}" style="display: none;">Читать далее</a>
                        </div>
                        ${post.image ? `<div class="post-image-container mt-3">
                            <img src="${post.image}" alt="Post image">
                        </div>` : ''}
                    </div>
                `;
                postsList.insertAdjacentHTML('beforeend', postHtml);
            });

            page++;

            hidePostText();
        }

        if (!data.has_next) {
            pageEnded = true;
        }
    } catch (error) {
        console.error('Error loading more posts:', error);
    } finally {
        isLoading = false;
        loadMoreBlock.classList.remove('loading');
        const loader = document.querySelector('.loader-wrapper');
        if (loader) loader.remove();
    }
}

window.addEventListener('scroll', loadMore);
window.addEventListener('resize', loadMore);
