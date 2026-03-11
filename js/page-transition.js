/**
 * page-transition.js - 页面间跳转平滑过渡
 * 拦截站内 .html 链接点击：当前页淡出后跳转，新页加载后主体淡入
 */
(function () {
  'use strict';

  var DURATION = 220;

  function isInternalLink(el) {
    var href = el.getAttribute('href');
    if (!href || href.startsWith('#') || el.target === '_blank' || el.hasAttribute('download')) return false;
    try {
      var url = new URL(el.href, window.location.href);
      if (url.origin !== window.location.origin) return false;
      var current = window.location.pathname + window.location.search;
      var next = url.pathname + url.search;
      return next !== current;
    } catch (e) {
      return false;
    }
  }

  function handleClick(e) {
    var a = e.target && e.target.closest('a');
    if (!a || !isInternalLink(a)) return;
    var href = a.getAttribute('href');
    if (!href) return;
    e.preventDefault();
    document.body.classList.add('page-exit');
    setTimeout(function () {
      window.location.href = href;
    }, DURATION);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      document.addEventListener('click', handleClick, true);
    });
  } else {
    document.addEventListener('click', handleClick, true);
  }
})();
