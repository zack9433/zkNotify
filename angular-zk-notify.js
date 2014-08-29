;(function() { 'use strict';
  angular.module('zkNotify', [])
    .constant('NOTIFY_TIMEOUT', 6000)
    .provider('zkNotifyConfig', function(NOTIFY_TIMEOUT) {

      var config, self;

      self = this;
      config = {};

      config.notifyTimeout = NOTIFY_TIMEOUT;

      self.setNotifyTimeout = function(timeout) {
        config.notifyTimeout  = timeout;
      };

      self.getNotifyTimeout = function() {
        return config.notifyTimeout;
      };

      this.$get = function() {
        return {
          setNotifyTimeout: self.setNotifyTimeout,
          getNotifyTimeout: self.getNotifyTimeout
        };
      };
    })
    .service('zkNotifySrv', ['zkNotifyConfig', '$timeout', function zkNotifySrv(zkNotifyConfig, $timeout) {

      var self = this;

      this.isShow = false;
      this.message = null;

      this.setNotifyMsg = function(msg) {

        self.message = msg;
        self.showNotifyMsg();

        var timeout = zkNotifyConfig.getNotifyTimeout();

        if (timeout > 0) {
          $timeout(function() {
            self.hideNotifyMsg();
          }, timeout);
        }
      };

      this.getNotifyMsg = function() {
        return self.message;
      };

      this.showNotifyMsg = function() {
        self.isShow = true;
      };

      this.hideNotifyMsg = function() {
        self.isShow = false;
      };

    }])
    .directive('zkNotify',
      ['$rootScope', '$timeout', 'zkNotifySrv', 'zkNotifyConfig',
      function ($rootScope, $timeout, zkNotifySrv, zkNotifyConfig) {
      return {
        templateUrl: 'angular-zk-notify.html',
        restrict: 'EA',
        replace: true,
        scope: {},
        link: function postLink(scope, element, attrs) {

          var timeout, timer;

          if (attrs.timeout) {
            zkNotifyConfig.setNotifyTimeout(scope.$eval(attrs.timeout));
          }

          timeout = zkNotifyConfig.getNotifyTimeout();
          scope.notify = zkNotifySrv;

          if (angular.isDefined(attrs.message)) {

            attrs.$observe('message', function(value) {

              if (value) {
                scope.notify.setNotifyMsg(value);
              } else {
                scope.notify.hideNotifyMsg();
              }
            });
          }

          scope.closeNotify = function() {
            scope.notify.hideNotifyMsg();
          };

          $rootScope.$on('$locationChangeSuccess', function() {
            scope.closeNotify();
          });
        }
      };
    }]);
}());
