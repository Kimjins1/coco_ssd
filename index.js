
var constraints = { audio: false, video: true };
var video = document.getElementById("videoInput");
function successCallback(stream) {
    video.srcObject = stream;
    video.play();
}
function errorCallback(error) {
    console.log(error);
}
navigator.getUserMedia(constraints, successCallback, errorCallback);

let net;
async function app() {
    console.log('Loading mobilenet..');
    net = await cocoSsd.load();
    console.log('Sucessfully loaded model');

    const canvas = document.getElementById("videoOutput");
    var ctx = canvas.getContext("2d");
    const color = ['green', 'red', 'blue'];
    ctx.lineWidth = 2;
    ctx.font = "15px Arial";
    while (true) {
        const predictions = await net.detect(video);
        ctx.drawImage(video, 0, 0, 320 , 240);
        let count = predictions.length;
        if (count > 0 && count < 4) {
            for (i = 0; i < count; i++) {
                ctx.fillStyle = color[i];
                ctx.strokeStyle = color[i];
                console.log(predictions[i].class);
                ctx.strokeRect(predictions[i].bbox[0], predictions[i].bbox[1], predictions[i].bbox[2], predictions[i].bbox[3]);
                ctx.fillText(predictions[i].class, predictions[i].bbox[0] + 5, predictions[i].bbox[1] + 15);
            }
        }
        await tf.nextFrame();
    }
}
app();