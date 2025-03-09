document.addEventListener('click', function (event) {
    const copy_code_button = event.target.closest('.copy-code');
    if (copy_code_button) {
        const codeHeader = copy_code_button.closest('.code-header');
        const codeBlock = codeHeader.nextElementSibling.querySelector('code');
        const codeText = codeBlock.innerText;

        navigator.clipboard.writeText(codeText).then(() => {
            showCopyCodeMessage()
        }).catch(err => {
            console.error('Ошибка при копировании:', err);
        });
    }
});

// дублирование кода из copy_post_link.js, потом придумаю, что с этим сделать
function showCopyCodeMessage() {
    const message = document.createElement('div');
    message.textContent = 'Код скопирован';
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

