const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let model;

async function startVideo() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;
    await video.play();
    model = await blazeface.load();
    detectFaces();
  } catch(err) {
    console.error(err);
  }
}

async function detectFaces() {
  const predictions = await model.estimateFaces(video);
  ctx.drawImage(video, 0, 0);
  drawBoxes(predictions);
  requestAnimationFrame(detectFaces);
}

function drawBoxes(predictions) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  predictions.forEach(prediction => {
    const {topLeft, bottomRight } = prediction.region;
    ctx.beginPath();
    ctx.rect(topLeft[0], topLeft[1], bottomRight[0] - topLeft[0], bottomRight[1] - topLeft[1]);
    ctx.strokeStyle = 'green';
    ctx.lineWidth = 2;
    ctx.stroke();
  });
}

startVideo();
