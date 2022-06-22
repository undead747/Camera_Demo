const htmlMediaCapture = document.getElementById("htmlMediaCapture");
const previewImage = document.getElementById("preview-image");
var previewExist = false;

const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const startVideoBtn = document.getElementById('start-video-btn');
const captureBtn = document.getElementById('capture-btn');

const handleSubmitImageByMediaCapture = (elm) => {
    elm.onchange = event => {
        debugger
        const [file] = htmlMediaCapture.files;
        let context = canvas.getContext('2d');
 
        if (file) {
            let imgObject = new Image;
            imgObject.onload = () =>{
                canvas.width = imgObject.width;
                canvas.height = imgObject.height;
               
                context.drawImage(imgObject, 0 ,0);
                previewExist = true;
            }

            imgObject.src = URL.createObjectURL(file);
        }
    }
    
}

const hasGetUserMedia = () => {
    return !!(navigator.getUserMedia || navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia || navigator.msGetUserMedia)
}

const handleVideoByUserMedia = () => {
    let streaming = false;

    captureBtn.disabled = true;
    
    startVideoBtn.onclick = (event) => {
        if(hasGetUserMedia()){
            navigator.mediaDevices.getUserMedia({video: true, audio: false}).then(stream => {
                video.srcObject = stream;
                video.play();

                video.oncanplay = (event) =>{
                    captureBtn.disabled = false;
                    if(!streaming){
                       
                        video.width = video.videoWidth;
                        video.height = video.videoHeight;
                        captureBtn.disabled = false;
                        streaming = true;
                    }
                }
            }).catch(err => {
                alert("Errors !! : " + err);
            })
        }else{
            alert("Your browser dose not supported this function !");
        }
    }

    captureBtn.onclick = (event) => {
        let context = canvas.getContext('2d');
        context.clearRect(0, 0, canvas.width, canvas.height);

        canvas.width = video.width;
        canvas.height = video.height;
        
        context.drawImage(video, 0, 0, video.width, video.height);
    }
}

const takePicture = (video) => {
    const canvas = document.getElementById('canvas');

    let context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, )
}

document.addEventListener('DOMContentLoaded', () => {
    handleSubmitImageByMediaCapture(htmlMediaCapture);
    handleVideoByUserMedia();
})