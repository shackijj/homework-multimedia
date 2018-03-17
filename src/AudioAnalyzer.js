function AudioAnalyzer (el, analyserNode) {
  this.el = el;
  this.ctx = el.getContext('2d');

  this.analyserNode = analyserNode;
  this.bufferLen = analyserNode.frequencyBinCount;
  this.buffer = new Uint8Array(this.bufferLen);
}

AudioAnalyzer.prototype.draw = function () {
  const maxDecibels = 255;
  const volumeBarWidth = 30;
  const volumeBarOffset = 10;
  const width = this.el.width - (volumeBarWidth + volumeBarOffset);
  const height = this.el.height;

  this.analyserNode.getByteFrequencyData(this.buffer);

  this.ctx.clearRect(0, 0, this.el.width, this.el.height);

  const barWidth = (width / this.bufferLen);
  let x = 0;
  let y;

  this.ctx.fillStyle = 'rgba(225,255,255,0.6)';

  let maxDb = 0;
  for(let i = 0; i < this.bufferLen; i++) {
    let db = this.buffer[i];
    if (db > maxDb) {
      maxDb = db;
    }
    let barHeight = height * (db / maxDecibels);
    y = height - barHeight;
    this.ctx.fillRect(x, y, barWidth, barHeight);

    x += barWidth;
  }

  let volumeHeight = height * (maxDb / maxDecibels);
  y = height - volumeHeight;
  if (maxDb > 200) {
    this.ctx.fillStyle = 'rgba(225,0,0,1)';
  }
  this.ctx.fillRect(x + volumeBarOffset, y, volumeBarWidth, volumeHeight);
};
