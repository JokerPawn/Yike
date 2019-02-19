var Yike = angular.module('Yike', ['ngRoute', 'Controllers', 'Directives']);
Yike.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/today', {
        templateUrl: './views/today.html',
        controller: 'TodayController'
    }).when('/older', {
        templateUrl: './views/older.html',
        controller: 'OlderController'
    }).when('/author', {
        templateUrl: './views/author.html',
        controller: 'AuthorController'
    }).when('/category', {
        templateUrl: './views/category.html',
        controller: 'CategoryController'
    })/*.when('/favorite', {
        templateUrl: './views/favorite.html',
        controller: 'FavoriteController'
    })*/.when('/settings', {
        templateUrl: './views/settings.html',
        controller: 'SettingsController'
    }).when('/center', {
        templateUrl: './views/center.html',
        controller: 'CenterController'
    }).when('/list', {
        templateUrl: './views/list.html',
        controller: 'ListController'
    })/*.when('/login', {
        templateUrl: './views/login.html',
        controller: 'LoginController'
    })*/.otherwise({
        redirectTo: '/today'
    });
}]);

Yike.run(['$rootScope', function ($rootScope) {
    //设置类名初始值
    $rootScope.collapsed = false;
    //全局方法
    $rootScope.toggle = function () {
        //改类名初始值
        $rootScope.collapsed = !$rootScope.collapsed;
        //获取所有导航
        var navs = document.querySelectorAll('.navs dd');
        if ($rootScope.collapsed) {
            // console.log('打开导航');
            for (var i = 0; i < navs.length; i++) {
                navs[i].style.transform = 'translate(0)';
                navs[i].style.transitionDelay = '0.2s';
                navs[i].style.transitionDuration = (i + 1) * 0.1 + 's';
            }
        } else {
            // console.log('关闭导航');
            var len = navs.length - 1;
            for (var j = len; j > 0 ; j--) {
                navs[j].style.transform = 'translate(-100%)';
                navs[j].style.transitionDelay = '';
                navs[j].style.transitionDuration = (len - j) * 0.16 + 's';
            }
        }
    }

}]);

