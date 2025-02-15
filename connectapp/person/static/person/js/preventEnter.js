// Отменем переход на новую строку при нажатии Enter 
document.addEventListener('DOMContentLoaded', function () {
    const aboutTextarea = document.querySelector('#id_about');
    if (aboutTextarea) {
        aboutTextarea.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') {
                e.preventDefault();
            }
        });
    }
});
// При нажатии Enter форма отправляется 
aboutTextarea.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
        e.preventDefault(); 
        document.getElementById('edit-about-modal-form').submit();
    }
});
