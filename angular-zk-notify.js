'use strict';

var zkNotifyMgr = function(zkNotifySrv) {
  this.setNotifyMsg = function(msg) {
    zkNotifySrv.setNotifyMsg(msg);
  };
  this.getNotifyMsg = function() {
    return zkNotifySrv.getNotifyMsg();
  };
  this.getNotifyMsgStatus = function() {
    return zkNotifySrv.getNotifyMsgStatus();
  };
};
zkNotifyMgr.$inject = ['zkNotifySrv'];

angular.module('zkNotify', [])
  .service('zkNotifySrv', ['$rootScope', '$timeout', function zkNotifySrv($rootScope, $timeout) {
    var timer, timeout = 6000;

    this.message = null;
    this.isToggleNotifyMsg = false;

    this.setNotifyMsg = function(msg) {
      var self = this;
      if (timer) {
        $timeout.cancel(timer);
      }
      self.message = msg;
      self.toggleNotifyMsg();
      timer = $timeout(function() {
        self.toggleNotifyMsg();
      }, timeout);
    };

    this.getNotifyMsg = function() {
      return this.message;
    };

    this.toggleNotifyMsg = function() {
      this.isToggleNotifyMsg = !this.isToggleNotifyMsg;
    };

    this.getNotifyMsgStatus = function() {
      return this.isToggleNotifyMsg;
    };

    $rootScope.$on('$destory', function() {
      $timeout.cancel(timer);
    });
  }])
  .directive('zkNotify', ['$controller', function ($controller) {
    return {
      templateUrl: 'angular-zk-notify.html',
      restrict: 'EA',
      replace: true,
      scope: {},
      link: function postLink(scope, element, attrs) {
        scope.notifyMgr = $controller(zkNotifyMgr);
      }
    };
  }]);
