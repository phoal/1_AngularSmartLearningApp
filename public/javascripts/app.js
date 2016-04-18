'use strict';

angular.module('cap', ['ui.router', 'ngResource'])
.config(function($stateProvider, $urlRouterProvider) {
        $stateProvider

            // route for the home page
            .state('app', {
                url:'/',
                views: {
                    'header': {
                        templateUrl : 'views/header.html',
                    },
                    'content': {
                        templateUrl : 'views/desc.html',
                    },
                    'footer': {
                        templateUrl : 'views/footer.html',
                    }
                }

            })
            // route for the courses page
            .state('app.courses', {
                url: 'courses',
                views: {
                    'content@': {
                        templateUrl : 'views/courses.html',
                        controller  : 'CoursesController'
                    }
                }
            })
            // route for single course details.
            .state('app.cours', {
              url: 'courses/:id',
              views: {
                'content@': {
                    templateUrl : 'views/cours.html',
                    controller  : 'UserController'
                }
              }
            })
            // route for user's homepage.
            .state('app.user', {
              url: 'user',
              views: {
                'content@': {
                    templateUrl : 'views/user.html',
                    controller  : 'UserController'
                }
              }
            })
            .state('app.cor', {
              url: 'cor/:id',
              views: {
                'content@': {
                  templateUrl : 'views/cor.html',
                  controller : 'CorController'
                }
              }
            } )
/*
            // route for the aboutus page
            .state('app.aboutus', {
                url:'aboutus',
                views: {
                    'content@': {
                        templateUrl : 'views/aboutus.html',
                        controller  : 'AboutController'
      }              }
                }
            })

            // route for the contactus page
            .state('app.contactus', {
                url:'contactus',
                views: {
                    'content@': {
                        templateUrl : 'views/contactus.html',
                        controller  : 'ContactController'
                    }
                }
            })

            // route for the dishdetail page
            .state('app.dishdetails', {
                url: 'menu/:id',
                views: {
                    'content@': {
                        templateUrl : 'views/dishdetail.html',
                        controller  : 'DishDetailController'
                   }
                }
            });
*/;
        $urlRouterProvider.otherwise('/');
    })
;
