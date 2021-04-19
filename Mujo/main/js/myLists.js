getAllCustomLists();

var port = chrome.runtime.connect(null, {name: 'port2'});

port.onDisconnect.addListener(obj => {
    console.log('disconnected port2');
})
    
port.onMessage.addListener((message) => {
    if (message.command == "addingDone") {
        console.log("seems as if the adding is done.");
    }
})

document.querySelector("#addToListButton").addEventListener("click", function(e) {
    e.preventDefault()
        var listToAddTo = document.querySelector(`#listSelect`).value
        var title = document.querySelector(`#newMediaTitle`).value
        var type = "null";
    
        if(document.getElementById(`tvRadio`).checked) {
            type = "tv"
        }
        else if(document.getElementById(`movieRadio`).checked) {
            type = "movie"
        }
        console.log("BUTTON EVENT LISTENER");
        port.postMessage({"listName": listToAddTo, "command": "addToCustomList", "title": title, "type": type});
    
        getAllCustomLists();
    
        return true;
})

document.querySelector("#createListButton").addEventListener("click", function(e) {
    e.preventDefault();
    var listName = document.querySelector("#customListName").value

    chrome.runtime.sendMessage({"listName": listName, "command": "createCustomList"}, (response) => {
        console.log("List Created");
    });

    getAllCustomLists();

    return true;
})

