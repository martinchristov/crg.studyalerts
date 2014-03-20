'use strict';
var angular;

angular.module('crg.studyalerts', [
		'datePicker'
	]);

//controller
angular.module('crg.studyalerts')
.
controller('StudyAlerts', ['$scope','Studies', function ($scope, Studies) {
	Studies.get(function(d){
		$scope.studies = d;
	});

	$scope.add = function(){
		
		$scope.studies.unshift({
			unsaved:true,
			target:0,
			compare:0,
			value:1,
			msg:'',
			timestamp:new Date(),
			via:0,
			anytime:true
		});
	};
}]);
//service
angular.module('crg.studyalerts')
.
service('Studies', ['$http', function () {
	var studies = {};
	studies.get = function(cb){
		var data = [
			{
				id:21,
				target:1,
				compare:1,
				value:500,
				msg:'goes here',
				timestamp:new Date(),
				anytime:false,
				via:0
			},
			{
				id:22,
				target:2,
				compare:0,
				value:100,
				msg:'something here',
				timestamp:new Date(),
				anytime:true,
				via:1
			}
		];
		cb(data);
	};
	return studies;
}]);

//directives
angular.module('crg.studyalerts')
.
directive('study', [function () {
	return {
		restrict: 'E',
		replace: true,
		templateUrl:'partials/study.html',
		link: function ($scope, el, attrs) {
			$scope.maxsmslen = 40;
			$scope.charsleft = $scope.maxsmslen - $scope.study.msg.length;
			$scope.toggleVia = function(){
				$scope.study.via ++;
				if($scope.study.via>1){
					$scope.study.via=0;
				}
			};
			$scope.toggleCompare = function(){
				$scope.study.compare++;
				if($scope.study.compare>4){$scope.study.compare=0;}
			};
			$scope.toggleTarget = function(){
				$scope.study.target++;
				if($scope.study.target>2){$scope.study.target=0;}
			};
			$scope.del = function(){
				$scope.$parent.studies.splice(attrs.index,1);
			};
			$scope.save = function(){
				$scope.study.unsaved=false;
				$scope.study.changed=false;
			};
			var init=false;
			$scope.$watch('study',function(){
				if(init){
					if($scope.study.unsaved!==false){
						$scope.study.changed=true;
					}
				}
				init=true;
			},true);
			$scope.$watch('study.msg',function(){
				$scope.charsleft = $scope.maxsmslen - $scope.study.msg.length;
			});
		}
	};
}])
.
directive('limitedtext', [function () {
	return {
		restrict: 'E',
		replace:true,
		templateUrl:'partials/limitedtext.html',
		scope:{
			maxlen:'@maxlen',
			placeholder:'@placeholder'
		},
		link: function ($scope) {
			//todo: learn how to do this loosely coupled
			//the directive should not reach out to its parent
			$scope.$parent.$watch('study.msg',function(){
				$scope.charsleft = $scope.maxlen - $scope.$parent.study.msg.length;
			});
		}
	};
}]);

//filters

angular.module('crg.studyalerts')
.
filter('comparers',[function(){
	return function(d){
		var comparers = ['<','≤','=','≥','>'];
		return comparers[d];
	};
}]).
filter('target',[function(){
	return function(d){
		var target = ['participants','calls','available in call list'];
		return target[d];
	};
}]);