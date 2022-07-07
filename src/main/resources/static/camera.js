const bt = document.querySelector('#container');
const canvas = document.querySelector('.still_image');
const video = document.querySelector("#videoElement");
const lightning = document.querySelector('.lightning');
const cameraShutterSound = new Audio('camera.mp3');
const pingSound = new Audio('ping.mp3');
const message = document.querySelector('#message');
let inputAllowed = true;



if (navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({video: true})
        .then(function (stream) {
            video.srcObject = stream;
        })
        .catch(function (err0r) {
            console.log("Something went wrong!");
        });
}


document.addEventListener("keydown", photo)
bt.onclick = () => {
    enterFullscreen(document.documentElement);
    bt.onclick = photo
}

function photo() {

    if (inputAllowed) {
        message.classList.add('invisible')
        inputAllowed = false
        countDown(document.querySelector("#countdown"), () => {
            doScreenshot()
            message.classList.remove('invisible')
            inputAllowed = true
        }, 3)
    }
}

function doScreenshot() {
    restartAnimation(lightning, 'lightning_fadeout')
    restartAnimation(canvas, 'fadeout')
    cameraShutterSound.play();

    canvas.width = 3 * video.videoWidth;
    canvas.height = 3 * video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob(upload, 'image/jpeg');
}

function countDown(display, successorFunction, timer) {
    pingSound.play()
    display.textContent = timer;
    display.classList.remove('invisible')

    setTimeout(function () {
            if (timer <= 1) {
                display.classList.add('invisible')
                successorFunction()
            } else {
                countDown(display, successorFunction, timer - 1)
            }
        }, 1400
    )
}

function restartAnimation(element, animation) {
    //For some weird JS reason readding a class wont restart the animation so a reflow has to be triggered
    element.classList.remove(animation)
    element.offsetWidth;
    element.classList.add(animation)
}

function upload(blob) {
    let file = new File([blob], 'foto.jpg', {type: "image/jpeg"})
    let formData = new FormData();
    formData.append("image", file);
    fetch('/upload', {
        method: "POST",
        body: formData
    });
}

function enterFullscreen(element) {
    if(element.requestFullscreen) {
        element.requestFullscreen();
    } else if(element.msRequestFullscreen) {      // for IE11 (remove June 15, 2022)
        element.msRequestFullscreen();
    } else if(element.webkitRequestFullscreen) {  // iOS Safari
        element.webkitRequestFullscreen();
    }
}

