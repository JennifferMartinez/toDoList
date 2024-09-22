
   //Observer
   class TasksManager {
    static #instance;
    tasks = [];
    observers = [];

    constructor() {
        if (TasksManager.#instance) {
            return TasksManager.#instance;
        }
        TasksManager.#instance = this;
    }

    addObserver(observer) {
        this.observers.push(observer);
    }

    notifyObservers() {
        this.observers.forEach(observer => observer(this.tasks));
    }

    add(task) {
        this.tasks.push({ name: task, completed: false });
        console.log("You added a new task:", task);
        this.notifyObservers();
    }

    eliminate(taskIndex) {
        this.tasks.splice(taskIndex, 1);
        console.log("You have deleted a task");
        this.notifyObservers();
    }

    complete(taskIndex) {
        this.tasks[taskIndex].completed = true;
        console.log("You have completed this task");
        this.notifyObservers();
    }

    static getInstance() {
        if (!TasksManager.#instance) {
            TasksManager.#instance = new TasksManager();
        }
        return TasksManager.#instance;
    }
}

const tasksManager = TasksManager.getInstance();

function updateTaskListUI(tasks) {
    const taskListElement = document.getElementById('task-list');
    taskListElement.innerHTML = '';

    tasks.forEach((task, index) => {
        const taskItem = document.createElement('li');
        taskItem.textContent = task.name;

        const completeButton = document.createElement('button');
        completeButton.textContent = task.completed ? '💜' : 'Complete';
        completeButton.onclick = () => tasksManager.complete(index);

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.onclick = () => tasksManager.eliminate(index);

        taskItem.appendChild(completeButton);
        taskItem.appendChild(deleteButton);
        if (task.completed) taskItem.style.textDecoration = 'line-through';

        taskListElement.appendChild(taskItem);
    });
}

tasksManager.addObserver(updateTaskListUI);

document.getElementById('add-task-btn').onclick = () => {
    const newTaskInput = document.getElementById('new-task');
    const taskName = newTaskInput.value.trim();
    if (taskName) {
        tasksManager.add(taskName);
        newTaskInput.value = '';
    }
};
