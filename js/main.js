const image = document.getElementById('image');

const htmlMediaCapture = document.getElementById("htmlMediaCapture");
const previewContent = document.getElementById("preview-content");

const closeImagePreviewBtn = document.getElementById('closeImagePreview');

const savePreviewImgBtn = document.querySelector(".preview-image__save");
const downloadImgBtn = document.getElementById("application-form__download");
const resultImg = document.getElementById("application-form__image-result");

const loadingModal = document.getElementById('loading-modal');
const previewModal = document.getElementById('preview-modal');

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
                        enforceBoundary: true
                    })

                    debugger
                    croppieInst.bind({
                        url: imgSrc,
                        zoom: defaultZoomRatio,
                        orientation: 1
                    }).then(() => {
                        document.querySelector(".cr-slider").setAttribute("max", 3.000)
                        resolve("work");
                    })

                    savePreviewImgBtn.onclick = () => {
                        croppieInst.result({ type: "blob", format: "jpeg", size: { width: 240, height: 320 }, quality: 1, circle: false }).then(Blob => {
                            debugger
                            resultImg.src = URL.createObjectURL(Blob);
                            handleLoadingModal().close();
                        })
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

                canvasContext.fillStyle = "lightgrey";
                canvasContext.fillRect(0, 0, canvs.width, canvs.height);

                const testInfo = `img width: ${img.width}, img height: ${img.height}, canvas width: ${canvs.width}, canvas height: ${canvs.height}`;

                alert(testInfo);
                canvasContext.drawImage(img, 0, 0, img.width, img.height, QVGAWidth / 2, QVGAHeight / 2, img.width, img.height);
                resolve(canvs.toDataURL());
            }
        } catch (error) {
            reject(error);
        }
    })
}


const handleSubmitImageByMediaCapture = (elm) => {
    elm.onchange = async event => {
        const [file] = htmlMediaCapture.files;
        
        if (file) {
            // handleLoadingModal().open();
            loadingAnimation().start();

            alert(file.type)
            
            setTimeout(async () => {
                let inputImgURL = URL.createObjectURL(file);
                let drawnImgSrc = await drawImageInMiddleCanvas(inputImgURL);
                
                let img = new Image();

                img.src = drawnImgSrc;
                img.onload = function() {
                    alert(`width: ${img.width}  height: ${img.height}`)
                }

                resultImg.src = drawnImgSrc;
                // await croppieInit(drawnImgSrc);
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

const previewModalCloseListener = () => {
    $("#preview-modal").on("hidden.bs.modal", function () {
        htmlMediaCapture.value = '';
    });
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

const handleLoadingModal = () => {
    const open = () =>{
        $("#preview-modal").modal('show');
    } 
    const close = () =>{
        $("#preview-modal").modal('hide');
    }

    return {
        open,
        close
    }
}

document.addEventListener('DOMContentLoaded', () => {
    handleSubmitImageByMediaCapture(htmlMediaCapture);
    handleImageDownload();
    previewModalCloseListener();
})
