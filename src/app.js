function App (el) {
  const videoEl = el.querySelector('.app__video');
  const constraints = {
    video: { width: 640, height: 480 },
    audio: true
  };

  navigator.mediaDevices.getUserMedia(constraints)
    .then(function (stream) {
      videoEl.srcObject = stream;
      videoEl.onloadedmetadata = function (e) {
        videoEl.play();
      };
    })
    .catch(function (err) {
      /* handle the error */
    });

  function runGlitch1 () {
    videoEl.classList.add('app__video_glitch_1');
    setTimeout(function () {
      videoEl.classList.remove('app__video_glitch_1');
      setTimeout(function () {
        runGlitch1();
      }, 1000 + Math.floor(2000 * Math.random()));
    }, 1000);
  }

  runGlitch1();
}

App(document.querySelector('.app'));
