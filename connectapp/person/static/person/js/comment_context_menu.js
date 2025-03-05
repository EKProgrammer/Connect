$(document).ready(function() {
    // Переменная для хранения текущего комментария
    let currentCommentId = null;
    
    // Показать контекстное меню при клике правой кнопкой мыши на комментарий
    $(document).on('contextmenu', '.comment-item', function(e) {
        e.preventDefault(); // Отменяем стандартное контекстное меню
        
        // Получаем ID комментария и пользователя
        const commentId = $(this).data('comment-id');
        const commentUserId = $(this).data('user-id');
        const currentUserId = $('meta[name="user-id"]').attr('content');
        
        // Проверяем, является ли текущий пользователь автором комментария
        if (commentUserId == currentUserId) {
            // Устанавливаем ID комментария для кнопок контекстного меню
            $('#edit-comment-btn').data('comment-id', commentId);
            $('#delete-comment-btn').data('comment-id', commentId);
            
            // Сохраняем текущий комментарий
            currentCommentId = commentId;
            
            // Позиционируем и показываем контекстное меню
            const contextMenu = $('#context-menu');
            contextMenu.css({
                top: e.pageY + 'px',
                left: e.pageX + 'px'
            }).show();
        }
    });
    
    // Скрыть контекстное меню при клике в любом другом месте
    $(document).on('click', function(e) {
        if (!$(e.target).closest('#context-menu').length) {
            $('#context-menu').hide();
        }
    });
    
    // Обработка нажатия на кнопку "Редактировать"
    $('#edit-comment-btn').on('click', function() {
        const commentId = $(this).data('comment-id');
        // Открываем модальное окно для редактирования
        $('#editCommentModal' + commentId).modal('show');
        // Скрываем контекстное меню
        $('#context-menu').hide();
    });
    
    // Обработка нажатия на кнопку "Удалить"
    $('#delete-comment-btn').on('click', function() {
        const commentId = $(this).data('comment-id');
        
        if (confirm('Вы действительно хотите удалить этот комментарий?')) {
            $.ajax({
                url: `/person/service/delete_comment/${commentId}/`,
                type: 'POST',
                data: {
                    'csrfmiddlewaretoken': $('input[name="csrfmiddlewaretoken"]').val()
                },
                success: function(response) {
                    if (response.success) {
                        // Удаляем комментарий из DOM
                        $(`.comment-item[data-comment-id="${commentId}"]`).remove();
                        
                        // Обновляем счетчик комментариев
                        const commentsCounter = $('.comments-counter-info h3');
                        const currentCount = parseInt(commentsCounter.text().match(/\d+/)[0]) - 1;
                        const commentWord = getCommentWord(currentCount);
                        commentsCounter.text(`${currentCount} ${commentWord}`);
                    } else {
                        alert('Ошибка при удалении комментария.');
                    }
                },
                error: function() {
                    alert('Произошла ошибка при выполнении запроса.');
                }
            });
        }
        
        // Скрываем контекстное меню
        $('#context-menu').hide();
    });
    
    // Функция для склонения слова "комментарий"
    function getCommentWord(count) {
        const lastDigit = count % 10;
        const lastTwoDigits = count % 100;
        
        if (lastDigit === 1 && lastTwoDigits !== 11) {
            return 'комментарий';
        } else if ([2, 3, 4].includes(lastDigit) && ![12, 13, 14].includes(lastTwoDigits)) {
            return 'комментария';
        } else {
            return 'комментариев';
        }
    }
});
