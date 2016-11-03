/**
 * @fileoverview
 * @author Igor Orlov
 */

'use strict';

// Создаёт для каждой записи массива pictures блок фотографии на основе шаблона #picture-template.
var pictureTemplate = document.getElementById('picture-template');
var templateContainer = 'content' in pictureTemplate ? pictureTemplate.content : pictureTemplate;

function getPictureElement(picture) {
  var pictureElement = templateContainer.querySelector('.picture').cloneNode(true);

  // Значение поля likes внутрь блока .picture-likes
  pictureElement.querySelector('.picture-likes').textContent = picture.likes;

  // Значение поля comments внутрь блока .picture-comments
  pictureElement.querySelector('.picture-comments').textContent = picture.comments;

  // Все изображения создаёт с помощью new Image() и добавляет им обработчики загрузки и ошибки
  var templateImage = pictureElement.querySelector('img');
  var pictureImage = new Image(templateImage.width, templateImage.heigth);
  pictureImage.alt = 'Ошибка соединения';

  // Обработчик загрузки: после загрузки изображения, укажите тегу <img /> в шаблоне src загруженного изображения и задайте ему размеры 182×182.
  pictureImage.onload = function(evt) {
    templateImage.src = evt.target.src;
  };
  // Обработчик ошибки: добавьте блоку фотографии .picture класс picture-load-failure.
  pictureImage.onerror = function() {
    pictureElement.classList.add('picture-load-failure');
  };

  pictureImage.src = picture.url;

  return pictureElement;
}

module.exports = getPictureElement;
