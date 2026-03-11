/**
 * charts.js - ECharts 数据可视化
 * 柱状图、饼图、折线图（支持暗黑模式标题与坐标轴高对比）
 */
(function (global) {
  'use strict';

  var chartData = null;

  function isDarkMode() {
    return document.body && document.body.getAttribute('data-theme') === 'dark';
  }

  /** 根据当前主题返回图表文字颜色配置（暗黑=白，亮色=深灰） */
  function getThemeTextOption() {
    var c = isDarkMode() ? '#FFFFFF' : '#334155';
    return {
      title: { textStyle: { color: c } },
      xAxis: { axisLabel: { color: c } },
      yAxis: { axisLabel: { color: c } },
      legend: { textStyle: { color: c } },
      series: [{ label: { color: c } }]
    };
  }

  /** 主题切换后调用，刷新所有已创建图表的文字颜色 */
  function refreshChartsTheme() {
    var opt = getThemeTextOption();
    [global._barChart, global._pieChart, global._lineChart].forEach(function (chart) {
      if (chart && typeof chart.setOption === 'function') chart.setOption(opt);
    });
  }

  function applyDarkModeText(option) {
    if (!isDarkMode()) return;
    var c = '#FFFFFF';
    if (option.title) option.title.textStyle = Object.assign({}, option.title.textStyle, { color: c });
    if (option.xAxis) {
      var x = option.xAxis;
      option.xAxis = Array.isArray(x) ? x.map(function (axis) {
        return Object.assign({}, axis, { axisLabel: Object.assign({}, axis.axisLabel, { color: c }) });
      }) : Object.assign({}, x, { axisLabel: Object.assign({}, x.axisLabel, { color: c }) });
    }
    if (option.yAxis) {
      var y = option.yAxis;
      option.yAxis = Array.isArray(y) ? y.map(function (axis) {
        return Object.assign({}, axis, { axisLabel: Object.assign({}, axis.axisLabel, { color: c }) });
      }) : Object.assign({}, y, { axisLabel: Object.assign({}, y.axisLabel, { color: c }) });
    }
    if (option.legend) option.legend.textStyle = Object.assign({}, option.legend.textStyle, { color: c });
    if (option.series && option.series[0] && option.series[0].label) {
      option.series[0].label = Object.assign({}, option.series[0].label, { color: c });
    }
  }

  function loadChartData(cb) {
    if (chartData) {
      if (cb) cb(chartData);
      return;
    }
    fetch('assets/data/chart-data.json')
      .then(function (r) { return r.json(); })
      .then(function (d) {
        chartData = d;
        if (cb) cb(d);
      })
      .catch(function () {
        if (cb) cb(null);
      });
  }

  function initBarChart(containerId, dimension) {
    var el = document.getElementById(containerId);
    if (!el) return;

    loadChartData(function (data) {
      if (!data || !data.cityVisit) return;
      var dim = dimension || 'month';
      var list = data.cityVisit[dim] || data.cityVisit.month;

      if (typeof echarts === 'undefined') {
        el.innerHTML = '<p>请引入 ECharts</p>';
        return;
      }

      var chart = echarts.init(el);
      var option = {
        title: { text: '2025热门旅游城市访问量', left: 'center' },
        tooltip: { trigger: 'axis' },
        xAxis: { type: 'category', data: list.map(function (x) { return x.city; }) },
        yAxis: { type: 'value' },
        series: [{
          type: 'bar',
          data: list.map(function (x) { return x.value; }),
          itemStyle: { color: '#1E3A8A' },
          emphasis: { itemStyle: { color: '#3B82F6' } }
        }]
      };
      applyDarkModeText(option);
      chart.setOption(option);

      global._barChart = chart;
      global._barChartUpdate = function (dim) {
        var list = (data.cityVisit[dim] || data.cityVisit.month);
        chart.setOption({
          xAxis: { data: list.map(function (x) { return x.city; }) },
          series: [{ data: list.map(function (x) { return x.value; }) }]
        });
      };
    });
  }

  function initPieChart(containerId) {
    var el = document.getElementById(containerId);
    if (!el) return;

    loadChartData(function (data) {
      if (!data || !data.travelMode) return;
      var list = data.travelMode;

      if (typeof echarts === 'undefined') {
        el.innerHTML = '<p>请引入 ECharts</p>';
        return;
      }

      var chart = echarts.init(el);
      var option = {
        title: { text: '出游方式占比', left: 'center' },
        tooltip: { trigger: 'item' },
        legend: { orient: 'horizontal', bottom: 10 },
        series: [{
          type: 'pie',
          radius: '60%',
          data: list,
          emphasis: { itemStyle: { shadowBlur: 10, shadowOffsetX: 0 } },
          label: { formatter: '{b}: {c}%' },
          selectedMode: 'single'
        }]
      };
      applyDarkModeText(option);
      chart.setOption(option);
      global._pieChart = chart;
    });
  }

  function initLineChart(containerId) {
    var el = document.getElementById(containerId);
    if (!el) return;

    loadChartData(function (data) {
      if (!data || !data.hotTrend) return;
      var list = data.hotTrend;

      if (typeof echarts === 'undefined') {
        el.innerHTML = '<p>请引入 ECharts</p>';
        return;
      }

      var chart = echarts.init(el);
      var option = {
        title: { text: '近12个月旅游热度趋势', left: 'center' },
        tooltip: { trigger: 'axis' },
        xAxis: { type: 'category', data: list.map(function (x) { return x.month; }) },
        yAxis: { type: 'value' },
        series: [{
          type: 'line',
          data: list.map(function (x) { return x.value; }),
          smooth: true,
          itemStyle: { color: '#1E3A8A' },
          animationDuration: 1500,
          animationEasing: 'elasticOut'
        }]
      };
      applyDarkModeText(option);
      chart.setOption(option);
      global._lineChart = chart;
    });
  }

  /**
   * 数据页统一初始化：先拉取数据，再初始化柱/饼/折线图，最后调用 onAllReady 隐藏 loading
   * @param {Object} opts - { barId, pieId, lineId, dimension, onAllReady, onError }
   */
  function initAnalyticsCharts(opts) {
    opts = opts || {};
    var barId = opts.barId || 'barChart';
    var pieId = opts.pieId || 'pieChart';
    var lineId = opts.lineId || 'lineChart';
    var dimension = opts.dimension || 'month';
    loadChartData(function (data) {
      if (!data) {
        if (opts.onError) opts.onError();
        return;
      }
      initBarChart(barId, dimension);
      initPieChart(pieId);
      initLineChart(lineId);
      if (opts.onAllReady) opts.onAllReady(data);
    });
  }

  global.initBarChart = initBarChart;
  global.initPieChart = initPieChart;
  global.initLineChart = initLineChart;
  global.initAnalyticsCharts = initAnalyticsCharts;
  global.refreshChartsTheme = refreshChartsTheme;
  global.loadChartData = loadChartData;

  document.addEventListener('themechange', function () {
    refreshChartsTheme();
  });
})(typeof window !== 'undefined' ? window : this);
