var ui = {};

ui.modal = {};

ui.modal.titleElement = function (options) {
  // options.text 内容(element)
  // options.child 加载组件(element)
  var titleElement = document.createElement('div');
  var titleText = document.createElement('span');
  titleText.innerHTML = options.text || '';
  titleElement.className = 'modal-title';
  titleElement.appendChild(titleText);
  (options.child || []).map(function (child, index) {
    titleElement.appendChild(child);
  });
  return titleElement;
};

ui.modal.titleCloseElement = function (className) {
  className = className || 'close-btn';
  var closeBtnElement = document.createElement('span');
  closeBtnElement.className = 'modal-title-close ' + 'iconfont ' + className;
  closeBtnElement.innerHTML = '×';
  return closeBtnElement;
};

ui.modal.titleFootElement = function (options) {
  var childElements = options.child;
  var footElement = document.createElement('div');
  footElement.className = 'modal-foot';
  (childElements || []).map(function (childElement, index) {
    footElement.appendChild(childElement);
  });
  return footElement;
};

ui.modal.popup = function (options) {
  // options.name 弹窗名(string)
  // options.modalType 弹窗样式类别(string)
  // options.content 内容元素(element)
  // options.width 弹窗宽度(int/string)
  // options.height 弹窗高度(int/string)
  // options.left 弹窗距离左边(int/string)
  // options.top 弹窗距离顶部(int/string)
  // options.marginLeft 弹窗左偏移(int/string)
  // options.marginTop 弹窗右偏移(int/string)
  // 不设置弹窗位置将会默认居中弹窗
  options.name = options.name || 'no-name';
  options.modalType = options.modalType || 'normal';
  options.modalData = options.modalData || 'null';
  options.width = options.width || 600;
  options.height = options.height || 600;
  options.top = options.top || '40%';
  options.left = options.left || '50%';
  options.marginLeft = options.marginLeft || options.width / 2;
  options.marginTop = options.marginTop || options.height / 2;
  var modalElement = document.createElement('div');
  var modalContainerHTML = '<div class="modal-dialog-window ' + options.modalType + '"></div>';
  var modalDialog = document.createElement('div');
  modalDialog.className = 'modal-dialog-window ' + options.modalType;
  modalDialog.style.width = typeof options.width === 'string' ? options.width : options.width + 'px';
  modalDialog.style.height = typeof options.height === 'string' ? options.height : options.height + 'px';
  modalDialog.style.left = typeof options.left === 'string' ? options.left : options.left + 'px';
  modalDialog.style.top = typeof options.top === 'string' ? options.top : options.top + 'px';
  modalDialog.style.marginTop = typeof options.marginTop === 'string' ? options.marginTop : -options.marginTop + 'px';
  modalDialog.style.marginLeft = typeof options.marginLeft === 'string' ? options.marginLeft : -options.marginLeft + 'px';
  options.content.classList.add('modal-content');
  modalDialog.appendChild(options.content);
  modalElement.appendChild(modalDialog);
  modalElement.classList.add('ui-modal');
  modalElement.classList.add(options.name);
  modalElement.setAttribute('modal', options.name);
  document.body.appendChild(modalElement);
  setTimeout(function () {
    modalElement.classList.add('popup');
  }, 100);
  return modalElement;
};

ui.modal.close = function (modalName) {
  console.log('ui.modal.close: ', modalName);
  var modal = $x.mapNode.getElementsByAttributeName(document.body, 'modal', modalName)[0];
  modal.style.opacity = 0;
  setTimeout(function () {
    modal.remove();
  }, 300);
  return modal;
};

ui.modal.confirm = function (options) {
  // options.name 弹窗名
  // options.className 自定义样式名
  // options.innerHTML 内容
  // options.confirmBtnTitle 确定
  // options.cancelBtnTitle 确定
  // options.onConfirm 确定
  // options.onCancel  取消
  options.name = options.name || 'no-name-confirm';
  options.onConfirm = options.onConfirm || function () { return ui.modal.close(options.name) };
  options.onCancel = options.onCancel || function () { return ui.modal.close(options.name) };
  var confirmElement = document.createElement('button');
  var confirmEventHandle = options.name + '-' + (new Date()).getTime() + '-on-confirm';
  confirmElement.classList.add('btn');
  confirmElement.classList.add('btn-n01');
  confirmElement.classList.add('modal-confirm-btn');
  confirmElement.innerHTML = options.confirmBtnTitle || '确定';
  confirmElement.setAttribute('x-event', confirmEventHandle);
  var cancelElement = document.createElement('button');
  var cancelEventHanldle = options.name + '-' + (new Date()).getTime() + '-on-cancel';
  cancelElement.classList.add('btn');
  cancelElement.classList.add('btn-n02');
  cancelElement.classList.add('modal-cancel-btn');
  cancelElement.innerHTML = options.cancelBtnTitle || '取消';
  cancelElement.setAttribute('x-event', cancelEventHanldle);
  var titleCloseElement = ui.modal.titleCloseElement();
  titleCloseElement.setAttribute('x-event', cancelEventHanldle);
  var titleElement = ui.modal.titleElement({child: [titleCloseElement]});
  var footElement = ui.modal.titleFootElement({child: [cancelElement, confirmElement]});
  var contentElement = document.createElement('div');
  var innerContentElement = document.createElement('div');
  innerContentElement.className = 'modal-inner-content';
  innerContentElement.innerHTML = options.innerHTML;
  contentElement.appendChild(titleElement);
  contentElement.appendChild(innerContentElement);
  contentElement.appendChild(footElement);
  var modalElement = ui.modal.popup({
    name: options.name,
    modalType: 'confirm',
    content: contentElement,
    width: 280,
    height: 160
  });
  $x.mapNode.xEvent(confirmEventHandle, 'click', options.onConfirm);
  $x.mapNode.xEvent(cancelEventHanldle, 'click', options.onCancel);
  return modalElement;
};

ui.modal.message = function (options) {
  // options.name 弹窗名
  // options.className 自定义样式名
  // options.innerHTML 内容
  // options.confirmBtnTitle 确定
  // options.onConfirm 确定
  options.name = options.name || 'no-name-message';
  options.onConfirm = options.onConfirm || function () { return ui.modal.close(options.name) };
  options.onCancel = options.onCancel || function () { return ui.modal.close(options.name) };
  var confirmElement = document.createElement('button');
  var confirmEventHandle = options.name + '-' + (new Date()).getTime() + '-on-confirm';
  confirmElement.classList.add('btn');
  confirmElement.classList.add('btn-n01');
  confirmElement.classList.add('modal-confirm-btn');
  confirmElement.innerHTML = options.confirmBtnTitle || '确定';
  confirmElement.setAttribute('x-event', confirmEventHandle);
  var titleCloseElement = ui.modal.titleCloseElement();
  titleCloseElement.setAttribute('x-event', confirmEventHandle);
  var titleElement = ui.modal.titleElement({child: [titleCloseElement]});
  var footElement = ui.modal.titleFootElement({child: [confirmElement]});
  var contentElement = document.createElement('div');
  var innerContentElement = document.createElement('div');
  innerContentElement.className = 'modal-inner-content';
  innerContentElement.innerHTML = options.innerHTML;
  contentElement.appendChild(titleElement);
  contentElement.appendChild(innerContentElement);
  contentElement.appendChild(footElement);
  var modalElement = ui.modal.popup({
    name: options.name,
    modalType: 'message',
    content: contentElement,
    width: 280,
    height: 160
  });
  $x.mapNode.xEvent(confirmEventHandle, 'click', options.onConfirm);
  return modalElement;
};
