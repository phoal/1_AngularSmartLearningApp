'use strict';

angular.module('cap')
        // Using Controller as ctr instead of $scope
        // AppController is a TOP LEVEL controller reserved ONLY for TOP LEVEL data.
        .controller('RegisterController', ['userFactory', 'registerFactory', '$state', function(uF, rF, $state) {
          var self = this;
          this.user = uF.getUser;
          this.errMsg = '';

          this.reset = function() {
            this.user = {};
          };

          this.claim = function() {
            this.user.member = true;
          };
          this.makePost = function() {
            var data = {
              username : this.user.username,
              password : this.user.pw
            };
            if (uF.getUser().pendingId) data = Object.assign(data, {pendingId: uF.getUser().pendingId});
            return data;
          };
          this.login = function() {
            if (uF.getUser().token) {
              jQCalls.toggleModal1();
              return $state.go('app.user');
            }
            rF.login().save(this.makePost())
              .$promise.then(
                  (function(response){
                      uF.updateUser({
                        member: true,
                        token : response.token,
                        courses : response.courses,
                        newCourse: response.newCourse,
                        curr : response.curr ? response.curr : response.newCourse,
                        pendingId: null
                      });
                      jQCalls.toggleModal1();
                      $state.go('app.user');
                  }).bind(this),
                  (function(response) {
                      //this.message = "Error: "+response.status + " " + response.statusText;
                      this.user.member = false;
                      this.errMsg = "Please Register.";
                  }).bind(this));
          };
          this.register = function() {
            if (this.user.member) this.login();
            else {
              rF.register().save(self.makePost())
              .$promise.then(
                  function(response){
                      uF.updateUser({
                        member: true,
                        token : response.token,
                        courses : response.courses,
                        newCourse : response.newCourse,
                        curr : response.curr ? response.curr : response.newCourse,
                        pendingId: null
                      });
                      $state.go('app.user');
                      jQCalls.toggleModal1();
                  },
                  function(response) {
                      //this.message = "Error: "+response.status + " " + response.statusText;
                      self.errMsg = "Unable to register.";
                  });
            }
          };
        }])

        .controller('UserController', ['courseFactory', 'userFactory', function(cF, uF) {
          this.user = uF.getUser();
          this.courses = this.user.courses;
        }])

        .controller('CoursesController', ['courseFactory', 'userFactory', function(cF, uF) {

            this.member = false;
            this.tab = 1;
            this.filtText = 0;
            this.showDetails = false;
            this.showCs = false;
            this.message = "Loading ...";

            var self = this;
            this.courses = cF.getCourses().query(
              function(response) {
                   self.courses = response;
                   self.showCs = true;
               },
               function(response) {
                   self.message = "Error: "+response.status + " " + response.statusText;
             });

             this.select = function(setTab) {
                self.tab = setTab;

                if (setTab === 2) {
                    self.filtText = 1;
                }
                else if (setTab === 3) {
                    this.filtText = 2;
                }
                else if (setTab === 4) {
                    self.filtText = 3;
                }
                else {
                    self.filtText = 0;
                }
            };

            this.isSelected = function (checkTab) {
                return (self.tab === checkTab);
            };

            this.toggleDetails = function() {
                this.showDetails = !this.showDetails;
            };
            this.initLogin = function(id) {
              uF.updateUser({pendingId: id});
              jQCalls.toggleModal1();
              //jQuery('#loginModal').modal('toggle');
            };
        }])

        .controller('CoursController', ['$stateParams', 'courseFactory',
          function( $stateParams, courseFactory) {

            this.showCours = false;
            this.message="Loading ...";
            this.cours = courseFactory.getCourses().get({id: $stateParams.id})
              .$promise.then(
                  function(response){
                      this.cours = response;
                      this.showCours = true;
                  },
                  function(response) {
                      this.message = "Error: "+response.status + " " + response.statusText;
                  });
        }])
        .controller('CorController', ['$scope', '$stateParams', 'courseFactory', 'userFactory',
          function($scope, $stateParams, cF, uF) {
            var cId = $stateParams.id;
            uF.setCurr(cId);
            this.errMsg = "Loading...";
            this.showCor = false;
            this.soln = "";
            this.cor = [];
            this.user = uF.getUser();
            this.progress = uF.getProgress() ? uF.getProgress() : {mark:0};
            var track = this.progress.mark;
            console.log("track");
            console.log(this.progress);
            // Helper fn: (true) -> this.right : (false) -> this.wrong
            this.feedback = function(right) {
              if (this.progress.tries[track] <= 0) return false;
              else if (right) return this.progress.scores[track];
              else return !this.progress.scores[track];
            };
            function convertTo(elem) {
              return function(el) {
                return elem;
              };
            }
            this.right = false;
            this.wrong = false;
            this.cors = cF.getCourses().get({id: $stateParams.id})
              .$promise.then(
                (function(response) {
                  this.cors = response;
                  this.showCor = true;
                  this.cor = response.content[track];
                  this.progress.scores = (this.progress.scores ? this.progress.scores :
                     this.cors.content.map(convertTo(false)));
                  this.progress.tries = (this.progress.tries ? this.progress.tries :
                     this.cors.content.map(convertTo(0)));
                  this.reset();
                }).bind(this),
                (function(response) {
                  this.errMsg = "Error: "+response.status + " " + response.statusText;
                }).bind(this));

            this.shift = function(fwd) {
              if (track <= 0 && !fwd || track >= (this.cors.content.length - 1) && fwd) return;
              if (fwd) track++;
              else track--;
              this.soln = "";
              this.reset();
              this.cor = this.cors.content[track];
            };
            this.solve = function() {
              this.progress.scores[track] = (this.soln === this.cor.answ);
              this.progress.tries[track]++;
              this.reset();
              uF.updateProgress({
                mark : track,
                scores : this.progress.scores,
                tries : this.progress.tries
              });
              console.log(this.progress.scores[track]);
              console.log(this.progress.tries[track]);
              console.log(uF.getProgress());
            };
            this.reset = function() {
              this.right = this.feedback(true);
              this.wrong = this.feedback(false);
            };
               $scope.$on('$locationChangeStart', function (event, next, current) {
                    console.log(current);

                    if (current.match("\/cor/")) {
                        var answer = confirm("Are you sure you want to leave this page?");
                        if (!answer) {
                            event.preventDefault();
                        }else{
                            
                        }
                    }
                });
          }])
