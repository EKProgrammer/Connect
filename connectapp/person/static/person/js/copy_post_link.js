function copyToClipboard(post_id) {
    const domain = window.location.hostname;
    const port = window.location.port;
    const protocol = window.location.protocol;
    const baseUrl = `${protocol}//${domain}${port ? `:${port}` : ''}/`;
    const url = `${baseUrl}person/post/${post_id}/`;

    navigator.clipboard.writeText(url).then(() => {
        showCopyMessage();
    }).catch(err => {
        console.error('Ошибка при копировании: ', err);
    });
}

function showCopyMessage() {
    const message = document.createElement('div');
    message.textContent = 'Ссылка скопирована';
    message.style.position = 'fixed';
    message.style.bottom = '20px';
    message.style.left = '50%';
    message.style.transform = 'translateX(-50%)';
    message.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    message.style.color = 'white';
    message.style.padding = '10px 20px';
    message.style.borderRadius = '5px';
    message.style.zIndex = '1000';
    document.body.appendChild(message);

    setTimeout(() => {
        document.body.removeChild(message);
    }, 3000);
}
