/**
 * @fileoverview
 * @author Igor Orlov
 */

'use strict';

var Picture = require('./picture');
var gallery = require('./gallery');
var load = require('./load');
var Utils = require('./utils');

var LOCALSTORAGE_ITEM_FILTER = 'currentFilter';
var PICTURES_URL = 'http://localhost:1507/api/pictures';
var PAGE_SIZE = 12;
var THROTTLE_DELAY = 100;
var GAP = 100;

var filters = document.querySelector('.filters');
var picturesBlock = document.querySelector('.pictures');

var pageNumber = 0;
var currentFilterID = localStorage.getItem(LOCALSTORAGE_ITEM_FILTER) || 'filter-popular';

function isBottomReached() {
  var footerElement = document.querySelector('footer');
  var footerPosition = footerElement.getBoundingClientRect();
  return footerPosition.top - window.innerHeight - GAP <= 0;
}

function clearContent(element) {
  var child = element.firstChild;
  while(child) {
    element.removeChild(child);
    child = element.firstChild;
  }
}

function onFilterChange(evt) {
  clearContent(picturesBlock);
  pageNumber = 0;
  currentFilterID = evt.target.id;
  localStorage.setItem(LOCALSTORAGE_ITEM_FILTER, currentFilterID);
  gallery.reset();
  loadAndRenderNextBlock();
}

// Захват на capture phase
filters.addEventListener('change', onFilterChange, true);

function onWindowScroll() {
  Utils.throttle(function() {
    if (isBottomReached()) {
      loadAndRenderNextBlock();
    }
  }, THROTTLE_DELAY)();
}

function setScrollEnabled() {
  window.addEventListener('scroll', onWindowScroll);
}

/**
 * Сделать активным кнопку с текущим фильтром (при инициализации).
 */
function chooseActiveFilter() {
  filters[currentFilterID].checked = true;
}

function loadAndRenderNextBlock() {
  var from = pageNumber * PAGE_SIZE;
  var to = from + PAGE_SIZE;
  load(PICTURES_URL, { from: from, to: to, filter: currentFilterID }, renderPicturesList);
  pageNumber++;
}

function renderPicturesList(data) {
  var indexFrom = gallery.pictures.length;
  gallery.appendPictures(data);

  // Прячет блок с фильтрами .filters, добавляя ему класс hidden
  filters.classList.add('hidden');

  data.forEach(function(picture, index) {
    var pictureIndex = indexFrom + index;
    var pictureObj = new Picture(picture, pictureIndex);
    picturesBlock.appendChild(pictureObj.element);
  });

  // Отображает блок с фильтрами.
  filters.classList.remove('hidden');

  // Если видно конец страницы, а фотки ещё есть - дозагружаем
  if (isBottomReached() && data.length > 0) {
    loadAndRenderNextBlock();
  }
}

function initPictures() {
  setScrollEnabled();
  chooseActiveFilter();
  loadAndRenderNextBlock();
}

module.exports = initPictures;
