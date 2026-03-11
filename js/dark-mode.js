/**
 * dark-mode.js - 暗黑模式
 * 切换主题，localStorage 持久化，全站配色平滑过渡
 */
(function (global) {
  'use strict';

  var DARK_BG = '#1F2937';
  var LIGHT_BG = '#F5F0E1';

  function ensureOverlay() {
    var el = document.getElementById('theme-transition-overlay');
    if (el) return el;
    el = document.createElement('div');
    el.id = 'theme-transition-overlay';
    el.setAttribute('aria-hidden', 'true');
    document.body.appendChild(el);
    return el;
  }

  function runTransition(toDark, onDone) {
    var overlay = ensureOverlay();
    overlay.style.backgroundColor = toDark ? DARK_BG : LIGHT_BG;
    overlay.style.opacity = '0';
    overlay.style.pointerEvents = 'auto';
    overlay.offsetHeight;
    overlay.style.opacity = '1';
    overlay.addEventListener('transitionend', function handler() {
      overlay.removeEventListener('transitionend', handler);
      if (typeof onDone === 'function') onDone();
      overlay.style.pointerEvents = 'none';
      overlay.style.opacity = '0';
    }, { once: true });
  }

  function initDarkMode(toggleSelector) {
    var toggle = document.querySelector(toggleSelector);
    if (!toggle) return;

    var stored = localStorage.getItem('theme');
    if (stored === 'dark') {
      document.body.setAttribute('data-theme', 'dark');
      toggle.textContent = '☀';
      toggle.setAttribute('aria-label', '切换亮色模式');
    }

    toggle.addEventListener('click', function () {
      var isDark = document.body.getAttribute('data-theme') === 'dark';
      var toggleBtn = toggle;
      toggleBtn.disabled = true;

      if (isDark) {
        runTransition(false, function () {
          document.body.removeAttribute('data-theme');
          localStorage.setItem('theme', 'light');
          toggleBtn.textContent = '🌙';
          toggleBtn.setAttribute('aria-label', '切换暗黑模式');
          toggleBtn.disabled = false;
          document.dispatchEvent(new CustomEvent('themechange'));
        });
      } else {
        runTransition(true, function () {
          document.body.setAttribute('data-theme', 'dark');
          localStorage.setItem('theme', 'dark');
          toggleBtn.textContent = '☀';
          toggleBtn.setAttribute('aria-label', '切换亮色模式');
          toggleBtn.disabled = false;
          document.dispatchEvent(new CustomEvent('themechange'));
        });
      }
    });
  }

  global.initDarkMode = initDarkMode;
})(typeof window !== 'undefined' ? window : this);
