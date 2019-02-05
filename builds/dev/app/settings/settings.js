;(function(){
    'use scrict';

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