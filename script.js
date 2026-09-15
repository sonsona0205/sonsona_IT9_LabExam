document.addEventListener("DOMContentLoaded", function () {

    const taskForm = document.getElementById("taskForm");
    const taskTitle = document.getElementById("taskTitle");
    const dueDate = document.getElementById("dueDate");
    const priority = document.getElementById("priority");
    const taskTableBody = document.getElementById("taskTableBody");
    const emptyMessage = document.getElementById("emptyMessage");
    const searchTask = document.getElementById("searchTask");

    let tasks = JSON.parse(localStorage.getItem("studentTasks")) || [];

    
    let editingTaskId = null;


    function saveTasks() {
        localStorage.setItem("studentTasks", JSON.stringify(tasks));
    }


    function displayTasks(taskList) {

        taskTableBody.innerHTML = "";

        if (taskList.length === 0) {

            emptyMessage.style.display = "block";

        } else {

            emptyMessage.style.display = "none";

        }


        taskList.forEach(function (task, index) {

            const row = document.createElement("tr");


            
            let priorityBadge;

            if (task.priority === "High") {

                priorityBadge =
                    '<span class="badge bg-danger">High</span>';

            } else if (task.priority === "Medium") {

                priorityBadge =
                    '<span class="badge bg-warning text-dark">Medium</span>';

            } else {

                priorityBadge =
                    '<span class="badge bg-success">Low</span>';

            }


            let statusBadge;

            if (task.completed === true) {

                statusBadge =
                    '<span class="badge bg-success">Completed</span>';

            } else {

                statusBadge =
                    '<span class="badge bg-warning text-dark">Pending</span>';

            }


            let titleClass = "";

            if (task.completed === true) {
                titleClass = "task-completed";
            }


            row.innerHTML = `
                <td>${index + 1}</td>

                <td class="${titleClass}">
                    ${task.title}
                </td>

                <td>
                    ${task.dueDate}
                </td>

                <td>
                    ${priorityBadge}
                </td>

                <td>
                    ${statusBadge}
                </td>

                <td>

                    <button
                        class="btn btn-sm btn-success me-1"
                        onclick="toggleComplete(${task.id})"
                        title="Mark as Done">

                        <i class="bi bi-check-lg"></i>

                    </button>


                    <button
                        class="btn btn-sm btn-warning me-1"
                        onclick="editTask(${task.id})"
                        title="Edit">

                        <i class="bi bi-pencil"></i>

                    </button>


                    <button
                        class="btn btn-sm btn-danger"
                        onclick="deleteTask(${task.id})"
                        title="Delete">

                        <i class="bi bi-trash"></i>

                    </button>

                </td>
            `;


            taskTableBody.appendChild(row);

        });


        updateStatistics();
    }


    taskForm.addEventListener("submit", function (event) {

        event.preventDefault();


        const title = taskTitle.value.trim();
        const date = dueDate.value;
        const selectedPriority = priority.value;


        
        if (title === "") {

            alert("Please enter a task title.");

            taskTitle.focus();

            return;
        }


        if (date === "") {

            alert("Please select a due date.");

            dueDate.focus();

            return;
        }


        if (selectedPriority === "") {

            alert("Please select a priority.");

            priority.focus();

            return;
        }


        
        if (editingTaskId !== null) {

            const task = tasks.find(function (item) {
                return item.id === editingTaskId;
            });


            if (task) {

                task.title = title;
                task.dueDate = date;
                task.priority = selectedPriority;

            }


            editingTaskId = null;


            taskForm.querySelector(
                "button[type='submit']"
            ).innerHTML =
                '<i class="bi bi-plus-lg"></i> Add Task';

        }

        
        else {

            const newTask = {
                id: Date.now(),
                title: title,
                dueDate: date,
                priority: selectedPriority,
                completed: false
            };


            tasks.push(newTask);

        }


       
        saveTasks();

        displayTasks(tasks);

        taskForm.reset();

    });


    window.toggleComplete = function (id) {

        const task = tasks.find(function (item) {
            return item.id === id;
        });


        if (task) {

            task.completed = !task.completed;

        }


        saveTasks();

        displayTasks(tasks);

    };


    window.editTask = function (id) {

        const task = tasks.find(function (item) {
            return item.id === id;
        });


        if (!task) {
            return;
        }


        taskTitle.value = task.title;
        dueDate.value = task.dueDate;
        priority.value = task.priority;


        editingTaskId = id;


        taskForm.querySelector(
            "button[type='submit']"
        ).innerHTML =
            '<i class="bi bi-pencil"></i> Update Task';


        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    };



    window.deleteTask = function (id) {

        const confirmation = confirm(
            "Are you sure you want to delete this task?"
        );


        if (confirmation) {

            tasks = tasks.filter(function (task) {
                return task.id !== id;
            });


            saveTasks();

            displayTasks(tasks);

        }

    };



    window.clearAllTasks = function () {

        if (tasks.length === 0) {

            alert("There are no tasks to clear.");

            return;
        }


        const confirmation = confirm(
            "Are you sure you want to delete ALL tasks?"
        );


        if (confirmation) {

            tasks = [];

            saveTasks();

            displayTasks(tasks);

        }

    };



    searchTask.addEventListener("input", function () {

        const searchValue =
            searchTask.value.toLowerCase().trim();


        const filteredTasks = tasks.filter(function (task) {

            return task.title
                .toLowerCase()
                .includes(searchValue);

        });


        displayTasks(filteredTasks);

    });



    function updateStatistics() {

        const total = tasks.length;


        let completed = 0;


        // Count completed tasks
        for (let i = 0; i < tasks.length; i++) {

            if (tasks[i].completed === true) {

                completed++;

            }

        }


        const pending = total - completed;


        document.getElementById("totalTasks").textContent = total;

        document.getElementById("pendingTasks").textContent = pending;

        document.getElementById("completedTasks").textContent = completed;

    }



    displayTasks(tasks);

});