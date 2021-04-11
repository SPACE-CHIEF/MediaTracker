(function($) {

	"use strict";

	var fullHeight = function() {

		$('.js-fullheight').css('height', $(window).height());
		$(window).resize(function(){
			$('.js-fullheight').css('height', $(window).height());
		});

	};
	fullHeight();

	$('#sidebarCollapse').on('click', function () {
      $('#sidebar').toggleClass('active');
  });

})(jQuery);

chrome.runtime.sendMessage({"command": "getMovies"}, (response) => {

	document.querySelector("#movieRow").innerHTML = "";
    for (const key in response.data) {
        
		var posterURL = ""

		const baseImagePath = "https://image.tmdb.org/t/p/original/"
		
		fetch(`https://api.themoviedb.org/3/search/movie?api_key=c9e5f6b44a8037f35894aef02579205a&language=en-US&query=${key}&page=1`)
			.then(response => {
				return response.json()
			})
			.then(data => {
				var movieID = data.results[0].id
				posterURL = baseImagePath + data.results[0].poster_path
				var htmlToAdd = 
				`<div class="col-md-6 col-lg-4 col-xl-3 pb-4">
					<div class="card h-100">
						<img src="${posterURL}" class="card-img-top" alt="...">
						<div class="card-body">
							<h5 class="card-title">${key}</h5>
							<div class="card-footer">
								<small class="text-muted">Rating: 4/5</small>
							</div>
						</div>
					</div>
				</div>`
				document.querySelector("#movieRow").innerHTML += htmlToAdd;
			})
			.catch(error => {
				console.log(error);
			})
    }

});

chrome.runtime.sendMessage({"command": "getTV"}, (response) => {

	document.querySelector("#tvshowRow").innerHTML = "";
    for (const key in response.data) {

		var posterURL = ""
		const baseImagePath = "https://image.tmdb.org/t/p/original/"

		fetch(`https://api.themoviedb.org/3/search/tv?api_key=c9e5f6b44a8037f35894aef02579205a&language=en-US&page=1&query=${key}&include_adult=false`)
			.then(response => {
				return response.json()
			})
			.then(data => {
				var tvID = data.results[0].id
				posterURL = baseImagePath + data.results[0].poster_path
				var htmlToAdd = 
				`<div class="col-md-6 col-lg-4 col-xl-3 pb-4">
					<div class="card h-100">
						<img src="${posterURL}" class="card-img-top" alt="...">
						<div class="card-body">
							<h5 class="card-title">${key}</h5>
							<div class="card-footer">
								<small class="text-muted">Rating: 4/5</small>
							</div>
						</div>
					</div>
				</div>`
				document.querySelector("#tvshowRow").innerHTML += htmlToAdd;
			})
			.catch(error => {
				console.log(error);
			})
    }

});

/*	
	Display a card with the title and episode. 
	@param media type of media (Movie, Anime, Show).
	@return none. 
*/
// function displayCard(media) {
// 	for(title in media){
		
// 	}
// }

/*
	create a list based on the type of media (Movie, Anime, Show)
	@param listType (Movie, Anime, Show).
	@return none.
*/
// function displayList(listType) {

// }