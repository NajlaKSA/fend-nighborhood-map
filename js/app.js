var map;
var markers = []; 
var infowindow ;
// id will make more effecient way to find an item within the array without iterating through it.
var locations = [
    {
        position:
        {lat: 18.467483,  lng: -66.111214} ,
        name:"Castillo de San Cristóbal",
        id : 0
    },
    {
        position:
        {lat:18.468503,  lng:-66.110316},
         name: "Garita del Diablo",
         id: 1
    },
    {
        position:
        {lat:18.468589,  lng:-66.115660},
        name:"Bda La Perla",
        id : 2
    },
    {
        position:
        {lat:18.466085,  lng:-66.112061},
         name: "Plaza de Colón",
         id : 3
    },
    {
        position:
        {lat:18.467849,  lng:-66.106103},
        name: "Playa Peña Beach",
        id : 4
    }
];

// initialize map and set markers from locations array.
function initMap() {
    infowindow = new google.maps.InfoWindow();
    var focus = {
        lat: 18.466843, 
        lng: -66.111082
    };
    map = new google.maps.Map(document.getElementById('map_view'), {
        zoom: 16,
        center: focus,
        mapTypeId: 'satellite'
    });

    //console.log(jQuery);
    for (var i =0 ; i <locations.length ; i++){
        addMarkers(locations[i].position , locations[i].name);
    }
    //console.log(markers);
}
// provide feedback in case of map loading error.
function errorMap(){
    alert("Something went wrong with Google Maps, Please refresh the page.");
}

/*  this function will represent markers on the map and assign infowindow with details
    taken from Wikipeia API (as 3rd party service.) 
*/
function addMarkers(position , name)
{
    var marker = null;
    var currentMarker;


        marker = new google.maps.Marker({
        position: position ,
        map: map,
        animation: google.maps.Animation.DROP,//Bounce
        title :name
        });
        // add infowindow to each marker either using an external function or in here.
        var url = "https://en.wikipedia.org/w/api.php?action=opensearch&search=" + name + "&limit=1&format=json";
        $.ajax({
            url: url,
            type: 'GET',
            dataType: 'jsonp',
            async: true,
            success: function (data) {
                //write function to make infowindow appear onclicks.
                //console.log("Ajax is Working!!! " + name);
                var windowContent = "<div class='infowindow'> <h5>"+data[1]+"</h5> "
                +"<p>More on Wikipedia: <a href='"+data[3]+"'>"+name+"</a></p></div>";
                marker.addListener('click', function() {
                    if (data[2].length > 0) { // if not empty
                        infowindow.setContent(windowContent);
                    } else {
                        infowindow.setContent("<div class='infowindow'>Nothing found on Wikipedia about <b> ("+name
                        +")</b>, please check google for more information <a href='https://www.google.de/search?q=" 
                        + name + "'>Click Here! </a></div>");
                    }
                    infowindow.open(map, marker);
                });
            },
            error: function(){
                alert("something went wrong, please retry.");
            }
        });
        markers.push(marker);//keep track of created markers.
}

//  =======================================================================================
 // The Octopus :)
var ViewModel = function() {
    this.field = ko.observable();
    // assign a copy of the locations to an observable to track any changes
    this.locDuplicate = ko.observableArray([].concat(locations));

    this.displayItems = function(item) {
        var index = ((item.id === undefined )? -1 : item.id);
        if (!(index === -1)){
            infowindow.setContent("<p>searching, please wait ....</p>");
            infowindow.open(map, markers[index]);
        }
            var url = "https://en.wikipedia.org/w/api.php?action=opensearch&search=" + item.name + "&limit=1&format=json";
            $.ajax({
                url: url,//wikipedia as 3rd party service.
                type: 'GET',
                dataType: 'jsonp',
                async: true,
                success: function (data) {
                    var windowContent = "<div class='infowindow'> <h5>" + data[1] + "</h5> "
                        + "<p>More on Wikipedia: <a href='" + data[3] + "'>" + item.name + "</a></p></div>";
                        if (data[2].length > 0) { // if not empty
                            infowindow.setContent(windowContent);
                        } else {
                            infowindow.setContent("<div class='infowindow'>Nothing found on Wikipedia about <b> (" + item.name
                                + ")</b>, please check google for more information <a href='https://www.google.de/search?q="
                                + item.name + "'>Click Here! </a></div>");
                        }
                },
                error: function () {
                    alert("something went wrong, please retry.");
                }
            });

    };


    sort = function(value) {
        /*
            * show only the sorted places and markers.
         */
        locDuplicate.removeAll();// update the UI.
        for (var i = 0 ; i < locations.length ; i++) {
            if (locations[i].name.toLowerCase().indexOf(value.toLowerCase()) >= 0) {
                locDuplicate.push(locations[i]);
                markers[i].setVisible(true);
            } else {
                markers[i].setVisible(false);
            }
        }

    },
    // to take the value of field and call sort(value_of_field);
    this.field.subscribe(this.sort);

    this.toggleMenu = function() {
        var sidebar = document.getElementById("sidebar");
        var mapSide = document.getElementById("map_side");
        if (sidebar.classList.contains("sidebar_shown")) {
            sidebar.classList.replace("sidebar_shown", "sidebar_hidden");
            //change the col of map_side to be full
            mapSide.classList.replace("col-9", "col-12");
            //re-render the Map (size adaptation)
            google.maps.event.trigger(map, 'resize');
        } else {
            sidebar.classList.replace("sidebar_hidden", "sidebar_shown");
            //change the col of map side to be col-9
            mapSide.classList.replace("col-12", "col-9");
        }
        //alert("!!"); 
    };
};
ko.applyBindings(ViewModel());
//alert("ko!!");

