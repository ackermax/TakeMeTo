$(document).ready(function () {
    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyCSUUtdiqgPpIFoUuCqzclcYYf4Zw-zths",
        authDomain: "dragdroptest-65a47.firebaseapp.com",
        databaseURL: "https://dragdroptest-65a47.firebaseio.com",
        projectId: "dragdroptest-65a47",
        storageBucket: "dragdroptest-65a47.appspot.com",
        messagingSenderId: "743186977258"
    };
    firebase.initializeApp(config);
    var url;
    var landmark;


    var ref = firebase.storage().ref();
    $("#submit").click(function(e){
    e.preventDefault();

    var file = document.getElementById('photo1').files[0];
    var name = (+new Date()) + '-' + file.name;
    var metadata = {
        contentType: file.type
    };
    var task = ref.child(name).put(file, metadata);
    task.then((snapshot) => {
        url = snapshot.downloadURL;
        $("#imagestay").attr("src", url);

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
        var subscriptionKey = "a3bc14d0fe3549c087c313308db28bfc";

        // Replace or verify the region.
        //
        // You must use the same region in your REST API call as you used to obtain your subscription keys.
        // For example, if you obtained your subscription keys from the westus region, replace
        // "westcentralus" in the URI below with "westus".
        //
        // NOTE: Free trial subscription keys are generated in the westcentralus region, so if you are using
        // a free trial subscription key, you should not need to change this region.
        var uriBase = "https://westcentralus.api.cognitive.microsoft.com/vision/v1.0/analyze";

        // Request parameters.
        var params = {
            "visualFeatures": "Categories,Description,Color",
            "details": "",
            "language": "en",
        };

        // Display the image.
        var sourceImageUrl = url;
        

        // Perform the REST API call.
        $.ajax({
            url: uriBase + "?" + $.param(params),

            // Request headers.
            beforeSend: function(xhrObj){
                xhrObj.setRequestHeader("Content-Type","application/json");
                xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", subscriptionKey);
            },

            type: "POST",

            // Request body.
            data: '{"url": ' + '"' + sourceImageUrl + '"}',
        })

        .done(function(data) {
            // Show formatted JSON on webpage.
            console.log(data);
           landmark = data.categories[0].detail.landmarks[0].name;
           console.log(landmark);

           //sharona's places api code
           var queryURLrest="https://maps.googleapis.com/maps/api/place/textsearch/json?query=" + landmark + "&type=restaurant&key=AIzaSyDvoVUjY-466T_MG7ZUxYXxXzmF6MJusCY"
           
           queryURLlodg="https://maps.googleapis.com/maps/api/place/textsearch/json?query=" + landmark + "&type=lodging&key=AIzaSyDvoVUjY-466T_MG7ZUxYXxXzmF6MJusCY"
           
           
           $.ajax({
               url: queryURLrest,
               method: "GET"
           }).done(function(response) {
             console.log(response);
             console.log(response.results["0"].name);
           });
           
           $.ajax({
               url: queryURLlodg,
               method: "GET"
           }).done(function(response) {
               console.log(response);
           });
           
        })
        

        .fail(function(jqXHR, textStatus, errorThrown) {
            // Display error message.
            var errorString = (errorThrown === "") ? "Error. " : errorThrown + " (" + jqXHR.status + "): ";
            errorString += (jqXHR.responseText === "") ? "" : jQuery.parseJSON(jqXHR.responseText).message;
            alert(errorString);
        });
    };

});