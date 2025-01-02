"use strict"

const windowHeight = document.documentElement.clientHeight;
const loadMoreBlock = document.querySelector(".load-more");

function loadMore() {
    const loadMoreBlockPos = loadMoreBlock.getBoundingClientRect().top + scrollY;
    const loadMoreBlockHeight = loadMoreBlock.offsetHeight;

    if (scrollY > (loadMoreBlockPos + loadMoreBlockHeight) - windowHeight) {
        getContent();
    }
}

async function getContent() {
    if (!document.querySelector('.loader')) {
        loadMoreBlock.insertAdjacentHTML(
            'beforeend',
            '<div class="loader"></div>'
        )
    }
    loadMoreBlock.classList.add('loading');

    let responce = await fetch()
}
