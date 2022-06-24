const image = document.getElementById('image');

const htmlMediaCapture = document.getElementById("htmlMediaCapture");
const previewImage = document.getElementById("preview-image");
var previewExist = false;

const video = document.getElementById('video');
const canvas = document.getElementById('temp-canvas');
const startVideoBtn = document.getElementById('start-video-btn');
const captureBtn = document.getElementById('capture-btn');
const closeImagePreviewBtn = document.getElementById('closeImagePreview');

const imageUpBtn = document.querySelector(".preview-image__possition-up");
const imageDownBtn = document.querySelector(".preview-image__possition-down");
const imageleftBtn = document.querySelector(".preview-image__possition-left");
const imageRightBtn = document.querySelector(".preview-image__possition-right");
const imageZoomInBtn = document.querySelector(".preview-image__zoom-in");
const imageZoomOutBtn = document.querySelector(".preview-image__zoom-out");
const imageResetBtn = document.getElementById("preview-modal__reset-btn");


const savePreviewImgBtn = document.querySelector(".preview-image__save");
const downloadImgBtn = document.querySelector(".preview-image__download");
const resultImg = document.querySelector(".image-result");

const previewModal = new bootstrap.Modal(document.getElementById("preview-modal"), {});


var cropper = null;
var option = {
    aspectRatio: 3/4,
    autoCropArea: 1,
    viewMode: 0,
    dragMode: 'move',
    data: null,
    background: true,
    center: false,
    highlight: false,
    guides: false,
    cropBoxMovable: false,
    cropBoxResizable: false,
    toggleDragModeOnDblclick: false,
    ready: function(){
        let currContainerData = cropper.getContainerData();
        cropper.setCropBoxData({left: 0, top: 0, width: currContainerData.width, height: currContainerData.height});
        console.log(JSON.stringify(cropper.getContainerData()));
        imageZoomInBtn.onclick = () => cropper.zoom(0.1);
        imageZoomOutBtn.onclick = () => cropper.zoom(-0.1);

        imageUpBtn.onclick = () => cropper.move(0, 10)

        imageDownBtn.onclick = () => cropper.move(0, -10)

        imageleftBtn.onclick = () => cropper.move(10, 0)

        imageRightBtn.onclick = () => cropper.move(-10, 0)

        savePreviewImgBtn.onclick = () => {
            cropper.getCroppedCanvas().toBlob(blob => {
                let croppedImgUrl = URL.createObjectURL(blob);
                resultImg.src = croppedImgUrl;
                previewModal.hide();
            })
        }

        imageResetBtn.onclick = () => {
            cropper.reset();
        }
    }
}

const handleSubmitImageByMediaCapture = (elm) => {
    elm.onchange = event => {
        const [file] = htmlMediaCapture.files;

        if (file) {
            previewImage.src = URL.createObjectURL(file);
            if (cropper) cropper.destroy();

            previewModal.show();
            
            setTimeout(() => {
                cropper = new Cropper(previewImage, option);
            }, 160)
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
        navigator.mediaDevices.getUserMedia({ video: true, audio: false }).then(stream => {
            video.srcObject = stream;
            video.play();

            video.oncanplay = (event) => {
                captureBtn.disabled = false;
                if (!streaming) {

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

const handleImageChange = () => {
    downloadImgBtn.disabled = true;
    
    resultImg.onload = () => {
        downloadImgBtn.disabled = false;
    }
}

const handleImageDownload = () => {
    let aTag = document.createElement('a');

    handleImageChange();
    downloadImgBtn.onclick = () => {
        let currDate = new Date();

        aTag.href = resultImg.src;
        aTag.download = `download_${currDate.toLocaleString()}.jpg`;
        aTag.click();
    }
}

const handleClosePreviewModal = () =>{
    closeImagePreviewBtn.onclick = () => {
        previewModal.hide();
        htmlMediaCapture.value = '';
        if (cropper) cropper.destroy();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    handleSubmitImageByMediaCapture(htmlMediaCapture);
    handleClosePreviewModal();
    handleVideoByUserMedia();
    handleImageDownload();
})
