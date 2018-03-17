let prevImgData;
const threshold = 3;

/**
 * Root mean square difference
 * @param {ImageData} img1
 * @param {ImageData} img2
 * @return {number}
 */
function rmsDiff (img1, img2){
  let squares = 0;
  let iter1 = img1.data.data[Symbol.iterator]();
  let iter2 = img2.data.data[Symbol.iterator]();
  for(let val1 of iter1) {
    let val2 = iter2.next().value;
    squares += (val1 - val2) * (val1 - val2);
  }
  return Math.sqrt(squares / img1.data.data.length);
}

onmessage = function (imageData) {
  let result = 0;
  if (prevImgData) {
    result = rmsDiff(prevImgData, imageData);
  }
  if (result > threshold) {
    postMessage('detected');
  }
  prevImgData = imageData;
};
