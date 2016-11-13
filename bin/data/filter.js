'use strict';

function daydiff(first, second) {
    return Math.round((second-first)/(1000 * 60 * 60 * 24));
}

module.exports = function(list, filterID) {

  var filtered = list;
  switch (filterID) {
    case 'filter-popular':
      // Ничего не делаем, list уже popular
      break;
    case 'filter-new':
      // фотографии сделанные в течение трех последних дней, отсортированные по убыванию даты (поле created)
      var today = new Date();
      var newestPredicate = function(element) {
        return daydiff(new Date(element.created), today) <= 3;
      };
      var newestSort = function(item1, item2) { return item2.created - item1.created; };
      var filtered = list.filter(newestPredicate).sort(newestSort);
      break;
    case 'filter-discussed':
      // фотографии, отсортированные по убыванию количества комментариев (поле comments)
      var discussedSort = function(item1, item2) { return item2.comments - item1.comments; };
      filtered = list.sort(discussedSort);
      break;
  }
  return filtered;
};
