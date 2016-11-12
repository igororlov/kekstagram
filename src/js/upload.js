/* global Cookies: true */

/**
 * @fileoverview
 * @author Igor Alexeenko (o0)
 */

'use strict';

var Resizer = require('./resizer');

/** @enum {string} */
var FileType = {
  'GIF': '',
  'JPEG': '',
  'PNG': '',
  'SVG+XML': ''
};

/** @enum {number} */
var Action = {
  ERROR: 0,
  UPLOADING: 1,
  CUSTOM: 2
};

/**
 * Регулярное выражение, проверяющее тип загружаемого файла. Составляется
 * из ключей FileType.
 * @type {RegExp}
 */
var fileRegExp = new RegExp('^image/(' + Object.keys(FileType).join('|').replace('\+', '\\+') + ')$', 'i');

/**
 * @type {Object.<string, string>}
 */
var filterMap;

/**
 * Объект, который занимается кадрированием изображения.
 * @type {Resizer}
 */
var currentResizer;

/**
 * Удаляет текущий объект {@link Resizer}, чтобы создать новый с другим
 * изображением.
 */
var cleanupResizer = function() {
  if (currentResizer) {
    currentResizer.remove();
    currentResizer = null;
  }
};

/**
 * Ставит одну из трех случайных картинок на фон формы загрузки.
 */
var updateBackground = function() {
  var images = [
    'img/logo-background-1.jpg',
    'img/logo-background-2.jpg',
    'img/logo-background-3.jpg'
  ];

  var backgroundElement = document.querySelector('.upload');
  var randomImageNumber = Math.round(Math.random() * (images.length - 1));
  backgroundElement.style.backgroundImage = 'url(' + images[randomImageNumber] + ')';
};

/**
 * Кнопка "Продолжить".
 */
var resizeForwardBtn = document.getElementById('resize-fwd');

/*
* Обновляет атрибут disabled у кнопки отправки формы в зависимости от её валидности.
*/
function onFormFieldInput() {
  // Проверить видимость resizeForwardBtn
  resizeForwardBtn.disabled = !resizeFormIsValid();
  // Обновить resizer
  var resizeX = 1 * resizeInputX.value;
  var resizeY = 1 * resizeInputY.value;
  var resizeSize = 1 * resizeInputSize.value;
  currentResizer.setConstraint(resizeX, resizeY, resizeSize);
}



/**
 * Проверяет, валидны ли данные, в форме кадрирования.
 * @return {boolean}
 */
var resizeFormIsValid = function() {
  var imWidth = currentResizer._image.naturalWidth;
  var imHeight = currentResizer._image.naturalHeight;
  var resizeX = 1 * resizeInputX.value;
  var resizeY = 1 * resizeInputY.value;
  var resizeSize = 1 * resizeInputSize.value;
  var isValid = (resizeX + resizeSize <= imWidth) &&
    (resizeY + resizeSize <= imHeight) && (resizeX >= 0) && (resizeY >= 0);

  resizeForwardBtn.disabled = !isValid;

  return isValid;
};

/**
 * Форма загрузки изображения.
 * @type {HTMLFormElement}
 */
var uploadForm = document.forms['upload-select-image'];

/**
 * Форма кадрирования изображения.
 * @type {HTMLFormElement}
 */
var resizeForm = document.forms['upload-resize'];

/**
 * Форма добавления фильтра.
 * @type {HTMLFormElement}
 */
var filterForm = document.forms['upload-filter'];

/**
 * @type {HTMLImageElement}
 */
var filterImage = filterForm.querySelector('.filter-image-preview');

/**
 * @type {HTMLElement}
 */
var uploadMessage = document.querySelector('.upload-message');

/**
 * Объявить поля ввода формы.
 */
var resizeInputX = resizeForm.elements.x;
var resizeInputY = resizeForm.elements.y;
var resizeInputSize = resizeForm.elements.size;

resizeInputX.addEventListener('input', onFormFieldInput);
resizeInputY.addEventListener('input', onFormFieldInput);
resizeInputSize.addEventListener('input', onFormFieldInput);

/**
 * @param {Action} action
 * @param {string=} message
 * @return {Element}
 */
var showMessage = function(action, message) {
  var isError = false;

  switch (action) {
    case Action.UPLOADING:
      message = message || 'Кексограмим&hellip;';
      break;

    case Action.ERROR:
      isError = true;
      message = message || 'Неподдерживаемый формат файла<br> <a href="' + document.location + '">Попробовать еще раз</a>.';
      break;
  }

  uploadMessage.querySelector('.upload-message-container').innerHTML = message;
  uploadMessage.classList.remove('invisible');
  uploadMessage.classList.toggle('upload-message-error', isError);
  return uploadMessage;
};

var hideMessage = function() {
  uploadMessage.classList.add('invisible');
};

/**
 * Обработчик изменения изображения в форме загрузки. Если загруженный
 * файл является изображением, считывается исходник картинки, создается
 * Resizer с загруженной картинкой, добавляется в форму кадрирования
 * и показывается форма кадрирования.
 * @param {Event} evt
 */
