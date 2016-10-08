function getMessage(a, b) {
  var result;
  if (typeof a === "boolean") {
    if (a) {
      result = "Переданное GIF-изображение анимировано и содержит [b] кадров".replace("[b]", b);
    } else {
      result = "Переданное GIF-изображение не анимировано";
    }
  } else if (typeof a === "number") {
    result = "Переданное SVG-изображение содержит [a] объектов и [b * 4] атрибутов".replace("[a]", a).replace("[b * 4]", b*4);
  } else if (Array.isArray(a)) {
    if (!Array.isArray(b)) {
      result = "Количество красных точек во всех строчках изображения: [amountOfRedPoints]".replace("[amountOfRedPoints]", arraySum(a));
    } else {
      result = "Общая площадь артефактов сжатия: [artifactsSquare] пикселей".replace("[artifactsSquare]", dotProduct(a, b));
    }
  } else {
    result = "Переданы некорректные данные";
  }
  return result;
}

function arraySum(a) {
  return a.reduce(function(a, b) { return a + b; }, 0);
}

function dotProduct(a, b) {
  var result = 0;
  for (var i = 0; i < a.length; i++) {
    result += a[i] * b[i];
  }
  return result;
}
