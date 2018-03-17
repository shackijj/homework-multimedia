window = self;

importScripts(
  '../node_modules/tracking/build/tracking.js',
  '../node_modules/tracking/build/data/face.js');

const tracker = new tracking.ObjectTracker(['face']);

tracker.setEdgesDensity(0.1);
tracker.setInitialScale(2);
tracker.setStepSize(2);

tracker.on('track', function (result) {
  postMessage(result);
});

onmessage = function ({data: {imageData, width, height }}) {
  tracker.track(imageData, width, height);
};