/*
        .controller('ContactController', ['this', function(this) {

            this.feedback = {mychannel:"", firstName:"", lastName:"", agree:false, email:"" };

            var channels = [{value:"tel", label:"Tel."}, {value:"Email",label:"Email"}];

            this.channels = channels;
            this.invalidChannelSelection = false;

        }])

        .controller('FeedbackController', ['this', 'feedbackFactory',
          function(this, feedbackFactory) {

            this.sendFeedback = function() {

                console.log(this.feedback);

                if (this.feedback.agree && (this.feedback.mychannel === "")) {
                    this.invalidChannelSelection = true;
                    console.log('incorrect');
                }
                else {
                    // Use save function of resource to Post feedback to server.
                    feedbackFactory.getFeedback().save(this.feedback);
                    // Reset the form.
                    this.invalidChannelSelection = false;
                    this.feedback = {mychannel:"", firstName:"", lastName:"", agree:false, email:"" };
                    this.feedback.mychannel="";
                    this.feedbackForm.$setPristine();
                    console.log(this.feedback);
                }
          };
        }])

        .controller('DishCommentController', ['this', 'menuFactory', function(this, menuFactory) {

            this.mycomment = {rating:5, comment:"", author:"", date:""};

            this.submitComment = function () {

                this.mycomment.date = new Date().toISOString();
                console.log(this.mycomment);

                this.dish.comments.push(this.mycomment);

                menuFactory.getDishes().update({id:this.dish.id},this.dish);

                this.commentForm.$setPristine();

                this.mycomment = {rating:5, comment:"", author:"", date:""};
            };
        }])

        // implement the IndexController and About Controller here
        .controller('IndexController', ['this', 'menuFactory', 'corporateFactory',
            function(this, menuFactory, corporateFactory) {

                  this.showDish = false;
                  this.message="Loading ...";
                  this.showPromotion = false;
                  this.msgPromotion="Loading ...";
                  this.showLeader = false;
                  this.msgLeader="Loading ...";

                  this.dish = menuFactory.getDishes().get({id:0})
                  .$promise.then(
                     function(response){
                         this.dish = response;
                         this.showDish = true;
                     },
                     function(response) {
                         this.message = "Error: "+response.status + " " + response.statusText;
                     });

                  // This requests the promotion data from the resource and
                  // updates the home page by attaching it to this.promotion
                   this.promotion = menuFactory.getPromotions().get({id:0})
                   .$promise.then(
                     function(response) {
                       this.promotion = response;
                       this.showPromotion = true;
                     },
                     function(response) {
                         this.msgPromotion = "Error: "+response.status + " " + response.statusText;
                     }
                   );

                   // This requests the leader data from the resource and
                   // updates the home page by attaching it to this.leader
                  this.leader = corporateFactory.getLeaders().get({id:3})
                  .$promise.then(
                     function(response){
                         this.leader = response;
                         this.showLeader = true;
                     },
                     function(response) {
                         this.msgLeader = "Error: "+response.status + " " + response.statusText;
                     });

        }])

        .controller('AboutController', ['this', 'corporateFactory',
          function(this, corporateFactory) {

            this.showLeaders = false;
            this.msgLeaders="Loading ...";

            // This requests the leaders data from the resource and updates
            // the aboutus page by attaching it to this.leaders
            this.leaders = corporateFactory.getLeaders().query(
              function(response) {
                   this.leaders = response;
                   this.showLeaders = true;
               },
               function(response) {
                   this.msgLeaders = "Error: "+response.status + " " + response.statusText;
             });

        }])

*/
      .filter('level', function() {
        return function(l1,l2) {
          if (l2 === 0) return l1;
          return l1.filter(function(el){
            return el.cat === l2;
          });
        };
      })
;
