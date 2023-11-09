//#region Helper functions and variables.

var JSONfile;

// Gets SVGs from SVGs folder in static folder.
async function getSVG(fileName, parentElement)
{
    let myObject = await fetch(fileName);
    let mySVG = await myObject.text();
    parentElement.innerHTML = mySVG;
}

// Creates a request to update JSON file.
function updateTasks()
{
  let request = new XMLHttpRequest();
  request.open("PUT", "api/Tasks", true);

  var newTasks = JSON.stringify(JSONfile);
  request.setRequestHeader("Content-Type", "application/json");
  request.send(newTasks);
}

//#endregion

//#region Data retrieval and Task list building

document.addEventListener("DOMContentLoaded", getTasks());

// Creates a request, calls an API and retrieves the JSON file.
function getTasks()
{
  let request = new XMLHttpRequest();
  request.onload = () => buildTasks(request);
  request.open("GET", "api/Tasks", true);
  request.send(null);
}

// Builds the tasks saved on the JSON file.
function buildTasks(request)
{
  // if request is ready...
  if (request.readyState == 4 && request.status == 200) 
  {
    let tasksResult = JSON.parse(request.responseText);
    JSONfile = tasksResult;

    // Build task for each item in JSON file.
    for (let item of tasksResult.tasks) 
    {
      let listItem = document.createElement("li");

      let taskName = document.createElement("label");
      taskName.className = "container";
      taskName.innerHTML = item.name;

      let checkBox = document.createElement("input");
      checkBox.setAttribute("type", "checkbox");

      let span = document.createElement("span");
      span.className = "checkmark";

      let dateLabel = document.createElement("label");
      dateLabel.className = "dateLabel";
      dateLabel.innerHTML = item.date;

      let dateDetailBtn = document.createElement("button");
      dateDetailBtn.className = "dateDetailBtn";
      dateDetailBtn.addEventListener("click", showDateDetail);

      getSVG("\\static\\SVGs\\DateLever.svg", dateDetailBtn);

      let datePicker = document.createElement("button");
      datePicker.className = "datePicker";
      datePicker.taskIdentity = item.name;
      datePicker.addEventListener("click", startDatePicking);

      getSVG("\\static\\SVGs\\clock-svgrepo-com.svg", datePicker);

      let priorityBtn = document.createElement("button");
      priorityBtn.className = "priorityBtn";
      priorityBtn.taskIdentity = item.name;
      priorityBtn.elementTriggerer = priorityBtn;
      priorityBtn.addEventListener("click", appearPriorities)

      switch (item.priority)
      {
        case 'low':
          priorityBtn.style.backgroundColor = 'lightblue';
          break;
        case 'medium':
          priorityBtn.style.backgroundColor = 'yellow';
          break;
        case 'high':
          priorityBtn.style.backgroundColor = 'red';
          break;
      }

      let deleteTaskBtn = document.createElement("button");
      deleteTaskBtn.className = "deleteTask";
      deleteTaskBtn.innerHTML = "Remove";
      deleteTaskBtn.taskIdentity = taskName.textContent;
      deleteTaskBtn.addEventListener("click", deleteTask);

      taskName.append(checkBox);
      taskName.append(span);
      taskName.append(dateLabel);
      taskName.append(dateDetailBtn);
      taskName.append(datePicker);
      taskName.append(priorityBtn);
      taskName.append(deleteTaskBtn);

      listItem.append(taskName);
      document.getElementById("tasks").append(listItem);
    }
  }
  else
  {
    console.log("xhttp request problem occurred");
  }
}

//#endregion

//#region Adding a new a task to the list.

// Retrives the addButton and assigns it a function when clicked on.
const addButton = document.getElementById("addButton");
addButton.addEventListener("transitionend", createAddForm)

