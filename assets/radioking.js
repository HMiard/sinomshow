var settings = {
    'radio_id': 'sinom-show1',
};

const RADIO_NAME = "Sinom Show Radio"
const RADIO_ID = settings.radio_id;
const URL_STREAMING = "https://www.radioking.com/play/" + RADIO_ID;
const DEFAULT_COVER_ART = "assets/img/vinyl.png";
const DATE = new Date();

window.addEventListener('DOMContentLoaded', (event) => {

    var player = new Player();
    //player.play();

    getStreamingData();

    setInterval(function () {
        getStreamingData();
    }, 5000);
})

var audio = new Audio(URL_STREAMING);

// Player control
function Player() {
    this.play = async function () {
        await audio.play();
    };

    this.pause = function () {
        audio.pause();
    };
}

// On play, change the button to pause
audio.onplay = function () {
    var botao = document.getElementById('toggle-play').firstElementChild;

    if (botao.className === 'fa fa-play') {
        botao.className = 'fa fa-stop';
    }
}

// On pause, change the button to play
audio.onpause = function () {
    var botao = document.getElementById('toggle-play').firstElementChild;

    if (botao.className === 'fa fa-stop') {
        botao.className = 'fa fa-play';
    }
}

function getStreamingData() {

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {

        if (this.readyState === 4 && this.status === 200) {

            var data = JSON.parse(this.responseText);

            // Formating characters to UTF-8
            let song = data.title.replace(/&apos;/g, '\'');
            let currentSong = song.replace(/&amp;/g, '&');

            let artist = data.artist.replace(/&apos;/g, '\'');
            let currentArtist = artist.replace(/&amp;/g, '&');
            currentArtist = currentArtist.replace('  ', ' ');

            // Change the title
            document.title = currentSong + ' - ' + currentArtist + ' | ' + RADIO_NAME;
            
            var currentSongElement = document.getElementById('track-name');
            var currentSongElementControl = document.getElementById('control-track-name').firstElementChild;
            var currentArtistElement = document.getElementById('artist-name');
            var currentAlbumElement = document.getElementById('album-name');
    
            if (song !== currentSongElement.innerHTML) {
                currentSongElement.innerHTML = song;
                currentSongElementControl.innerHTML = song;
                currentArtistElement.innerHTML = artist;
                
                updateNext();
            }
            

            var artworkUrl = data.cover ?? DEFAULT_COVER_ART;
            var coverArt = document.getElementById('albumArt');
            
            //document.getElementsByTagName('body')[0].style.background = 'url('+ artworkUrl +') no-repeat center center fixed'
            //document.getElementsByTagName('body')[0].style.backgroundSize = "cover";
            coverArt.src = artworkUrl;
            
            /*
            if ('mediaSession' in navigator) {
                navigator.mediaSession.metadata = new MediaMetadata({
                    title: song,
                    artist: artist,
                    artwork: [{
                        src: artworkUrl,
                        type: 'image/png'
                    }]
                });                
            }
            */
            
            
            
        }
    };

    xhttp.open('GET', 'https://api.radioking.io/widget/radio/' + RADIO_ID + '/track/current', true);
    xhttp.send();
}

function updateNext() {

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            var data = JSON.parse(this.responseText);
            
            for (var i = 0; i < 5; i++){
            
                // Note: compensating offset
                var item = data[i + 1];
                var artworkUrl = item.cover_url ?? DEFAULT_COVER_ART;
                var coverArt = document.getElementById('next' + i);
                console.log(item);
                coverArt.src = artworkUrl;
                
              
            }
            
            data.forEach(function (item, index) {
            
                var artworkUrl = item.cover ?? DEFAULT_COVER_ART;
                
            });
        }
    }
    
    // Note: no offset parameter as it seems
    xhttp.open('GET', 'https://api.radioking.io/widget/radio/' + RADIO_ID + '/track/history?limit=6', true);
    xhttp.send();
}


function togglePlay() {
    if (!audio.paused) {
        audio.pause();
    } else {
        audio.load();
        audio.play();
    }
}