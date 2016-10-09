'use strict';

function getMessage(a, b) {
  var result;
  if (typeof a === "boolean") {
    if (a) {
      result = "Переданное GIF-изображение анимировано и содержит " + b + " кадров";
    } else {
      result = "Переданное GIF-изображение не анимировано";
    }
  } else if (typeof a === "number") {
    result = "Переданное SVG-изображение содержит " + a + " объектов и " + b*4 + " атрибутов";
  } else if (Array.isArray(a)) {
    if (!Array.isArray(b)) {
      result = "Количество красных точек во всех строчках изображения: " + getArraySum(a);
    } else {
      result = "Общая площадь артефактов сжатия: " + getDotProduct(a, b) + " пикселей";
    }
  } else {
    result = "Переданы некорректные данные";
  }
  return result;
}

function getArraySum(a) {
  return a.reduce(function(a, b) { return a + b; }, 0);
}

function getDotProduct(a, b) {
  var result = 0;
  for (var i = 0; i < a.length; i++) {
    result += a[i] * b[i];
  }
  return result;
}
