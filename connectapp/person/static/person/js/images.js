"use strict"


const MAX_IMAGES = 10;

document.addEventListener('shown.bs.modal', async function(event) {
    const modal = event.target;
    const previewContainer = modal.querySelector('.modal-list-images');
    if (!previewContainer) {
        return;
    }
    const imageInput = modal.querySelector('input[type="file"]');

    if (!modal.fileListArray) {
        modal.fileListArray = [];
    }

    const fileListArray = modal.fileListArray;

    // Загружаем уже существующие изображения, если они ещё не добавлены
    const existingWrappers = previewContainer.querySelectorAll('.modal-img-wrapper');

    for (const wrapper of existingWrappers) {
        const src = wrapper.dataset.src;
        const name = wrapper.dataset.name || 'image.jpg';
        const size = parseInt(wrapper.dataset.size, 10) || 0;

        const alreadyAdded = fileListArray.some(
            f => f.name === name && f.size === size
        );
        if (!alreadyAdded && src) {
            try {
                const response = await fetch(src);
                const blob = await response.blob();
                const file = new File([blob], name, { type: blob.type });
                fileListArray.push(file);
            } catch (err) {
                console.error('Ошибка загрузки изображения: ', err);
            }
        }
    }

    if (imageInput) {
        const dataTransfer = new DataTransfer();
        for (let i = fileListArray.length - 1; i >= 0; i--) {
            dataTransfer.items.add(fileListArray[i]);
        }
        imageInput.files = dataTransfer.files;
    }
});


document.addEventListener('change', function(event) {
    // Обработка формы для добавления изображения для поста
    if (event.target.tagName === 'INPUT' && event.target.type === 'file') {
        const imageInput = event.target;
        const modal = imageInput.closest('.modal');
        const previewContainer = modal.querySelector('.modal-list-images');
        const previewLabel = previewContainer.querySelector('label');
        const addImgText = previewLabel.querySelector('span');
        const addImgIcon = previewLabel.querySelector('img');

        if (!modal.fileListArray) {
            modal.fileListArray = [];
        }

        const fileListArray = modal.fileListArray;

        if (imageInput.files && imageInput.files.length > 0) {
            const newFiles = Array.from(imageInput.files);

            if (fileListArray.length + newFiles.length > MAX_IMAGES) {
                const allowed = MAX_IMAGES - fileListArray.length;
                if (allowed <= 0) {
                    showError(`Можно загрузить не более ${MAX_IMAGES} изображений.`);
                    imageInput.value = '';
                    return;
                } else {
                    showError(`Можно добавить только ${allowed} изображений.`);
                    newFiles.splice(allowed);
                }
            }

            let count_correct_files = 0;

            newFiles.forEach(file => {
                const alreadyAdded = fileListArray.some(
                    f => f.name === file.name && f.size === file.size
                );

                if (!alreadyAdded) {
                    if (!file.type.startsWith('image/')) {
                        showError(`Файл "${file.name}" не является изображением и не будет добавлен.`);
                        return;
                    }
                    count_correct_files += 1;

                    fileListArray.push(file);

                    const reader = new FileReader();
                    reader.onload = function(e) {
                        const imgWrapper = document.createElement('span');
                        imgWrapper.classList.add('modal-img-wrapper');
                        imgWrapper.dataset.name = file.name;
                        imgWrapper.dataset.size = file.size;

                        const img = document.createElement('img');
                        img.src = e.target.result;

                        const closeButton = document.createElement('span');
                        closeButton.classList.add('modal-img-close-btn');
                        closeButton.textContent = '×';

                        imgWrapper.appendChild(img);
                        imgWrapper.appendChild(closeButton);
                        previewLabel.after(imgWrapper);
                    };
                    reader.readAsDataURL(file);
                }
            });

            if (count_correct_files > 0) {
                addImgText.style.display = 'none';
                addImgIcon.style.display = 'inline';
                previewLabel.style.width = '48px';
                previewLabel.style.height = 'auto';
                previewLabel.style.margin = 'auto 30px';
            }

            const dataTransfer = new DataTransfer();
            fileListArray.forEach(file => dataTransfer.items.add(file));
            imageInput.files = dataTransfer.files;
        }
    }
});


document.addEventListener('click', function(event) {
    if (event.target.classList.contains('modal-img-close-btn')) {
        const closeButton = event.target;
        const imgWrapper = closeButton.closest('.modal-img-wrapper');
        const modal = closeButton.closest('.modal');
        const previewContainer = modal.querySelector('.modal-list-images');
        const previewLabel = previewContainer.querySelector('label');
        const addImgText = previewLabel.querySelector('span');
        const addImgIcon = previewLabel.querySelector('img');
        const imageInput = modal.querySelector('input[type="file"]');

        if (!modal.fileListArray) return;
        const fileListArray = modal.fileListArray;

        const fileName = imgWrapper.dataset.name;
        const fileSize = parseInt(imgWrapper.dataset.size, 10);

        // Удаляем элемент с интерфейса
        imgWrapper.remove();

        // Удаляем файл из массива
        const indexToRemove = fileListArray.findIndex(
            f => f.name === fileName && f.size === fileSize
        );
        if (indexToRemove !== -1) {
            fileListArray.splice(indexToRemove, 1);
        }

        // Обновляем input.files
        const dataTransfer = new DataTransfer();
        fileListArray.forEach(f => dataTransfer.items.add(f));
        imageInput.files = dataTransfer.files;

        // Сброс отображения кнопки добавления изображения, если все изображения удалены
        if (imageInput.files.length === 0) {
            addImgText.style.display = 'inline';
            addImgIcon.style.display = 'none';
            previewLabel.removeAttribute('style');
        }
    }
});


// Область предпросмотра изображений можно прокручивать по горизонтали с помощью колеса мыши.
document.addEventListener('DOMContentLoaded', function () {
    // При показе любой модалки
    document.addEventListener('shown.bs.modal', function (event) {
        const modal = event.target;
        const previewContainer = modal.querySelector('.modal-list-images');

        if (previewContainer) {
            // Удаляем предыдущий обработчик, если есть
            previewContainer.removeEventListener('wheel', previewContainer._wheelHandler || (() => {}));

            // Создаем и сохраняем обработчик, чтобы можно было удалить позже
            const wheelHandler = function (e) {
                e.preventDefault();
                previewContainer.scrollLeft += e.deltaY;
            };

            previewContainer._wheelHandler = wheelHandler;
            previewContainer.addEventListener('wheel', wheelHandler);
        }
    });
});

