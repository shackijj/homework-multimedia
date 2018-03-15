function App (el) {
  const videoEl = el.querySelector('.app__video');
  const audioCanvasEl = el.querySelector('.app__audio-canvas');
  const audioCanvasCtx = audioCanvasEl.getContext('2d');

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

  navigator.mediaDevices.getUserMedia(constraints)
    .then(function (stream) {
      videoEl.srcObject = stream;
      videoEl.onloadedmetadata = function (e) {
        videoEl.play();
        videoEl.volume = 0;
      };
      audioSource = audioCtx.createMediaStreamSource(stream);
      audioSource.connect(analyser);
      analyser.connect(audioCtx.destination);
      analyser.fftSize = 2048;
      audioBufferLength = analyser.frequencyBinCount;
      audioDataArray = new Uint8Array(audioBufferLength);
      gameLoop();
    })
    .catch(function (err) {
      /* handle the error */
    });

  function draw () {
    const WIDTH = audioCanvasEl.offsetWidth;
    const HEIGHT = audioCanvasEl.offsetHeight;
    analyser.getByteFrequencyData(audioDataArray);
    audioCanvasCtx.clearRect(0, 0, WIDTH, HEIGHT);

    audioCanvasCtx.fillStyle = 'transparent';
    audioCanvasCtx.fillRect(0, 0, WIDTH, HEIGHT);
    const barWidth = (WIDTH / audioBufferLength) * 2.5;
    let barHeight;
    let x = 0;

    for(let i = 0; i < audioBufferLength; i++) {
      barHeight = audioDataArray[i];
      audioCanvasCtx.fillStyle = 'rgb(225,255,255)';
      audioCanvasCtx.fillRect(x, HEIGHT - barHeight / 2, barWidth, barHeight);

      x += barWidth + 1;
    }
  }

  function gameLoop () {
    draw();
    window.requestAnimationFrame(gameLoop);
  }

  /** Giltches */
  function runGlitch (modifier) {
    videoEl.classList.add('app__video_glitch_' + modifier);
    setTimeout(function () {
      videoEl.classList.remove('app__video_glitch_' + modifier);
      setTimeout(function () {
        runGlitch(modifier);
      }, 1000 + Math.floor(6000 * Math.random()));
    }, 1000);
  }

  runGlitch(1);
  runGlitch(2);
}

App(document.querySelector('.app'));
