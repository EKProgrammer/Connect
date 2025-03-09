document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("search-input");
    const userList = document.getElementById("user-list");
    const nextBtn = document.getElementById("next-btn");
    const cancelBtn = document.getElementById("cancel-group-btn");
    const createGroupContainer = document.getElementById("create-group-container");
    const groupNameContainer = document.getElementById("group-name-container");
    const groupTitle = document.querySelector("#create-group-container h2"); 
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
    });
    

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
});
