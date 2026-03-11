/**
 * search.js - 搜索联想
 * 防抖、联想匹配、打字机效果
 */
(function (global) {
  'use strict';

  function initSearch(inputSelector, resultSelector, dataSource, options) {
    var input = document.querySelector(inputSelector);
    var resultEl = document.querySelector(resultSelector);
    if (!input || !resultEl) return;

    var opt = options || {};
    var onFilterChange = opt.onFilterChange;

    var data = dataSource;
    if (typeof dataSource === 'string') {
      fetch(dataSource).then(function (r) { return r.json(); }).then(function (d) {
        data = d;
        doFilterUpdate();
      }).catch(function () {});
    }

    function matchList(keyword) {
      if (!data || !Array.isArray(data)) return [];
      keyword = (keyword || '').trim().toLowerCase();
      if (!keyword) return [];
      return data.filter(function (item) {
        var name = (item.name || '').toLowerCase();
        var city = (item.city || '').toLowerCase();
        var desc = (item.description || '').toLowerCase();
        return name.indexOf(keyword) >= 0 || city.indexOf(keyword) >= 0 || desc.indexOf(keyword) >= 0;
      });
    }

    function typewriter(el, text, cb) {
      el.textContent = '';
      var i = 0;
      function tick() {
        if (i < text.length) {
          el.textContent += text[i];
          i++;
          setTimeout(tick, 30);
        } else if (cb) cb();
      }
      tick();
    }

    function renderResults(list) {
      resultEl.innerHTML = '';
      if (list.length === 0) {
        resultEl.style.display = 'none';
        return;
      }
      resultEl.style.display = 'block';
      var idx = 0;
      function appendNext() {
        if (idx >= list.length) return;
        var item = list[idx];
        var li = document.createElement('div');
        li.className = 'search-result-item';
        li.style.cursor = 'pointer';
        var strong = document.createElement('strong');
        var nameSpan = document.createElement('span');
        var citySpan = document.createElement('span');
        strong.appendChild(nameSpan);
        li.appendChild(strong);
        li.appendChild(document.createTextNode(' - '));
        li.appendChild(citySpan);
        li.addEventListener('click', function () {
          input.value = item.name;
          resultEl.innerHTML = '';
          resultEl.style.display = 'none';
          doFilterUpdate();
          if (typeof global.onSearchSelect === 'function') {
            global.onSearchSelect(item);
          }
        });
        resultEl.appendChild(li);
        function showCity() {
          typewriter(citySpan, item.city, function () {
            idx++;
            setTimeout(appendNext, 80);
          });
        }
        typewriter(nameSpan, item.name, showCity);
      }
      appendNext();
    }

    function doFilterUpdate() {
      var kw = (input && input.value) ? input.value : '';
      var list = matchList(kw);
      var displayList;
      if ((kw || '').trim()) {
        displayList = list;
      } else {
        var base = (data && Array.isArray(data)) ? data : [];
        if (opt.initialFilter && opt.initialFilter.city) {
          displayList = base.filter(function (d) {
            return (d.city || '') === opt.initialFilter.city;
          });
        } else {
          displayList = base;
        }
      }
      renderResults(list);
      if (typeof onFilterChange === 'function' && Array.isArray(displayList)) {
        onFilterChange(displayList);
      }
    }

    var debounced = global.Utils && global.Utils.debounce
      ? global.Utils.debounce(doFilterUpdate, 300)
      : function () { setTimeout(doFilterUpdate, 300); };

    input.addEventListener('input', debounced);
    input.addEventListener('focus', function () {
      var list = matchList(input.value);
      if (list.length) resultEl.style.display = 'block';
    });

    document.addEventListener('click', function (e) {
      if (!input.contains(e.target) && !resultEl.contains(e.target)) {
        resultEl.style.display = 'none';
      }
    });
  }

  global.initSearch = initSearch;
})(typeof window !== 'undefined' ? window : this);
