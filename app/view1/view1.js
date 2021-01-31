'use strict';

angular.module('myApp.view1', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/view1', {
            templateUrl: 'view1/view1.html',
            controller: 'View1Ctrl'
        });
    }]).controller('View1Ctrl', ['$scope', '$http', '$timeout', function ($scope, $httpClient, $timeout) {

    function closeErrorDialog(){
        document.getElementById("errorDialog").style.display = "none";
    }

    $scope.submitUser = function () {
        var userDTO = {
            name: $scope.name,
            code: $scope.code,
            email: $scope.email,
            address: $scope.address
        };
        var submitData = JSON.stringify(userDTO);
        console.log(userDTO);

        $httpClient.post("http://localhost:8080/rest/api/User.svc/user", submitData).then(function (response) {
            if(response.data.error != null){
                console.log("ERROR");
                document.getElementById("errorDialog").style.display = "block";
                document.getElementById("errorText").innerHTML = response.data.code + "<br/> " + response.data.message;
                $timeout(function () {
                    closeErrorDialog();
                }, 3500);
            }
            console.log(response);
        }).catch(function (error) {
            console.log(error);
            document.getElementById("errorDialog").style.display = "block";
            document.getElementById("errorText").innerHTML = "Service unavailable please contact Admin";
            $timeout(function () {
                closeErrorDialog();
            }, 3500);
        });
    };
    //define function accesable by NG-CLICK in html
    $scope.deleteUser = function (id) {
        console.log(id);
        $httpClient.delete("http://localhost:8080/rest/api/User.svc/user(" + id + ")")
            .then(function (response) {
                var index = 0;
                angular.forEach($scope.arrRec, function(value) {
                    if(value.id == id){
                        $scope.arrRec.splice(index, 1);
                    }
                    index++;
                });
                console.log($scope.arrRec);
            }).catch(function (error) {
            console.log(error);
        });
    };

    $httpClient.get("http://localhost:8080//rest/api/User.svc/users")
        .then(function (response) {
            $scope.arrRec = response.data;
            console.log($scope.arrRec);
        }).catch(function (error) {
        console.log(error);
    });


}]);