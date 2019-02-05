;(function(){
	'use scrict';

		configObm.$inject = ["$urlRouterProvider"];
		MainController.$inject = ["$scope", "$http", "$interval", "IntServ", "$sce"];
		IntouchServer.$inject = ["$http"];
		SetTagCommand.$inject = ["$http"];
	angular
		.module('obm', [
			//'ui.bootstrap',
			'ui.router',
			//'ngAnimate',
	//		'obm.users',
			'obm.home',
			'obm.diag',
			//'obm.alarms',
			'obm.power',
			//'obm.scheduler',
			//'obm.trends',
		//	'obm.ups',
			'obm.odo',
			'obm.settings',
			//'obm.translate',
			//'obm.auth',
			//'obm.login'
		])
		.config(configObm)
		.run(runObm)
		.controller('MainCtrl', MainController)
		.service('IntServ',IntouchServer)
		.service('Command',SetTagCommand)

		function SetTagCommand ($http){
			this.Simple = function(tag_name,value){
				var tag = "%22" + tag_name + "%22";
				var url1 = '/awp/vigor/command.html' + '?' + tag + '=' + value + '&'+Math.random();
				return $http({
					method: 'GET',
					url: url1,
					headers: { 'Content-Type': 'text/plain' }
				});
			}

			this.DBtag = function(DB_name,tag_name,value){
				var tag = "%22" + DB_name + "%22." + tag_name;
				console.log(tag);

				var url1 = '/awp/vigor/command.html' + '?' + tag + '=' + value + '&'+Math.random();
				return $http({
					method: 'GET',
					url: url1,
					headers: { 'Content-Type': 'text/plain' }
				});
			}
		}

		function IntouchServer($http) {

			this.PostRequest = function() {
				return $http({
					method: 'GET',
					url: 'text.json',
					headers: { 'Content-Type': 'application/json' }
				});
			}

		}

		function MainController($scope,$http,$interval,IntServ,$sce){

			var onSuccess = function(response){
				$scope.fullTree = response.data;
				$scope.mode = '0';
				$scope.fullTree.settings.ModeUpdate = '0';
			}

			var onError = function(response){
					console.log('Error reading  ss');
			}

			// главное дерево
			IntServ.PostRequest().then(onSuccess,onError);

			$scope.mainError = false;

			// дизаблим кнопки
			$scope.startDisabled=true;
			$scope.stopDisabled=true;
			$scope.onDisabled=true;
			$scope.offDisabled=true;

			// статус системы
			$scope.globalStatus = "0";

			// Регулярный запрос контроллера
			$interval(function() {
				testRequest();
			},1000);

			var testRequest = function(){

				$http({
					method: 'GET',
					url: '/awp/vigor/siemens.html',
					headers: { 'Content-Type': 'text/plain' }
				})
				.then(function successCallback(response){
					$scope.mainError = false;
					$scope.ajaxloading=false;


					////
					var modules = $scope.fullTree.modules;
					var sensors = $scope.fullTree.sensors;
					var software = $scope.fullTree.software;
					var uNum = 0;

					var html_code = response.data;
					var decoded = angular.element('<textarea />').html(html_code).text();
            		var str = $sce.trustAsHtml(decoded).toString();
            		str = str.replace("'","");


					//window.alert(str);

					var strArr = String(str).split(';');

					//console.log(str);

					$scope.mode = strArr[0];
					$scope.manual = strArr[1];
					$scope.fullTree.settings.ModeUpdate = strArr[2];
					$scope.rack = strArr[7];
					$scope.service = strArr[8];
					$scope.LinuxOnline = strArr[9];
					$scope.WinOnline = strArr[10];
					$scope.ArmOnline = strArr[11];

					var modsArr = String(strArr[3]).split(',');
					var sensArr = String(strArr[4]).split(',');
					var dpsArr = String(strArr[5]).split(',');
					var softArr = String(strArr[6]).split(',');
					// Режимы

					if ($scope.mode == '0'){
						$scope.startDisabled=true;
						$scope.stopDisabled=true;
						$scope.onDisabled=false;
						$scope.offDisabled=true;
					}

					if ($scope.mode == '5'){
						$scope.startDisabled=false;
						$scope.stopDisabled=true;
						$scope.onDisabled=true;
						$scope.offDisabled=false;
					}

					if ($scope.mode == '10'){
						$scope.startDisabled=true;
						$scope.stopDisabled=false;
						$scope.onDisabled=true;
						$scope.offDisabled=true;
					}

					if ($scope.mode == '2'){
						$scope.ajaxloading=true;
						$scope.startDisabled=true;
						$scope.stopDisabled=true;
						$scope.onDisabled=true;
						$scope.offDisabled=false;
					}
					if ($scope.mode == '9'){
						$scope.ajaxloading=true;
						$scope.startDisabled=true;
						$scope.stopDisabled=false;
						$scope.onDisabled=true;
						$scope.offDisabled=true;
					}

					if ($scope.mode == '1'){
						$scope.ajaxloading=true;
						$scope.startDisabled=true;
						$scope.stopDisabled=true;
						$scope.onDisabled=false;
						$scope.offDisabled=true;
					}

					/////


					var arr1 = [];
					var arr2 = [];
					var arr3 = [];
					var alarms = [];


					// модули
					modules.forEach(function(item, i, arr){
						//
						item.status = modsArr[i];

						var num = Math.floor(item.id/1000);
						if (num==1){
							arr1.push(item);
						}
						if (num==2){
							arr2.push(item);
						}
						if (num==3){
							arr3.push(item);
						}
					});


					// сенсоры
					sensors.forEach(function(item, i, arr){

						if (!(item.text == true)) {
							item.value = sensArr[i]/1000;

							if (item.id == '8001'||item.id == '8002'||item.id == '8003'||item.id == '8004'||item.id == '8005') {
								if (item.value > 120){
									item.value = "—";
									item.valid = false;
								}
							}
						} else {
							item.value = sensArr[i];
						}


					});

					software.forEach(function(item, i, arr){
						item.value = Math.round(softArr[i]);
					});

					// dps
					$scope.fullTree.dps.mode = dpsArr[0];
					$scope.fullTree.dps.dir = dpsArr[1];
					$scope.fullTree.dps.speed = dpsArr[2];

					$scope.central = arr1;
					$scope.controllers = arr2;
					$scope.aux = arr3;
					$scope.fullTree.sensors = sensors;
					$scope.fullTree.software = software;
					//$scope.alarms = alarms;

				}, function errorCalback(response){
					console.log('Error reading');
					$scope.mainError = true;
					//$scope.rr = JSON.stringify(response.data);
					//console.log('|||||   ' + response.xhrStatus);
				});


			}


		}


		function configObm($urlRouterProvider){
			//console.log('obm-config');
			$urlRouterProvider.otherwise('/');
		}

		function runObm(){


		}



})();
;(function(){
	'use scrict';

		configAlarms.$inject = ["$stateProvider"];
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
;(function(){
	'use scrict';

		configHome.$inject = ["$stateProvider"];
		HomeController.$inject = ["$scope", "Command"];
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
;(function(){
	'use scrict';

		configOdo.$inject = ["$stateProvider"];
		odometerController.$inject = ["$scope", "Command"];
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
;(function(){
	'use scrict';

		configPower.$inject = ["$stateProvider"];
		PowerController.$inject = ["$scope", "$http"];
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
;(function(){
    'use scrict';

        configSettings.$inject = ["$stateProvider"];
        SettingsController.$inject = ["$scope", "$http"];
    angular
        .module('obm.settings', [
            'ui.router',
        ])

        .config(configSettings)
        .controller('SetCtrl', SettingsController)

        function SettingsController($scope,$http){


        }

        function configSettings($stateProvider){
            var mName = 'settings';


            $stateProvider.state(mName, {
                url: '/' + mName,
                templateUrl: 'app/' + mName + '/index.html',
            });
        }


})();
;(function(){
	'use scrict';

		configUps.$inject = ["$stateProvider"];
	angular
		.module('obm.ups', [
			'ui.router',
		])

		.config(configUps)

		function configUps($stateProvider){
			var mName = 'ups';


			$stateProvider.state(mName, {
				url: '/' + mName,
				templateUrl: 'app/' + mName + '/index.html',
			});
		}


})();
;(function(){
	'use scrict';

		configDiag.$inject = ["$stateProvider"];
		getTreeController.$inject = ["$scope"];
	angular
		.module('obm.diag', [
			'ui.router',
		])

		.config(configDiag)
		.controller('GetTreeCtrl', getTreeController)

		function getTreeController($scope){


		}

		function configDiag($stateProvider){

			var mName = 'diag';
			$stateProvider.state(mName, {
				url: '/' + mName,
				templateUrl: 'app/' + mName + '/index.html',
				controller: 'GetTreeCtrl'
			});
		}


})();