// Creates a form of elements responsible for adding a task.
function createAddForm(e)
{
  if (e.target.tagName != "BUTTON")
  {
    return;
  }
  
  // Stores the parent element of the button that triggered
  // this function.
  var parentNode = addButton.parentElement;
  addButton.remove();

  // Creates a div containing the listed below elements.
  var addDiv = document.createElement("div");
  addDiv.id = "adderDiv";
  addDiv.addEventListener("transitionend", addTask);

  // Creates an input which is added to the div.
  var textBox = document.createElement("input");
  textBox.id = "textBoxLine";
  textBox.placeholder = "Type in your next task...";
  addDiv.append(textBox);

  // Creates the animated placeholder of the TextBox.
  var placeholder = document.createElement("label");
  placeholder.id = "epicLabel";
  placeholder.className = "defaultColor";
  placeholder.setAttribute("for", "textBoxLine");
  placeholder.textContent = "Type in your next task...";
  placeholder.addEventListener("transitionend", restoreColor);
  addDiv.append(placeholder);

  function restoreColor()
  {
    placeholder.classList.remove("warning");
  }
  
  // Creates a button which is added to the div.
  var finalAddBtn = document.createElement("button");
  finalAddBtn.id = "finalAdd";
  finalAddBtn.className = "textButtons";
  finalAddBtn.textContent = "ADD";
  finalAddBtn.addEventListener("click", disappearingOrWarningTransition);
  addDiv.append(finalAddBtn);

  // Creates a button which is added to the div.
  var deleteAddBtn = document.createElement("button");
  deleteAddBtn.id = "deleteAdd";
  deleteAddBtn.className = "textButtons";
  deleteAddBtn.textContent = "DEL";
  deleteAddBtn.addEventListener("click", disappearAddForm);
  addDiv.append(deleteAddBtn);
  
  // The div is added to the DOM.
  parentNode.append(addDiv);
}

// Responsible for validation of Add form.
function disappearingOrWarningTransition()
{
  // Retrives the input with the user's value.
  var input = document.getElementById("textBoxLine");

  // If the user's value input isn't empty...
  if (input.value != "")
  {
    input.parentElement.className = "whenDisappearing";
  }
  else
  {
    let placeholder = document.getElementById("epicLabel");
    placeholder.classList.add("warning");
  }
  
}

// Activates disappearing transition for the Add form.
function disappearAddForm(e)
{
  e.target.parentElement.className = "whenDisappearing";
}

// Creates a task and adds it to the list.
function addTask(e)
{
  var input = document.getElementById("textBoxLine");

  if (e.target.tagName != "DIV")
  {
    return;
  }
  else if (input.value == "")
  {
    let temporaryParent = e.target.parentElement;
    e.target.remove();
    temporaryParent.append(addButton);
    
    return;
  }
  
  // Input and buttons disappear...
  input.parentElement.remove();

  // A new task is created combining label, checkbox and span.
   
  let li = document.createElement("li");
   
  let label = document.createElement("label");
  label.className = "container";
  label.textContent = input.value;
                                     
  let checkBox = document.createElement("input");
  checkBox.setAttribute("type", "checkbox");
                                     
  let span = document.createElement("span");
  span.className = "checkmark";

  let dateLabel = document.createElement("label");
  dateLabel.className = "dateLabel";
  dateLabel.innerHTML = "04 JAN 2023";
  dateLabel.setAttribute("data-date", "04 JAN 2023");

  let dateShower = document.createElement("button");
  dateShower.className = "dateDetailBtn";
  dateShower.addEventListener("click", showDateDetail);
  
  getSVG("\\static\\SVGs\\DateLever.svg", dateShower);

  let datePicker = document.createElement("button");
  datePicker.className = "datePicker";
  datePicker.addEventListener("click", startDatePicking);
  datePicker.taskIdentity = input.value;

  getSVG("\\static\\SVGs\\clock-svgrepo-com.svg", datePicker);

  let prioritySelector = document.createElement("button");
  prioritySelector.className = "priorityBtn";
  prioritySelector.taskIdentity = input.value;
  prioritySelector.elementTriggerer = prioritySelector;
  prioritySelector.addEventListener("click", appearPriorities)

  let button = document.createElement("button");  
  button.className = "deleteTask";
  button.textContent = "Remove";
  button.taskIdentity = input.value;
  button.addEventListener("click", deleteTask);

  label.append(checkBox);
  label.append(span);
  label.append(dateLabel);
  label.append(dateShower);
  label.append(datePicker);
  label.append(prioritySelector);
  label.append(button);
  li.append(label);

  // The created task is added to the DOM.
  document.getElementById("tasks").append(li);
  // The button is readded to the DOM.
  document.getElementById("main").append(addButton);

  JSONfile.tasks.push({
    "date": "04-JAN-2023",
    "name": input.value,
    "priority": "low"
  });

  // Updates JSON file as a new task has been added.
  updateTasks();
}

//#endregion

//#region Priorities.

