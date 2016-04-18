'use strict';

angular.module('cap')
        .constant("baseURL","http://localhost:3000/")

        .service('courseFactory',['$resource', 'baseURL', function($resource,baseURL) {

            this.getCourses = function(){
               return $resource(baseURL + "courses/:id", null,  {'update':{method:'PUT' }});
            };
            this.getIds = function() {
              return $resource(baseURL + "courses/ids/:ids", null);
            };
        }])
        .factory('registerFactory', ['$resource', 'baseURL', function($resource, baseURL) {
          var regfac = {};
          regfac.register = function() {
            return $resource(baseURL + "users/register/:_id", null);
          };
          regfac.login = function() {
            return $resource(baseURL + "users/login/:_id", null);
          };
          return regfac;

        }])
        .factory('userFactory', ['$resource', 'baseURL', function($resource, baseURL) {
          var userfac = {};
          /* *** UNSAFE STORAGE & TOKEN USAGE - NORMALLY STORED IN LOCAL STORAGE
           AND TRANSFERRED via HTTPS - DEMO ONLY ****/
          var user = {
            //_id: id,
            //courses: [{
              //_id:
              //name:
              //prog:
              //image:
              //category:
            //}]
            //username: un,
            //token: token,
            //curr: currentCourse,
            //currIndex: index WHERE courses[index] = currentCourse,
            member: false
          };
          userfac.updateUser = function(obj) {
            user = Object.assign(user, obj);
          };
          userfac.getUser = function() {
            return user;
          };
          userfac.setCurr = function(currId, currIndex) {
            if (currIndex) userfac.updateUser({curr:currId,currIndex:currIndex});
            else if (user.courses) {
              var ids = user.courses.map(function(el) {return el._id;});
              var index = ids.indexOf(currId);
              if (index >= 0) userfac.updateUser({curr:currId,currIndex:index});
              else userfac.updateUser({curr:currId});
            }
            else userfac.updateUser({curr:currId});
          };
          userfac.getProgress = function(id) {
            if (!user.courses) return false;
            if (!id && user.currIndex) {
              if (!user.courses[user.currIndex].prog) user.courses[user.currIndex].prog = {mark:0};
              return user.courses[user.currIndex].prog;
            }
            var ids = user.courses.map(function(el) {return el._id;});
            var i = id ? id : user.curr;
            console.log("i: " + i);
            console.log(user.curr);
            console.log(ids);
            var index = ids.indexOf(i);
            console.log(index);
            if (index < 0) return false;
            userfac.updateUser({currIndex:index});
            if (!user.courses[index].prog) user.courses[index].prog = {mark:0};
            return user.courses[index].prog;
          };
          userfac.updateProgress = function(obj) {
            var pro = userfac.getProgress();
            Object.assign(pro, obj);
          };
          userfac.getUsers = function() {
            return $resource(baseURL + "users/:email", null, {'update':{method:'PUT' }});
          };
          return userfac;
        }])
/*
        .factory('corporateFactory', ['$resource', 'baseURL',function($resource,baseURL) {

            var corpfac = {};

            // this.getLeader not necessary - use getLeaders().get({id:@id})
            // OPTIONAL 'update' NOT necessary for this assignment for leaders
            // since the web pages just retrieve this info and do not change it.
            corpfac.getLeaders = function() {
              return $resource(baseURL+"leadership/:id",null);
            };

            return corpfac;
        }])

        .factory('feedbackFactory', ['$resource', 'baseURL',function($resource,baseURL) {

            var feedbackfac = {};

            // {'save':{method:'Post' }} already configured in library for $resource -
            // NOT necessary to explicitly configure it.
            // The following is all the configuration necessary to enable 'save'.
            feedbackfac.getFeedback = function() {
              return $resource(baseURL+"feedback/:id",null);
            };

            return feedbackfac;
        }])
*/
;
