const image = document.getElementById('image');

const htmlMediaCapture = document.getElementById("htmlMediaCapture");
const previewContent = document.getElementById("preview-content");

const video = document.getElementById('video');
const temCanvas = document.getElementById('temp-canvas');
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
const loadingModal = document.querySelector('.loading-modal');

let croppieInst = null;

const QVGAWidth = 240,
    QVGAHeight = 320
QVGARatio = 3 / 4;

const croppieInit = (imgSrc) => {
    const img = new Image();

    if (imgSrc) {
        img.src = imgSrc;
        img.onload = () => {
            if (croppieInst) croppieInst.destroy();

            croppieInst = new Croppie(previewContent, {
                viewport: { width: QVGAWidth, height: QVGAHeight },
                enforceBoundary: false,
                showZoomer: false
            })

            croppieInst.bind({
                url: imgSrc,
                zoom: (QVGAWidth < img.width) ? QVGAWidth / img.width : 1,
                orientation: 1
            })

            imageResetBtn.onclick = () => {
                croppieInst.bind({
                    url: imgSrc,
                    zoom: (QVGAWidth < img.width) ? QVGAWidth / img.width : 1,
                    orientation: 1
                })
            }

            imageZoomInBtn.onclick = () => handleZoomInEvent()
            
            imageZoomOutBtn.onclick = () => handleZoomOutEvent()
            
            const overideCroppieZoom = () => {
                const currCropArea = document.querySelector(".cr-boundary");
                
                currCropArea.addEventListener('DOMMouseScroll', (event) => {
                    event.preventDefault();
                    event.stopImmediatePropagation();
                    
                    let weelStatus = getCurrentWeelStatus(event);
                   
                    if(weelStatus === 1) handleZoomInEvent();
                    else handleZoomOutEvent();
                }, true);
                
                currCropArea.addEventListener("mousewheel", (event) => {
                    event.preventDefault();
                    event.stopImmediatePropagation();
                    
                    let weelStatus = getCurrentWeelStatus(event);
                   
                    if(weelStatus === 1) handleZoomInEvent();
                    else handleZoomOutEvent();
                }, true)
            }
            
            const handleZoomInEvent = () => {
                let currZoomVal = croppieInst.get().zoom;
                croppieInst.setZoom(currZoomVal + 0.01);
            }
            
            const handleZoomOutEvent = () => {
                let currZoomVal = croppieInst.get().zoom;
                if (currZoomVal - 0.01 >= QVGAWidth / img.width) croppieInst.setZoom(currZoomVal - 0.01);
            }
        }
    }
}

const getCurrentWeelStatus = (e) => {
    var e = window.event || e;
    var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));

    if(delta > 0) return 1;

    return 0;
}

const handleSubmitImageByMediaCapture = (elm) => {
    elm.onchange = event => {
        const [file] = htmlMediaCapture.files;
        // 1920 x 1080 img
        const maxImgSize = 6220800;

        if (file) {
            if (file.size > maxImgSize) alert("写真が大きすぎる !!!");
            
            setTimeout(() => {
                croppieInit(URL.createObjectURL(file));
            }, 1000)

            previewModal.show();
        }
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

const handleClosePreviewModal = () => {
    closeImagePreviewBtn.onclick = () => {
        previewModal.hide();
        htmlMediaCapture.value = '';
    }
}

const resizeImage = (imgSrc) => {
    let finalCanvas = document.createElement("canvas");
    let img = new Image();
    const finalWidth = 240;
    const finalHeight = 320;

    img.onload = function () {
        finalCanvas.width = finalWidth;
        finalCanvas.height = finalHeight;

        finalCanvas.getContext("2d").drawImage(img, 0, 0, img.width, img.height,
            0, 0, finalCanvas.width, finalCanvas.height);

        resultImg.src = finalCanvas.toDataURL("image/jpeg")
    }

    img.src = imgSrc;
}

document.addEventListener('DOMContentLoaded', () => {
    handleSubmitImageByMediaCapture(htmlMediaCapture);
    handleClosePreviewModal();
    handleVideoByUserMedia();
    handleImageDownload();
})



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
        let context = temCanvas.getContext('2d');
        context.clearRect(0, 0, temCanvas.width, temCanvas.height);

        temCanvas.width = video.width;
        temCanvas.height = video.height;

        context.drawImage(video, 0, 0, video.width, video.height);
        previewImage.src = temCanvas.toDataURL();
        previewModal.show();

        if (cropper) cropper.destroy();

        cropper = new Cropper(previewImage, {
            aspectRatio: 16 / 9,
            dragMode: 'move',
            viewMode: 2,
            background: false,
        });

    }
}


// var cropper = null;

// var option = {
//     aspectRatio: 3 / 4,
//     autoCropArea: 1,
//     viewMode: 0,
//     dragMode: 'move',
//     data: null,
//     background: true,
//     center: false,
//     highlight: false,
//     guides: false,
//     cropBoxMovable: false,
//     cropBoxResizable: false,
//     toggleDragModeOnDblclick: false,
//     ready: function () {
//         let currContainerData = cropper.getContainerData();
//         cropper.setCropBoxData({ left: 0, top: 0, width: currContainerData.width, height: currContainerData.height });
//         imageZoomInBtn.onclick = () => cropper.zoom(0.15);

//         imageZoomOutBtn.onclick = () => cropper.zoom(-0.15);

//         imageUpBtn.onclick = () => cropper.move(0, -10)

//         imageDownBtn.onclick = () => cropper.move(0, 10)

//         imageleftBtn.onclick = () => cropper.move(-10, 0)

//         imageRightBtn.onclick = () => cropper.move(10, 0)

//         savePreviewImgBtn.onclick = () => {
//             try {
//                 loadingModal.style.display = "block";
//                 cropper.getCroppedCanvas({fillColor: '#FFFFFF' }).toBlob(blob => {
//                     let croppedImgUrl = URL.createObjectURL(blob);
//                     resizeImage(croppedImgUrl);
//                     previewModal.hide();
//                     loadingModal.style.display = "none";
//                     htmlMediaCapture.value = '';
//                 }, 'image/jpeg', 0.9)
//             } catch (error) {
//                 alert(error);
//             }
//         }

//         imageResetBtn.onclick = () => {
//             cropper.reset();
//             cropper.setCropBoxData({ left: 0, top: 0, width: currContainerData.width, height: currContainerData.height });
//         }
//     }
// }