'use strict';

var zkNotifyMgr = function(zkNotifySrv) {
  this.setNotifyMsg = function(msg) {
    zkNotifySrv.setNotifyMsg(msg);
  };
  this.getNotifyMsg = function() {
    return zkNotifySrv.getNotifyMsg();
  };
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
  }])
  .directive('zkNotify', ['$controller', function ($controller) {
    return {
      templateUrl: 'angular-zk-notify.html',
      restrict: 'EA',
      scope: {},
      link: function postLink(scope, element, attrs) {
        var notifyMgr = $controller(zkNotifyMgr);
        scope.message = notifyMgr.getNotifyMsg();
      }
    };
  }]);
