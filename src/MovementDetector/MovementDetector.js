const MovementDetectorWorker = require('./MovementDetector.worker.js');

function MovementDetector (el) {
  this.el = el;
  this.worker = new MovementDetectorWorker();
  this.isBusy = false;

  this.hide = this.hide.bind(this);
  this.worker.addEventListener('message', this.onDetect.bind(this));
}

MovementDetector.prototype.detect = function (imageData) {
  if (!this.isBusy) {
    this.isBusy = true;
    this.worker.postMessage(imageData);
  }
};

MovementDetector.prototype.onDetect = function ({data: {result}}) {
  this.isBusy = false;
  if (result && !this.el.classList.contains('app__movement-detected_visible')) {
    this.el.classList.add('app__movement-detected_visible');
    setTimeout(this.hide, 1000);
  }
};

MovementDetector.prototype.hide = function () {
  this.el.classList.remove('app__movement-detected_visible');
};

module.exports = MovementDetector;
