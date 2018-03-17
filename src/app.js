function wait (time) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time);
  });
}

function App (el) {
  const width = 640;
  const height = 480;
  const videoEl = el.querySelector('.app__video');

  const loaderEl = el.querySelector('.app__load');
  const canvasEl = el.querySelector('.app__audio-analyzer');
  const movementDetectedEl = el.querySelector('.app__movement-detected');

  const analyserCanvas = document.createElement('canvas');
  analyserCanvas.setAttribute('class', 'app__analyzer-canvas');
  analyserCanvas.setAttribute('width', width);
  analyserCanvas.setAttribute('height', height);

  const analyserCanvasCtx = analyserCanvas.getContext('2d');

  const constraints = {
    video: { width, height },
    audio: true
  };

  const AudioContext = window.AudioContext || window.webkitAudioContext;
  const audioCtx = new AudioContext();
  const analyser = audioCtx.createAnalyser();
  analyser.fftSize = 256;
  const audioAnalyzer = new AudioAnalyzer(canvasEl, analyser);
  const imageDataWidget = new ImageDataWidget(el.querySelector('.app__image-data'));

  let faceTracker;
  /**
   * It's not a production solution. I just need a way to quickly disable the feature.
   */
  if (window.location.search.indexOf('face_detection=1') !== -1) {
    faceTracker = new FaceTracker(el.querySelector('.app__face-tracker'), analyserCanvas);
  }

  const movementDetectorWorker = new Worker('movementDetector.js');

  movementDetectorWorker.onmessage = function () {
    if (!movementDetectedEl.classList.contains('app__movement-detected_visible')) {
      movementDetectedEl.classList.add('app__movement-detected_visible');
      setTimeout(function () {
        movementDetectedEl.classList.remove('app__movement-detected_visible');
      }, 1000);
    }
  };

  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia(constraints)
      .then(function (stream) {
        videoEl.srcObject = stream;
        videoEl.onloadedmetadata = function () {
          videoEl.play();
          videoEl.volume = 0;
        };
        const audioSource = audioCtx.createMediaStreamSource(stream);
        audioSource.connect(analyser);

        loaderEl.classList.add('app__load_closed');
        gameLoop();
      })
      .catch(function (error) {
        loaderEl.innerHTML = error.message;
      });
  } else {
    loaderEl.innerHTML = 'Sorry, navigator.mediaDevices is not supported by your browser';
    return;
  }

  let frame = 0;
  function gameLoop () {
    analyserCanvasCtx.drawImage(videoEl, 0, 0);
    const videoImageData = analyserCanvasCtx.getImageData(0, 0, width, height);

    /**
     * Send analytics on each 4th frame
     */
    if (frame % 4) {
      movementDetectorWorker.postMessage(videoImageData);

      if (faceTracker) {
        faceTracker.track(videoImageData);
      }
    }

    audioAnalyzer.draw();
    window.requestAnimationFrame(gameLoop);
    if (frame === 59) {
      frame = 0;
    }
    frame++;
  }

  const turbulence = el.querySelector('.app__feTurbulence');

  function runDistortionGlitchLoop () {
    turbulence.setAttribute('baseFrequency', Math.random());
    el.classList.add('app_glitch_1');
    const animationDuration = 100;
    const maxInterval = 5000;
    wait(animationDuration)
      .then(function () {
        el.classList.remove('app_glitch_1');
      })
      .then(function () {
        return wait(Math.random() * maxInterval + animationDuration);
      })
      .then(runDistortionGlitchLoop);
  }

  runDistortionGlitchLoop();

  setInterval(function () {
    const data = analyserCanvasCtx.getImageData(0, 0, width, height);
    imageDataWidget.update(data);
  }, 2000);
}

App(document.querySelector('.app'));
