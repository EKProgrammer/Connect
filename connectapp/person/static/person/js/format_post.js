function formatPosts(postsList) {
    if (postsList) {
        const postText = postsList.querySelectorAll('.post-text');
        postText.forEach(post => {
            post.innerHTML = formatText(post.innerText);
        });
    }
}

function formatPost() {
    const post = document.querySelector('.post-text');
    post.innerHTML = formatText(post.innerText);
}

document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname;

    if (path === '/feed/' || (path.startsWith('/person/') && !path.startsWith('/person/post/'))) {
        const first_posts = document.querySelector('.posts-list');
        formatPosts(first_posts);
    } else if (path.startsWith('/person/post/')) {
        formatPost();
    }
});
