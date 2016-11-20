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
  this.index = index;
  this.element = templateContainer.querySelector('.picture').cloneNode(true);

  // Значение поля likes внутрь блока .picture-likes
  this.element.querySelector('.picture-likes').textContent = data.likes;

  // Значение поля comments внутрь блока .picture-comments
  this.element.querySelector('.picture-comments').textContent = data.comments;

  // Все изображения создаёт с помощью new Image() и добавляет им обработчики загрузки и ошибки
  this.templateImage = this.element.querySelector('img');
  this.pictureImage = new Image(this.templateImage.width, this.templateImage.heigth);
  this.pictureImage.alt = 'Ошибка соединения';

  // Обработчик загрузки: после загрузки изображения, укажите тегу <img /> в шаблоне src загруженного изображения и задайте ему размеры 182×182.
  this.onPictureImageLoadSuccess = this.onPictureImageLoadSuccess.bind(this);
  this.pictureImage.addEventListener('load', this.onPictureImageLoadSuccess);

  // Обработчик ошибки: добавьте блоку фотографии .picture класс picture-load-failure.
  this.onPictureImageLoadError = this.onPictureImageLoadError.bind(this);
  this.pictureImage.addEventListener('error', this.onPictureImageLoadError);

  // Обработчик клика - показать изображение
  this.handleClick = this.handleClick.bind(this);
  this.element.addEventListener('click', this.handleClick);

  this.pictureImage.src = data.url;
};

Picture.prototype = {

  onPictureImageLoadSuccess: function(evt) {
    this.templateImage.src = evt.target.src;
  },

  onPictureImageLoadError: function() {
    this.element.classList.add('picture-load-failure');
  },

  handleClick: function(evt) {
    evt.preventDefault();
    gallery.show(this.index);
    return false;
  },

  remove: function() {
    this.pictureImage.removeEventListener('load', this.onPictureImageLoadSuccess);
    this.pictureImage.removeEventListener('error', this.onPictureImageLoadError);
    this.element.removeEventListener('click', this.handleClick);
  }
};

module.exports = Picture;
