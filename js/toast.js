/**
 * toast.js - 轻提示组件（参考 Ant Design Message 效果）
 * 支持 success / error / info / warning 四种类型
 */
(function (global) {
  'use strict';

  var CONTAINER_ID = 'toast-container';
  var DURATION = 3000;
  var ICONS = {
    success: '✓',
    error: '✕',
    info: 'ℹ',
    warning: '!'
  };

  function getContainer() {
    var el = document.getElementById(CONTAINER_ID);
    if (!el) {
      el = document.createElement('div');
      el.id = CONTAINER_ID;
      el.className = 'toast-container';
      document.body.appendChild(el);
    }
    return el;
  }

  function show(type, content, duration) {
    var container = getContainer();
    var dur = duration !== undefined ? duration : DURATION;

    var item = document.createElement('div');
    item.className = 'toast-item toast-' + type;
    item.setAttribute('role', 'alert');

    var icon = document.createElement('span');
    icon.className = 'toast-icon';
    icon.textContent = ICONS[type] || ICONS.info;

    var text = document.createElement('span');
    text.className = 'toast-content';
    text.textContent = content;

    item.appendChild(icon);
    item.appendChild(text);
    container.appendChild(item);

    // 触发动画
    requestAnimationFrame(function () {
      item.classList.add('toast-visible');
    });

    var timer = setTimeout(function () {
      item.classList.remove('toast-visible');
      item.classList.add('toast-leave');
      setTimeout(function () {
        if (item.parentNode) {
          item.parentNode.removeChild(item);
        }
      }, 300);
    }, dur);

    return {
      close: function () {
        clearTimeout(timer);
        item.classList.remove('toast-visible');
        item.classList.add('toast-leave');
        setTimeout(function () {
          if (item.parentNode) {
            item.parentNode.removeChild(item);
          }
        }, 300);
      }
    };
  }

  var Toast = {
    success: function (content, duration) {
      return show('success', content, duration);
    },
    error: function (content, duration) {
      return show('error', content, duration);
    },
    info: function (content, duration) {
      return show('info', content, duration);
    },
    warning: function (content, duration) {
      return show('warning', content, duration);
    }
  };

  global.Toast = Toast;
})(typeof window !== 'undefined' ? window : this);
