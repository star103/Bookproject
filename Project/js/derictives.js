/**
 * Created by Administrator on 2018/1/8.
 */
(function () {
    angular.module('app.directives', [])
        .directive('pageNav', function () {
            return {
                restrict: 'EA',
                replace: true,
                templateUrl: 'templates/pageNav.html',
                scope: {
                    selectedIndex: '@'
                }
            }
        })
        .directive('myAlert', function () {
            return {
                restrict: 'EA',
                replace: true,
                templateUrl: 'templates/alert.html',
                scope: {
                    title: '@',
                    content: '@',
                    state: '='
                },
                controller: function ($scope, $timeout) {
                    //$scope.$watch('state', function () {
                    //    if ($scope.state) {
                    //        $timeout(function () {
                    //            $scope.state = false;
                    //        }, 3000);
                    //    }
                    //});


                    $scope.btnClose_onclick = function () {
                        $scope.state = false;
                    }
                }

            };
        });
})();