// Builds and shows to the user a form where a priority can be chosen. 
function appearPriorities(event)
{
  let prioritySelectionContainer = document.createElement("div");
  prioritySelectionContainer.className = "prioritySelectionContainer";

  let taskLabel = document.createElement("label");
  taskLabel.innerHTML = event.currentTarget.taskIdentity;
  taskLabel.className = "taskName";

  let prioritiesContainer = document.createElement("ul");
  prioritiesContainer.className = "prioritiesContainer";

  for (let counter = 0; counter < 3; counter++)
  {
    let prioritySelection = document.createElement("li");
    prioritySelection.className = "prioritySelection";
    prioritySelection.taskIdentity = event.currentTarget.taskIdentity;
    prioritySelection.elementTriggerer = event.currentTarget;

    switch (counter)
    {
      case 0:
        prioritySelection.classList.add("low");
        break;
      case 1:
        prioritySelection.classList.add("medium");
        break;
      case 2:
        prioritySelection.classList.add("high");
        break;
    }

    prioritySelection.addEventListener("click", setPriority);
    prioritiesContainer.append(prioritySelection);
  }

  prioritySelectionContainer.append(taskLabel);
  prioritySelectionContainer.append(prioritiesContainer);

  let body = document.getElementsByTagName("body")[0];
  body.append(prioritySelectionContainer);

  // Code responsible for disabling the page.
  body.classList.add("disablePage");
  prioritySelectionContainer.classList.add("activatePointerEvents");
  document.getElementsByTagName("header")[0].classList.add("lowOpacity");
  document.getElementsByTagName("main")[0].classList.add("lowOpacity");
}

// Sets the priority of a task after the user has chosen.
function setPriority(event)
{  
  var taskToBeChanged;

  for (let task of JSONfile.tasks)
  {
    if (task.name == event.currentTarget.taskIdentity)
    {
      taskToBeChanged = task;
      break;
    }
  }

  if (event.currentTarget.classList.contains("low"))
  {
    taskToBeChanged.priority = 'low';
    event.currentTarget.elementTriggerer.style.backgroundColor = 'lightblue';
  }
  else if (event.currentTarget.classList.contains("medium"))
  {
    taskToBeChanged.priority = 'medium';
    event.currentTarget.elementTriggerer.style.backgroundColor = 'yellow';
  }
  else if (event.currentTarget.classList.contains("high"))
  {
    taskToBeChanged.priority = 'high';
    event.currentTarget.elementTriggerer.style.backgroundColor = 'red';
  }

  document.body.classList.remove("disablePage");
  document.getElementsByTagName("header")[0].classList.remove("lowOpacity");
  document.getElementsByTagName("main")[0].classList.remove("lowOpacity");

  // Updates JSON file as priority property has been changed.
  updateTasks();
  event.currentTarget.parentElement.parentElement.remove();
}

//#endregion

//#region Date display.

// Displays deadline of the task chosen by the user. 
function showDateDetail(event)
{
  event.currentTarget.classList.toggle("dateLeverSVGRotation");
  event.currentTarget.previousSibling.classList.toggle("dateLabelOpacityOn");
}

//#endregion

//#region Task deletion.

// Deletes a task both client-side and server-side.
function deleteTask(event)
{
  for (let task of JSONfile.tasks)
  {
    if (task.name == event.currentTarget.taskIdentity)
    {
      JSONfile.tasks.splice(JSONfile.tasks.indexOf(task), 1);
      break;
    }
  }

  // Updates JSON file as a task has been deleted.
  updateTasks();
  event.currentTarget.parentElement.parentElement.remove();
}

//#endregion

//#region Date choosing functionalities.

