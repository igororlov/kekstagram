/**
 * @fileoverview
 * @author Igor Orlov
 */

'use strict';

var Picture = require('./picture');
var gallery = require('./gallery');
var load = require('./load');

var filters = document.querySelector('.filters');
var picturesBlock = document.querySelector('.pictures');

var PAGE_SIZE = 12;
var pageNumber = 0;

var THROTTLE_DELAY = 100;

var GAP = 100;

var isBottomReached = function() {
  var footerElement = document.querySelector('footer');
  var footerPosition = footerElement.getBoundingClientRect();
  return footerPosition.top - window.innerHeight - GAP <= 0;
};

function clearContent(element) {
  var child = element.firstChild;
  while(child) {
    element.removeChild(child);
    child = element.firstChild;
  }
}

var currentFilterID = 'filter-popular';
filters.addEventListener('change', function(evt) {
  clearContent(picturesBlock);
  pageNumber = 0;
  currentFilterID = evt.target.id;
  gallery.reset();
  loadAndRenderNextBlock();
}, true); // Захват на capture phase

var setScrollEnabled = function() {
  var lastCall = Date.now();
  window.addEventListener('scroll', function() {
    if (Date.now() - lastCall >= THROTTLE_DELAY) {
      if (isBottomReached()) {
        loadAndRenderNextBlock();
      }
      lastCall = Date.now();
    }
  });
};

function loadAndRenderNextBlock() {
  var from = pageNumber * PAGE_SIZE;
  var to = from + PAGE_SIZE;
  load('http://localhost:1507/api/pictures', { from: from, to: to, filter: currentFilterID }, renderPicturesList);
  pageNumber++;
}

function renderPicturesList(data) {
  gallery.appendPictures(data);

  // Прячет блок с фильтрами .filters, добавляя ему класс hidden
  filters.classList.add('hidden');

  data.forEach(function(picture, index) {
    var pictureObj = new Picture(picture, index);
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
  loadAndRenderNextBlock();
}

module.exports = initPictures;
