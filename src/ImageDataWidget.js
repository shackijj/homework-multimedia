function ImageDataWidget (el) {
  this.el = el;
  this.content1 = el.querySelector('.image-data__content_1');
}

ImageDataWidget.prototype.update = function (imgData) {
  this.content1.innerHTML = imgData.data.slice(0, 200).join(' ');
};
