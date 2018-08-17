'use strict';

// обработка клика на гамбургер
let toggleBtn = document.querySelector('.main-nav__toggle');

function toggleMenu(e) {
  toggleBtn.classList.toggle('main-nav__toggle-opened');
}

toggleBtn.addEventListener('touchstart', toggleMenu);

// обработка клика на блок устройства
let devices = document.querySelectorAll('.widget__task-device');
let btnClose = document.querySelectorAll('.button-close');
let popups = document.querySelectorAll('.popup');

function openPopup(e) {
  let deviceName = e.target.closest('.widget__task-device').querySelector('.widget-task__name').textContent;
  let deviceAction = e.target.closest('.widget__task-device').querySelector('.widget-task__action').textContent;
  let type = e.target.closest('.widget__task-device').dataset.type;
  let popup = document.querySelector("[data-popup-type='" + type + "']" );

  popup.querySelector('.page__title').textContent = deviceName;
  popup.querySelector('.popup__subtitle').textContent = deviceAction;
  popup.style.display = 'block';
}

function closePopup() {
  for (let i = 0; i < popups.length; i++) {
    popups[i].style.display = 'none';
  }
}

for (let i = 0; i < devices.length; i++) {
  devices[i].addEventListener('touchend', openPopup);
}

for (let i = 0; i < btnClose.length; i++) {
  btnClose[i].addEventListener('touchend', closePopup);
}

// скрытие стрелки при скролле
let sliderVertical = document.querySelector('.widget-slider-vertical');
let sliderVerticalArrow = document.querySelector('.widget__arrow');

function hideArrow() {
  if (sliderVertical.scrollTop > 0) {
    sliderVerticalArrow.style.display = 'none';
  } else {
    sliderVerticalArrow.style.display = 'block';
  }
}

if (window.screen.width >= 1024 && window.screen.height >= 768) {
  sliderVertical.addEventListener('scroll', hideArrow);
}

// фильтр
let filterActive = document.querySelector('.page-content .filter__item-active');
console.log(filterActive);
let filterList = document.querySelectorAll('.page-content .filter__item');


function chooseFilter(e) {
  const filter = e.target.closest('.filter__list');
  const closed = filter.classList.contains('filter__list-closed');
  const items = filter.querySelectorAll('.filter__item');
  if (closed) {
    // show options
    filter.classList.remove('filter__list-closed');
    filter.classList.add('filter__list-opened');
  }
  else {
    for (let i = 0; i < items.length; i++) {
      items[i].style.order = 0;
      items[i].classList.remove('filter__item-active');
    }
    const item = e.target.closest('.filter__item');
    item.style.order = -1;
    item.classList.add('filter__item-active');

    // close options
    filter.classList.remove('filter__list-opened');
    filter.classList.add('filter__list-closed');
  }
}


if (window.screen.width <= 1024) {
  let filterLists = document.querySelectorAll('.filter__list');
  for (let i = 0; i < filterLists.length; i++){
    let filterList = filterLists[i];
    filterList.addEventListener('touchend', chooseFilter)
  }
}

//сценарии по 3
let widget3n = document.querySelector('.widget-slider-3n');
let widgetTasks = widget3n.querySelectorAll('.widget-task');

if (widgetTasks.length > 9) {
  widget3n.parentNode.querySelector('.widget__pagination').style.display = 'flex';
}


