"use strict"


// Обработка формы для добавления изображения для аватара
const avatarInput = document.getElementById('avatar');
const uploadBtn = document.getElementById('uploadAvatarBtn');
const avatarForm = document.getElementById('avatarForm');
uploadBtn.addEventListener('click', function() {
    avatarInput.click();
});
avatarInput.addEventListener('change', function() {
    if (this.files && this.files[0]) {
        avatarForm.submit();
    }
});


document.addEventListener('change', function(event) {
    // Обработка формы для добавления изображения для поста
    if (event.target.tagName === 'INPUT' && event.target.type === 'file') {
        const imageInput = event.target;
        const modal = imageInput.closest('.modal');
        const previewContainer = modal.querySelector('.modal-list-images');

        const previewContainerLabel = previewContainer.querySelector(`label`);
        previewContainerLabel.style.display = 'none';

        if (imageInput.files && imageInput.files.length > 0) {
            const fileListArray = Array.from(imageInput.files);
            console.log(fileListArray.length);

            fileListArray.forEach((file, index) => {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const imgWrapper = document.createElement('span');
                    imgWrapper.style.position = 'relative';
                    imgWrapper.style.marginRight = '10px';
                    imgWrapper.style.display = 'inline-block';
                    imgWrapper.style.maxWidth = '400px';
                    imgWrapper.style.height = '100%';

                    const img = document.createElement('img');
                    img.src = e.target.result;
                    img.style.objectFit = 'cover';
                    img.style.height = '100%';
                    img.style.borderRadius = '5px';

                    const closeButton = document.createElement('span');
                    closeButton.textContent = '×';
                    closeButton.style.position = 'absolute';
                    closeButton.style.top = '5px';
                    closeButton.style.right = '5px';
                    closeButton.style.background = 'rgba(0, 0, 0, 0.5)';
                    closeButton.style.color = 'white';
                    closeButton.style.borderRadius = '50%';
                    closeButton.style.width = '20px';
                    closeButton.style.height = '20px';
                    closeButton.style.display = 'flex';
                    closeButton.style.justifyContent = 'center';
                    closeButton.style.alignItems = 'center';
                    closeButton.style.cursor = 'pointer';
                    closeButton.style.fontSize = '16px';

                    closeButton.addEventListener('click', function() {
                        // Обработчик удаления изображения
                        // есть проблема: если быстро нажимать на крестики, то js не успевает удалять изображания
                        imgWrapper.remove();
                        fileListArray.splice(index, 1);

                        const dataTransfer = new DataTransfer();
                        fileListArray.forEach(file => dataTransfer.items.add(file));
                        imageInput.files = dataTransfer.files;

                        if (imageInput.files.length === 0) {
                            previewContainerLabel.style.display = 'flex';
                        }
                    });

                    imgWrapper.appendChild(img);
                    imgWrapper.appendChild(closeButton);
                    previewContainer.appendChild(imgWrapper);
                };
                reader.readAsDataURL(file);
            });
        }
    }
});


// Область предпросмотра изображений можно прокручивать по горизонтали с помощью колеса мыши.
document.addEventListener('DOMContentLoaded', function() {
    const previewContainer = document.querySelector('.modal-list-images');
    if (previewContainer) {
        previewContainer.addEventListener('wheel', function(event) {
            event.preventDefault();
            previewContainer.scrollLeft += event.deltaY;
        });
    }
});
