getLocation()
    .then(point => createMap(point))


// 주소 -> 좌표값을 구한다
function convertAnAddressToCoordinates(address) {
    return new Promise(function (resolve, reject) {
        naver.maps.Service.geocode({
            address: address
        }, function(status, response) {
            if (status !== naver.maps.Service.Status.OK) {
                reject(new Error('Something wrong!'));
            }
            resolve(response)
        })
    })
}

function createMap(geolocationPosition) {
    var mapOptions = {
        center: new naver.maps.LatLng(geolocationPosition.coords.latitude, geolocationPosition.coords.longitude),
        zoom: 15
    };
    var map = new naver.maps.Map('map', mapOptions);
    console.log(map)
    return map
}

// 마커 생성
function createMarker(map, location) {
    var marker = new naver.maps.Marker({
        position: new naver.maps.LatLng(location),
        map: map
    })
}

function getLocation() {
    return new Promise(function (resolve, reject) {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    });
}