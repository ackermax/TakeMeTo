$(document).ready(function () {
    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyCSUUtdiqgPpIFoUuCqzclcYYf4Zw-zths",
        authDomain: "dragdroptest-65a47.sapp.com",
        databaseURL: "https://dragdroptest-65a47.firebaseio.com",
        projectId: "dragdroptest-65a47",
        storageBucket: "dragdroptest-65a47.appspot.com",
        messagingSenderId: "743186977258"
    };
    firebase.initializeApp(config);
    var url;
    var landmark;
    var ref = firebase.storage().ref();
    $("#submit").click(function (e) {
        e.preventDefault();
        var file = document.getElementById('photo1').files[0];
        var name = (+new Date()) + '-' + file.name;
        var metadata = {
            contentType: file.type
        };
        var task = ref.child(name).put(file, metadata);
        task.then((snapshot) => {
            url = snapshot.downloadURL;
            $("<img>").attr({ "src": url, "id": "imagestay", "class": "responsive-img" }).appendTo("#image-hold");
            //empty the image select div
            $("#button-row").empty();
            $("#directive").empty();

            //make a call with microsoft
            processImage(url);

        }).catch((error) => {
            console.error(error);
        });
    });

    function processImage() {
        // **********************************************
        // *** Update or verify the following values. ***
        // **********************************************

        // Replace the subscriptionKey string value with your valid subscription key.
        var subscriptionKey = "9d57f68c663c4cd9b13bbf8a93ac7230";

        // Replace or verify the region.
        //
        // You must use the same region in your REST API call as you used to obtain your subscription keys.
        // For example, if you obtained your subscription keys from the westus region, replace
        // "westcentralus" in the URI below with "westus".
        //
        // NOTE: Free trial subscription keys are generated in the westcentralus region, so if you are using
        // a free trial subscription key, you should not need to change this region.
        var uriBase = "https://westcentralus.api.cognitive.microsoft.com/vision/v1.0/models/landmarks/analyze";

        // Request parameters.
        var params = {
           "model": "landmarks",
        };

        // Display the image.
        var sourceImageUrl = url;


        // Perform the REST API call.
        $.ajax({
            url: uriBase + "?" + $.param(params),

            // Request headers.
            beforeSend: function (xhrObj) {
                xhrObj.setRequestHeader("Content-Type", "application/json");
                xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", subscriptionKey);
            },

            type: "POST",

            // Request body.
            data: '{"url": ' + '"' + sourceImageUrl + '"}',
        })

            .done(function (data) {
                // Show formatted JSON on webpage.
                landmark = data.result.landmarks[0].name;

                //make a text tag with the landmark name.

                $("<h2>").text("takemeto... " + landmark).appendTo("#button-row").attr("id", "landmark-text");

                //sharona's places api code
                var queryURLrest = "https://maps.googleapis.com/maps/api/place/textsearch/json?query=" + landmark + "&type=restaurant&key=AIzaSyC7KxkIt-qVDfl6a30zFsclztT9U2jJ2eE"

                var queryURLlodg = "https://maps.googleapis.com/maps/api/place/textsearch/json?query=" + landmark + "&type=lodging&key=AIzaSyC7KxkIt-qVDfl6a30zFsclztT9U2jJ2eE"

                var queryURLFlight = "https://maps.googleapis.com/maps/api/place/textsearch/json?query=" + landmark + "&type=airport&key=AIzaSyC7KxkIt-qVDfl6a30zFsclztT9U2jJ2eE"


                $.ajax({
                    url: queryURLrest,
                    method: "GET"
                }).done(function (response) {
                    console.log(response);

                    var resRes = response.results;
                    //make some html to put our best food in

                    $("<li>").html('<div class="collapsible-header"><i class="material-icons">restaurant</i>Dine</div><div class="collapsible-body card-panel white" id="fly-body"><ul class="collection" id="rest-data"></ul></div>').appendTo("#data-display");


                    //make a for loop to make our list items
                    for (var i = 0; i < resRes.length; i++) {
                        //make an li tag and append it to the list tag
                        $("<li>").html("<a href='https://www.google.com/maps/place/?q=place_id:" + resRes[i].place_id + "' target='_blank'>" + resRes[i].name + "</a>").appendTo("#rest-data");
                    }
                });

                $.ajax({
                    url: queryURLlodg,
                    method: "GET"
                }).done(function (response) {
                    var resRes = response.results;
                    //make some html to put our best lodging in

                    $("<li>").html('<div class="collapsible-header"><i class="material-icons">home</i>Stay</div><div class="collapsible-body card-panel white" id="fly-body"><ul class="collection" id="lodge-data"></ul></div>').appendTo("#data-display");

                    //make a for loop to make our list items
                    for (var i = 0; i < resRes.length; i++) {
                        //make an li tag and append it to the list tag
                        $("<li>").html("<a href='https://www.google.com/maps/place/?q=place_id:" + resRes[i].place_id + "' target='_blank'>" + resRes[i].name + "</a>").appendTo("#lodge-data");
                    }
                });

                $.ajax({
                    url: queryURLFlight,
                    method: "GET"
                }).done(function (response) {
                    var airport = response.results[0].name;
                    var airURL = "https://www.google.com/flights/#search;t="

                    $.getJSON("https://raw.githubusercontent.com/jbrooksuk/JSON-Airports/master/airports.json", function (data) {
                        for (var i = 0; i < data.length; i++) {
                            if (data[i].name === airport) {
                                var iata = data[i].iata;
                                airURL = "https://www.google.com/flights/#search;t=" + iata;

                            }
                        }
                        setTimeout(function () {
                            //grab the airport and put that inside the html
                            $("<li>").html('<div class="collapsible-header"><i class="material-icons">local_airport</i>Fly</div><div class="collapsible-body card-panel white" id="fly-body"><p>The closest airport to your destination is the <a href="' + airURL + '" target="_blank">' + airport + '</a>.</p></div>').appendTo("#data-display");
                        }, 2000);
                    });




                });

            })


            .fail(function (jqXHR, textStatus, errorThrown) {
                // Display error message.
                var errorString = (errorThrown === "") ? "Error. " : errorThrown + " (" + jqXHR.status + "): ";
                errorString += (jqXHR.responseText === "") ? "" : jQuery.parseJSON(jqXHR.responseText).message;
                console.log(errorString);
            });
    };

});