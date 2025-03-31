function copyToClipboard(post_id) {
    const domain = window.location.hostname;
    const port = window.location.port;
    const protocol = window.location.protocol;
    const baseUrl = `${protocol}//${domain}${port ? `:${port}` : ''}/`;
    const url = `${baseUrl}person/post/${post_id}/`;

    navigator.clipboard.writeText(url).then(() => {
        showSuccess('Ссылка скопирована.');
    }).catch(err => {
        showError('Ошибка при копировании: ' + err.toString());
    });
}
