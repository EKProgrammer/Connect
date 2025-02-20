$(document).ready(function() {
    $('.comment').on('click', function() {
      $(this).find('.delete-btn').toggle();
    });

    $('.delete-btn').on('click', function(e) {
      e.stopPropagation();
      const commentDiv = $(this).closest('.comment');
      const commentId = commentDiv.data('id');

      $.ajax({
        url: `/delete_comment/${commentId}/`,
        type: 'POST',
        data: {
          'csrfmiddlewaretoken': '{{ csrf_token }}'
        },
        success: function(response) {
          if (response.success) {
            commentDiv.remove();
          } else {
            alert('Ошибка при удалении комментария.');
          }
        }
      });
    });
  });