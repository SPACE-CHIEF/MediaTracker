(function ($) {

	"use strict";

	var fullHeight = function () {

		$('.js-fullheight').css('height', $(window).height());
		$(window).resize(function () {
			$('.js-fullheight').css('height', $(window).height());
		});

	};
	fullHeight();

	$('#sidebarCollapse').on('click', function () {
		$('#sidebar').toggleClass('active');
	});

})(jQuery);

getAllMovies();
getAllTVShows();

document.querySelector("#addMovieButton").addEventListener("click", function(e) {
    e.preventDefault();

    var inputValues = Array.from(document.querySelectorAll("#addMovieForm input")).reduce((acc, input) => ({
        ...acc, [input.id]: input.value
    }), {});

    chrome.runtime.sendMessage({"type": "movie","title": inputValues.manualMovieTitle, "command": "contentScript", "url": inputValues.movieURL}, (response) => {
        console.log("RESPONSE RECIEVED: " + response.text);
    })

    getAllMovies();

    return true;
})

document.querySelector("#addTVShowButton").addEventListener("click", function(e) {
    e.preventDefault();

    var inputValues = Array.from(document.querySelectorAll("#addTVShowForm input")).reduce((acc, input) => ({
        ...acc, [input.id]: input.value
    }), {});

    chrome.runtime.sendMessage({"type": "tv","title": inputValues.manualTVShowTitle, "command": "contentScript", "url": inputValues.tv_episode_URL}, (response) => {
        console.log("RESPONSE RECIEVED: " + response.text);
    })

    getAllTVShows();

    return true;
})

function getAllMovies() {
    chrome.runtime.sendMessage({ "command": "getMovies" }, (response) => {

        document.querySelector("#movieRow").innerHTML = "";
        
        var keys = Object.keys(response.data)
    
        for (let counter = 0; counter < keys.length; counter++) {
            var key = keys[counter]
            var posterURL = ""
            const baseImagePath = "https://image.tmdb.org/t/p/original/"
            var movieID = fetch(`https://api.themoviedb.org/3/search/movie?api_key=c9e5f6b44a8037f35894aef02579205a&language=en-US&query=${key}&page=1`)
                .then(res => {
                    return res.json()
                })
                .then(data => {
                    movieID = data.results[0].id
                    posterURL = baseImagePath + data.results[0].poster_path
                    var htmlToAdd =
                        `
                        <div class="col-md-6 col-lg-4 col-xl-3 pb-4">
                            <div class="card h-100">					
                                <img src="${posterURL}" class="card-img-top" alt="..."/>
                                <div class="card-body">	
                                    <h5 class="card-title">${keys[counter]}</h5>
                                    <div class="card-footer">
                                        <small class="text-muted">Rating: 4/5</small>
                                    </div>
                                    <a class="stretched-link" role="button" data-toggle="modal" data-target="#myModal${counter}"></a>
                                </div>
                            </div>
                        </div>
                        `
                    document.querySelector("#movieRow").innerHTML += htmlToAdd;
                    return movieID;
                })
                .catch(error => {
                    console.log(error);
                })
    
            movieID.then(data => {
                fetch(`https://api.themoviedb.org/3/movie/${data}/credits?api_key=c9e5f6b44a8037f35894aef02579205a&language=en-US`)
                    .then(response => {
                        return response.json();
                    })
                    .then(credits => {
                        let addModal = ``
                        let crew = credits["crew"];
                        var cast = "";
                        if(credits.cast[0] && credits.cast[1] && credits.cast[2]){
                            cast += credits.cast[0].name + ", " + credits.cast[1].name + ", " + credits.cast[2].name + "."
                        }else if(credits.cast[0] && credits.cast[1]){
                            cast += credits.cast[0].name + ", " + credits.cast[1].name + ".";
                        }else if(credits.cast[0]){
                            cast += credits.cast[0].name
                        }else{
                            cast += "Sorry cast information is not available."
                        }
                        for (const member of crew) {
                            if (member.known_for_department == "Directing") {
                                
                                addModal = 
                                `<div class="modal fade" id="myModal${counter}" tabindex="-1" role="dialog" aria-labelledby="myModal" aria-hidden="true">
                                    <div class="modal-dialog modal-dialog-centered">
                                        <div class="modal-content">
                                            <div class="modal-header">
                                                <h5 class="modal-title" id="myModalLabel">${keys[counter]}</h5>
                                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                                    <span aria-hidden="true">&times;</span>
                                                </button>
                                            </div>
                                            <div class="modal-body">
                                                <p><a href="${response.data[keys[counter]]}" target="_blank">Keep watching</a></p>
                                                <p>Cast: ${cast}</p>
                                                <p>Director: ${member.name} </p>
                                            </div>
                                            <div class="modal-footer">
                                                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                                                <button type="button" class="btn btn-primary">Save changes</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>`
                                break;
                            }
                        }
                        document.querySelector("#movieRow").innerHTML += addModal;
                    })
            })
        }
    });
}

