const htmlMediaCapture = document.getElementById("htmlMediaCapture");
const previewImage = document.getElementById("preview-image");

const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const startVideoBtn = document.getElementById('start-video-btn');
const captureBtn = document.getElementById('capture-btn');

const handleSubmitImageByMediaCapture = (elm) => {
    elm.onchange = event => {
        const [file] = htmlMediaCapture.files;
        let context = canvas.getContext('2d');
 
        if (file) {
            let imgObject = new Image;
            imgObject.onload = () =>{
                canvas.width = imgObject.width;
                canvas.height = imgObject.height;
               
                context.drawImage(imgObject, 0 ,0);
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
    let width = 550;
    let height = 0;

    let streaming = false;


    captureBtn.disabled = true;
    
    startVideoBtn.onclick = (event) => {
            navigator.mediaDevices.getUserMedia({video: true, audio: false}).then(stream => {
                video.srcObject = stream;
                video.play();

                video.oncanplay = (event) =>{
                    if(!streaming){
                        height = video.videoHeight / (video.videoWidth/width);
                        video.width = width;
                        video.height = height;
                        canvas.width = width;
                        canvas.height = height;
                        captureBtn.disabled = false;
                        streaming = true;
                    }
                }
            }).catch(err => {
                console.log("Errors !! : " + err);
            })
    }

    captureBtn.onclick = (event) => {
        let context = canvas.getContext('2d');
        if (width && height) {
            context.drawImage(video, 0, 0, width, height);
        }else{
            context.fillStyle = "#AAA";
            context.fillRect(0, 0, canvas.width, canvas.height);
        }
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