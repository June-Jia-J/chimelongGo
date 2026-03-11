/**
 * back-to-top.js - 回到顶部
 * 滚动>500px 渐显，点击平滑回顶，悬停旋转+变色
 */
(function (global) {
  'use strict';

  function initBackToTop(buttonSelector) {
    var btn = document.querySelector(buttonSelector);
    if (!btn) return;

    var scrollFn = function () {
      if (window.scrollY > 500) {
        btn.classList.add('visible');
      } else {
        btn.classList.remove('visible');
      }
    };
    var throttledScroll = (global.Utils && global.Utils.throttle)
      ? global.Utils.throttle(scrollFn, 100)
      : scrollFn;

    window.addEventListener('scroll', throttledScroll);
    scrollFn();

    btn.addEventListener('click', function () {
      if (global.Utils && global.Utils.scrollToTop) {
        global.Utils.scrollToTop();
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }

  global.initBackToTop = initBackToTop;
})(typeof window !== 'undefined' ? window : this);
