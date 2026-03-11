/**
 * nav.js - 导航栏交互
 * 功能：滚动透明→实色、下划线动画、下拉菜单、汉堡菜单
 */
(function (global) {
  'use strict';

  function initNav() {
    var nav = document.querySelector('.site-nav');
    var navToggle = document.querySelector('.nav-toggle');
    var navMenu = document.querySelector('.nav-menu');

    if (!nav) return;

    // 当前页面对应导航高亮
    var path = window.location.pathname || '';
    var filename = path.split('/').pop() || '';
    if (!filename || filename === '') filename = 'index.html';
    nav.querySelectorAll('.nav-menu a').forEach(function (a) {
      var href = (a.getAttribute('href') || '').split('?')[0];
      if (href === filename || (filename === 'index.html' && (href === 'index.html' || href === ''))) {
        a.classList.add('active');
      }
    });
    if (filename === 'destinations.html') {
      var dd = nav.querySelector('.nav-dropdown');
      if (dd) dd.classList.add('current');
    }
    // 1. 滚动时背景透明→实色（节流限频）
    function onScroll() {
      if (window.scrollY > 50) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    }
    var throttledScroll = (global.Utils && global.Utils.throttle)
      ? global.Utils.throttle(onScroll, 100)
      : onScroll;

    window.addEventListener('scroll', throttledScroll);
    onScroll(); // 初始执行

    // 2. 下划线动画（通过 CSS .nav-link-active 实现，悬停用 :hover）
    // 在 components.css 中已定义 nav-menu a 样式

    // 3. 下拉菜单（如有 .nav-dropdown）
    var dropdowns = nav.querySelectorAll('.nav-dropdown');
    dropdowns.forEach(function (dropdown) {
      var trigger = dropdown.querySelector('.nav-dropdown-trigger');
      var menu = dropdown.querySelector('.nav-dropdown-menu');
      if (trigger && menu) {
        trigger.addEventListener('click', function (e) {
          e.preventDefault();
          e.stopPropagation();
          var isOpen = dropdown.classList.toggle('open');
          trigger.setAttribute('aria-expanded', isOpen);
        });
      }
    });
    document.addEventListener('click', function () {
      dropdowns.forEach(function (dropdown) {
        dropdown.classList.remove('open');
        var t = dropdown.querySelector('.nav-dropdown-trigger');
        if (t) t.setAttribute('aria-expanded', 'false');
      });
    });

    // 4. 汉堡菜单：移动端点击展开/收起
    if (navToggle && navMenu) {
      navToggle.addEventListener('click', function () {
        navMenu.classList.toggle('mobile-open');
        navToggle.setAttribute('aria-expanded', navMenu.classList.contains('mobile-open'));
      });

      // 点击菜单项后收起（移动端）
      navMenu.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', function () {
          navMenu.classList.remove('mobile-open');
        });
      });
    }
  }

  // DOM 就绪后初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNav);
  } else {
    initNav();
  }
})('undefined' !== typeof window ? window : this);
