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
    let height = 0;

    let streaming = false;

    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    const photo = document.getElementById('photo');
    const startVideoBtn = document.getElementById('start-video-btn');
    const captureBtn = document.getElementById('capture-btn');

    captureBtn.disabled = true;
    
    startVideoBtn.onclick = (event) => {
            navigator.mediaDevices.getUserMedia({video: true, audio: false}).then(stream => {
                video.srcObject = stream;
                video.play();

                video.oncanplay = (event) =>{
                    if(!streaming){
                        height = video.videoHeight / (video.videoWidth/width);
                        video.setAttribute('width', width);
                        video.setAttribute('height', height);
                        canvas.setAttribute('width', width);
                        canvas.setAttribute('height', height);
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
    
            let data = canvas.toDataURL('image/png');
            photo.setAttribute('src', data);
        }else{
            context.fillStyle = "#AAA";
            context.fillRect(0, 0, canvas.width, canvas.height);

            let data = canvas.toDataURL('image/png');
            photo.setAttribute('src', data);
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