;(function(){
	'use scrict';

	angular
		.module('obm.power', [
			'ui.router',
		])

		.config(configPower)
		.controller('PwrCtrl', PowerController)

		function PowerController($scope,$http){

			var onSuccess = function (response){
				//var status1 = response.data;
				//$log.log(status1);
				//$scope.status = status1;
			};

			var onError  = function (response){
				//var status1 = "Error! Data: " + String(response.data) + " StatusText: " + response.statusText + " xhrStatus: " + response.xhrStatus;
				//$log.log(status1);
				//$scope.status = status1;
			};


			$scope.switch = function(power,id,value) {

				console.log('Switch');

				var tag = "%22" + power + "%22";

				if (id >= 2000 && id <2999) {
					tag = "%22Settings%22.Allow" + power;
				}
				var url1 = '/awp/vigor/command.html' + '?' + tag + '=' + value + '&'+Math.random();

				$http({
					method: 'GET',
					url: url1,
					headers: { 'Content-Type': 'text/plain' }
				}).then(onSuccess,onError);

			}


		}

		function configPower($stateProvider){
			var mName = 'power';


			$stateProvider.state(mName, {
				url: '/' + mName,
				templateUrl: 'app/' + mName + '/index.html',
			});
		}


})();