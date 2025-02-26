function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

const csrftoken = getCookie('csrftoken');

$.ajaxSetup({
    headers: { "X-CSRFToken": csrftoken }
});

$(document).ready(function () {
    let selectedCommentId = null;

    $('.comment-item').on('contextmenu', function (e) {
        e.preventDefault();
        selectedCommentId = $(this).data('comment-id');

        $('#context-menu')
            .css({
                top: (e.pageY - 181)+ 'px',
                left: (e.pageX - 396)+ 'px',

                display: 'block'
            });
    });

    $('#delete-comment-btn').on('click', function () {
        if (selectedCommentId) {
            if (confirm("Точно ли вы хотите удалить этот комментарий?")) {
                $.ajax({
                    url: `/person/service/delete_comment/${selectedCommentId}/`,
                    method: 'POST',
                    success: function (response) {
                        console.log(response); 

                        if (response.success) {
                            $(`.comment-item[data-comment-id="${selectedCommentId}"]`).remove();
                            $('#context-menu').hide();
                            selectedCommentId = null;
                        } else {
                            alert(response.error || 'Ошибка при удалении комментария.');
                        }
                    },
                    error: function (xhr, status, error) {
                        console.error("Ошибка запроса:", status, error);
                        alert('Ошибка при удалении комментария.');
                    }
                });
            } else {
                console.log("Удаление комментария отменено");
            }
        }
    });

    $(document).on('click', function (e) {
        if (!$(e.target).closest('#context-menu').length) {
            $('#context-menu').hide();
            selectedCommentId = null;
        }
    });
});
