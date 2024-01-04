
// Initialize Firebase
// TODO: Replace with your project's customized code snippet
var Riderid
var triptype

window.onload = function () {
    LoadMap();
};

var map;
var marker;

function LoadMap() {
    var mapOptions = {
        center: new google.maps.LatLng(19.42847, -99.12766),
        zoom: 20,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    map = new google.maps.Map(document.getElementById("dvMap"), mapOptions);
    SetMarker(19.42847, -99.12766);
};

function SetMarker(lat, lng) {
    //Remove previous Marker.
    if (marker != null) {
        marker.setMap(null);
    }

    //Set Marker on Map.
    var myLatlng = new google.maps.LatLng(lat, lng);
    marker = new google.maps.Marker({
        position: myLatlng,
        map: map,
        icon: "ic_standard.png"

    });
    var mapOptions = {
        center: new google.maps.LatLng(lat, lng),
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    //Create and open InfoWindow.
    var infoWindow = new google.maps.InfoWindow();
    infoWindow.setContent("<div style = 'width:180px;min-height:10px'>" + lat +  " , " + lng + "</div>");
    infoWindow.open(map, marker);
};

function openNav() {
    document.getElementById("mySidenav").style.width = "400px";
}

function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
}

var Address = new function () {
    var path = window.location.href;
    //   var path=config.host
    var id = path.split("=")
    tripId = id[1]
    apiToCall(tripId)
}

function apiToCall(id) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            let obj = xhttp.responseText
            // console.log(obj)
            let data = JSON.parse(obj)
            accessData(data)
        }
    }
    xhttp.open("get", baseUrl + id, true)
    xhttp.send()
}

function displayResultContent(result) {
    // console.log(result)
    var DriverData = result.driver
    var RiderData = result.rider
    var TripDetails = result.tripDetails
    // console.log(RiderData)
    document.getElementById("driverName").innerHTML = DriverData.name
    document.getElementById("driveremail").innerHTML = DriverData.email
    document.getElementById("driverphone").innerHTML = DriverData.phone
    document.getElementById("drivercurService").innerHTML = DriverData.curService
    document.getElementById("Driverimage_inner_container").innerHTML = '<img src=' + DriverData.profile + ' alt="" class="img-rounded img-responsive" />'

    document.getElementById("riderName").innerHTML = RiderData.name
    document.getElementById("rideremail").innerHTML = RiderData.email
    document.getElementById("riderphone").innerHTML = RiderData.phone
    document.getElementById("riderimage_inner_container").innerHTML = '<img src=' + RiderData.profile + ' alt="" class="img-rounded img-responsive" />'

    document.getElementById("TripPickup").innerHTML = '<cite title="San Francisco, USA">' + TripDetails.pickupAt + '<i class="glyphicon glyphicon-map-marker"></i></cite>'
    document.getElementById("TripDropAt").innerHTML = '<cite title="San Francisco, USA">' + TripDetails.dropAt + '<i class="glyphicon glyphicon-map-marker"></i></cite>'
    document.getElementById("TripStartAt").innerHTML = TripDetails.startAt
    document.getElementById("TripEndAt").innerHTML = TripDetails.endAt
    document.getElementById("TripStatus").innerHTML = TripDetails.status
    document.getElementById("TripNo").innerHTML = TripDetails.tripno


    document.getElementById("SupportEmail").innerHTML = result.supportEmail
    document.getElementById("Supportnumber").innerHTML = result.supportNo
}

function accessData(data) {
    if (data.success == true) {
        var triptype = data.result.tripid
        var curService = data.result.driver.curService;
        var driverId = data.result.driver._id
        trackLocationFromFirebase(triptype, driverId, curService)
        displayResultContent(data.result)
    }
    else {
        document.getElementById("statusFalse").innerHTML = "False"
    }

}

/* var firebaseKey = {
    "appName": "taximandu-251211",
    "authDomain": "taximandu-251211.firebaseapp.com",
    "databaseURL": "https://taximandu-251211.firebaseio.com/",
    "storageBucket": "taximandu-251211.appspot.com"
}; */

function trackLocationFromFirebase(triptype, driverId, curService) {
    firebase.initializeApp(firebaseKey);
    var database = firebase.database()
    curService = curService.toLowerCase();
    var baseNode = "drivers_location/" + curService + "/" + driverId;
    var locationRef = database.ref(baseNode);
    locationRef.on('value', function (snapshot) {
        if (snapshot.exists()) {
            var SelectedDocs = snapshot.val()
            var lati = SelectedDocs.l[0]
            var long = SelectedDocs.l[1]
            SetMarker(lati.toString(), long.toString())
        }
        else {
            document.getElementById("statusFalse").innerHTML = "False"
        }
    })

}

