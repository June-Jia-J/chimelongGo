/**
 * region-linkage.js - 省市县三级联动（加分项）
 * 根据 region.json 填充省/市/县三个 select，选择后联动筛选目的地列表
 */
(function (global) {
  'use strict';

  var regionData = [];
  var currentFilter = { province: '', city: '', district: '' };

  function applyRegionFilter(list, filter) {
    if (!list || !Array.isArray(list)) return [];
    if (!filter || (!filter.province && !filter.city && !filter.district)) return list;
    return list.filter(function (d) {
      if (filter.province && (d.province || '') !== filter.province) return false;
      if (filter.city && (d.city || '') !== filter.city) return false;
      if (filter.district && (d.district || '') !== filter.district) return false;
      return true;
    });
  }

  function getRegionFilter() {
    return {
      province: currentFilter.province || '',
      city: currentFilter.city || '',
      district: currentFilter.district || ''
    };
  }

  function filterByKeyword(list, keyword) {
    if (!keyword || !(keyword = keyword.trim())) return list;
    var kw = keyword.toLowerCase();
    return (list || []).filter(function (item) {
      var name = (item.name || '').toLowerCase();
      var city = (item.city || '').toLowerCase();
      var desc = (item.description || '').toLowerCase();
      return name.indexOf(kw) >= 0 || city.indexOf(kw) >= 0 || desc.indexOf(kw) >= 0;
    });
  }

  function initRegionLinkage(options) {
    var opt = options || {};
    var provinceEl = document.getElementById(opt.provinceId || 'regionProvince');
    var cityEl = document.getElementById(opt.cityId || 'regionCity');
    var districtEl = document.getElementById(opt.districtId || 'regionDistrict');
    var regionUrl = opt.regionUrl || 'assets/data/region.json';
    var getFullList = opt.getFullList;
    var getSearchKeyword = opt.getSearchKeyword;
    var onRegionChange = opt.onRegionChange;

    if (!provinceEl || !cityEl || !districtEl) return;

    function clearOptions(select, keepFirst) {
      var first = keepFirst && select.options.length ? select.options[0].cloneNode(true) : null;
      select.innerHTML = '';
      if (first) select.appendChild(first);
    }

    function setCityOptions(cities) {
      clearOptions(cityEl, true);
      cityEl.disabled = !cities || !cities.length;
      if (cities && cities.length) {
        cities.forEach(function (c) {
          var name = typeof c === 'string' ? c : (c.name || c);
          var opt = document.createElement('option');
          opt.value = name;
          opt.textContent = name;
          cityEl.appendChild(opt);
        });
      }
      cityEl.value = '';
    }

    function setDistrictOptions(districts) {
      clearOptions(districtEl, true);
      districtEl.disabled = !districts || !districts.length;
      if (districts && districts.length) {
        districts.forEach(function (d) {
          var name = typeof d === 'string' ? d : (d.name || d);
          var opt = document.createElement('option');
          opt.value = name;
          opt.textContent = name;
          districtEl.appendChild(opt);
        });
      }
      districtEl.value = '';
    }

    function emitChange() {
      currentFilter.province = provinceEl.value || '';
      currentFilter.city = cityEl.value || '';
      currentFilter.district = districtEl.value || '';
      if (typeof getFullList !== 'function' || typeof onRegionChange !== 'function') return;
      var list = getFullList();
      if (!list) return;
      list = applyRegionFilter(list, currentFilter);
      list = filterByKeyword(list, typeof getSearchKeyword === 'function' ? getSearchKeyword() : '');
      onRegionChange(list);
    }

    provinceEl.addEventListener('change', function () {
      var name = provinceEl.value;
      currentFilter.province = name;
      currentFilter.city = '';
      currentFilter.district = '';
      setCityOptions('');
      setDistrictOptions('');
      if (name && regionData.length) {
        var prov = regionData.find(function (p) { return p.name === name; });
        if (prov && prov.cities) setCityOptions(prov.cities);
      }
      emitChange();
    });

    cityEl.addEventListener('change', function () {
      var provName = provinceEl.value;
      var cityName = cityEl.value;
      currentFilter.city = cityName;
      currentFilter.district = '';
      setDistrictOptions('');
      if (provName && cityName && regionData.length) {
        var prov = regionData.find(function (p) { return p.name === provName; });
        if (prov && prov.cities) {
          var city = prov.cities.find(function (c) { return (c.name || c) === cityName; });
          if (city && city.districts) setDistrictOptions(city.districts);
        }
      }
      emitChange();
    });

    districtEl.addEventListener('change', function () {
      currentFilter.district = districtEl.value || '';
      emitChange();
    });

    fetch(regionUrl)
      .then(function (r) { return r.json(); })
      .then(function (data) {
        regionData = Array.isArray(data) ? data : [];
        clearOptions(provinceEl, true);
        regionData.forEach(function (p) {
          var opt = document.createElement('option');
          opt.value = p.name;
          opt.textContent = p.name;
          provinceEl.appendChild(opt);
        });
        if (opt.preselectCity) {
          var prov = regionData.find(function (p) {
            return p.cities && p.cities.some(function (c) { return (c.name || c) === opt.preselectCity; });
          });
          if (prov) {
            provinceEl.value = prov.name;
            currentFilter.province = prov.name;
            setCityOptions(prov.cities);
            var cityObj = prov.cities.find(function (c) { return (c.name || c) === opt.preselectCity; });
            if (cityObj) {
              cityEl.value = opt.preselectCity;
              cityEl.disabled = false;
              currentFilter.city = opt.preselectCity;
              setDistrictOptions(cityObj.districts || []);
            }
          }
        }
      })
      .catch(function () {});

    global.getRegionFilter = getRegionFilter;
    global.applyRegionFilter = applyRegionFilter;
  }

  global.initRegionLinkage = initRegionLinkage;
})(typeof window !== 'undefined' ? window : this);
