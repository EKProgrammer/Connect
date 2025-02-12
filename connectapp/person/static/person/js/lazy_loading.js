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
        let href_response;
        if (window.location.pathname === '/person/') {
            href_response = `service/load_more_posts/?page=${page}`;
        } else {
            const username = window.location.pathname.split('/')[2];
            href_response = `/person/service/load_more_posts_other_user/${username}/?page=${page}`;
        }
        const response = await fetch(href_response);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();

        if (data.posts_html.length > 0) {
            const postsList = document.querySelector('.posts-list');
            postsList.insertAdjacentHTML('beforeend', data.posts_html);
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