uploadForm.addEventListener('change', function(evt) {
  var element = evt.target;
  if (element.id === 'upload-file') {
    // Проверка типа загружаемого файла, тип должен быть изображением
    // одного из форматов: JPEG, PNG, GIF или SVG.
    if (fileRegExp.test(element.files[0].type)) {
      var fileReader = new FileReader();

      showMessage(Action.UPLOADING);

      fileReader.addEventListener('load', function() {
        cleanupResizer();

        currentResizer = new Resizer(fileReader.result);
        currentResizer.setElement(resizeForm);
        uploadMessage.classList.add('invisible');

        uploadForm.classList.add('invisible');
        resizeForm.classList.remove('invisible');

        hideMessage();
        syncResizerAndForm();
      });

      fileReader.readAsDataURL(element.files[0]);
    } else {
      // Показ сообщения об ошибке, если формат загружаемого файла не поддерживается
      showMessage(Action.ERROR);
    }
  }
});

/**
 * Обработка сброса формы кадрирования. Возвращает в начальное состояние
 * и обновляет фон.
 * @param {Event} evt
 */
resizeForm.addEventListener('reset', function(evt) {
  evt.preventDefault();

  cleanupResizer();
  updateBackground();

  resizeForm.classList.add('invisible');
  uploadForm.classList.remove('invisible');
});

/**
 * Обработка отправки формы кадрирования. Если форма валидна, экспортирует
 * кропнутое изображение в форму добавления фильтра и показывает ее.
 * @param {Event} evt
 */
resizeForm.addEventListener('submit', function(evt) {
  evt.preventDefault();

  if (resizeFormIsValid()) {
    var image = currentResizer.exportImage().src;

    var thumbnails = filterForm.querySelectorAll('.upload-filter-preview');
    for (var i = 0; i < thumbnails.length; i++) {
      thumbnails[i].style.backgroundImage = 'url(' + image + ')';
    }

    filterImage.src = image;

    resizeForm.classList.add('invisible');
    filterForm.classList.remove('invisible');
  }
});

/**
 * Сброс формы фильтра. Показывает форму кадрирования.
 * @param {Event} evt
 */
filterForm.addEventListener('reset', function(evt) {
  evt.preventDefault();

  var selectedFilter = Cookies.get('upload-filter');
  if (selectedFilter) {
    filterImage.className = 'filter-image-preview ' + filterMap[selectedFilter];
  }

  filterForm.classList.add('invisible');
  resizeForm.classList.remove('invisible');
});

/**
 * Отправка формы фильтра. Возвращает в начальное состояние, предварительно
 * записав сохраненный фильтр в cookie.
 * @param {Event} evt
 */
filterForm.addEventListener('submit', function(evt) {
  evt.preventDefault();

  var selectedFilter = getSelectedFilter();
  Cookies.set('upload-filter', selectedFilter, { expires: getDaysSinceGraceHoppersBirthday() });

  cleanupResizer();
  updateBackground();

  filterForm.classList.add('invisible');
  uploadForm.classList.remove('invisible');
});

function getDaysSinceGraceHoppersBirthday() {
  var currentYear = new Date().getFullYear();
  var birthdayThisYear = new Date(currentYear, 11, 9);
  var today = new Date();
  today.setHours(0, 0, 0, 0);
  var birthday;
  if (birthdayThisYear < today) {
    birthday = birthdayThisYear;
  } else {
    birthday = birthdayThisYear.setYear(currentYear - 1);
  }
  return Math.floor((today - birthday) / 86400000) + 1;
}

/**
 * Обработчик изменения фильтра. Добавляет класс из filterMap соответствующий
 * выбранному значению в форме.
 */
filterForm.addEventListener('change', function() {
  if (!filterMap) {
    // Ленивая инициализация. Объект не создается до тех пор, пока
    // не понадобится прочитать его в первый раз, а после этого запоминается
    // навсегда.
    filterMap = {
      'none': 'filter-none',
      'chrome': 'filter-chrome',
      'sepia': 'filter-sepia',
      'marvin': 'filter-marvin'
    };
  }

  var selectedFilter = getSelectedFilter();

  // Класс перезаписывается, а не обновляется через classList потому что нужно
  // убрать предыдущий примененный класс. Для этого нужно или запоминать его
  // состояние или просто перезаписывать.
  filterImage.className = 'filter-image-preview ' + filterMap[selectedFilter];
});

function getSelectedFilter() {
  var selectedFilter = [].filter.call(filterForm['upload-filter'], function(item) {
    return item.checked;
  })[0].value;
  return selectedFilter;
}



function syncResizerAndForm() {
  var constraint = currentResizer.getConstraint();
  if (constraint === null) {
    return;
  }
  resizeInputX.value = constraint.x;
  resizeInputY.value = constraint.y;
  resizeInputSize.value = constraint.side;
}

window.addEventListener('resizerchange', syncResizerAndForm);


function initUpload() {
  cleanupResizer();
  updateBackground();
}

module.exports = initUpload;
