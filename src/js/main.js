'use strict';

var load = require('./load');
var drawPictures = require('./pictures');
var initUpload = require('./upload');

initUpload();
load('http://localhost:1507/api/pictures', drawPictures, '__jsonpCallback');
