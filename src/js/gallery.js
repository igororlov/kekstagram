'use strict';

var Gallery = function() {
  this.pictures = [];
  this.activePicture = 0;
  this.overlayElement = document.querySelector('.gallery-overlay');
  this.overlayCloseElement = this.overlayElement.querySelector('.gallery-overlay-close');
  this.overlayImageElement = this.overlayElement.querySelector('.gallery-overlay-image');
};

Gallery.prototype.setPictures = function(pictures) {
  this.pictures = pictures;
};

Gallery.prototype.show = function(index) {
  // Добавить обработчики
  var self = this;
  this.overlayCloseElement.onclick = function(evt) {
    evt.preventDefault();
    self.hide();
  };
  this.overlayImageElement.onclick = function(evt) {
    evt.preventDefault();
    var nextPictureIndex = (self.activePicture < self.pictures.length - 1) ? self.activePicture + 1 : 0;
    self.setActivePicture(nextPictureIndex);
  };
  // Показать фотогалерею и вызвать setActivePicture
  this.overlayElement.classList.remove('invisible');
  this.setActivePicture(index);
};

Gallery.prototype.hide = function() {
  this.overlayElement.classList.add('invisible');
  // Обнулить обработчики
  this.overlayCloseElement.onclick = null;
  this.overlayImageElement.onclick = null;
};

Gallery.prototype.setActivePicture = function(index) {
  this.activePicture = index;
  var picture = this.pictures[index];
  this.overlayImageElement.src = picture.url;
  this.overlayElement.querySelector('.likes-count').textContent = picture.likes;
  this.overlayElement.querySelector('.comments-count').textContent = picture.comments;
};

module.exports = new Gallery();
