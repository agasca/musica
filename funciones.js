//Globals Mayusculas no se cambia el dato
var LAST_FM_API_KEY = '42f75f939105d2110d6a0daf27db431c';
var LAST_FM_API_URL = 'http://ws.audioscrobbler.com/2.0/';
var $artistaI = $('#artista'),
	$buscar = $('#buscar'),
	$resultado = $('#resultado');

//Eventos - listener
$artistaI.on('keyup', onKeyUp);	//ok
$buscar.on('click', onSubmit);

function onKeyUp( evt ){ // Enter ok
	if(evt.keyCode == 13){
		onSubmit();
	}
}

function onSubmit(){	//Click ok
	getArtist($artistaI.val(), presentarArtista);
	$resultado.html( '<p class="loading">cargando...</p>' );
}

//AJAX Functions
function getArtist(name, callback){	//peticion asincrona
	$.ajax({
	data:{
		artist: name,
		api_key: LAST_FM_API_KEY,
		format: 'json',
		method: 'artist.getinfo'
	},
	url: LAST_FM_API_URL
	})
	.done(callback);
}

function getArtistAlbums(name, callback){
	$.ajax({
	data:{
		artist: name,
		api_key: LAST_FM_API_KEY,
		format: 'json',
		method: 'artist.gettopalbums'
	},
	url: LAST_FM_API_URL
	})
	.done(callback);
}

function getAlbumInfo(artist, album, callback){
	$.ajax({
	data:{
		artist: artist,
		album: album,
		api_key: LAST_FM_API_KEY,
		format: 'json',
		method: 'album.getinfo'
	},
	url: LAST_FM_API_URL
	})
	.done(callback);
}


//template functions(representacion en HTML)
function artistTemplate(artist){	//ok
	var html = '';

	html += '<h2>' + artist.name + '</h2>';
	html += '<figure><img src="'+artist.image[artist.image.length-1]['#text']+'"<figcaption>'+artist.image[artist.image.length-1].size+'</figcaption></figure>';
	html += '<p>' + artist.bio.summary + '</p>';
	html += '<button class="btn btn-info get-albums">Discos</button>';
	
	return html;
}

function albumTemplate(album){
	var html = '';

	html += '<div class="album album-onload" data-album="' + album.name + '" data-artist="' + album.artist.name + '">';
	html += '<figure>';
	html += '<h3>' + album.name + '</h3>';
	html += '<img src="' + album.image[album.image.length-1]['#text'] + '" class=img-rounded">';
	html += '</figure>';
	html += '</div>';

	return html;
}

function albumListTemplate(albums){
	//console.log(albums);
	var html = '';

	for(var i = 0; i < albums.topalbums.album.length; i++){
		var album = albums.topalbums.album[i];
		html += albumTemplate(album);
	}

	return html;
}

function albumTrackTemplate(track){
	var html = '';
	html += '<li>';
	html += '<a href="http://youtube.com/results?search_query=';
	html += (track.artist.name + ' ' + track.name).replace(new RegExp('||s','g'), '+');	//+ para youtube
	html += '" target="_blank">' + track.name + '</a></li>';

	return html;
}

function albumDetailTemplate(album){
	var html = '';

	html += '<div class="album-detail album-detail-onload">';
	html += '<figure>';
	html += '<h3>' + album.name + '</h3>';
	html += '<h3>' + album.artist + '</h3>';
	html += '<img src="' + album.image[album.image.length-1]['#text'] + '" class=img-rounded">';
	html += '</figure>';

	html += '<ol>';
	for (var i = 0; i < album.tracks.track.length; i++) {
		var track = album.tracks.track[i];
		html += albumTrackTemplate(track);
	}
	html += '</ol>';

	html += '</div>';
	return html;
}

function presentarArtista(jsonData){	//ok
	var	html = artistTemplate(jsonData.artist);

	$resultado.html(html);
	$('.get-albums').on('click', function(){
		getArtistAlbums(jsonData.artist.name, presentarAlbums);
	})
}

function presentarAlbums(jsonData){
	var	html = albumListTemplate(jsonData);

	$resultado.html(html);
	$('.album').on('click', function(){
		var album = $(this).data('album');
		var artist = $(this).data('artist');

		getAlbumInfo(artist, album, presentarAlbumsDetalle);
	})
}

function presentarAlbumsDetalle(jsonData){
	//console.log(jsonData);
	var html = albumDetailTemplate(jsonData.album);

	$resultado.html(html);
}
//$buscar.on('click', buscarArtista);