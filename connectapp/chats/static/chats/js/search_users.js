document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("search-input");
    searchInput.setAttribute("autocomplete", "off");
    const userList = document.getElementById("user-list");
    const nextBtn = document.getElementById("next-btn");
    const cancelBtn = document.getElementById("cancel-group-btn");
    const createGroupContainer = document.getElementById("create-group-container");
    const groupNameContainer = document.getElementById("group-name-container");
    const groupTitle = document.querySelector("#create-group-container h2");
    const groupNameInput = document.getElementById("group-name");
    groupNameInput.setAttribute("autocomplete", "off");
    groupNameInput.setAttribute("autocorrect", "off");
    groupNameInput.setAttribute("autocapitalize", "off");
    groupNameInput.setAttribute("spellcheck", "false");

    const selectedUsersContainer = document.createElement("div");
    selectedUsersContainer.id = "selected-users-container";
    selectedUsersContainer.style.display = "none";
    createGroupContainer.appendChild(selectedUsersContainer);

    let selectedUsers = [];
    const searchWrapper = document.createElement("div");
    searchWrapper.classList.add("search-wrapper");
    searchInput.parentNode.replaceChild(searchWrapper, searchInput);
    searchWrapper.appendChild(searchInput);
    
    function updateSelectedUsers() {
        searchWrapper.innerHTML = "";

        selectedUsers.forEach(user => {
            const tag = document.createElement("span");
            tag.classList.add("user-tag");
            tag.textContent = user.first_name;

            const removeBtn = document.createElement("button");
            removeBtn.textContent = "✖";
            removeBtn.classList.add("remove-btn");
            removeBtn.addEventListener("click", function () {
                removeUser(user);
            });

            tag.appendChild(removeBtn);
            searchWrapper.appendChild(tag);
        });

        searchWrapper.appendChild(searchInput);
        searchInput.value = "";
        searchInput.focus();
    }

    searchInput.addEventListener("input", function () {
        const query = searchInput.value.trim();
        fetch(`?query=${query}`, {
            headers: { "X-Requested-With": "XMLHttpRequest" }
        })
        .then(response => response.json())
        .then(data => {
            userList.innerHTML = "";
            data.users.forEach(user => {
                const userCard = document.createElement("div");
                userCard.classList.add("user-card");
                userCard.setAttribute("data-id", user.id);
                userCard.innerHTML = `
                    <div class="user-info">
                        <img src="${user.avatar}" alt="Фото пользователя">
                        <div>
                            <h5>${user.first_name} ${user.last_name}</h5>
                        </div>
                        <button class="select-btn ${selectedUsers.some(u => u.id === user.id) ? 'selected' : ''}"></button>
                    </div>`;
                userList.appendChild(userCard);

                const selectButton = userCard.querySelector(".select-btn");
                selectButton.addEventListener("click", function() {
                    selectUser(user, selectButton);
                });
            });
        });
    });

    function selectUser(user, button) {
        const userIndex = selectedUsers.findIndex(u => u.id === user.id);
        if (userIndex === -1) {
            selectedUsers.push(user);
        } else {
            selectedUsers.splice(userIndex, 1);
        }
        updateSelectedUsers();
        console.log("Размер кнопки:", button.offsetWidth, button.offsetHeight);
        toggleButtonColor(button);
    }

    function removeUser(user) {
        selectedUsers = selectedUsers.filter(u => u.id !== user.id);
        updateSelectedUsers();
    
        const userCard = document.querySelector(`.user-card[data-id="${user.id}"]`);
        if (userCard) {
            const selectButton = userCard.querySelector(".select-btn");
            if (selectButton) {
                selectButton.classList.remove("selected");
            }
        }
    }

    nextBtn.addEventListener("click", function () {
        searchWrapper.style.display = "none";
        userList.style.display = "none";
        nextBtn.style.display = "none";
    
        if (groupTitle) {
            groupTitle.remove();
        }
    
        selectedUsersContainer.innerHTML = "";
        selectedUsersContainer.appendChild(groupNameContainer);
        groupNameContainer.style.display = "block";
    
        const selectedUsersTitle = document.createElement("h4");
        selectedUsersTitle.textContent = "Выбранные пользователи:";
        selectedUsersContainer.appendChild(selectedUsersTitle);

        selectedUsers.forEach(user => {
            const userCard = document.createElement("div");
            userCard.classList.add("selected-user-card");
            userCard.innerHTML = `
                <img src="${user.avatar}" alt="Фото">
                <div>
                    <h5>${user.first_name} ${user.last_name}</h5>
                </div>`;
            selectedUsersContainer.appendChild(userCard);
        });
    
        selectedUsersContainer.style.display = "block";
    
        let createBtn = document.getElementById("create-btn");
        if (!createBtn) {
            createBtn = document.createElement("button");
            createBtn.id = "create-btn";
            createBtn.textContent = "Создать";
            createBtn.classList.add("create-btn"); 
            document.querySelector(".create-group-controls").appendChild(createBtn);
    
            createBtn.addEventListener("click", function () {
                createGroup();
            });
        }
    });
    
    function createGroup() {
        const groupName = groupNameInput.value.trim();
        
        if (!groupName) {
            showWarning("Введите название группы!");
            return;
        }
    
        const csrfToken = getCSRFToken();
    
        if (!csrfToken) {
            showError("CSRF-токен не найден!");
            return;
        }
    
        const requestData = {
            group_name: groupName,
            user_ids: selectedUsers.map(user => user.id),
        };
    
        fetch("/chats/service/create_group_chat/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": csrfToken,
            },
            body: JSON.stringify(requestData),
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                window.location.href = `/chats/${data.chat_id}`;
            } else {
                showError("Ошибка при создании группы: " + data.error);
            }
        })
        .catch(error => {
            console.error("Ошибка запроса:", error);
            showError("Не удалось создать группу. Попробуйте еще раз.");
        });
    }
    

    cancelBtn.addEventListener("click", function () {
        searchWrapper.style.display = "flex";
        userList.style.display = "block";
        nextBtn.style.display = "block";
        groupNameContainer.style.display = "none";
        selectedUsersContainer.style.display = "none";

        if (!document.querySelector("#create-group-container h2")) {
            const newTitle = document.createElement("h2");
            newTitle.textContent = "Выбор пользователей";
            createGroupContainer.insertBefore(newTitle, searchWrapper);
        }
    });

    function toggleButtonColor(button) {
        button.classList.toggle("selected");
    }

    function getCSRFToken() {
        const csrfElement = document.querySelector("[name=csrfmiddlewaretoken]");
        return csrfElement ? csrfElement.value : null;
    }
});
