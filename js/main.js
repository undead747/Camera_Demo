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

const QuadVGAWidth = 960,
      QuadVGAHeight = 1280;

const croppieInit = (imgSrc) => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        if (croppieInst) croppieInst.destroy();
        if (imgSrc) {
            img.src = imgSrc;
            try {
                img.onload = () => {
                    const defaultZoomRatio = QVGAWidth / img.width;

                    croppieInst = new Croppie(previewContent, {
                        viewport: { width: QVGAWidth, height: QVGAHeight },
                        enforceBoundary: true,
                        showZoomer: false
                    })

                    croppieInst.bind({
                        url: imgSrc,
                        zoom: defaultZoomRatio,
                        orientation: 1
                    }).then(() => {
                        resolve("work");
                    })

                    imageResetBtn.onclick = async () => {
                        await croppieInst.bind({
                            url: imgSrc,
                            zoom: defaultZoomRatio,
                            orientation: 1
                        })
                    }

                    imageZoomInBtn.onclick = () => handleZoomInEvent(0.02)

                    imageZoomOutBtn.onclick = () => handleZoomOutEvent(0.02)

                    savePreviewImgBtn.onclick = () => {
                        croppieInst.result({ type: "blob", format: "jpeg", size: {width: 240, height: 320}, quality: 1, circle: false }).then(Blob => {
                            resultImg.src = URL.createObjectURL(Blob);
                            htmlMediaCapture.value = '';
                            previewModal.hide();
                        })
                    }

                    const handleZoomInEvent = (zoomRatio) => {
                        let currZoomVal = croppieInst.get().zoom;
                        croppieInst.setZoom(currZoomVal + zoomRatio);
                    }

                    const handleZoomOutEvent = (zoomRatio) => {
                        let currZoomVal = croppieInst.get().zoom;
                        croppieInst.setZoom(currZoomVal - zoomRatio);
                    }
                }
            } catch (error) {
                reject(error);
            }
        }
    })
}

const getCurrentWeelStatus = (e) => {
    var e = window.event || e;
    var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));

    if (delta > 0) return 1;

    return 0;
}

const drawImageInMiddleCanvas = (imgSrc) => {
    let img = new Image();
    let canvs = document.createElement('canvas');
    let canvasContext = canvs.getContext('2d');
    
    img.src = imgSrc;

    return new Promise((resolve, reject) => {
        try {
            img.onload = () => {
                let imgWidth = QuadVGAWidth,
                    imgHeight = QuadVGAWidth * img.height / img.width;

                canvs.width = imgWidth + QVGAWidth;
                canvs.height = imgHeight + QVGAHeight;

                canvasContext.fillStyle = "white";
                canvasContext.fillRect(0, 0, canvs.width, canvs.height);
                canvasContext.drawImage(img, 0, 0, img.width, img.height, QVGAWidth / 2, QVGAHeight / 2, imgWidth, imgHeight);
                resolve(canvs.toDataURL());
            }
        } catch (error) {
            reject(error);
        }
    })
}

const loadingAnimation = () => {
    const start = () => {
        loadingModal.style.display = "block";
    }
    const end = () => loadingModal.style.display = "none";

    return {
        start,
        end
    }
}

const handleSubmitImageByMediaCapture = (elm) => {
    elm.onchange = async event => {
        const [file] = htmlMediaCapture.files;

        if (file) {
            await previewModal.show();
            loadingAnimation().start();
            
            setTimeout(async () => {
                let inputImgURL = URL.createObjectURL(file);
                let drawnImgSrc = await drawImageInMiddleCanvas(inputImgURL);
                await croppieInit(drawnImgSrc);
                loadingAnimation().end();
            }, 170)

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

const resizeImage = (imgSrc, [width = 1920, height = 1080]) => {
    let finalCanvas = document.createElement("canvas");
    let img = new Image();
    const finalWidth = width;
    const finalHeight = height;

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
