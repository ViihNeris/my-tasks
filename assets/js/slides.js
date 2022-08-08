"use strict";

const SLIDE_WRAPPER = document.querySelector('[data-slide="wrapper"]');
const SLIDE_LIST = document.querySelector('[data-slide="list"]');
const PREVIOUS_BUTTON = document.querySelector(
  '[data-slide="nav-previous-button"]'
);
const NEXT_BUTTON = document.querySelector('[data-slide="nav-next-button"]');
const CONSTROLS_WRAPPER = document.querySelector(
  '[data-slide="controls-wrapper"]'
);
let slideItems = document.querySelectorAll('[data-slide="item"]');
let controlButtons;
let slideInterval;

const STATE = {
  startingPoint: 0,
  savedPosition: 0,
  currentPoint: 0,
  movement: 0,
  currentSlideIndex: 0,
  autoPlay: true,
  timeInterval: 0,
};

function translateSlide({ position }) {
  STATE.savedPosition = position;
  SLIDE_LIST.style.transform = `translateX(${position}px)`;
}

function getCenterPosition({ index }) {
  const SLIDE_ITEM = slideItems[index];
  const SLIDE_WIDTH = SLIDE_ITEM.clientWidth;
  const WINDOW_WIDTH = document.body.clientWidth;
  const MARGIN = (WINDOW_WIDTH - SLIDE_WIDTH) / 2;
  const POSITION = MARGIN - index * SLIDE_WIDTH;
  return POSITION;
}

function setVisibleSlide({ index, animate }) {
  if (index === 0 || index === slideItems.length - 1) {
    index = STATE.currentSlideIndex;
  }
  const POSITION = getCenterPosition({ index });
  STATE.currentSlideIndex = index;
  SLIDE_LIST.style.transition = animate === true ? "transform .5s" : "none";
  activeControlButton({ index });
  translateSlide({ position: POSITION });
}

function nextSlide() {
  setVisibleSlide({ index: STATE.currentSlideIndex + 1, animate: true });
}

function previousSlide() {
  setVisibleSlide({ index: STATE.currentSlideIndex - 1, animate: true });
}

function createControlButtons() {
  slideItems.forEach(function () {
    const CONTROL_BUTTON = document.createElement("button");
    CONTROL_BUTTON.classList.add("slide-control-button");
    CONTROL_BUTTON.classList.add("fas");
    CONTROL_BUTTON.classList.add("fa-circle");
    CONTROL_BUTTON.dataset.slide = "control-button"; //data-slide = 'control-button'
    CONSTROLS_WRAPPER.append(CONTROL_BUTTON);
  });
}

function activeControlButton({ index }) {
  const SLIDE_ITEM = slideItems[index];
  const DATA_INDEX = Number(SLIDE_ITEM.dataset.index);
  const CONTROL_BUTTON = controlButtons[DATA_INDEX];
  controlButtons.forEach(function (controlButtonItem) {
    controlButtonItem.classList.remove("active");
  });
  if (CONTROL_BUTTON) CONTROL_BUTTON.classList.add("active");
}

function createSlideClones() {
  const FIRST_SLIDE = slideItems[0].cloneNode(true);
  FIRST_SLIDE.classList.add("slide-cloned");
  FIRST_SLIDE.dataset.index = slideItems.length;

  const SECOND_SLIDE = slideItems[1].cloneNode(true);
  SECOND_SLIDE.classList.add("slide-cloned");
  SECOND_SLIDE.dataset.index = slideItems.length + 1;

  const LAST_SLIDE = slideItems[slideItems.length - 1].cloneNode(true);
  LAST_SLIDE.classList.add("slide-cloned");
  LAST_SLIDE.dataset.index = -1;

  const PENULTIMATE_SLIDE = slideItems[slideItems.length - 2].cloneNode(true);
  PENULTIMATE_SLIDE.classList.add("slide-cloned");
  PENULTIMATE_SLIDE.dataset.index = -2;

  SLIDE_LIST.append(FIRST_SLIDE);
  SLIDE_LIST.append(SECOND_SLIDE);
  SLIDE_LIST.prepend(LAST_SLIDE);
  SLIDE_LIST.prepend(PENULTIMATE_SLIDE);

  slideItems = document.querySelectorAll('[data-slide="item"]');
}

