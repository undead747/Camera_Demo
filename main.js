const htmlMediaCapture = document.getElementById("htmlMediaCapture");
const previewImage = document.getElementById("preview-image");

const handleSubmitImageByMediaCapture = (elm) => {
    elm.onchange = event => {
        const [file] = htmlMediaCapture.files;
        if (file) {
            previewImage.src = URL.createObjectURL(file);
        }
    }
}

const hasGetUserMedia = () => {
    return !!(navigator.getUserMedia || navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia || navigator.msGetUserMedia)
}

const handleVideoByUserMedia = () => {
    let width = 320;
    var height = 0;

    var streaming = false;

    var video = document.getElementById('video');
    var canvas = document.getElementById('canvas');
    var photo = document.getElementById('photo');
    var startbutton = document.getElementById('startbutton');
    
    if (hasGetUserMedia()) {
        navigator.mediaDevices.getUserMedia({video: true, audio: false}).then(stream => {
            video.srcObject = stream;
            video.play();
        }).catch(err => {
            console.log("Errors !! : " + err);
        })
    } else {
        alert("Browser not support User Media")
    }
}

document.addEventListener('DOMContentLoaded', () => {
    handleSubmitImageByMediaCapture(htmlMediaCapture);
    handleVideoByUserMedia();
})