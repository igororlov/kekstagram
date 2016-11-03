'use strict';

var load = require('./load');
var pictures = require('./pictures');
var upload = require('./upload');

load('http://localhost:1507/api/pictures', pictures, '__jsonpCallback');
