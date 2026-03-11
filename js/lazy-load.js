/**
 * lazy-load.js - 图片懒加载
 * data-src 存真实 URL，IntersectionObserver 触发加载
 */
(function (global) {
  'use strict';

  function initLazyLoad(imgSelector) {
    var imgs = document.querySelectorAll(imgSelector || 'img[data-src]');
    if (!imgs.length) return;

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var img = entry.target;
        var src = img.getAttribute('data-src');
        if (src) {
          img.src = src;
          img.removeAttribute('data-src');
          io.unobserve(img);
        }
      });
    }, { rootMargin: '50px' });

    imgs.forEach(function (img) {
      if (img.getAttribute('data-src')) io.observe(img);
    });
  }

  global.initLazyLoad = initLazyLoad;
})(typeof window !== 'undefined' ? window : this);
