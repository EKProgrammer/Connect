document.querySelector('textarea[name="content"]').addEventListener('keydown', function(event) {
    if (event.key === 'Enter' && !event.shiftKey) { 
        event.preventDefault();
        document.getElementById('comment-form').submit();
    }
});