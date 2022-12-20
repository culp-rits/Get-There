
const map = new google.maps.Map(document.getElementById("googleMap"), {
    center: new google.maps.LatLng(13.0826, 80.2707),
    zoom: 13,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
});

function showPosition(position) {
    lat = position.coords.latitude;
    lng = position.coords.longitude;
    loc = {lat,lng}
}

function fgetLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
        ifrom.value = "Current Location" 
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

var options = {
    fields: ["name","geometry.location","place_id","formatted_address"]
}

function printPlace() {
    const map = new google.maps.Map(document.getElementById("googleMap"), {
        center: new google.maps.LatLng(13.0826, 80.2707),
        zoom: 13,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
    });
    while (out.firstChild) {
        out.removeChild(out.lastChild);
    }
    if(ifrom.value == "Current Location") {
        var request = {
            location: {lat,lng},
            radius: 1000,
            keyword: document.getElementById("query").value
        };        
    } else {
        var geocoder = new google.maps.Geocoder();
        geocoder.geocode({"address": ifrom.value}, function(results, status) {
            if (status == 'OK') {
                loc = results[0].geometry.location
            }
        })
        var request = {
            location: loc,
            radius: 1000,
            keyword: document.getElementById("query").value
        };        
    }
    service.search(request, function(results) {
        for (let i in results) {
            const b = document.createElement("button")
            var pid = results[i].place_id
            service.getDetails({
                placeId: pid
            }, function (result, status) {
                if(status === google.maps.GeocoderStatus.OK) {
                    var marker = new google.maps.Marker({
                        map: map,
                        place: {
                            placeId: pid,
                            location: result.geometry.location
                        }
                    });
                }
            });
            y = results[i].geometry.location
            dlat = y.lat()
            dlng = y.lng()
            dloc = {lat: dlat,lng: dlng}
            b.id = results[i].place_id
            b.classList.add("list")
            if(ifrom.value == "Current Location"){    
                var request = {
                    origin: {lat,lng},
                    destination: dloc,
                    travelMode: google.maps.TravelMode.DRIVING,
                }
            } else {
                var request = {
                    origin: ifrom.value,
                    destination: dloc,
                    travelMode: google.maps.TravelMode.DRIVING,
                }
            }
            var x = {}
            directionsService.route(request, function(result, status) {
                if(status == google.maps.DirectionsStatus.OK){
                    x = result.routes[0].legs[0];
                    b.innerHTML = "<b>"+results[i].name+"</b>" + "<br>" + results[i].vicinity + "<br>Distance - " + x.distance.text + "<br>Duration - " + x.duration.text + "<br>Rating - " + results[i].rating
                    out.appendChild(b)
                    out.innerHTML = out.innerHTML + "<br>" 
                }
            });
        }
    })
}

const directionsDisplay = new google.maps.DirectionsRenderer();

directionsDisplay.setMap(map);

const directionsService = new google.maps.DirectionsService();

const service = new google.maps.places.PlacesService(map);

var y = {}  
var fcurr = document.getElementById("fromcurr");
fcurr.addEventListener('click',fgetLocation)

var lat = 0;
var lng = 0;

var dlat = 0;
var dlng = 0;
var loc = {lat,lng}
var dloc = {dlat,dlng}

var ifrom = document.getElementById("ifrom");
var auto1 = new google.maps.places.Autocomplete(ifrom, options)

var getthere = document.getElementById("next");
getthere.addEventListener('click',printPlace); 

const out = document.getElementById("out")