;(function(){
	'use scrict';

	angular
		.module('obm.alarms', [
			'ui.router',
		])

		.config(configAlarms)

		function configAlarms($stateProvider){
			var mName = 'alarms';


			$stateProvider.state(mName, {
				url: '/' + mName,
				templateUrl: 'app/' + mName + '/index.html',
			});
		}


})();