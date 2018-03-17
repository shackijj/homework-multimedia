const Worker = require('./FaceTracker.worker.js');

function FaceTracker (el) {
  this.el = el;
  this.worker = new Worker();
  this.isWorkerBusy = false;
  this.worker.addEventListener('message', this.onWorkerResponse.bind(this));
}

FaceTracker.prototype.track = function (imageData) {
  if (!this.isWorkerBusy) {
    this.isWorkerBusy = true;
    this.worker.postMessage({
      width: imageData.width,
      height: imageData.height,
      imageData: imageData.data
    });
  }
};

FaceTracker.prototype.onWorkerResponse = function ({data: {data}}) {
  this.isWorkerBusy= false;

  this.el.innerHTML = '';
  if (data.length === 0) {
    // No objects were detected in this frame.
  } else {
    data.forEach(function plotRectangle (rect) {
      const div = document.createElement('div');
      div.style.position = 'absolute';
      div.style.border = '1px solid rgba(255, 255, 255, 0.6)';
      div.style.width = rect.width + 'px';
      div.style.height = rect.height + 'px';
      div.style.left = this.el.offsetLeft + rect.x + 'px';
      div.style.top = this.el.offsetTop + rect.y + 'px';
      this.el.appendChild(div);
      return div;
    }.bind(this));
  }
};

module.exports = FaceTracker;
