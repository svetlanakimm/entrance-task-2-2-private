'use strict';

// обработка клика на гамбургер
let toggleBtn = document.querySelector('.main-nav__toggle');

function toggleMenu(e) {
  toggleBtn.classList.toggle('main-nav__toggle-opened');
}

toggleBtn.addEventListener('touchstart', toggleMenu);

// крутилка
function thermostatPopup() {
  let wrap = document.querySelector('#thermostat');
  let triangle = document.querySelector('.thermostat__triangle');
  let temperature = document.querySelector('.thermostat__temperature');

  let coords = wrap.getBoundingClientRect();
  let coordsLeft = coords.left;
  let coordsTop = coords.top;
  let coordsWidth = coords.width;
  let coordsHeight = coords.height;

  let coordsXCenter = coordsLeft + coordsWidth / 2;
  let coordsYCenter = coordsTop + coordsHeight / 2;

  function setTemperature(angle) {
    let currT = 18;
    let deltaT = 360 / 16;
    for (let i = 0; i < 16; i++) {
      if (angle < 180) {
        if ((angle > i * deltaT) && (angle < (i + 1) * deltaT)) {
          temperature.innerHTML = currT + i + 1;
        }
      } else {
        currT = 10;
        if ((angle > i * deltaT) && (angle < (i + 1) * deltaT)) {
          temperature.innerHTML = currT + i - 8;
        }
      }
    }
  }

  function swipeTriangleStart(e) {
    triangle.classList.add('active');
  }

  function swipeTriangleMove(e) {
    let clientX = e.touches[0].clientX;
    let clientY = e.touches[0].clientY;

    let triangleWidth = clientX - coordsXCenter;
    let triangleHeight = clientY - coordsYCenter;
    let hypotenuze = Math.hypot(triangleWidth, triangleHeight);

    let radius = coordsXCenter - coordsLeft;
    let hNew = (radius * triangleHeight) / hypotenuze;

    let angle = 180 - Math.round(Math.acos(hNew / radius) * (180 / Math.PI));
    if ((triangleWidth < 0)) {
      angle = 360 - angle;
    }
    wrap.style.transform = 'rotate(' + angle + 'deg)';
    setTemperature(angle);

    if ((angle < 180) && (angle > 15)) {
      document.querySelector('.thermostat__bg-blackcopy').style.display = 'none';
      document.querySelector('.thermostat__bg-yellowcopy').style.display = 'block';
    }
    if ((angle > 180) && (angle < 345)) {
      document.querySelector('.thermostat__bg-yellowcopy').style.display = 'none';
      document.querySelector('.thermostat__bg-blackcopy').style.display = 'block';
    }
    if ((angle > 345) || (angle < 15)) {
      document.querySelector('.thermostat__bg-blackcopy').style.display = 'none';
      document.querySelector('.thermostat__bg-yellowcopy').style.display = 'none';
    }
  }

  function swipeTriangleEnd(e) {
    triangle.classList.remove('active');
  }

  triangle.addEventListener('touchstart', swipeTriangleStart);
  triangle.addEventListener('touchmove', swipeTriangleMove);
  triangle.addEventListener('touchend', swipeTriangleEnd);
}
thermostatPopup.init = false;

// обработка клика на блок устройства
let devices = document.querySelectorAll('.widget__task-device');
let btnClose = document.querySelectorAll('.button-close');
let btnSubmit = document.querySelectorAll('.button-submit');
let popups = document.querySelectorAll('.popup');

