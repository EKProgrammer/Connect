document.getElementById("comment-form").addEventListener("submit", function (e) {
    e.preventDefault();
    let formData = new FormData(this);

    fetch("{% url 'add_comment' post.id %}", {
        method: "POST",
        body: formData,
        headers: {
            "X-CSRFToken": "{{ csrf_token }}"
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            let commentCount = document.getElementById("comment-count");
            commentCount.textContent = parseInt(commentCount.textContent) + 1;
        }
    });
});
