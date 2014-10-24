var widget = angular.module('ionicWidget', ['ionic'])


widget.controller("TabController", function ($scope) {

});

widget.controller("ListController", function ($scope, OrientDB, $location, $ionicModal) {


    $scope.$watch("config.source.type", function (data) {

        if (data == 'Array') {
            $scope.data = $scope.config.source.data;
        } else {
            OrientDB.query($scope.config.source.value).then(function (data) {
                $scope.data = data;
            })
        }

    })

    $scope.detail = function (location) {
        $location.path(location)
    }
    $scope.edit = function (item) {
        $location.path($scope.config.editUrl + '/' + item["@rid"].replace("#", ''));
    }
    $scope.getValue = function (d) {
        if ($scope.config.source.type == 'Array') {
            return d;
        } else {
            return d[$scope.config.source.field];
        }
    }

});

widget.controller("FormController", function ($scope, $routeParams, $ionicPopup, OrientDB) {

    $scope.$watch("config.source.value", function (val) {
        if (val) {
            var query = S(val).template($routeParams).s;
            OrientDB.query(query).then(function (data) {
                $scope.data = data[0];
            })
        }
    })
    $scope.save = function () {

        OrientDB.save($scope.data).then(function (data) {

            $scope.data = data
            var alertPopup = $ionicPopup.alert({
                title: '',
                template: "Item saved correctly."
            });
            alertPopup.then(function (res) {

            });
        })
    }
})
widget.controller("CardController", function ($scope, $routeParams, $ionicPopup, OrientDB) {


    $scope.$watch("config.source.value", function (val) {
        if (val) {
            var query = S(val).template($routeParams).s;
            OrientDB.query(query).then(function (data) {
                $scope.data = data[0];
            })
        }
    })


});

widget.controller("ContentController", function ($scope, $routeParams, OrientDB) {


    $scope.$watch("config.source.value", function (val) {
        if (val) {
            var query = S(val).template($routeParams).s;
            OrientDB.query(query).then(function (data) {
                $scope.data = data;
            })
        }
    })


});
widget.controller("HeaderBackController", function ($scope, $window) {


    $scope.back = function () {
        $window.history.back();
    }


});

widget.filter('orid', function () {
    return function (input) {
        return input.replace("#", "");
    }
});
widget.factory('OrientDB', function ($http, $q, $window) {


    return {
        getApp: function () {
            var url = OApp.url;
            var db = OApp.db;
            var text = url + 'command/' + db + "/sql/-/" + 20 + '?format=rid,type,version,class,graph';
            var deferred = $q.defer();
            $http.post(text, 'select from app').success(function (data) {
                deferred.resolve(data.result[0]);
            }).error(function (e) {
                    deferred.reject(e);
                })
            return  deferred.promise;
        },
        save: function (data) {

            var deferred = $q.defer();
            var url = OApp.url;
            var db = OApp.db;
            var rid = data['@rid'];
            var text = url + 'document/' + db + "/" + rid.replace("#", '');
            $http.put(text, data).success(function (d) {
                deferred.resolve(d);
            })
            return  deferred.promise;
        },
        setApp: function (app) {
            var url = OApp.url;
            var db = OApp.db;
            var rid = app['@rid'];
            var deferred = $q.defer();
            if (!rid) {
                var text = url + 'document/' + db;
                app['@class'] = 'App';
                $http.post(text, app).success(function (data) {
                    deferred.resolve(data);
                })
            } else {
                var text = url + 'document/' + db + "/" + rid.replace("#", '');
                $http.put(text, app).success(function (data) {
                    deferred.resolve(data);
                })
            }
            return  deferred.promise;
        },
        query: function (q) {
            var url = OApp.url;
            var db = OApp.db;
            var text = url + 'command/' + db + "/sql/-/" + 20 + '?format=rid,type,version,class,graph';
            var deferred = $q.defer();

            $http.post(text, q).success(function (data) {
                deferred.resolve(data.result);
            })
            return  deferred.promise;
        }
    }
})
