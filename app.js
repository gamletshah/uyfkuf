let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
document.getElementById('taskList').innerHTML = renderTasks();

document.getElementById('addTaskBtn').onclick = () => {
    const taskInput = document.getElementById('taskInput').value;
    if (taskInput) {
        tasks.push({ text: taskInput, completed: false });
        localStorage.setItem('tasks', JSON.stringify(tasks));
        document.getElementById('taskList').innerHTML = renderTasks();
        
        // Push Notification
        if (Notification.permission === 'granted') {
            new Notification('Задача добавлена', {
                body: taskInput,
            });
        }
        document.getElementById('taskInput').value = '';
    }
};

function renderTasks(filter = 'all') {
    let filteredTasks = tasks;
    if (filter === 'active') {
        filteredTasks = tasks.filter(task => !task.completed);
    } else if (filter === 'completed') {
        filteredTasks = tasks.filter(task => task.completed);
    }

    return filteredTasks.map((task, index) => `
        <li>
            <input type="checkbox" id="task-${index}" 
                ${task.completed ? 'checked' : ''} 
                onchange="toggleTask(${index})">
            <label for="task-${index}">${task.text}</label>
        </li>`).join('');
}

function toggleTask(index) {
    tasks[index].completed = !tasks[index].completed;
    localStorage.setItem('tasks', JSON.stringify(tasks));
    document.getElementById('taskList').innerHTML = renderTasks();
}

document.getElementById('filterAllBtn').onclick = () => {
    document.getElementById('taskList').innerHTML = renderTasks('all');
};

document.getElementById('filterActiveBtn').onclick = () => {
    document.getElementById('taskList').innerHTML = renderTasks('active');
};

document.getElementById('filterCompletedBtn').onclick = () => {
    document.getElementById('taskList').innerHTML = renderTasks('completed');
};

document.getElementById('toggleNotificationsBtn').onclick = () => {
    Notification.requestPermission();
};

// Periodic reminder for unfinished tasks
setInterval(() => {
    if (tasks.some(task => !task.completed)) {
        if (Notification.permission === 'granted') {
            new Notification('Напоминание!', {
                body: 'У вас есть невыполненные задачи.',
            });
        }
    }
}, 10* 1000); // каждые 2 часа
