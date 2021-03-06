getLocation()
    .then(point => createMap(point))
    .then(map => createMarker(map))

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

async function createMap(geolocationPosition) {
    var mapOptions = {
        center: new naver.maps.LatLng(geolocationPosition.coords.latitude, geolocationPosition.coords.longitude),
        size: new naver.maps.Size($("#map").width() ,636),
        zoom: 15
    }

    var map = new naver.maps.Map('map', mapOptions);

    var markerOptions = {
        position: new naver.maps.LatLng(geolocationPosition.coords.latitude, geolocationPosition.coords.longitude),
        map: map,
        icon: {
            url: "https://img.icons8.com/bubbles/50/000000/place-marker.png",
            size: new naver.maps.Size(50, 50),
            origin: new naver.maps.Point(0, 0),
            anchor: new naver.maps.Point(25, 26)
        }
    };

    var marker = new naver.maps.Marker(markerOptions);
    getSidogun(geolocationPosition)

    naver.maps.Event.addListener(map, 'dragend', function(e) {
        console.log(e.point)
        // getSidogun(geolocationPosition)
    });
    return map
}

// 마커 생성
async function createMarker(map) {
    let response = await fetch(`/trash?region=영등포구`, {method: "GET"});
    let commits = await response.json();

    commits.forEach((trash) => {
        //TODO: 버스정류장 같은경우는 도로명으로 검색이 안됨
        convertAnAddressToCoordinates(trash.address)
        .then(addresses => {
            console.log(addresses)
            var marker = new naver.maps.Marker({
                position: new naver.maps.LatLng(addresses.result?.items[0]?.point),
                icon: {
                    url: "home/assets/images/icons8-trash-50-2.png",
                    size: new naver.maps.Size(45, 45),
                    origin: new naver.maps.Point(0, 0),
                },
                map: map
            })
            $(marker.eventTarget).attr("id", trash.id)
            $(marker.eventTarget).addClass("trash-marker")
            $(marker.eventTarget).click(function () {
                const id = $(this).attr('id')
                data = getTrashInformation(id)
            })
        })
    });
}

function getLocation() {
    return new Promise(function (resolve, reject) {
        return navigator.geolocation.getCurrentPosition(resolve, reject)
    });
}

async function getTrashInformation(id) {
    let response = await fetch(`/trash/${id}`, {method: "GET"});
    let commits = await response.json();

    $("#address").val(commits.address)
    $("#location").val(commits.location)
    $("#point").val(commits.point)
}

function getSidogun(geolocationPosition) {
    naver.maps.Service.reverseGeocode({
        location: new naver.maps.LatLng(geolocationPosition.coords.latitude, geolocationPosition.coords.longitude),
    }, function(status, response) {
        if (status !== naver.maps.Service.Status.OK) {
            return alert('Something wrong!');
        }

        var result = response.result, // 검색 결과의 컨테이너
            items = result.items; // 검색 결과의 배열

        $("#searchTarget").text(items[0].addrdetail.sigugun)
        return items[0]?.addrdetail.sigugun
    });
}

// 데이터 넣기



