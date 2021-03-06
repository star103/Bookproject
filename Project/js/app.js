/**
 * Created by Administrator on 2018/1/8.
 */
//入口模块
(function(){
    angular.module('app',['ngRoute','app.directives','app.controllers'])
        .config(function($routeProvider,$locationProvider){
            $locationProvider.hashPrefix('');
            $routeProvider
                .when('/',{
                    templateUrl:'views/home.html',
                    controller:'homeController'
                })
                .when('/sort',{
                    templateUrl:'views/sort.html',
                    controller:'sortController'
                })
                .when('/discovery',{
                    templateUrl:'views/discovery.html'
                })
                .when('/mine',{
                    templateUrl:'views/mine.html',
                    controller:'mineController'
                })
                .when('/login',{
                    templateUrl:'views/login.html',
                    controller:'loginController'
                })
                .when('/search',{
                    templateUrl:'views/search.html',
                    controller:'searchController'
                })
                .when('/detail',{
                    templateUrl:'views/detail.html',
                    controller:'detailController'
                })
                .when('/bookList',{
                    templateUrl:'views/bookList.html',
                    controller:'bookListController'
                })
                .when('/pageCode',{
                    templateUrl:'views/pageCode.html',
                    controller:'pageCodeController'
                })
                .when('/resetPassword',{
                    templateUrl:'views/resetPassword.html',
                    controller:'resetPasswordController'
                })
                .when('/pageShelf',{
                    templateUrl:'views/pageShelf.html',
                    controller:'pageShelfController'
                })
                .when('/myBorrow',{
                    templateUrl:'views/myBorrow.html',
                    controller:'myBorrowController'
                })
                .when('/personalCenter',{
                    templateUrl:'views/personalCenter.html',
                    controller:'personalCenterController'
                })
                .otherwise({redirectTo:'/'})
        });
})();