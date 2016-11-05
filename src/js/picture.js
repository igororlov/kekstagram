/**
 * @fileoverview
 * @author Igor Orlov
 */

'use strict';

var gallery = require('./gallery');

var pictureTemplate = document.getElementById('picture-template');
var templateContainer = 'content' in pictureTemplate ? pictureTemplate.content : pictureTemplate;

var Picture = function(data, index) {
  this.data = data;
  this.element = templateContainer.querySelector('.picture').cloneNode(true);

  // Значение поля likes внутрь блока .picture-likes
  this.element.querySelector('.picture-likes').textContent = data.likes;

  // Значение поля comments внутрь блока .picture-comments
  this.element.querySelector('.picture-comments').textContent = data.comments;

  // Все изображения создаёт с помощью new Image() и добавляет им обработчики загрузки и ошибки
  var templateImage = this.element.querySelector('img');
  this.pictureImage = new Image(templateImage.width, templateImage.heigth);
  this.pictureImage.alt = 'Ошибка соединения';

  // Обработчик загрузки: после загрузки изображения, укажите тегу <img /> в шаблоне src загруженного изображения и задайте ему размеры 182×182.
  this.pictureImage.onload = function(evt) {
    templateImage.src = evt.target.src;
  };
  // Обработчик ошибки: добавьте блоку фотографии .picture класс picture-load-failure.
  var self = this;
  this.pictureImage.onerror = function() {
    self.element.classList.add('picture-load-failure');
  };
  // Обработчик клика - показать изображение
  this.element.onclick = function(evt) {
    self.handleClick(evt, index);
  }
  this.pictureImage.src = data.url;
};

Picture.prototype.handleClick = function(evt, index) {
  evt.preventDefault();
  gallery.show(index);
  return false;
};

Picture.prototype.remove = function() {
  this.pictureImage.onload = null;
  this.pictureImage.onerror = null;
  this.element.onclick = null;
};

module.exports = Picture;
