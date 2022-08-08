const DEL_ALL_TASKS = document.querySelector(".del-op");
const LI_TASKS = document.querySelectorAll("li");
const HAMB_MENU = document.querySelector(".menu");
const BACK_WELCOME_BUTTON = document.querySelector(".back-op");
const GIT_HUB_DEV = document.querySelector(".about-dev-op");
const NO_TASKS = document.querySelector(".no-tasks");
const BTN_DEL_TASKS = document.querySelector(".btn-del-all-tasks");
const BTN_CLOSE_POPUP = document.querySelector(".close-popup");
const BTN_MORE_INFO = document.querySelector(".btn-more-info");
const POPUP = document.querySelector(".all-notification");
const BTN_CONFIRM = document.querySelector("#confirm");
const BTN_CANCEL = document.querySelector("#cancel");
const CONFIRM_DEL_POPUP = document.querySelector(".popup-del");
const BTN_OK = document.querySelector(".ok");

let contOptionsClass = document.querySelector(".cont-options");

function activeMenu() {
  HAMB_MENU.checked
    ? (contOptionsClass.style.display = "flex")
    : (contOptionsClass.style.display = "none");
}

function openPopup() {
  POPUP.style.display = "flex";
}

function closePopup() {
  POPUP.style.display = "none";
}

function confirmToDelete() {
  TASKS_LIST.childElementCount === 0
    ? (NO_TASKS.style.display = "flex")
    : (CONFIRM_DEL_POPUP.style.display = "flex");
}

function confirmDel() {
  deleteAllTasks();
  CONFIRM_DEL_POPUP.style.display = "none";
}

function cancelDel() {
  CONFIRM_DEL_POPUP.style.display = "none";
  contOptionsClass.style.display = "none";
  HAMB_MENU.checked = false;
}

function minimizedNotTasks(){
  NO_TASKS.style.display = "none";
  contOptionsClass.style.display = "none";
  HAMB_MENU.checked = false
}

function deleteAllTasks() {
  while (TASKS_LIST.childElementCount > 0) {
    let allTasks = document.querySelector(".tasks-and-del");
    allTasks.parentNode.removeChild(allTasks);
  }
  minimizedMenu();
}

function minimizedMenu() {
  HAMB_MENU.checked = false;
  contOptionsClass.style.display = "none";
}

function setListenersMenu() {
  HAMB_MENU.addEventListener("click", activeMenu);
  BTN_DEL_TASKS.addEventListener("click", confirmToDelete);
  DEL_ALL_TASKS.addEventListener("click", confirmToDelete);
  BACK_WELCOME_BUTTON.addEventListener("click", minimizedMenu);
  GIT_HUB_DEV.addEventListener("click", minimizedMenu);
  BTN_CLOSE_POPUP.addEventListener("click", closePopup);
  BTN_MORE_INFO.addEventListener("click", openPopup);
  BTN_CONFIRM.addEventListener("click", confirmDel);
  BTN_CANCEL.addEventListener("click", cancelDel);
  BTN_OK.addEventListener("click", minimizedNotTasks)
}

function initMenu() {
  setListenersMenu();
}

initMenu();
