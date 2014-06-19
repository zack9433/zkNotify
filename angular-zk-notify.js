'use strict';

angular.module('zkNotify', [])
  .constant('NOTIFY_TIMEOUT', 6000)
  .service('zkNotifySrv', [function zkNotifySrv() {
    this.message = null;

    this.setNotifyMsg = function(msg) {
      this.message = msg;
    };

    this.getNotifyMsg = function() {
      return this.message;
    };

  }])
  .directive('zkNotify',
    ['$rootScope', '$timeout', 'zkNotifySrv', 'NOTIFY_TIMEOUT',
    function ($rootScope, $timeout, zkNotifySrv, NOTIFY_TIMEOUT) {
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

        element.css('display', 'none');
        attrs.$observe('message', function(value) {
          if (!value) {
            scope.notify = zkNotifySrv;
          } else {
            scope.notify = {
              message: value
            };
            $timeout(function() {
              element.css('display', 'block');
              scope.notify.message = '';
            }, timeout);
          }
        });

        scope.closeNotify = function() {
          if (timer) {
            $timeout.cancel(timer);
          }
          element.css('display', 'none');
          scope.notify.message = '';
        };

        scope.$watch('notify.message', function(newVal) {
          if (!newVal) {
            return;
          }

          if (timer) {
            $timeout.cancel(timer);
          }

          if (!attrs.message) {
            element.css('display', 'block');
            element.removeClass('hide');
            timer = $timeout(function() {
              element.css('display', 'none');
              zkNotifySrv.setNotifyMsg('');
            }, timeout);
          }
        });

        $rootScope.$on('$locationChangeSuccess', function() {
          scope.closeNotify();
        });
      }
    };
  }]);
