$(document).ready(function () {

// google places API: AIzaSyDvoVUjY-466T_MG7ZUxYXxXzmF6MJusCY

var landmark = "Millenium park"

var queryURLrest="https://maps.googleapis.com/maps/api/place/textsearch/json?query=" + landmark + "&type=restaurant&key=AIzaSyDvoVUjY-466T_MG7ZUxYXxXzmF6MJusCY"

queryURLlodg="https://maps.googleapis.com/maps/api/place/textsearch/json?query=" + landmark + "&type=lodging&key=AIzaSyDvoVUjY-466T_MG7ZUxYXxXzmF6MJusCY"


$.ajax({
	url: queryURLrest,
	method: "GET"
}).done(function(response) {
  // for (i=0; response.results.length; i++);
    console.log(response);
});

$.ajax({
	url: queryURLlodg,
	method: "GET"
}).done(function(response) {
	console.log(response);
});


});