document.addEventListener('DOMContentLoaded', function() {
    const avatarInput = document.getElementById('id_avatar');
    const avatarPreview = document.getElementById('avatarPreview');
    
    if (avatarInput && avatarPreview) {
        avatarInput.addEventListener('change', function(e) {
            if (e.target.files && e.target.files[0]) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    avatarPreview.src = event.target.result;
                };
                reader.readAsDataURL(e.target.files[0]);
            }
        });
    }
    
    const removeAvatarCheckbox = document.getElementById('removeAvatar');
    if (removeAvatarCheckbox) {
        removeAvatarCheckbox.addEventListener('change', function() {
            if (this.checked) {
                avatarPreview.src = '{% static "path/to/default/avatar.jpg" %}';
            } else {
                avatarPreview.src = '{{ user.get_avatar_url }}';
            }
        });
    }
});