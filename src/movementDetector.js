let prevImgData;
const threshold = 3;

/**
 * @param {ImageData} img1
 * @param {ImageData} img2
 * @return {number}
 */
function rootMeanSquareDifference (img1, img2){
  let squares = 0;
  const maxPossibleValue = 255;
  let length = img1.data.length;

  if (length !== img2.data.length) {
    return maxPossibleValue;
  }

  for(let i = 0; i < length; i++) {
    let val1 = img1.data[i];
    let val2 = img2.data[i];
    squares += Math.pow(val1 - val2, 2);
  }
  return Math.sqrt(squares / length);
}

onmessage = function (e) {
  let result = 0;
  if (prevImgData) {
    result = rootMeanSquareDifference(prevImgData, e.data);
  }
  if (result > threshold) {
    postMessage('detected');
  }
  prevImgData = e.data;
};
