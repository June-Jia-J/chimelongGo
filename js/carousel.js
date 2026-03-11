/**
 * carousel.js - 轮播图
 * 无缝自动轮播、悬停暂停、左右箭头、指示器、进度条、淡入淡出+缩放
 */
(function (global) {
  'use strict';

  function initCarousel(containerSelector, options) {
    var container = document.querySelector(containerSelector);
    if (!container) return;

    var track = container.querySelector('.carousel-track');
    var slides = track ? track.querySelectorAll('.carousel-slide') : container.querySelectorAll('.carousel-slide');
    if (slides.length === 0) return;

    var opt = options || {};
    var interval = opt.interval || 4000;
    var timer = null;
    var current = 0;
    var len = slides.length;

    function show(index) {
      current = index;
      slides.forEach(function (s, i) {
        s.classList.toggle('active', i === index);
      });
      updateIndicators();
      resetProgress();
    }

    function next() {
      show((current + 1) % len);
    }

    function prev() {
      show((current - 1 + len) % len);
    }

    function updateIndicators() {
      var ind = container.querySelector('.carousel-indicators');
      if (ind) {
        var dots = ind.querySelectorAll('.carousel-dot');
        dots.forEach(function (d, i) {
          d.classList.toggle('active', i === current);
        });
      }
    }

    function resetProgress() {
      var bars = container.querySelectorAll('.carousel-progress-bar');
      bars.forEach(function (b) {
        b.classList.remove('active');
        b.style.animation = 'none';
        b.offsetHeight;
      });
      var bar = bars[current];
      if (bar) {
        bar.classList.add('active');
        bar.style.animation = 'carouselProgress ' + (interval / 1000) + 's linear forwards';
      }
    }

    function startTimer() {
      stopTimer();
      timer = setInterval(next, interval);
    }

    function stopTimer() {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    }

    container.addEventListener('mouseenter', stopTimer);
    container.addEventListener('mouseleave', startTimer);

    var prevBtn = container.querySelector('.carousel-prev');
    var nextBtn = container.querySelector('.carousel-next');
    if (prevBtn) prevBtn.addEventListener('click', function () { prev(); startTimer(); });
    if (nextBtn) nextBtn.addEventListener('click', function () { next(); startTimer(); });

    var dots = container.querySelectorAll('.carousel-dot');
    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        show(i);
        startTimer();
      });
    });

    show(0);
    startTimer();
  }

  global.initCarousel = initCarousel;
})(typeof window !== 'undefined' ? window : this);
