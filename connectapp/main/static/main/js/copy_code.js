document.addEventListener('click', function (event) {
    const copy_code_button = event.target.closest('.copy-code');
    if (copy_code_button) {
        const codeHeader = copy_code_button.closest('.code-header');
        const codeBlock = codeHeader.nextElementSibling.querySelector('code');
        const codeText = codeBlock.innerText;

        navigator.clipboard.writeText(codeText).then(() => {
            showSuccess("Код скопирован.");
        }).catch(err => {
            showError('Ошибка при копировании:' + err.toString());
        });
    }
});
