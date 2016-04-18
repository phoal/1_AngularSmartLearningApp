var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');
var Verify = require('./verify');
var Courses = require('../models/courses');

/* GET users listing. */
router.get('/', Verify.verifyUser, Verify.verifyAdmin, function(req, res, next) {
  // Find all users using the User schema
  User.find({}, function (err, user) {
      if (err) throw err;
      res.json(user);
  });
});

router.get('/:user', Verify.verifyUser, Verify.verifyAdmin, function(req, res, next) {
  User.findOne({_id: req.params.user}, function (err, user) {
      if (err) throw err;
      res.json(user);
  });
});

router.post('/register', function(req, res) {
    User.register(new User({ username : req.body.username }),
        req.body.password, function(err, user) {
        var pId = req.body.pendingId;
        if (err) {
            return res.status(500).json({err: err});
        }
        if(req.body.firstname) {
            user.firstname = req.body.firstname;
        }
        if(req.body.lastname) {
            user.lastname = req.body.lastname;
        }
        if (pId) {
          user.courses = [{_id:pId, prog:{mark:0}}];
        }
        user.save(function(err,user1) {
          if (err) {
            return res.status(500).json({err: err});
          }
            //passport.authenticate('local')(req, res, function () {
            //    return res.status(200).json({status: 'Registration Successful!'});
            //});
            passport.authenticate('local', function(err, user2, info) {
              if (err) {
                return res.status(500).json({err: err});
              }
              if (!user2) {
                return res.status(401).json({
                  err: info
                });
              }
              /*
              ** req.login() called by middleware in passport.authenticate
              req.logIn(user, function(err) {
                if (err) {
                  return res.status(500).json({
                    err: 'Could not log in user'
                  });
                }
                }
                */
              Verify.getToken(user2, function(token) {
                Courses.findOne({_id: pId}, {name: true, img: true, cat: true}, function(err, course) {
                  if (err) return res.status(500).json({err: err});
                  return res.json({
                    token: token,
                    courses: [course],
                    newCourse : pId
                  });
                });
              });
            })(req,res);
          });
    });
});
router.post('/login', function(req, res, next) {
  var pId = req.body.pendingId;
  var chx = false;
  function find(el) {
    return el._id == pId;
  }

  function addTrack(courses, cours, arr) {
    return courses.map(function(el) {
      idx = arr.indexOf(el._id);
      if (idx > -1) {
        el.prog = cours[idx].prog;
      }
      return el;
    });
  }
  function reply(token, usr) {
    var arr = usr.courses.map(function(el) {return el._id;});
    console.log("arr: " + arr);
    Courses.find({_id : {$in : arr}}, {name: true, img: true, cat: true},
      function(err, courses) {
      if (err) {
        return res.status(500).json({err1: err});
      }
      res.status(200).json({
        token: token,
        courses: addTrack(courses, usr.courses, arr),
        newCourse: pId
      });
    });
  }
  passport.authenticate('local', function(err, user, info) {
    if (err) {
      return res.status(500).json({err: err});
      //return next(err);
    }
    if (!user) {
      return res.status(401).json({
        err: info
      });
    }
    Verify.getToken(user, function(token) {
      if (pId) {
        var cs = {
          _id : pId,
          prog : {
            mark : 0
          }
        };
        if (user.courses) {
          if (user.courses.findIndex(find) == -1) {
            user.courses.push(cs);
            chx = true;
          }
        } else {
          user.courses = [{_id:pId, prog:{mark:0}}];
          chx = true;
        }
        if (chx) return user.save(function(err, user1) {
          if (err) return res.status(500).json({err2: err});
          reply(token, user1);
        });
      }
      reply(token, user);
      });
    })(req,res);
  });

router.get('/logout', function(req, res) {
    req.logout();
    res.status(200).json({
    status: 'Bye!'
    });
});

module.exports = router;
