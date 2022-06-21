const htmlMediaCapture = document.getElementById("htmlMediaCapture");
const previewImage = document.getElementById("preview-image");

const handleSubmitImageByMediaCapture = (elm) => {
    elm.onchange = event => {
        const [file] = htmlMediaCapture.files;
        if(file){
            previewImage.src = URL.createObjectURL(file);
        }
    }
}

const hasGetUserMedia = () => {
    return !!(navigator.getUserMedia || navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia || navigator.msGetUserMedia)
}

const handleVideoByUserMedia = () =>{
    if(hasGetUserMedia()){
        navigator.getUserMedia({video: true, audio: true}, function(localMediaStream){
            var video = document.querySelector('video');
            video.src = window.URL.createObjectURL(localMediaStream);

            video.onloadedmetadata = function(e) {

            }
        }, (e) => {
            console.log('Reeeejected!', e);
        })
    }else{
        alert("Browser not support User Media")
    }
}

document.addEventListener('DOMContentLoaded', () => {
    handleSubmitImageByMediaCapture(htmlMediaCapture);
    handleVideoByUserMedia();
})