'use strict';

angular.module('zkNotify', [])
  .service('zkNotifySrv', [function zkNotifySrv() {
    this.message = null;

    this.setNotifyMsg = function(msg) {
      this.message = msg;
    };

    this.getNotifyMsg = function() {
      return this.message;
    };

  }])
  .directive('zkNotify', ['$timeout', 'zkNotifySrv', function ($timeout, zkNotifySrv) {
    return {
      templateUrl: 'angular-zk-notify.html',
      restrict: 'EA',
      replace: true,
      scope: {},
      link: function postLink(scope, element, attrs) {
        var timeout = 6000, timer;
        if (attrs.timeout) {
          timeout = scope.$eval(attrs.timeout);
        }

        scope.isNotify = false;
        attrs.$observe('message', function(value) {
          if (!value) {
            scope.message = zkNotifySrv.getNotifyMsg();
          } else {
            scope.message = value;
            scope.isNotify = true;
            $timeout(function() {
              scope.isNotify = false;
            }, timeout);
          }
        });

        scope.$watch(function() {
          return zkNotifySrv.getNotifyMsg();
        }, function(newVal) {
          if (!newVal) {
            return;
          }

          if (timer) {
            $timeout.cancel(timer);
          }

          scope.message = newVal;
          scope.isNotify = true;
          timer = $timeout(function() {
            scope.isNotify = false;
          }, timeout);
        });
      }
    };
  }]);
