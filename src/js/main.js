'use strict';

var load = require('./load');
var drawPictures = require('./pictures');
var upload = require('./upload');

load('http://localhost:1507/api/pictures', drawPictures, '__jsonpCallback');