function openPopup(e) {
  let deviceName = e.target.closest('.widget__task-device').querySelector('.widget-task__name').textContent;
  let deviceAction = e.target.closest('.widget__task-device').querySelector('.widget-task__action').textContent;
  let type = e.target.closest('.widget__task-device').dataset.type;
  let popup = document.querySelector("[data-popup-type='" + type + "']" );

  popup.querySelector('.page__title').textContent = deviceName;
  popup.querySelector('.popup__subtitle').textContent = deviceAction;
  popup.style.display = 'block';

  if (!thermostatPopup.init) {
    thermostatPopup();
    thermostatPopup.init = true;
  }
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

for (let i = 0; i < btnSubmit.length; i++) {
  btnSubmit[i].addEventListener('touchend', closePopup);
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
function chooseFilter(e) {
  e.preventDefault();
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
  for (let i = 0; i < filterLists.length; i++) {
    let filterList = filterLists[i];
    filterList.addEventListener('touchend', chooseFilter);
  }
}

let newSelection = '';
let widgetFull = document.querySelector('.widget-full');
let filterList = widgetFull.querySelector('.filter__list');
let filterListLinks = filterList.querySelectorAll('a');

function filter(e) {
  for (let i = 0; i < filterListLinks.length; i++) {
    filterListLinks[i].closest('.filter__item').classList.remove('filter__item-active');
  }
  e.target.closest('.filter__item').classList.add('filter__item-active');
  newSelection = e.target.rel;

  let widgetTasksNot = widgetFull.querySelectorAll('.widget-task:not(.' + newSelection + ')');
  let widgetTasks = widgetFull.querySelectorAll('.widget-task.' + newSelection);
  widgetTasksNot.forEach(function (element) {
    element.style.display = 'none';
  });

  widgetTasks.forEach(function (element) {
    element.style.display = 'flex';
  })
}

filterListLinks.forEach(function (element) {
  element.addEventListener('touchend', filter);
});

//сценарии по 3
let widget3n = document.querySelector('.widget-slider-3n');
let widgetTasks3n = widget3n.querySelectorAll('.widget-task');
const widgetTasks3nLength = widgetTasks3n.length;

if (widgetTasks3nLength > 9) {
  for (let i = 0; i < 9; i++) {
    widgetTasks3n[i].classList.add('widget__task-showed');
  }

  for (let i = 9; i < widgetTasks3nLength; i++) {
    widgetTasks3n[i].classList.add('widget__task-hided');
  }
}

let pageNumberScripts = 1;

function openPrev(e, n) {
  e.preventDefault();
  if (pageNumberScripts <= 1) {
    return false;
  }
  pageNumberScripts--;

  if (pageNumberScripts <= widgetTasks3nLength / n) {
    e.target.parentNode.querySelector('.widget__btn-next').classList.add('widget__btn-active');
  } else {
    e.target.parentNode.querySelector('.widget__btn-next').classList.remove('widget__btn-active');
  }

  if (pageNumberScripts === 1) {
    e.target.classList.remove('widget__btn-active');
  }

  if (pageNumberScripts >= 1) {
    let openedTasks = widget3n.querySelectorAll('.widget__task-showed');
    for (let i = 0; i < openedTasks.length; i++) {
      openedTasks[i].classList.remove('widget__task-showed');
      openedTasks[i].classList.add('widget__task-hided');
    }

    for (let i = (pageNumberScripts - 1) * n; i < pageNumberScripts * n; i++) {
      widgetTasks3n[i].classList.remove('widget__task-hided');
      widgetTasks3n[i].classList.add('widget__task-showed');
    }
  }
}

function openNext(e, n) {
  e.preventDefault();
  let currentCount = 0;
  if (pageNumberScripts > widgetTasks3nLength / n) {
    return false;
  }
  pageNumberScripts++;

  if (pageNumberScripts > 1) {
    e.target.parentNode.querySelector('.widget__btn-prev').classList.add('widget__btn-active');
  } else {
    e.target.parentNode.querySelector('.widget__btn-prev').classList.remove('widget__btn-active');
  }

  if (widgetTasks3nLength > n * pageNumberScripts) {
    currentCount = n * pageNumberScripts;
  } else {
    currentCount = widgetTasks3nLength;
    e.target.classList.remove('widget__btn-active');
  }

  let openedTasks = widget3n.querySelectorAll('.widget__task-showed');
  for (let i = 0; i < openedTasks.length; i++) {
    openedTasks[i].classList.remove('widget__task-showed');
    openedTasks[i].classList.add('widget__task-hided');
  }

  for (let i = (pageNumberScripts - 1) * n; i < currentCount; i++) {
    widgetTasks3n[i].classList.remove('widget__task-hided');
    widgetTasks3n[i].classList.add('widget__task-showed');
  }
}

if (window.screen.width >= 1024 && window.screen.height >= 768) {
  let btnNext3n =  widget3n.parentNode.querySelector('.widget__btn-next');
  let btnPrev3n = widget3n.parentNode.querySelector('.widget__btn-prev');

  btnNext3n.addEventListener('touchend', function(e) {
    openNext(e, 9);
  });

  if (widgetTasks3nLength > 9) {
    widget3n.parentNode.querySelector('.widget__pagination').style.display = 'flex';
    btnNext3n.classList.add('widget__btn-active');
  }

  btnPrev3n.addEventListener('touchend', function(e) {
    openPrev(e, 9);
  });

  if (widgetTasks3nLength > 9) {
    widget3n.parentNode.querySelector('.widget__pagination').style.display = 'flex';
  }
}

//блок Избранные устройства пагинация
if (window.screen.width >= 1024 && window.screen.height >= 768) {
  let pageNumberDevices = 1;
  const deviceWidth = window.innerWidth;
  let widgetHorizontal = document.querySelector('.widget-slider-horizontal');
  let widgetTasksHorizontal = widgetHorizontal.querySelectorAll('.widget-task');
  const widgetTasksHorizontalLength = widgetTasksHorizontal.length;
  let btnNextHorizontal =  widgetHorizontal.parentNode.querySelector('.widget__btn-next');
  let btnPrevHorizontal = widgetHorizontal.parentNode.querySelector('.widget__btn-prev');
  const n = (deviceWidth - 40) / 215;
  const intN = Math.round((deviceWidth - 40) / 215);

  btnNextHorizontal.addEventListener('touchend', function(e) {
    e.preventDefault();
    let currentCount = 0;
    if (pageNumberDevices > widgetTasksHorizontalLength / intN) {
      return false;
    }
    pageNumberDevices++;

    if (pageNumberDevices > 1) {
      btnPrevHorizontal.classList.add('widget__btn-active');
    }

    if (widgetTasksHorizontalLength > intN * pageNumberDevices) {
      currentCount = intN * pageNumberDevices;
    } else {
      currentCount = widgetTasksHorizontalLength;
      e.target.classList.remove('widget__btn-active');
    }

    let openedTasks = widgetHorizontal.querySelectorAll('.widget__task-showed');
    for (let i = 0; i < openedTasks.length; i++) {
      openedTasks[i].classList.remove('widget__task-showed');
      openedTasks[i].classList.add('widget__task-hided');
    }

    for (let i = (pageNumberDevices - 1) * intN; i < currentCount; i++) {
      widgetTasksHorizontal[i].classList.remove('widget__task-hided');
      widgetTasksHorizontal[i].classList.add('widget__task-showed');
    }

  });

  btnPrevHorizontal.addEventListener('touchend', function(e) {
    e.preventDefault();
    if (pageNumberDevices <= 1) {
      return false;
    }
    pageNumberDevices--;

    if (pageNumberDevices === 1) {
      e.target.classList.remove('widget__btn-active');
      btnNextHorizontal.classList.add('widget__btn-active');
    }

    if (pageNumberDevices >= 1) {
      let openedTasks = widgetHorizontal.querySelectorAll('.widget__task-showed');
      for (let i = 0; i < openedTasks.length; i++) {
        openedTasks[i].classList.remove('widget__task-showed');
        openedTasks[i].classList.add('widget__task-hided');
      }

      for (let i = (pageNumberDevices - 1) * intN; i < pageNumberDevices * intN; i++) {
        widgetTasksHorizontal[i].classList.remove('widget__task-hided');
        widgetTasksHorizontal[i].classList.add('widget__task-showed');
      }
    }

  });

  if (widgetTasksHorizontalLength > intN) {
    for (let i = 0; i < intN; i++) {
      widgetTasksHorizontal[i].classList.add('widget__task-showed');
    }

    widgetHorizontal.parentNode.querySelector('.widget__pagination').style.display = 'flex';
    btnNextHorizontal.classList.add('widget__btn-active');
  }
}
