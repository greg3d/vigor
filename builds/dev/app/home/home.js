;(function(){
	'use scrict';

	angular
		.module('obm.home', [
			'ui.router',
		])

		.config(configHome)
		.controller('HomeCtrl', HomeController)

		function HomeController($scope,Command){

			var onSuccess = function (response){
				console.log('Done!');
			};

			var onError  = function (response){
				console.log('Error!');
			};

			// functuons
			$scope.startMeasure = function (){
				Command.Simple('HMI_StartMeasure',1);

			};

			$scope.stopMeasure = function (){
				Command.Simple('HMI_StopMeasure',1);
			};

			$scope.powerOn = function (){
				Command.Simple('HMI_TurnOn',1);
			};

			$scope.powerOff = function (){
				Command.Simple('HMI_PowerOFF',1);
			}


			////////////////////// degub
			$scope.DebugOn = function (){
				Command.DBtag('Settings','ModeUpdate',1);
			}

			$scope.DebugOff = function (){
				Command.DBtag('Settings','ModeUpdate',0);
			}

		}

		function configHome($stateProvider){
			var mName = 'home';


			$stateProvider.state(mName, {
				url: '/',
				templateUrl: 'app/' + mName + '/index.html',
				controller: 'HomeCtrl',
				controllerAs: 'hc'
			});
		}
})();