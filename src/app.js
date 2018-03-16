function App (el) {
  const videoEl = el.querySelector('.app__video');
  const loaderEl = el.querySelector('.app__load');
  const canvasEl = el.querySelector('.app__canvas');
  const canvasCtx = canvasEl.getContext('2d');

  const constraints = {
    video: { width: 640, height: 480 },
    audio: true
  };

  const AudioContext = window.AudioContext || window.webkitAudioContext;
  const audioCtx = new AudioContext();
  const analyser = audioCtx.createAnalyser();
  let audioSource;
  let audioBufferLength;
  let audioDataArray;

  const comparissonWorker = new Worker('comparisson.js');

  let lastMovementDetected;
  comparissonWorker.onmessage = () => {
    lastMovementDetected = Date.now();
  };

  navigator.mediaDevices.getUserMedia(constraints)
    .then(function (stream) {
      videoEl.srcObject = stream;
      videoEl.onloadedmetadata = function (e) {
        videoEl.play();
        videoEl.volume = 0;
      };
      audioSource = audioCtx.createMediaStreamSource(stream);
      audioSource.connect(analyser);
      analyser.fftSize = 256;
      audioBufferLength = analyser.frequencyBinCount;
      audioDataArray = new Uint8Array(audioBufferLength);

      loaderEl.classList.add('app__load_closed');
      gameLoop();
    })
    .catch(function (err) {
      /* handle the error */
    });

  function drawAudioAnalyzer () {
    const maxDecibels = 255;
    const startY = 375;
    const startX = 5;
    const width = 256;
    const height = 100;

    analyser.getByteFrequencyData(audioDataArray);
    canvasCtx.strokeStyle = 'rgb(225,255,255)';
    canvasCtx.strokeRect(startX, startY, width, height);

    const barWidth = (width / audioBufferLength);
    let x = startX;

    canvasCtx.fillStyle = 'rgba(225,255,255,0.6)';

    for(let i = 0; i < audioBufferLength; i++) {
      let db = audioDataArray[i];
      let barHeight = height * (db / maxDecibels);
      let y = startY + height - barHeight;
      canvasCtx.fillRect(x, y, barWidth, barHeight);

      x += barWidth;
    }
  }

  function draw () {
    canvasCtx.clearRect(0, 0, canvasEl.width, canvasEl.height);
    canvasCtx.drawImage(videoEl, 0, 0);

    comparissonWorker.postMessage(canvasCtx.getImageData(0, 0, canvasEl.width, canvasEl.height));

    drawAudioAnalyzer();
  }

  function gameLoop () {
    draw();
    window.requestAnimationFrame(gameLoop);
  }

  /** Giltches */
  function runGlitch (modifier) {
    canvasEl.classList.add('app__canvas_glitch_' + modifier);
    setTimeout(function () {
      canvasEl.classList.remove('app__canvas_glitch_' + modifier);
      setTimeout(function () {
        runGlitch(modifier);
      }, 1000 + Math.floor(6000 * Math.random()));
    }, 1000);
  }

  runGlitch(1);
  runGlitch(2);
}

App(document.querySelector('.app'));
