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
