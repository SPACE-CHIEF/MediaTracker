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

chrome.runtime.onMessage.addListener((message, sender, response) => {
	if(message.command == "item_added"){
		console.log(message.title);
	}
});
// Set up firebase
// var firebaseConfig = {
//     apiKey: "AIzaSyDPbdTfxqjz-OWp-cXc6TmMw65YeBptGjM",
//     authDomain: "moju-e6cff.firebaseapp.com",
//     databaseURL: "https://moju-e6cff-default-rtdb.firebaseio.com",
//     projectId: "moju-e6cff",
//     storageBucket: "moju-e6cff.appspot.com",
//     messagingSenderId: "508414131397",
//     appId: "1:508414131397:web:eb506c5c63f6651c9b84ac",
//     measurementId: "G-ZPRWN0YR81"
// };
// Initialize Firebase
// firebase.initializeApp(firebaseConfig);

// The Realtime Database object
// var database = firebase.database();
// console.log(firebase.auth().currentUser.uid);

// var lists = database.ref('/users/' + firebase.auth().currentUser.uid);
// lists.on('child_added', (snapshot) => {
// 	const data = snapshot.val();
// 	for(user in data){
// 		console.log(user);
// 	}
// });

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