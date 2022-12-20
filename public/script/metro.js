const map = new google.maps.Map(document.getElementById("googleMap"), {
    center: new google.maps.LatLng(13.0826, 80.2707),
    zoom: 12,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
});

function calcRoute() {
    const out = document.getElementById('out')
    while (out.firstChild) {
        out.removeChild(out.lastChild);
    }
    if(ifrom.value == "Current Location"){    
        var request = {
            origin: {lat,lng},
            destination: ito.value,
            travelMode: google.maps.TravelMode.TRANSIT,
            transitOptions: {
                modes: ['SUBWAY']
            }
        }
    } else if (ito.value == "Current Location"){
        var request = {
            origin: ifrom.value,
            destination: {lat,lng},
            travelMode: google.maps.TravelMode.TRANSIT,
            transitOptions: {
                modes: ['SUBWAY']
            }
        }
    } else {
        var request = {
            origin: ifrom.value,
            destination: ito.value,
            travelMode: google.maps.TravelMode.TRANSIT,
            transitOptions: {
                modes: ['SUBWAY']
            }
        }
    }
    
    directionsService.route(request, function(result, status) {
        if(status == google.maps.DirectionsStatus.OK){
            temp = result.routes[0];
            var x = temp.legs[0].steps            
            for (let i in x){
                const p = document.createElement('p')
                if(x[i].travel_mode == "TRANSIT"){
                    if(x[i].transit.line.short_name != undefined){
                        p.innerHTML = x[i].transit.line.vehicle.name + " - " + x[i].transit.line.short_name + "<br>Arrival Time - " + x[i].transit.departure_time.text + "<br>" + x[i].instructions + "<br>From - " + x[i].transit.departure_stop.name + "<br>To - " + x[i].transit.arrival_stop.name
                    }
                    else{
                        p.innerHTML = x[i].transit.line.vehicle.name + " - " + x[i].transit.line.name + "<br>Arrival Time - " + x[i].transit.departure_time.text + "<br>" + x[i].instructions + "<br>From - " + x[i].transit.departure_stop.name + "<br>To - " + x[i].transit.arrival_stop.name + "<br>"
                    }
                }
                else{
                    const z = x[i].steps
                    for(let j in z){
                        if(z[j].instructions != undefined)
                        p.innerHTML = p.innerHTML + z[j].instructions
                    }
                    p.innerHTML = p.innerHTML + x[i].instructions
                }
                out.appendChild(p)
            }
            if(temp.fare != undefined){
                const p = document.createElement('p')
                p.innerText = "Fare - " + temp.fare.text
                out.appendChild(p)
            }
            const q = document.createElement('p')
            q.innerText = "Duration - " + temp.legs[0].duration.text
            out.appendChild(q)
            directionsDisplay.setDirections(result);
        }
        else {
            const output = document.getElementById("out")
            directionsDisplay.setDirections({routes: []})
            map.setCenter(google.maps.LatLng(13.0826, 80.2707))
            output.innerText="404"
        }
    });
}

var options = {
    fields: ["name","geometry.location","place_id","formatted_address"]
}

function showPosition(position) {
    lat = position.coords.latitude;
    lng = position.coords.longitude;
}

function fgetLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
        ifrom.value = "Current Location" 
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

function igetLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
        ito.value = "Current Location" 
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

const directionsService = new google.maps.DirectionsService();

const directionsDisplay = new google.maps.DirectionsRenderer();

directionsDisplay.setMap(map);

var temp = {};

var ifrom = document.getElementById("ifrom");
var auto1 = new google.maps.places.Autocomplete(ifrom, options)

var ito = document.getElementById("ito");
var auto2 = new google.maps.places.Autocomplete(ito, options)

var getthere = document.getElementById("next");
getthere.addEventListener('click',calcRoute); 

var fcurr = document.getElementById("fromcurr");
fcurr.addEventListener('click',fgetLocation)

var tcurr = document.getElementById("tocurr");
tcurr.addEventListener('click',igetLocation)

var lat = 0;
var lng = 0;