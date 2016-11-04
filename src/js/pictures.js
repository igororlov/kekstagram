/**
 * @fileoverview
 * @author Igor Orlov
 */

'use strict';

var getPicture = require('./picture');

var filters = document.querySelector('.filters');
var picturesBlock = document.querySelector('.pictures');

function renderPicturesList(data) {
  // Прячет блок с фильтрами .filters, добавляя ему класс hidden
  filters.classList.add('hidden');

  data.forEach(function(picture) {
    var pictureElement = getPicture(picture);
    picturesBlock.appendChild(pictureElement);
  });

  // Отображает блок с фильтрами.
  filters.classList.remove('hidden');
}

module.exports = renderPicturesList;
