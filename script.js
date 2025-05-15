// Select DOM elements
const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list'); 
const activeTasksCountSpan=  document.getElementById('active-tasks-count');
const clearCompletedButton = document.getElementById('clear-completed-button');

// Let's test if we selected them correctly
console.log(taskForm, taskInput, taskList, activeTasksCountSpan, clearCompletedButton);

// Function to create and add a new task item to the DOM
function addTaskToDom(taskText, isCompleted = false) { // Default isCompleted to false
    console.log('AddTaskToDom called with text:', taskText, 'Completed:', isCompleted);

    // 1. create the list item (<li>)
    const listItem = document.createElement('li');
    listItem.classList.add('task-item'); // Add a class for styling
    if (isCompleted) {
        listItem.classList.add('completed');
    }

    // 2. create the span element for the task text
    const taskTextSpan = document.createElement('span');
    taskTextSpan.textContent = taskText; // Set the text content

    // 3. Create a container for action buttons
    const actionsDiv = document.createElement('div');
    actionsDiv.classList.add('actions');

    // 4. Create the "Complete" button
    const completeButton = document.createElement('button');
    completeButton.classList.add('complete-button');
    completeButton.innerHTML = '✓';

    // 5. Create the "Delete" button
    const deleteButton = document.createElement('button');
    deleteButton.classList.add('delete-button');
    deleteButton.innerHTML = '✗';

    // 6. Append buttons to the actions container
    actionsDiv.appendChild(completeButton);
    actionsDiv.appendChild(deleteButton);

    // 7. Append the text span and actions container to the list item
    listItem.appendChild(taskTextSpan);
    listItem.appendChild(actionsDiv);

    // 8. Append the new list item to the task list (<ul>)
    taskList.appendChild(listItem);
}





// Event listener for form submission
taskForm.addEventListener('submit', function(event) {
    event.preventDefault();
    
    let taskText = taskInput.value; // Get the value from the input field
    
    taskText = taskText.trim(); // Trim whitespace from the input
    

  // Use the length check for the if-condition
  if (taskText.length > 0) {
    console.log('Task added:', taskText);
    addTaskToDom(taskText); // Call the function to add the task to the DOM
    saveTasksToLocalStorage(); // Save tasks to local storage
    updateActiveTasksCount(); // A new task is added and always active, so update the count

    taskInput.value = ''; // Clear the input field
    taskInput.focus(); // Set focus back to the input field

  } else {

    alert('Please enter a task.'); // Show an alert if the input is empty
  }

});

// Event Listener for clicks whithin the task list (using event delegation)
taskList.addEventListener('click', function(event) {
    // event.target is the actual element that was clicked inside the taskList
    const clickedElement = event.target;
    console.log('Clicked inside taskList on:', clickedElement);

    // Check if the "Complete" button was clicked
    // We check if the clicked element OR its parent has the 'complete-button' class
    // This is because the click might be on the icon inside the button.
    const completeButton = clickedElement.closest('.complete-button');
    if (completeButton) {
        console.log('Complete button was clicked');
        // Find the parent <li> element (the task item)
        const taskItem = completeButton.closest('.task-item');
        if (taskItem) {
            taskItem.classList.toggle('completed'); // Toggle the .completed class
            saveTasksToLocalStorage();
            updateActiveTasksCount(); // Update the count after toggling
            console.log('Toggled .completed class on:', taskItem);
        }
        return; // Stop further processing if we handled a complete button
    }

    // Check if the "Delete" button was clicked
    const deleteButton = clickedElement.closest('.delete-button');
    if (deleteButton) {
        console.log('Delete button was clicked');
        // Find the parent <li> element (the task item)
        const taskItem = deleteButton.closest('.task-item');
        if (taskItem) {
            taskItem.remove(); // Remove the task item from the DOM
            saveTasksToLocalStorage();
            updateActiveTasksCount(); // Update the count after deletion
            console.log('Removed task item:', taskItem);
        }
        return; // Stop further processing if we handled a delete button
    }
});

clearCompletedButton.addEventListener('click', function() {
    console.log('Clear completed button clicked');
    const completedTasks = taskList.querySelectorAll('.task-item.completed'); // Get all completed tasks

    if (completedTasks.length === 0) {
        alert('No completed tasks to clear.');
        return; // Exit if there are no completed tasks
    }

    if (confirm(`Are you sure you want to delete ${completedTasks.length} completed task(s)?`)) {
        completedTasks.forEach(function(taskItem) {
            taskItem.remove(); // Remove each completed task item from the DOM
        });
        saveTasksToLocalStorage(); // Save the updated tasks to local storage
        updateActiveTasksCount(); // Update the count after deletion (it should not change, but for consistency)
        console.log('${completedTasks.length} completed tasks cleared');
    }
});



// *** LOCAL STORAGE FUNCTIONS ***

// Function to get tasks from local storage
function getTasksFromLocalStorage() {
    let tasks;
    if (localStorage.getItem('tasks') === null) {
        tasks = []; // Initialize an empty array if no tasks are found
    } else {
        tasks = JSON.parse(localStorage.getItem('tasks')); // Parse the JSON string into an array
    }
    return tasks;
}

// Function to save all current tasks to Local Storage
function saveTasksToLocalStorage() {
    const taskItems = taskList.querySelectorAll('.task-item'); // Get all <li> elements
    const taskToSave = [];

    taskItems.forEach(function(taskItem) {
        const taskText = taskItem.querySelector('span').textContent; // Get the text
        const isCompleted = taskItem.classList.contains('completed'); // Check if it's completed
        taskToSave.push({ text: taskText, completed: isCompleted }); // Push to the array
    });

    localStorage.setItem('tasks', JSON.stringify(taskToSave)); // Save the array to local storage
    console.log('Tasks saved to local storage:', taskToSave);
}

// Function to update the active tasks count
// This function is called whenever a task is added, completed, or deleted
function updateActiveTasksCount() {
    const incompleteTaskItems = taskList.querySelectorAll('.task-item:not(.completed)');
    const count = incompleteTaskItems.length;
    activeTasksCountSpan.textContent = count;
    console.log('Active tasks count updated to:', count);
}

// Function to display tasks from local storage on page load
function displayTasksOnLoad() {
    const tasks = getTasksFromLocalStorage();
    tasks.forEach(function(taskData) {
        // We need to pass not just the text, but also the completed status
        addTaskToDom(taskData.text, taskData.completed);
    })
    updateActiveTasksCount(); // Update the count after loading tasks
    console.log('Tasks loaded from local storage and displayed');
}


// *** INITIALIZATION ***

// Call this function when the page loads to display any stored tasks
document.addEventListener('DOMContentLoaded', displayTasksOnLoad);