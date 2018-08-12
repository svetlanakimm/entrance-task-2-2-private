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

sliderVertical.addEventListener('scroll', hideArrow);