function onMouseDown(e, index) {
  const SLIDE_ITEM = e.currentTarget;
  STATE.startingPoint = e.clientX;
  STATE.currentPoint = STATE.startingPoint - STATE.savedPosition;
  STATE.currentSlideIndex = index;
  SLIDE_LIST.style.transition = "none";
  SLIDE_ITEM.addEventListener("mousemove", onMouseMove);
}

function onMouseMove(e) {
  STATE.movement = e.clientX - STATE.startingPoint;
  const POSITION = e.clientX - STATE.currentPoint;
  translateSlide({ position: POSITION });
}

function onMouseUp(e) {
  const POINTS_TO_MOVE = e.type.includes("touch") ? 50 : 150;
  const SLIDE_ITEM = e.currentTarget;
  if (STATE.movement < -POINTS_TO_MOVE) {
    nextSlide();
  } else if (STATE.movement > POINTS_TO_MOVE) {
    previousSlide();
  } else {
    setVisibleSlide({ index: STATE.currentSlideIndex, animate: true });
  }
  SLIDE_ITEM.removeEventListener("mousemove", onMouseMove);
}

function onTouchStart(e, index) {
  e.clientX = e.touches[0].clientX;
  onMouseDown(e, index);
  const SLIDE_ITEM = e.currentTarget;
  SLIDE_ITEM.addEventListener("touchmove", onTouchMove);
}

function onTouchMove(e) {
  e.clientX = e.touches[0].clientX;
  onMouseMove(e);
}

function onTouchEnd(e) {
  onMouseUp();
  const SLIDE_ITEM = e.currentTarget;
  SLIDE_ITEM.removeEventListener("touchmove", onTouchMove);
}

function onControlButtonClick(index) {
  setVisibleSlide({ index: index + 2, animate: true });
}

function onSlideListTransitionEnd() {
  const SLIDE_ITEM = slideItems[STATE.currentSlideIndex]

  if (SLIDE_ITEM.classList.contains("slide-cloned") && Number(SLIDE_ITEM.dataset.index) > 0) {
    setVisibleSlide({ index: 2, animate: false });
  }
  if (SLIDE_ITEM.classList.contains("slide-cloned") && Number(SLIDE_ITEM.dataset.index) < 0) {
    setVisibleSlide({ index: slideItems.length - 3, animate: false });
  }
}

function setAutoPlay() {
  if (STATE.autoPlay) {
    slideInterval = setInterval(function () {
      setVisibleSlide({ index: STATE.currentSlideIndex + 1, animate: true });
    }, STATE.timeInterval);
  }
}
function setListeners() {
  controlButtons = document.querySelectorAll('[data-slide="control-button"]');

  controlButtons.forEach(function (controlButton, index) {
    controlButton.addEventListener("click", function (e) {
      onControlButtonClick(index);
    });
  });

  slideItems.forEach(function (slideItem, index) {
    slideItem.addEventListener("dragstart", function (e) {
      e.preventDefault();
    });
    slideItem.addEventListener("mousedown", function (e) {
      onMouseDown(e, index);
    });
    slideItem.addEventListener("mouseup", onMouseUp);
    slideItem.addEventListener("touchstart", function (e) {
      onTouchStart(e, index);
    });
    slideItem.addEventListener("touchend", onTouchEnd);
  });
  NEXT_BUTTON.addEventListener("click", nextSlide);
  PREVIOUS_BUTTON.addEventListener("click", previousSlide);
  SLIDE_LIST.addEventListener("transitionend", onSlideListTransitionEnd);
  SLIDE_WRAPPER.addEventListener("mouseenter", function () {
    clearInterval(slideInterval);
  });

  SLIDE_WRAPPER.addEventListener("mouseleave", function () {
    setAutoPlay();
  });

  let resizeTimeOut;

  window.addEventListener("resize", function () {
    clearTimeout(resizeTimeOut);
    resizeTimeOut = setTimeout(function () {
      setVisibleSlide({ index: STATE.currentSlideIndex, animate: true });
    }, 1000);
  });
}

function initSlider({
  startAtIndex = 0,
  autoPlay = true,
  timeInterval = 3000,
}) {
  STATE.autoPlay = autoPlay;
  STATE.timeInterval = timeInterval;
  createControlButtons();
  createSlideClones();
  setListeners();
  setVisibleSlide({ index: startAtIndex + 2, animate: true });
  setAutoPlay();
}
