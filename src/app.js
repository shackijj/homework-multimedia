function App (el) {
  const videoEl = el.querySelector('.app__video');
  const loaderEl = el.querySelector('.app__load');
  const canvasEl = el.querySelector('.app__canvas');
  const movementDetectedEl = el.querySelector('.app__movement-detected');
  const canvasCtx = canvasEl.getContext('2d');

  const analyserCanvas = document.createElement('canvas');
  const analyserCanvasCtx = analyserCanvas.getContext('2d');
  const turbulence = el.querySelector('.app__feTurbulence');

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

  const movementDetectorWorker = new Worker('movementDetector.js');

  movementDetectorWorker.onmessage = function () {
    if (!movementDetectedEl.classList.contains('app__movement-detected_visible')) {
      movementDetectedEl.classList.add('app__movement-detected_visible');
      setTimeout(function () {
        movementDetectedEl.classList.remove('app__movement-detected_visible');
      }, 1000);
    }
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
    let y;

    canvasCtx.fillStyle = 'rgba(225,255,255,0.6)';

    let maxDb = 0;
    for(let i = 0; i < audioBufferLength; i++) {
      let db = audioDataArray[i];
      if (db > maxDb) {
        maxDb = db;
      }
      let barHeight = height * (db / maxDecibels);
      y = startY + height - barHeight;
      canvasCtx.fillRect(x, y, barWidth, barHeight);

      x += barWidth;
    }

    let volumeHeight = height * (maxDb / maxDecibels);
    y = startY + height - volumeHeight;
    if (maxDb > 200) {
      canvasCtx.fillStyle = 'rgba(225,0,0,1)';
    }
    canvasCtx.fillRect(x + 10, y, 30, volumeHeight);
  }

  function draw () {
    canvasCtx.clearRect(0, 0, canvasEl.width, canvasEl.height);

    analyserCanvasCtx.drawImage(videoEl, 0, 0);
    movementDetectorWorker.postMessage(analyserCanvasCtx.getImageData(0, 0, canvasEl.width, canvasEl.height));

    drawAudioAnalyzer();
  }

  function gameLoop () {
    draw();
    window.requestAnimationFrame(gameLoop);
  }

  function runDistortionGlitchLoop () {
    turbulence.setAttribute('baseFrequency', '0.00 ' + Math.random());
    el.classList.add('app_glitch_1');
    setTimeout(function () {
      el.classList.remove('app_glitch_1');
      setTimeout(runDistortionGlitchLoop, Math.random() * 5000 + 100);
    }, 100);
  }

  runDistortionGlitchLoop();
}

App(document.querySelector('.app'));
