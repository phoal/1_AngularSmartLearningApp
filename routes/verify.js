var User = require('../models/user');
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('../config.js');

exports.getToken = function (user, cb) {
     return jwt.sign(user, config.secretKey, {expiresIn: 3600}, cb);
};

exports.verifyUser = function (req, res, next) {
  next();
};

exports.verifyAdmin = function(req, res, next) {
  next();
} ;
