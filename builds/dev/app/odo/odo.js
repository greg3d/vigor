;(function(){
	'use scrict';

	angular
		.module('obm.odo', [
			'ui.router',
		])

		.config(configOdo)
		.controller('OdoCtrl', odometerController)


		function odometerController($scope,Command){

			var onSuccess = function (response){
				console.log('Done!');
			};

			var onError  = function (response){
				console.log('Error!');
			};

			// functuons
			$scope.odoEmul = function (value){
				if (value==1) {
					Command.Simple('HMI_dps_emul',1);
				} else {
					Command.Simple('HMI_dps_normal',1);
				}
			};

			$scope.odoDir = function (value){
				if (value==1) {
					Command.Simple('HMI_dps_dir0',1);
				} else {
					Command.Simple('HMI_dps_dir1',1);
				}

			};

			$scope.odoSpeedUp = function (value){
					Command.Simple('HMI_dps_speedUp',1);
			};
			$scope.odoSpeedDown = function (value){
					Command.Simple('HMI_dps_speedDown',1);
			};


		}


		function configOdo($stateProvider){
			var mName = 'odo';

			$stateProvider.state(mName, {
				url: '/' + mName,
				templateUrl: 'app/' + mName + '/index.html',
			});
		}


})();