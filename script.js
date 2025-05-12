// Select DOM elements
const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');

// Let's test if we selected them correctly
console.log(taskForm, taskInput, taskList);

// Add event listener to the form
taskForm.addEventListener('submit', function(event) {
    event.preventDefault();
    
    let taskText = taskInput.value; // Get the value from the input field
    
    taskText = taskText.trim(); // Trim whitespace from the input
    

  // Use the length check for the if-condition
  if (taskText.length > 0) {
    console.log('Task added:', taskText);

    taskInput.value = ''; // Clear the input field
    taskInput.focus(); // Set focus back to the input field

  } else {

    alert('Please enter a task.'); // Show an alert if the input is empty
  }

});