// Builds and shows to the user a form where a date can be chosen.
function startDatePicking(event)
{
  var datePickerContainer = document.createElement("div");
  datePickerContainer.className = "datePickerContainer";

  var taskName = document.createElement("label");
  taskName.className = "taskName";
  taskName.innerHTML = event.currentTarget.taskIdentity;

  var submitDateBtn = document.createElement("button");
  submitDateBtn.className = "submitDateBtn";
  submitDateBtn.innerHTML = "SUBMIT";
  submitDateBtn.elementTriggerer = event.currentTarget;
  submitDateBtn.taskIdentity = event.currentTarget.taskIdentity;
  submitDateBtn.addEventListener("click", setDate);

  var scrollDatePickContainer = document.createElement("div");
  scrollDatePickContainer.className = "scrollDatePickContainer";

  for (let counter = 0; counter < 3; counter++)
  {
    let valueContainer = document.createElement("div");
    valueContainer.className = "valueContainer";

    let centralDateValue = document.createElement("label");
    centralDateValue.className = "centralDateValues";

    switch (counter)
    {
      case 0:
        valueContainer.classList.add("leftValueContainer");
        valueContainer.addEventListener("wheel", dayRotation);
        centralDateValue.innerHTML = "04";
        break;

      case 1:
        valueContainer.addEventListener("wheel", monthRotation);
        centralDateValue.innerHTML = "JAN";
        break;

      case 2:
        valueContainer.classList.add("rightValueContainer");
        valueContainer.addEventListener("wheel", yearRotation);
        centralDateValue.innerHTML = "2023";
        break;
    }

    valueContainer.append(centralDateValue);
    scrollDatePickContainer.append(valueContainer);
  }

  datePickerContainer.append(taskName);
  datePickerContainer.append(submitDateBtn);
  datePickerContainer.append(scrollDatePickContainer);

  let body = document.getElementsByTagName("body")[0];
  body.append(datePickerContainer);
  body.className = "disablePage";

  document.getElementsByTagName("header")[0].classList.add("lowOpacity");
  document.getElementsByTagName("main")[0].classList.add("lowOpacity");

  datePickerContainer.classList.add("activatePointerEvents");
}

// Sets the date chosen by the user and updates the JSON file.
function setDate(event)
{
  var divContainer = event.currentTarget.nextSibling;
  var listOfDateValues = [];

  for (let valueContainer of divContainer.children)
  {
    listOfDateValues.push(valueContainer.children[0].textContent);
  }

  event.currentTarget.elementTriggerer.previousSibling.previousSibling.innerHTML = listOfDateValues[0] + " " + listOfDateValues[1] + " " + listOfDateValues[2];
  
  for (let task of JSONfile.tasks)
  {
    if (task.name == event.currentTarget.taskIdentity)
    {
      task.date = listOfDateValues[0] + '-' + listOfDateValues[1] + '-' + listOfDateValues[2];
      break;
    }
  }

  document.getElementsByTagName("body")[0].classList.remove("disablePage");
  document.getElementsByTagName("header")[0].classList.remove("lowOpacity");
  document.getElementsByTagName("main")[0].classList.remove("lowOpacity");
  
  // Updates the JSON file as the date property has been changed.
  updateTasks();
  event.currentTarget.parentElement.remove();

}

// Allows user to choose a day in the date picking form.
function dayRotation(event)
{
    var verticalMovement = event.deltaY;
    var valueContainer = event.currentTarget;
    var valueLabel = valueContainer.children[0];
    var value = valueLabel.textContent;

    if (value[0] == '0')
    {
        value = value.substring(1);
    }

    var intValue = parseInt(value);

    if (verticalMovement > 0 && intValue < 31)
    {
        value = intValue + 1;
    }
    else if (verticalMovement < 0 && intValue > 1)
    {
        value = intValue - 1;
    }

    if (value.toString().length == 1)
    {
        value = "0" + value;
    }

    valueLabel.innerHTML = value;
}

// Allows user to choose a month in the date picking form.
function monthRotation(event)
{
    var verticalMovement = event.deltaY;
    var valueContainer = event.currentTarget;
    var valueLabel = valueContainer.children[0];
    var value = valueLabel.textContent;
    var monthsList = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

    if (verticalMovement > 0 && value != "DEC")
    {
        value = monthsList[monthsList.indexOf(value) + 1];
    }
    else if (verticalMovement < 0 && value != "JAN")
    {
        value = monthsList[monthsList.indexOf(value) - 1];
    }

    valueLabel.innerHTML = value;
}

// Allows user to choose a year in the date picking form.
function yearRotation(event)
{
    var verticalMovement = event.deltaY;
    var valueContainer = event.currentTarget;
    var valueLabel = valueContainer.children[0];
    var value = valueLabel.textContent;

    if (verticalMovement > 0)
    {
        value = parseInt(value) + 1; 
    }
    else if (verticalMovement < 0 && value != "2023")
    {
        value = parseInt(value) - 1;
    }

    valueLabel.innerHTML = value;
}

//#endregion

//#region Sorting section.

