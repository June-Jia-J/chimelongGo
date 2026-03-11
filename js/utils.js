/**
 * utils.js - 工具函数
 * 防抖、节流、平滑滚动、URL 参数
 */
(function (global) {
  'use strict';

  /** 防抖：延迟执行，用于搜索输入等 */
  function debounce(fn, delay) {
    var timer = null;
    return function () {
      var args = arguments;
      var ctx = this;
      if (timer) clearTimeout(timer);
      timer = setTimeout(function () {
        fn.apply(ctx, args);
        timer = null;
      }, delay);
    };
  }

  /** 节流：限频执行，用于滚动等 */
  function throttle(fn, delay) {
    var last = 0;
    return function () {
      var now = Date.now();
      if (now - last >= delay) {
        last = now;
        fn.apply(this, arguments);
      }
    };
  }

  /** 平滑滚动到顶部 */
  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /** 获取 URL 查询参数 */
  function getQueryParam(key) {
    var params = new URLSearchParams(window.location.search);
    return params.get(key);
  }

  global.Utils = {
    debounce: debounce,
    throttle: throttle,
    scrollToTop: scrollToTop,
    getQueryParam: getQueryParam
  };
})(typeof window !== 'undefined' ? window : this);
