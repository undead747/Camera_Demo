const image = document.getElementById('image');

const htmlMediaCapture = document.getElementById("htmlMediaCapture");
const previewImage = document.getElementById("preview-image");
var previewExist = false;

const video = document.getElementById('video');
const canvas = document.getElementById('temp-canvas');
const startVideoBtn = document.getElementById('start-video-btn');
const captureBtn = document.getElementById('capture-btn');
const previewModal = new bootstrap.Modal(document.getElementById("preview-modal"), {});

var cropper = new Cropper(previewImage, {
    aspectRatio: 16 / 9,
    dragMode: 'move',
    viewMode: 2,
    autoCropArea: 1,
    background: false,
  });

const handleSubmitImageByMediaCapture = (elm) => {
    elm.onchange = event => {
        const [file] = htmlMediaCapture.files;
 
        if (file) {
          previewModal.show();
          setTimeout(()=>{
              previewImage.src = URL.createObjectURL(file);
              cropper.destroy();
              
              cropper = new Cropper(previewImage, {
                aspectRatio: 16 / 9,
                dragMode: 'move',
                viewMode: 2,
                background: false,
              });
            }, 100)
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
        // if(hasGetUserMedia()){
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
        // }
        // else{
            // alert("Your browser dose not supported this function !");
        // }
    }

    captureBtn.onclick = (event) => {
        let context = canvas.getContext('2d');
        context.clearRect(0, 0, canvas.width, canvas.height);

        canvas.width = video.width;
        canvas.height = video.height;
        
        context.drawImage(video, 0, 0, video.width, video.height);
        previewImage.src = canvas.toDataURL();
        previewModal.show();
        
        cropper.destroy();
            
        cropper = new Cropper(previewImage, {
          aspectRatio: 16 / 9,
          dragMode: 'move',
          viewMode: 2,
          background: false,
        });
        
    }
}

document.addEventListener('DOMContentLoaded', () => {
    handleSubmitImageByMediaCapture(htmlMediaCapture);
    handleVideoByUserMedia();
})
