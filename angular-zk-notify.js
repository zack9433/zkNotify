'use strict';

angular.module('zkNotify', [])
  .constant('NOTIFY_TIMEOUT', 6000)
  .service('zkNotifySrv', [function zkNotifySrv() {
    this.message = null;
    this.isShow = false;

    this.setNotifyMsg = function(msg) {
      this.message = msg;
    };

    this.getNotifyMsg = function() {
      return this.message;
    };

  }])
  .directive('zkNotify',
    ['$timeout', 'zkNotifySrv', 'NOTIFY_TIMEOUT', function ($timeout, zkNotifySrv, NOTIFY_TIMEOUT) {
    return {
      templateUrl: 'angular-zk-notify.html',
      restrict: 'EA',
      replace: true,
      scope: {},
      link: function postLink(scope, element, attrs) {
        var timeout = NOTIFY_TIMEOUT, timer;

        if (attrs.timeout) {
          timeout = scope.$eval(attrs.timeout);
        }

        attrs.$observe('message', function(value) {
          if (!value) {
            scope.notify = zkNotifySrv;
          } else {
            scope.notify = {
              message: value,
              isShow: true
            };
            $timeout(function() {
              scope.notify.isShow = false;
              scope.notify.message = '';
            }, timeout);
          }
        });

        scope.closeNotify = function(status) {
          if (timer) {
            $timeout.cancel(timer);
          }
          if (status) {
            scope.notify.isShow = false;
            scope.notify.message = '';
          }
        };

        scope.$watch('notify.message', function(newVal) {
          if (!newVal) {
            return;
          }

          if (timer) {
            $timeout.cancel(timer);
          }

          if (!attrs.message) {
            scope.notify.isShow = true;
            timer = $timeout(function() {
              scope.notify.isShow = false;
              zkNotifySrv.setNotifyMsg('');
            }, timeout);
          }
        });
      }
    };
  }]);
