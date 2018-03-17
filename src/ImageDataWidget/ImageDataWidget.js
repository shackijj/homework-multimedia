function ImageDataWidget (el) {
  this.el = el;
  this.content = el.querySelector('.image-data__content_1');
}

ImageDataWidget.prototype.update = function (imgData) {
  this.content.innerHTML = imgData.data.slice(0, 200).join(' ');
};

module.exports = ImageDataWidget;
