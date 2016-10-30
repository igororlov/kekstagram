'use strict';

var Resizer = require('resizer');
var upload = require('upload');
var pictures = require('pictures');
var load = require('load');

var PICTURES_URL = 'http://localhost:1507/api/pictures';
load(PICTURES_URL, pictures);
