'use strict';

var zkNotifyMgr = function($rootScope, $timeout, zkNotifySrv) {
  var timer = null, timeout = 6000;

  this.setNotifyMsg = function(msg) {
    $timeout.cancel(timer);
    zkNotifySrv.setNotifyMsg(msg);
    zkNotifySrv.toggleNotifyMsg();
    timer = $timeout(function() {
      zkNotifySrv.toggleNotifyMsg();
    }, timeout);
  };
  this.getNotifyMsg = function() {
    return zkNotifySrv.getNotifyMsg();
  };
  this.getNotifyMsgStatus = function() {
    return zkNotifySrv.getNotifyMsgStatus();
  };
  this.setTimer = function(time) {
    timeout = time;
  };

  $rootScope.$on('$destroy', function() {
    $timeout.cancel(timer);
  });
};
zkNotifyMgr.$inject = ['$rootScope', '$timeout', 'zkNotifySrv'];

angular.module('zkNotify', [])
  .service('zkNotifySrv', [function zkNotifySrv() {
    this.message = null;

    this.setNotifyMsg = function(msg) {
      this.message = msg;
    };

    this.getNotifyMsg = function() {
      return this.message;
    };

    this.toggleNotifyMsg = function() {
      this.status.isToggleNotifyMsg = !this.status.isToggleNotifyMsg;
    };

    this.getNotifyMsgStatus = function() {
      return this.status.isToggleNotifyMsg;
    };
  }])
  .directive('zkNotify', ['$controller', function ($controller) {
    return {
      templateUrl: 'angular-zk-notify.html',
      restrict: 'EA',
      scope: {},
      link: function postLink(scope, element, attrs) {
        var timeout = scope.$eval(attrs.timeout),
            notifyMgr = $controller(zkNotifyMgr);

        if ('number' === typeof timeout) {
          notifyMgr.setTimer(timeout);
        }

        scope.message = notifyMgr.getNotifyMsg();
      }
    };
  }]);
