//实例一个模块，用来管理所有的控制器
angular.module('Controllers', [])
    .controller('DemoController', ['$scope', function ($scope) {
        console.log('启动了');
    }])
    //导航菜单
    .controller('NavController', ['$scope', function ($scope) {
        //当行数据
        $scope.navs =  [
            {link: '#/today', text: '今日一刻', icon: 'icon-home'},
            {link: '#/older', text: '往期内容', icon: 'icon-file-empty'},
            {link: '#/author', text: '热门作者', icon: 'icon-pencil'},
            {link: '#/category', text: '栏目浏览', icon: 'icon-menu'},
            {link: '#/favorite', text: '我的喜欢', icon: 'icon-heart'},
            {link: '#/settings', text: '设置', icon: 'icon-cog'}
        ];
    }])

    //今日一刻
    .controller('TodayController', ['$scope', '$http', '$filter', '$rootScope', function ($scope, $http, $filter, $rootScope) {
        //获取计算机时间
        var today = $filter('date')(new Date, 'yyyy-MM-dd');
        // console.log(today);
        $rootScope.title = '今日一刻';
        $rootScope.index = 0;
        $rootScope.loaded = false;

        $http({
            url: './api/today.php',
            method: 'get',
            params: {today: today}
        }).then(function success(info) {
            // console.log(info);
            $rootScope.loaded = true;
            $scope.date = info.data.date;
            $scope.posts = info.data.posts;
        }, function err(info) {
            console.log(info);
        });



    }])

    //往期内容
    .controller('OlderController', ['$scope', '$http', '$rootScope', '$filter',  function ($scope, $http, $rootScope, $filter) {
        $rootScope.title = '往期内容';
        $rootScope.index = 1;
        $rootScope.loaded = false;
        $rootScope.loadedPrev = true;

        var cut = -1;
        $scope.prevs = [];
        var prevs = document.querySelectorAll('.prev');
        var navsHeight = parseFloat(document.querySelector('.navs').offsetHeight);
        var maxDistance;
        var fixed = document.querySelector('.fixed');
        var reqHttp = false;


        function getMaxDistance() {  
            return  parseFloat(document.querySelector('.scroll').scrollHeight - navsHeight);
        }

        function getScrollDistance() {
            return parseFloat(document.querySelector('.scroll').scrollTop);
        }

        function getData() {
            $http({
                url: './api/prev.php',
                params: {cut: cut}
            }).then(function success(info) {
                $scope.prev = info.data.prev;
                $scope.prevs.push($scope.prev);
                $rootScope.loaded = true;

                if (cut == -1) {
                    fixed.innerHTML = $filter('date')($scope.prev.date, 'ddMMM');
                }

                setTimeout(() => {
                    cut = cut -1;
                    reqHttp = false;
                }, 0);

            }, function err(info) {
                reqHttp = false;
                console.log(info);
            });  

        }
       
        getData();

        setInterval(() => {
            $scope.prevs.forEach(function (prev, key) {
                prevs = document.querySelectorAll('.prev');
                var curTop = prevs[key].offsetTop;
                var nextTop = prevs[key].offsetTop + prevs[key].offsetHeight;
                scrollDistance = getScrollDistance();
                var headerHeight = document.querySelector('.header').offsetHeight;
                if (cut < -1) {
                    if (scrollDistance + headerHeight >= curTop  && scrollDistance + headerHeight < nextTop ) {
                        fixed.innerHTML = $filter('date')(prev.date, 'ddMMM');
                        // console.log(fixed.innerHTML);
                    }
                }
            }); 
        }, 500);
        
            
        document.querySelector('.scroll').onscroll = function () {
            if (reqHttp) return;
            if (reqHttp == false) {
                maxDistance = getMaxDistance();
                scrollDistance = getScrollDistance();
                // console.log(scrollDistance);
                // console.log(maxDistance);
                if (scrollDistance >= maxDistance - 10) {
                    reqHttp = true;
                    getData();
                }
            }
        } 
    }])

    //热门作者
    .controller('AuthorController', ['$scope', '$http', '$rootScope', function ($scope, $http, $rootScope) {
        $rootScope.index = 2;
        $rootScope.title = '热门作者';
        $rootScope.loaded = false;

        $http({
            url: './api/author.php'
        }).then(function success(info) {
            console.log(info);
            $rootScope.loaded = true;
            $scope.rec = info.data.rec;
            $scope.all = info.data.all;
        }, function err(info) {
            console.log(info);
        });
    }])

    //作者主页
    .controller('CenterController', ['$scope', '$http', '$rootScope', '$location', function ($scope, $http, $rootScope, $location) {
        var id = $location.search().id;
        $rootScope.title = $location.search().name + '的主页';
        $rootScope.loaded = false;

        $http({
            url: './api/center.php',
            params: {id: id}
        }).then(function success(info) {
            console.log(info);
            $rootScope.loaded = true;
            $scope.author = info.data.author;
            $scope.posts = info.data.posts;
        }, function err(info) {
            console.log(info);
        });
    }])

    //栏目浏览
    .controller('CategoryController', ['$scope', '$http', '$rootScope', function ($scope, $http, $rootScope) {
        $rootScope.index = 3;
        $rootScope.title = '栏目浏览';
        $rootScope.loaded = false;


        $http({
            url: './api/category.php'
        }).then(function success(info) {
            // console.log(info);
            $rootScope.loaded = true;
            $scope.columns = info.data.columns;
        }, function err(info) {
            console.log(info);
        });
    }])

    //当前栏目
    .controller('ListController', ['$scope', '$http', '$rootScope', '$location', function ($scope, $http, $rootScope, $location) {
        var id = $location.search().id;
        $rootScope.title = '文章列表';
        $rootScope.loaded = false;

        $http({
            url: './api/list.php',
            params: {id: id}
        }).then(function success(info) {
            // console.log(info);
            $rootScope.loaded = true;
            $scope.column = info.data.column;
            $scope.posts = info.data.posts;
        }, function err(info) {
            console.log(info);
        });
    }])

    //我的喜欢
    .controller('FavoriteController', ['$scope', '$http', '$rootScope', '$filter', '$window', function ($scope, $http, $rootScope, $filter, $window) {
        $rootScope.loaded = false;
        $rootScope.title = '我的喜欢';
        $rootScope.index = 4;

        /*$http({
            url: './api/favorite.php',
        }).success(function (info) {
            $rootScope.loaded = true;
            $scope.column = info.column;
        });*/

    }])

    //设置
    .controller('SettingsController', ['$rootScope', function ($rootScope) {
        $rootScope.loaded = true;
        $rootScope.title = '设置';
        $rootScope.index = 5;

        /*$http({
            url: './api/settings.php',
        }).success(function (info) {
            $rootScope.loaded = true;
            $scope.column = info.column;
        });*/
    }])




