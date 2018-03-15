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

}

App(document.querySelector('.app'));
