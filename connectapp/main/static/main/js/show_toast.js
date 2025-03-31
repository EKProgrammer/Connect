function showToast(type, message, duration = 10000) {
    const containerId = 'toast-container';
    let container = document.getElementById(containerId);

    if (!container) {
        container = document.createElement('div');
        container.id = containerId;
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    // Вставка HTML: иконка + текст + кнопка закрытия
    toast.innerHTML = `
        <img src="/static/main/img/${type}_toast.svg" width="24px" height="24px">
        <span class="toast-message">${message}</span>
        <button class="toast-close" aria-label="Закрыть">🗙</button>
    `;

    // Обработка закрытия вручную
    toast.querySelector('.toast-close').addEventListener('click', () => {
        toast.remove();
    });

    container.appendChild(toast);

    // Автоудаление
    setTimeout(() => {
        toast.remove();
    }, duration);
}

// Алиасы
function showError(message) {
    showToast('error', message);
}

function showSuccess(message) {
    showToast('success', message);
}

function showWarning(message) {
    showToast('warning', message);
}
