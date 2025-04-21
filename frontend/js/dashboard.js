document.addEventListener('DOMContentLoaded', () => {
    // Check if user is logged in
    checkAuth();

    // Initialize event listeners
    document.getElementById('logoutBtn').addEventListener('click', handleLogout);
    document.getElementById('addCategoryForm').addEventListener('submit', handleAddCategory);
    document.getElementById('addTaskForm').addEventListener('submit', handleAddTask);

    // Load categories
    loadCategories();
});

async function checkAuth() {
    try {
        const response = await fetch('../backend/auth/check_auth.php');
        const data = await response.json();

        if (!data.logged_in) {
            window.location.href = 'login.html';
            return;
        }

        document.getElementById('userName').textContent = `Welcome, ${data.user_name}`;
    } catch (error) {
        window.location.href = 'login.html';
    }
}

async function handleLogout() {
    try {
        const response = await fetch('../backend/auth/logout.php');
        const data = await response.json();

        if (data.success) {
            window.location.href = 'login.html';
        }
    } catch (error) {
        console.error('Logout failed:', error);
    }
}

async function loadCategories() {
    try {
        const response = await fetch('../backend/categories/get_categories.php');
        const data = await response.json();

        if (data.success) {
            const categoryList = document.getElementById('categoryList');
            categoryList.innerHTML = '';

            data.categories.forEach(category => {
                const li = document.createElement('li');
                li.textContent = category.category_name;
                li.dataset.id = category.id;
                li.addEventListener('click', () => selectCategory(category.id, category.category_name));
                categoryList.appendChild(li);
            });
        }
    } catch (error) {
        console.error('Failed to load categories:', error);
    }
}

async function handleAddCategory(e) {
    e.preventDefault();
    const categoryName = document.getElementById('categoryName').value;

    try {
        const response = await fetch('../backend/categories/add_category.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ category_name: categoryName })
        });

        const data = await response.json();

        if (data.success) {
            document.getElementById('categoryName').value = '';
            loadCategories();
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error('Failed to add category:', error);
    }
}

function selectCategory(categoryId, categoryName) {
    document.getElementById('selectedCategory').textContent = categoryName;
    document.getElementById('addTaskForm').classList.remove('hidden');
    
    // Update active category in the list
    const categoryItems = document.querySelectorAll('#categoryList li');
    categoryItems.forEach(item => {
        item.classList.remove('active');
        if (item.dataset.id === categoryId.toString()) {
            item.classList.add('active');
        }
    });

    loadTasks(categoryId);
}

async function loadTasks(categoryId) {
    try {
        const response = await fetch(`../backend/tasks/get_tasks.php?category_id=${categoryId}`);
        const data = await response.json();

        if (data.success) {
            const tasksList = document.getElementById('tasksList');
            tasksList.innerHTML = '';

            data.tasks.forEach(task => {
                const taskElement = createTaskElement(task);
                tasksList.appendChild(taskElement);
            });

            updateProgressBar(data.tasks);
        }
    } catch (error) {
        console.error('Failed to load tasks:', error);
    }
}

function createTaskElement(task) {
    const div = document.createElement('div');
    div.className = `task-item ${task.is_done ? 'completed' : ''}`;
    div.dataset.id = task.id;

    div.innerHTML = `
        <div class="task-header">
            <span class="task-title">${task.task_name}</span>
            <div class="task-actions">
                <button class="btn toggle-complete" onclick="toggleTaskComplete(${task.id})">
                    ${task.is_done ? 'Undo' : 'Complete'}
                </button>
                <button class="btn delete-task" onclick="deleteTask(${task.id})">Delete</button>
            </div>
        </div>
        <div class="task-description">${task.description || ''}</div>
        ${task.due_date ? `<div class="task-due-date">Due: ${task.due_date}</div>` : ''}
    `;

    return div;
}

async function handleAddTask(e) {
    e.preventDefault();
    const categoryId = document.querySelector('#categoryList li.active').dataset.id;
    const taskName = document.getElementById('taskName').value;
    const description = document.getElementById('taskDescription').value;
    const dueDate = document.getElementById('taskDueDate').value;

    try {
        const response = await fetch('../backend/tasks/add_task.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                category_id: categoryId,
                task_name: taskName,
                description: description,
                due_date: dueDate
            })
        });

        const data = await response.json();

        if (data.success) {
            document.getElementById('taskName').value = '';
            document.getElementById('taskDescription').value = '';
            document.getElementById('taskDueDate').value = '';
            loadTasks(categoryId);
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error('Failed to add task:', error);
    }
}

async function toggleTaskComplete(taskId) {
    try {
        const response = await fetch('../backend/tasks/toggle_task.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ task_id: taskId })
        });

        const data = await response.json();

        if (data.success) {
            const categoryId = document.querySelector('#categoryList li.active').dataset.id;
            loadTasks(categoryId);
        }
    } catch (error) {
        console.error('Failed to toggle task:', error);
    }
}

async function deleteTask(taskId) {
    try {
        const response = await fetch('../backend/tasks/delete_task.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ task_id: taskId })
        });

        const data = await response.json();

        if (data.success) {
            const categoryId = document.querySelector('#categoryList li.active').dataset.id;
            loadTasks(categoryId);
        }
    } catch (error) {
        console.error('Failed to delete task:', error);
    }
}

function updateProgressBar(tasks) {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.is_done).length;
    const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    let progressBar = document.querySelector('.progress-bar');
    if (!progressBar) {
        progressBar = document.createElement('div');
        progressBar.className = 'progress-bar';
        document.getElementById('tasksList').insertAdjacentElement('beforebegin', progressBar);
    }

    progressBar.innerHTML = `
        <div class="progress" style="width: ${progress}%"></div>
    `;
}

// Add these event listeners after your existing code
const openAddTaskBtn = document.getElementById('openAddTaskBtn');
const taskFormPopup = document.getElementById('taskFormPopup');
const closePopupBtn = document.getElementById('closePopupBtn');
const addTaskForm = document.getElementById('addTaskForm');

openAddTaskBtn.addEventListener('click', () => {
    taskFormPopup.classList.remove('hidden');
});

closePopupBtn.addEventListener('click', () => {
    taskFormPopup.classList.add('hidden');
});

addTaskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    // Your existing form submission logic here
    
    // Close the popup after successful submission
    taskFormPopup.classList.add('hidden');
});

// Close popup when clicking outside the form
taskFormPopup.addEventListener('click', (e) => {
    if (e.target === taskFormPopup) {
        taskFormPopup.classList.add('hidden');
    }
});