function getAllTVShows() {
    chrome.runtime.sendMessage({ "command": "getTV" }, (response) => {

        document.querySelector("#tvshowRow").innerHTML = "";
        
        var keys = Object.keys(response.data)
    
        for (let counter = 0; counter < keys.length; counter++) {
            var key = keys[counter]
            var posterURL = ""
            const baseImagePath = "https://image.tmdb.org/t/p/original/"
    
            var movieID = fetch(`https://api.themoviedb.org/3/search/tv?api_key=c9e5f6b44a8037f35894aef02579205a&language=en-US&page=1&query=${key}&include_adult=false`)
                .then(res => {
                    return res.json()
                })
                .then(data => {
                    tvID = data.results[0].id
                    posterURL = baseImagePath + data.results[0].poster_path
                    var htmlToAdd =
                        `
                        <div class="col-md-6 col-lg-4 col-xl-3 pb-4">
                            <div class="card h-100">					
                                <img src="${posterURL}" class="card-img-top" alt="..."/>
                                <div class="card-body">	
                                    <h5 class="card-title">${keys[counter]}</h5>
                                    <div class="card-footer">
                                        <small class="text-muted">Rating: 4/5</small>
                                    </div>
                                    <a class="stretched-link" role="button" data-toggle="modal" data-target="#mytvModal${counter}"></a>
                                </div>
                            </div>
                        </div>
                        `
                    document.querySelector("#tvshowRow").innerHTML += htmlToAdd;
                    return tvID;
                })
                .catch(error => {
                    console.log(error);
                })
    
            movieID.then(data => {
                fetch(`https://api.themoviedb.org/3/tv/${data}/credits?api_key=c9e5f6b44a8037f35894aef02579205a&language=en-US`)
                    .then(response => {
                        return response.json();
                    })
                    .then(credits => {
                        let addModal = ``
                        let crew = credits["crew"];
                        var cast = "";
                        if(credits.cast[0] && credits.cast[1] && credits.cast[2]){
                            cast += credits.cast[0].name + ", " + credits.cast[1].name + ", " + credits.cast[2].name + "."
                        }else if(credits.cast[0] && credits.cast[1]){
                            cast += credits.cast[0].name + ", " + credits.cast[1].name + ".";
                        }else if(credits.cast[0]){
                            cast += credits.cast[0].name
                        }else{
                            cast += "Sorry cast information is not available."
                        }
                        for (const member of crew) {
                            if (member.known_for_department == "Directing") {
                                addModal = 
                                `<div class="modal fade" id="mytvModal${counter}" tabindex="-1" role="dialog" aria-labelledby="myModal" aria-hidden="true">
                                    <div class="modal-dialog modal-dialog-centered">
                                        <div class="modal-content">
                                            <div class="modal-header">
                                                <h5 class="modal-title" id="myModalLabel">${keys[counter]}</h5>
                                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                                    <span aria-hidden="true">&times;</span>
                                                </button>
                                            </div>
                                            <div class="modal-body">
                                                <p><a href="${response.data[key]}" target="_blank">Keep watching</a></p>
                                                <p>Cast: ${cast} </p>
                                                <p>Director: ${member.name} </p>
                                            </div>
                                            <div class="modal-footer">
                                                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                                                <button type="button" class="btn btn-primary">Save changes</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>`
                                break;
                            }
                        }
                        document.querySelector("#tvshowRow").innerHTML += addModal;
                    })
            })
        }
    
    });
}