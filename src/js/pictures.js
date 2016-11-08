/**
 * @fileoverview
 * @author Igor Orlov
 */

'use strict';

var Picture = require('./picture');
var gallery = require('./gallery');

var filters = document.querySelector('.filters');
var picturesBlock = document.querySelector('.pictures');

function renderPicturesList(data) {
  gallery.setPictures(data);

  // Прячет блок с фильтрами .filters, добавляя ему класс hidden
  filters.classList.add('hidden');

  data.forEach(function(picture, index) {
    var pictureObj = new Picture(picture, index);
    picturesBlock.appendChild(pictureObj.element);
  });

  // Отображает блок с фильтрами.
  filters.classList.remove('hidden');
}

module.exports = renderPicturesList;
