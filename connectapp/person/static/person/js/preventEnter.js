// Отменем переход на новую строку при нажатии Enter 
document.addEventListener('DOMContentLoaded', function() {
    const profileAbout = document.getElementById('profile_about');
    
    if (profileAbout) {
        profileAbout.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault(); 
                this.style.boxShadow = '0 0 0 2px rgba(255, 107, 107, 0.5)';
                setTimeout(() => {
                    this.style.boxShadow = '';
                }, 300);
                try {
                    new Audio('{% static "sounds/error.mp3" %}').play();
                } catch (e) {
                    console.log('Sound error', e);
                }
            }
        });
    }
});
aboutTextarea.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
        e.preventDefault(); 
        document.getElementById('edit-about-modal-form').submit();
    }
});
