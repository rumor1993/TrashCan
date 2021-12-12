window.addEventListener('DOMContentLoaded', async function () {

    // NOTE: 카카오맵이나 구글맵으로 변경해야할듯
    const mapEl = document.getElementById("map")

    const map = createMap();
    const location = await getLocation();
    const point = {x:location.coords.longitude, y:location.coords.latitude}

    createMarker(point, false)
    map.setCenter(point);

    const region = await getRegion(point).then(region => {return region})
    document.getElementById("searchTarget").textContent = "'" + region + "' ";

    const response = await getTrashOfCurrentMap(region)
    drawMarkerFromMap(response);

    naver.maps.Event.addListener(map, 'dragend', async function(e) {
        let afterPoint = {x:e.coord.x, y:e.coord.y}
        let afterRegion = await getRegion(afterPoint).then(region => {return region})
        if (region === afterRegion) return;
        document.getElementById("searchTarget").textContent = "'" + afterRegion + "' ";
        let response = await getTrashOfCurrentMap(afterRegion)
        drawMarkerFromMap(response);
    });

    naver.maps.Event.addListener(map, 'zoom_changed', function (e) {
        console.log(e)
    })

    // 지도를 그린다
    function createMap(){
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
    function createMarker(point, trashCan) {
        let marker = new naver.maps.Marker({
            position: new naver.maps.LatLng(point),
            icon: {
                url: trashCan ? "home/assets/images/icons8-trash-50-2.png" : "home/assets/images/place-marker.png",
                size: new naver.maps.Size(45, 45),
                origin: new naver.maps.Point(0, 0),
            },
            map: map
        })

        if (trashCan && marker.eventTarget) {
            const trashMarker = marker.eventTarget
            trashMarker.setAttribute("id", trashCan.id)
            trashMarker.classList.add("trash-marker")
            trashMarker.addEventListener("click", function () {
                getTrashInformation(trashCan.id).then(trashInfo => {
                    document.getElementById("address").value = trashInfo.address
                    document.getElementById("location").value = trashInfo.location
                    document.getElementById("point").value = trashInfo.point
                })
            })
        }
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

    function drawMarkerFromMap(response) {
        response.forEach((trash) => {
            convertAnAddressToCoordinates(trash.address)
                .then(trashCan => {
                    let trashCanPoint = trashCan?.result?.items[0]?.point
                    if (trashCanPoint) createMarker(trashCanPoint, trash)
                });
        });
    }

    async function getTrashInformation(id) {
        let response = await fetch(`/trash/${id}`, {method: "GET"});
        let commits = await response.json();
        return commits;
    }
});

