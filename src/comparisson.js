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

let prevImgData;
onmessage = function (imageData) {
  let result = 0;
  if (prevImgData) {
    result = rmsDiff(prevImgData, imageData);
  }
  if (result > 15) {
    postMessage('detected');
  }
  prevImgData = imageData;
};
