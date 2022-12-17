// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ 14. Работа с DOM. Часть 2 ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++ Задание #4 +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

/*
    Заказчик и команда разработки поздравляют тебя с успешной работой на проекте. Ты молодец! Хорошо себя показал.

    Но тут один из разработчиков заболел и больше некому выполнить его задачу. Поэтому тебя попросили подменить коллегу.

    Тебе необходимо реализовать смену темы с темной на светлую и наоборот. Тема должна переключаться при нажатии на кнопку “Tab”. Изначально тема светлая.

    При смене темы тебе необходимо изменить стили для следующих элементов:

    Элемент с тегом <body>. Если тема темная, то свойство background должно быть значением #24292E, иначе - initial.
    Все элементы по селектору .task-item. Если тема темная, то свойство color должно быть #ffffff, иначе - initial.
    Ко всем элементам с тегом button необходимо добавить значение border: 1px solid #ffffff, если тема темная, иначе - border: none.
    Для решения данной задачи используй свойства style у html-элементов.
*/

function getWorkToTasks (tasks) {
    const colorsThemes = {
        'black': {
            background: 'initial',
            color: 'initial',
            border: 'none'
        },
        'white': {
            background: '#24292E',
            color: '#ffffff',
            border: '1px solid #ffffff'
        }
    };
    
    const tasksWrapper = document.querySelector('.tasks__wrapper');
    const tasksList = tasksWrapper.querySelector('.tasks-list');
    const form = tasksWrapper.querySelector('.create-task-block');
    const input = form.querySelector('.create-task-block__input');
    
    let currentTheme = 'white';
    
    form.addEventListener('submit', addNewTask);
    
    function addNewTask(event) {
        event.preventDefault();
        const { target } = event;
        const { submitter } = event;
        if(submitter.className.includes('logout')) {
            authorizationWrapper.style.transform = `translateY(0)`;
            $tasks.style.transform = `translateY(0)`;
            setTimeout(() => {location.reload()}, 500);
        }else if(!submitter.className.includes('logout')) {
            const taskName = target.elements.taskName.value;
            input.focus();
            if(getValidation(taskName, form, target)) return;
            const id = String(Date.now());
            const newTask = {
                id: id,
                completed: false,
                text: taskName
            };
            tasks.unshift(newTask);
            setTasks(tasks, tasksList);
            localStorage.setItem('authorization', JSON.stringify(userData));
            target.elements.taskName.value = '';
        };
    };
    
    function getValidation(taskName, form, target) {
        const getStringToCompare = str => str.replace(/\s/g,'').toLowerCase();
        const textsValues = tasks.reduce((acc, item) => acc = [...acc, getStringToCompare(item.text)], []);
        const blockError = document.createElement('span');
        blockError.classList.add('error-message-block');
        if(form.children[3]) form.querySelector('.error-message-block').remove();
        if(!taskName.trim()) {
            blockError.textContent = 'Название задачи не должно быть пустым';
            target.elements.taskName.value = '';
        }else if(textsValues.includes(getStringToCompare(taskName))) {
            blockError.textContent = 'Задача с таким названием уже существует.';
        } else {
            return false;
        };
        form.append(blockError);
        return true;
    };

    function getChecked(item) {
        if(item.completed) return 'Checked';
    };
    
    const setTasks = (tasks, tasksList) => {
        let theme;
        if(currentTheme === 'black') theme = 'white';
        else theme = 'black';
        const tasksCompetedFalse = tasks.filter(item => item.completed === false);
        const tasksCompetedTrue = tasks.filter(item => item.completed === true);
        const filteredTasks = [...tasksCompetedFalse, ...tasksCompetedTrue];
        tasksList.innerHTML = '';
        nameUserWrapper.innerHTML = `
        <h1 class="name_current_user_title">To-Do List: Учётная запись ${currentLogin}</h1>
        <div class="name_current_user_delete_wrapper">
        <h2 class="name_current_user_delete_title">Удалить учётную запись ${currentLogin}:</h2>
            <button class="task-item__delete-button default-button delete-button_user" data-user-id=${currentLogin}>
                Удалить
            </button>
        </div>
        `;
        tasksWrapper.prepend(nameUserWrapper);
        filteredTasks.map((item, idx) => {
            return tasksList.innerHTML += `
                <div class="task-item" data-task-id=${item.id}>
                    <div class="task-item__main-container">
                        <div class="task-item__main-content">
                            <form class="checkbox-form">
                                <input class="checkbox-form__checkbox" type="checkbox" id=${item.id} ${getChecked(item)}>
                                <label for=${item.id}></label>
                            </form>
                            <span class="task-item__text">
                                ${item.text}
                            </span>
                        </div>
                        <button class="task-item__delete-button default-button delete-button" data-delete-task-id=${idx + 1}>
                            Удалить
                        </button>
                    </div>
                </div>
            `;
        });
        changeTheme(colorsThemes, theme);
    };
    
    setTasks(tasks, tasksList);
    
    const getModalWindow = () => {
        const modalOverlay = document.createElement('div');
        modalOverlay.classList.add('modal-overlay', 'modal-overlay_hidden');
        modalOverlay.innerHTML = `
            <div class="delete-modal">
                <h3 class="delete-modal__question">
                    Вы действительно хотите удалить эту задачу?
                </h3>
                <div class="delete-modal__buttons">
                    <button class="delete-modal__button delete-modal__cancel-button">
                        Отмена
                    </button>
                    <button class="delete-modal__button delete-modal__confirm-button">
                        Удалить
                    </button>
                </div>
            </div>
        `;
        const tasks = tasksWrapper.closest('#tasks');
        tasks.after(modalOverlay);
    };

    const deleteTask = ($elem, tasks) => {
        const taskId = $elem.dataset.taskId;
        $elem.remove();
        const tasksIdx = tasks.findIndex(item => item.id === taskId);
        tasks.splice(tasksIdx, 1);
        setTasks(tasks, tasksList);
        localStorage.setItem('authorization', JSON.stringify(userData));
        modalOverlay.remove();
    }

    let taskItem;
    
    const controlModalWindow = (event) => {
        event.preventDefault();
        const {target} = event;
        if(target.className.includes('delete-modal__confirm-button')) {
            deleteTask(taskItem, tasks);
            modalOverlay.classList.add('modal-overlay_hidden');
        }else if(target.className.includes('delete-modal__cancel-button')) {
            modalOverlay.remove();
        };
    };
    
    function showModalWindow(elem) {
        if(form.children[3]) form.querySelector('.error-message-block').remove();
        getModalWindow();
        modalOverlay = document.querySelector('.modal-overlay');
        const deleteModalBtns = modalOverlay.querySelector('.delete-modal__buttons');
        taskItem = elem.closest('.task-item');
        modalOverlay.classList.remove('modal-overlay_hidden');
        deleteModalBtns.addEventListener('click', event => {
            controlModalWindow(event);
        });
    };
    
    function changeColorTheme(background, color, border) {
        document.body.style.background = background;
        tasksList.querySelectorAll('.task-item').forEach(item => item.style.color = color);
        tasksList.querySelectorAll('button').forEach(item => item.style.border = border);
    };
    
    function changeTheme(objColors, theme) {
        switch(theme) {
            case 'white': 
                changeColorTheme(objColors[theme].background, objColors[theme].color, objColors[theme].border);
                currentTheme = 'black';
            break;
            case 'black': 
                changeColorTheme(objColors[theme].background, objColors[theme].color, objColors[theme].border);
                currentTheme = 'white';
            break;
        };
    };
    
    const getKeyTab = event => {
        const {key} = event;
        if(key === 'Tab') {
            event.preventDefault();
            changeTheme(colorsThemes, currentTheme);
        };
    };

    const checkCheckedTasks = elem => {
        const taskId = elem.id;
        const itemIdx = tasks.findIndex(item => item.id === taskId);
        if(elem.hasAttribute('checked')) {
            elem.setAttribute('checked', 'false');
            tasks[itemIdx].completed = false;
        }else  {
            elem.setAttribute('checked', 'true');
            tasks[itemIdx].completed = true;
        };
    };
    
    tasksList.addEventListener('click', (event) => {
        event.stopImmediatePropagation();
        const {target} = event;
        if(target.className.includes('task-item__delete-button')) {
            showModalWindow(target);
            setTasks(tasks, tasksList);
        }else if(target.className.includes('checkbox-form__checkbox')) {
            checkCheckedTasks(target);
            setTasks(tasks, tasksList);
            localStorage.setItem('authorization', JSON.stringify(userData))
        };
    });

    const deleteUserBtn = tasksWrapper.querySelector('.delete-button_user');

    const deleteUser = event => {
        const {target} = event;
        delete userData[target.dataset.userId];
        authorizationWrapper.style.transform = `translateY(0)`;
        $tasks.style.transform = `translateY(0)`;
        setTimeout(() => {location.reload()}, 500);
        localStorage.setItem('authorization', JSON.stringify(userData));
    };

    deleteUserBtn.addEventListener('click', deleteUser);

    document.addEventListener('keydown', getKeyTab);
};