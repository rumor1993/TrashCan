window.addEventListener('DOMContentLoaded', async function () {

    const mapEl = document.getElementById("map")

    const map = drawMap();
    const location = await getLocation();
    const point = {x:location.coords.longitude, y:location.coords.latitude}

    drawMarkerFromMap(point, false)
    map.setCenter(point);

    const region = await getRegion(point).then(region => {return region})
    const response = await getTrashOfCurrentMap(region)

    response.forEach((trash) => {
        convertAnAddressToCoordinates(trash.address)
            .then(trashCan => {
                let trashCanPoint = trashCan?.result?.items[0]?.point
                if (trashCanPoint) drawMarkerFromMap(trashCanPoint, true)
            });
    });

    naver.maps.Event.addListener(map, 'dragend', async function(e) {
        let afterPoint = {x:e.coord.x, y:e.coord.y}
        let afterRegion = await getRegion(afterPoint).then(region => {return region})
        if (region === afterRegion) return;
        let response = await getTrashOfCurrentMap(afterRegion)
    });

    // 지도를 그린다
    function drawMap(){
        const mapOptions = {
            size: new naver.maps.Size(mapEl.clientWidth ,636),
            zoom: 15
        }
        const map = new naver.maps.Map('map', mapOptions);
        return map
    }

    // 내 위치를 구한다
    function getLocation() {
        return new Promise(function (resolve, reject) {
            return navigator.geolocation.getCurrentPosition(resolve, reject)
        });
    }

    async function getRegion(point) {
        return new Promise(function (resolve, reject) {
            naver.maps.Service.reverseGeocode({location : new naver.maps.LatLng(point)},
                function(status, response) {
                if (status !== naver.maps.Service.Status.OK) {
                    reject('Something wrong!');
                }

                let result = response.result, // 검색 결과의 컨테이너
                    items = result.items; // 검색 결과의 배열
                resolve(items[0]?.addrdetail.sigugun)
            });
        })
    }

    // 현재지도의 쓰레기통 정
    async function getTrashOfCurrentMap(region) {
        const options =
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                }
            };

        let response = await fetch(`/trash?region=${region}`, options);
        let commits = await response.json();

        return commits
    }

    // 마커를 그린다
    function drawMarkerFromMap(point, isTrash) {
        let marker = new naver.maps.Marker({
            position: new naver.maps.LatLng(point),
            icon: {
                url: isTrash ? "home/assets/images/icons8-trash-50-2.png" : "home/assets/images/place-marker.png",
                size: new naver.maps.Size(45, 45),
                origin: new naver.maps.Point(0, 0),
            },
            map: map
        })
    }

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
});

