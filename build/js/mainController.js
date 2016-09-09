/**
 * Created by ISMAIL on 9/5/2016.
 */
var app = angular.module('businessApp', ['ngRoute']);
app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'views/default-view.html'
        }).when('/find', {
            templateUrl: 'views/view-data.html'
        })
}]);

app.controller('mainController', function ($scope, $http, $location, $window) {
    var markers = [],
        map;

    //On refresh the page load default location.
    if (angular.isUndefined($scope.findName) || angular.isUndefined($scope.location)) {
        $location.path('/');
    }

    $scope.dispalyDetails = [];
    function getData(input) {
        $scope.dispalyDetails = [];
        $http.post('/getdata', input).then(function (resp) {
            if (resp.data instanceof Array && resp.data.length > 0) {
                setMapOnAllMarkers();
                var responseData = resp.data;
                for (var i = 0; i < responseData.length; i++) {
                    $scope.dispalyDetails.push(
                        {
                            id: i,
                            name: responseData[i].name,
                            phone: responseData[i].phone,
                            rating: responseData[i].rating,
                            city: responseData[i].city,
                            image: responseData[i].photo,
                            address: responseData[i].address,
                            cords: responseData[i].cords,
                            url: responseData[i].url
                        }
                    )
                }

                //Load the google map function
                loadInitMapMarkers();
            } else {
                alert('No Results found please provide valid Inputs');
                $location.path('/');
            }
        }, function (error) {
            console.error(error);
            $location.path('/');
        });
    }

    //getData({query: 'food', location: 'new york'});
    $scope.onSearch = function () {
        if (!angular.isUndefined($scope.findName) || !angular.isUndefined($scope.location)) {
            getData({query: $scope.findName, location: $scope.location});
                $location.path('/find');
        }
    };

    function onCityPositionUpdate(position) {
        getCurrentCityPosition(position.coords.latitude, position.coords.longitude);
    }

    function getCurrentCityPosition(latitude, longitude) {
        var latlng = new google.maps.LatLng(latitude, longitude);

        new google.maps.Geocoder().geocode(
            {'latLng': latlng},
            function (results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    if (results[0]) {
                        var value = results[0].formatted_address.split(",");
                        var count = value.length;
                        var city = value[count - 3];
                        $scope.$apply(function () {
                            $scope.location = city;
                        });
                    }
                    else {
                        console.log("address not found");
                    }
                }
                else {
                    console.log("Geocoder failed due to: " + status);
                }
            }
        );
    }

    navigator.geolocation.getCurrentPosition(onCityPositionUpdate,
        function () {
            $scope.location = 'Pune';
        },
        {enableHighAccuracy: true, timeout: 5000, maximumAge: 600000});

    function setMapOnAllMarkers() {
        for (var i = 0; i < markers.length; i++) {
            markers[i].setMap(null);
        }
    }

    var previousElement,
        previousNumber;

    function onScrollElementToTop(number) {
        if (previousNumber != number) {
            if (!angular.isUndefined(previousElement)) {
                previousElement.css({'background-color': '#FFFFFF'});
            }
            $('.list-container .element-' + number + ' .panel-container').css({'background-color': '#B1D8B7'});
            $('.list-container').animate({
                scrollTop: $('.list-container .element-' + number).get(0).offsetTop
            }, 1000);
            previousNumber = number;
            previousElement = $('.list-container .element-' + number + ' .panel-container');
        }
    }

    function addMarker(_marker) {
        var marker = new google.maps.Marker({
            position: _marker.position,
            map: map
        });

        var infowindow = new google.maps.InfoWindow({
            content:'<div> Name: '+ _marker.title+'</div><div> Address: '+ _marker.address +'</div>'
        });

        marker.addListener('mouseover', function () {
            infowindow.open(map, marker);
        });

        marker.addListener('mouseout', function () {
            infowindow.close();
        });

        //click on marker
        marker.addListener('click', function () {
            onScrollElementToTop(_marker.number);
        });

        return marker;
    }

    //Adding google Map to dom element
    function loadMap(cords) {
        map = new google.maps.Map(document.getElementById('map'), {
            zoom: 14,
            center: new google.maps.LatLng(cords.lat, cords.lon)
        });
    }

    //google map
    function loadInitMapMarkers() {
        var locations = $scope.dispalyDetails;
        loadMap(locations[0].cords);
        var i;

        for (i = 0; i < locations.length; i++) {
            var cords = locations[i].cords;

            var _marker = new google.maps.Marker({
                number: i,
                position: new google.maps.LatLng(cords.lat, cords.lon),
                title: locations[i].name,
                address: locations[i].address,
                map: map
            });

            markers.push(addMarker(_marker));
        }
    }

    //click on list of items..
    $scope.onClick = function (url) {
        if (url !== 'NA') {
            $window.open(url, '_blank');
        }else{
            alert('Server is not provided Url')
        }
    };
    $scope.itemMouseOver = function(){
        console.log('display on over')
    };

    $scope.itemMouseOut = function(){
        console.log('display on out')
    };
});