const INPUT = document.querySelector(".task-input");
const ADD_BUTTON = document.querySelector(".btn-add-task");
const TASKS_LIST = document.querySelector(".tasks");

function verifyNull() {
  TASKS_LIST.childElementCount > 0
    ? (document.querySelector(".null").style.display = "none")
    : (document.querySelector(".null").style.display = "flex");
}

function visibilityUL() {
  TASKS_LIST.childElementCount > 0
    ? (TASKS_LIST.style.display = "block")
    : (TASKS_LIST.style.display = "none");
}

ADD_BUTTON.addEventListener("click", function () {
  if (!INPUT.value) return;
  createTask(INPUT.value);
  verifyNull();
  visibilityUL();
});

function keyEnterPress(e) {
  if (e.keyCode === 13) {
    if (!INPUT.value) return;
    createTask(INPUT.value);
    verifyNull();
    visibilityUL();
  }
}

function createTagDiv() {
  const DIV = document.createElement("div");
  DIV.classList.add("class", "tasks-and-del");
  return DIV;
}

function createTagLI() {
  const LI = document.createElement("li");
  return LI;
}

function createDeleteButton(div) {
  const DEL_BUTTON = document.createElement("button");
  div.appendChild(DEL_BUTTON);
  DEL_BUTTON.setAttribute("title", "Excluir tarefa permanentemente.");
  DEL_BUTTON.classList.add("class", "del-button");
  DEL_BUTTON.classList.add("class", "fas");
  DEL_BUTTON.classList.add("class", "fa-trash-alt");
  DeleteTask();
}

function onClickButtonDelete(e) {
  const ELEMENT = e.target;
  if (ELEMENT.classList.contains("del-button")) {
    ELEMENT.parentElement.remove();
  }
  saveTasks();
  verifyNull();
  visibilityUL();
}

function DeleteTask() {
  document.addEventListener("click", onClickButtonDelete);
}

function clearInput() {
  INPUT.value = "";
  INPUT.focus();
}

function createTask(textInput) {
  const DIV = createTagDiv();
  const LI = createTagLI();
  LI.innerText = textInput;
  DIV.appendChild(LI);
  TASKS_LIST.appendChild(DIV);
  clearInput();
  createDeleteButton(DIV);
  saveTasks();
}

function verifyKey() {
  INPUT.addEventListener("keypress", keyEnterPress);
}

function saveTasks() {
  const TOPICS_TASKS = TASKS_LIST.querySelectorAll("li");
  const REFRESH_LIST_TASKS = [];

  for (let task of TOPICS_TASKS) {
    let textTask = task.innerText;
    REFRESH_LIST_TASKS.push(textTask);
  }

  const TASKS_JSON = JSON.stringify(REFRESH_LIST_TASKS);
  localStorage.setItem("TASKS", TASKS_JSON);
}

function triggerSaveTasks() {
  const TASKS = localStorage.getItem("TASKS");
  const TASKS_LIST = JSON.parse(TASKS);

  for (let task of TASKS_LIST) {
    createTask(task);
  }
}

function initTasks() {
  triggerSaveTasks();
  verifyKey();
  verifyNull();
  visibilityUL();
}

initTasks();
