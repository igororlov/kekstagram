'use strict';

var Gallery = function() {
  this.pictures = [];
  this.activePicture = 0;
  this.overlayElement = document.querySelector('.gallery-overlay');
  this.overlayCloseElement = this.overlayElement.querySelector('.gallery-overlay-close');
  this.overlayImageElement = this.overlayElement.querySelector('.gallery-overlay-image');
};

Gallery.prototype = {
  setPictures: function(pictures) {
    this.pictures = pictures;
  },

  appendPictures: function(pictures) {
    this.pictures = this.pictures.concat(pictures);
  },

  getNextAvailableIndex: function() {
    return this.pictures.length;
  },

  reset: function() {
    this.pictures = [];
    this.activePicture = 0;
  },

  show: function(index) {
    // Обработчик закрытия
    this.onCloseClick = this.onCloseClick.bind(this);
    this.overlayCloseElement.addEventListener('click', this.onCloseClick);

    // Обработчик клика по изображению
    this.onImageClick = this.onImageClick.bind(this);
    this.overlayImageElement.addEventListener('click', this.onImageClick);

    // Показать фотогалерею и вызвать setActivePicture
    this.overlayElement.classList.remove('invisible');
    this.setActivePicture(index);
  },

  onCloseClick: function(evt) {
    evt.preventDefault();
    this.hide();
    window.location.hash = '';
  },

  onImageClick: function(evt) {
    evt.preventDefault();
    var nextPictureIndex = (this.activePicture < this.pictures.length - 1) ? this.activePicture + 1 : 0;
    window.location.hash = 'photo/' + this.pictures[nextPictureIndex].url;
  },

  hide: function() {
    this.overlayElement.classList.add('invisible');
    // Обнулить обработчики
    this.overlayCloseElement.removeEventListener('click', this.onCloseClick);
    this.overlayImageElement.removeEventListener('click', this.onImageClick);
  },

  setActivePicture: function(index) {
    if (typeof index === 'string') {
      index = this.pictures.findIndex(function(pic) {
        return pic.url === index;
      });
    }
    this.activePicture = index;
    var picture = this.pictures[index];
    this.overlayImageElement.src = picture.url;
    this.overlayElement.querySelector('.likes-count').textContent = picture.likes;
    this.overlayElement.querySelector('.comments-count').textContent = picture.comments;
  }
};

module.exports = new Gallery();