// Finds the sort button and assigns it a functionality when clicked.
const sortBtn = document.getElementById("sortButton");
sortBtn.addEventListener("click", showSortForm);

// Displays to the user a form that allows to choose whether sort the tasks by date or priority.
function showSortForm()
{
  var menu = document.createElement("menu");
  menu.className = "sortFormContainer";
  
  for (let counter = 0; counter < 2; counter++)
  {
    let li = document.createElement("li");
    li.className = "sortOptionContainer";

    let button = document.createElement("button");
    button.className = "sortOption";
    
    switch (counter)
    {
      case 0:
        button.innerHTML = "DATE";
        button.addEventListener("click", sortByDate);
        break;
      case 1:
        button.innerHTML = "PRIORITY";
        button.addEventListener("click", sortByPriority);
        break;
    }

    li.append(button);
    menu.append(li);
  }

  document.body.append(menu);
}

// Sorts tasks by date.
function sortByDate(event)
{
  var tasksContainer = document.getElementById("tasks");
  var listOfTasks = Array.from(tasksContainer.getElementsByTagName("li"));
  var orderingDictionary = {};
  var listToOrder = [];
  var monthsList = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

  for (let task of tasksContainer.children)
  {
    task.remove();
  }

  // For each item in the task list...
  for (let item of listOfTasks)
  {
    // Retrive their set date.
    let dateOfItem = item.children[0].children[2].innerHTML;

    // Add task and its date to the dictionary accordingly.
    orderingDictionary[dateOfItem] = item; 
  }

  listToOrder = Object.keys(orderingDictionary);

  for (let counter = 1; counter < listToOrder.length; counter++)
  {
    for (let secondCounter = 0; secondCounter < listToOrder.length - 1; secondCounter++)
    {
      let item1 = listToOrder[secondCounter];
      let item2 = listToOrder[secondCounter + 1];

      if (parseInt(item2.substring(7)) < parseInt(item1.substring(7)))
      {
        listToOrder.splice(secondCounter, 1, item2);
        listToOrder.splice(secondCounter + 1, 1, item1);
      }
      else if (parseInt(item2.substring(7)) == parseInt(item1.substring(7)))
      {
        if (monthsList.indexOf(item2.substring(3, 6)) < monthsList.indexOf(item1.substring(3, 6)))
        {
          listToOrder.splice(secondCounter, 1, item2);
          listToOrder.splice(secondCounter + 1, 1, item1);
        }
        else if (monthsList.indexOf(item2.substring(3, 6)) == monthsList.indexOf(item1.substring(3, 6)))
        {
          let num1 = item1.substring(0, 2);
          let num2 = item2.substring(0, 2);

          switch (num1.charAt(0))
          {
            case 0:
              num1 = num1.substring(1);
              break;
          }

          switch (num2.charAt(0))
          {
            case 0:
              num2 = num2.substring(1);
              break;
          }

          if (parseInt(num2) < parseInt(num1))
          {
            listToOrder.splice(secondCounter, 1, item2);
            listToOrder.splice(secondCounter + 1, 1, item1);
          }
        }
      }
    }
  }

  for (let orderedItem of listToOrder)
  {
    tasksContainer.append(orderingDictionary[orderedItem]);
  }

  event.currentTarget.parentElement.parentElement.remove();
}

// Sorts tasks by priority.
function sortByPriority(event)
{
  var tasksContainer = document.getElementById("tasks");
  var listOfTasks = Array.from(tasksContainer.getElementsByTagName("li"));
  var orderedList = [];

  for (let task of tasksContainer.children)
  {
    task.remove();
  }

  for (let item of listOfTasks)
  {
    let priority = item.children[0].children[5].style.backgroundColor;

    switch (priority)
    {
      case 'red':
        orderedList.push(item);
        break;
    }
  }

  for (let item of listOfTasks)
  {
    let priority = item.children[0].children[5].style.backgroundColor;

    switch (priority)
    {
      case 'yellow':
        orderedList.push(item);
        break;
    }
  }

  for (let item of listOfTasks)
  {
    let priority = item.children[0].children[5].style.backgroundColor;
    console.log(priority);

    switch (priority)
    {
      case 'lightblue':
        orderedList.push(item);
        break;
    }
  }

  console.log(orderedList);

  for (let item of orderedList)
  {
    tasksContainer.append(item);
  }

  event.currentTarget.parentElement.parentElement.remove();
}

//#endregion