function getAllCustomLists() {
    chrome.runtime.sendMessage({"command": "getAllCustomLists"}, (response) => {

        console.log(response.data);
        var keys = Object.keys(response.data)
        var contentDiv = document.querySelector("#content")
        contentDiv.innerHTML = `
        <h1 class="text-center">My Lists</h1>
        <button type="button" class="btn btn-primary mb-4" data-toggle="modal" data-target="#createListModal"><i class="fa fa-plus"></i> Create List</button>`
        
        document.querySelector("#listSelect").innerHTML = ""
        for (let i = 0; i < keys.length; i++) {
            document.querySelector("#listSelect").innerHTML += `
            <option>${keys[i]}</option>`

            if (response.data[keys[i]] == "null") {
                contentDiv.innerHTML += `<h3>${keys[i]}<button id="addToList" type="button" class="btn btn-link" data-toggle="modal" data-target="#addToListModal">Add to this list</button></h3>`
            }
            else {
                contentDiv.innerHTML += `
                <h3>${keys[i]}<button id="addToList" type="button" class="btn btn-link" data-toggle="modal" data-target="#addToListModal">Add to this list</button></h3>
                <div class="row" id="listRow${i}">
        
                </div>`
    
                var individualListObject = response.data[keys[i]];
                var titles = Object.keys(individualListObject)
                
                
                for (let counter = 0; counter < titles.length; counter++) {
                    var mediaTitle = titles[counter]
                
                    if (response.data[keys[i]][mediaTitle] == "movie") {
                        
                        var posterURL = ""
                        const baseImagePath = "https://image.tmdb.org/t/p/original/"
                        var movieID = fetch(`https://api.themoviedb.org/3/search/movie?api_key=c9e5f6b44a8037f35894aef02579205a&language=en-US&query=${mediaTitle}&page=1`)
                            .then(res => {
                                return res.json()
                            })
                            .then(data => {
                                var dataObject = {};
                                dataObject.movieID = data.results[0].id
                                posterURL = baseImagePath + data.results[0].poster_path
                                dataObject.title = data.results[0].original_title
                                var htmlToAdd =
                                    `
                                    <div class="col-md-6 col-lg-4 col-xl-3 pb-4">
                                        <div class="zoomOnHover card h-100">					
                                            <img src="${posterURL}" class="card-img-top" alt="..."/>
                                            <div class="card-body">	
                                                <h5 class="card-title">${dataObject.title}</h5>
                                                <div class="card-footer">
                                                    <small class="text-muted">Rating: 4/5</small>
                                                </div>
                                                <a class="stretched-link" role="button" data-toggle="modal" data-target="#myCustomModal${i}-${counter}"></a>
                                            </div>
                                        </div>
                                    </div>
                                    `;
                                var listRow = document.querySelector(`#listRow${i}`)
                                listRow.innerHTML += htmlToAdd;
    
                                return dataObject;
                            })
                            .catch(error => {
                                console.log(error);
                            })
                        movieID.then(data => {
                            fetch(`https://api.themoviedb.org/3/movie/${data.movieID}/credits?api_key=c9e5f6b44a8037f35894aef02579205a&language=en-US`)
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
                                            `<div class="modal fade" id="myCustomModal${i}-${counter}" tabindex="-1" role="dialog" aria-labelledby="myModal" aria-hidden="true">
                                                <div class="modal-dialog modal-dialog-centered">
                                                    <div class="modal-content">
                                                        <div class="modal-header">
                                                            <h5 class="modal-title" id="myModalLabel">${data.title}</h5>
                                                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                                                <span aria-hidden="true">&times;</span>
                                                            </button>
                                                        </div>
                                                        <div class="modal-body">
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
                                    
                                    var listRow = document.querySelector(`#listRow${i}`)
                                    listRow.innerHTML += addModal;
                                })
                            })
                        
                    }
                    else if (response.data[keys[i]][mediaTitle] == "tv") {
                        
                        var posterURL = ""
                        const baseImagePath = "https://image.tmdb.org/t/p/original/"
                        var tvID = fetch(`https://api.themoviedb.org/3/search/tv?api_key=c9e5f6b44a8037f35894aef02579205a&language=en-US&page=1&query=${mediaTitle}&include_adult=false`)
                            .then(res => {
                                return res.json()
                            })
                            .then(data => {
                                var dataObject = {};
                                dataObject.tvID = data.results[0].id
                                posterURL = baseImagePath + data.results[0].poster_path
                                dataObject.title = data.results[0].name
                                var htmlToAdd =
                                    `
                                    <div class="col-md-6 col-lg-4 col-xl-3 pb-4">
                                        <div class="zoomOnHover card h-100">					
                                            <img src="${posterURL}" class="card-img-top" alt="..."/>
                                            <div class="card-body">	
                                                <h5 class="card-title">${dataObject.title}</h5>
                                                <div class="card-footer">
                                                    <small class="text-muted">Rating: 4/5</small>
                                                </div>
                                                <a class="stretched-link" role="button" data-toggle="modal" data-target="#myCustomtvModal${i}-${counter}"></a>
                                            </div>
                                        </div>
                                    </div>
                                    `
                                var listRow = document.querySelector(`#listRow${i}`)
                                    
                                listRow.innerHTML += htmlToAdd;
    
                                return dataObject;
                            })
                            .catch(error => {
                                console.log(error);
                            })
                        tvID.then(data => {
                            fetch(`https://api.themoviedb.org/3/tv/${data.tvID}/credits?api_key=c9e5f6b44a8037f35894aef02579205a&language=en-US`)
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
    
                                    if (crew.length != 0) {
                                        for (const member of crew) {
                                            if (member.known_for_department == "Directing" || member.department == "Directing") {
                                                addModal = 
                                                `<div class="modal fade" id="myCustomtvModal${i}-${counter}" tabindex="-1" role="dialog" aria-labelledby="myModal" aria-hidden="true">
                                                    <div class="modal-dialog modal-dialog-centered">
                                                        <div class="modal-content">
                                                            <div class="modal-header">
                                                                <h5 class="modal-title" id="myModalLabel">${data.title}</h5>
                                                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                                                    <span aria-hidden="true">&times;</span>
                                                                </button>
                                                            </div>
                                                            <div class="modal-body">
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
                                        var listRow = document.querySelector(`#listRow${i}`)
                                    
                                        listRow.innerHTML += addModal;
                                    }
                                    else{
                                        addModal = 
                                            `<div class="modal fade" id="myCustomtvModal${i}-${counter}" tabindex="-1" role="dialog" aria-labelledby="myModal" aria-hidden="true">
                                                <div class="modal-dialog modal-dialog-centered">
                                                    <div class="modal-content">
                                                        <div class="modal-header">
                                                            <h5 class="modal-title" id="myModalLabel"></h5>
                                                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                                                <span aria-hidden="true">&times;</span>
                                                            </button>
                                                        </div>
                                                        <div class="modal-body">
                                                            <p><a href="${response.data[keys[counter]]}" target="_blank">Keep watching</a></p>
                                                            <p>Cast: ${cast} </p>
                                                            <p>Director/Producer information not provided.</p>
                                                        </div>
                                                        <div class="modal-footer">
                                                            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                                                            <button type="button" class="btn btn-primary">Save changes</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>`
                                        var listRow = document.querySelector(`#listRow${i}`)
                                    
                                        listRow.innerHTML += addModal;
                                    }
                                })
                            })
                    }
                    
                }
                
            }
        }
    })
}