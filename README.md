# 长隆旅游网站

## 🛠️ 技术栈

- **Frontend**: HTML5 + CSS3 + JavaScript + Tailwind CSS (CDN) + ECharts
- **部署**: Docker + Nginx

## 🚀 快速启动 (Docker)

1. 确保 Docker Desktop 已运行
2. 在根目录执行: `docker compose up --build`
3. 访问前端: http://localhost:3205

## 🔗 服务地址 (Services)

- **Frontend**: http://localhost:3205

## 📄 页面说明

| 页面 | 路径 | 功能 |
|------|------|------|
| 首页 | index.html | 轮播图、目的地概览、入口导航 |
| 目的地 | destinations.html | 搜索、目的地卡片、天气联动 |
| 攻略 | guide.html?id=1 | 攻略详情、3D相册、咨询表单 |
| 数据 | analytics.html | 柱状图、饼图、折线图 |

## 📚 详细代码说明与文档

本项目提供完整的代码说明文档，便于答辩与评审：

| 内容 | 位置 | 说明 |
|------|------|------|
| **功能说明** | 本文档「🗃️ 功能介绍」「📄 页面说明」 | 各页面功能与核心特性 |
| **技术点解释** | [doc/技术点说明.md](doc/技术点说明.md) | 防抖、节流、3D 变换数学原理、打字机效果、requestAnimationFrame 等 |
| **运行方式** | 本文档「🚀 快速启动」「🔧 开发环境」 | Docker 与本地 HTTP 预览 |

答辩时可重点参考 **doc/技术点说明.md**，其中对防抖/节流原理、3D 相册的 perspective/rotateX/rotateY、鼠标位移与旋转角度换算等有专门说明。

## 🗃️ 功能介绍

### 核心功能

1. **首页**
   - 轮播图（无缝自动轮播、悬停暂停、进度条、淡入淡出）
   - 热门目的地卡片概览
   - 数据可视化 / 旅游攻略入口

2. **目的地列表**
   - 搜索联想（防抖、打字机效果）
   - 按搜索词筛选下方目的地卡片
   - 选择目的地后天气联动展示

3. **攻略详情**
   - 根据 URL 参数加载攻略
   - 3D 相册（鼠标跟随旋转）
   - 咨询表单（含动态密码显示/隐藏）
   - 相关攻略推荐

4. **数据可视化**
   - 柱状图：热门城市访问量（月/季/年切换）
   - 饼图：出游方式占比
   - 折线图：近 12 个月旅游热度趋势

5. **全局交互**
   - 导航栏（滚动透明→实色、下划线动画、移动端汉堡菜单）
   - 暗黑模式（localStorage 持久化）
   - 回到顶部
   - Toast 轻提示（参考 Ant Design Message）

### 技术特点

- **零依赖部署**：仅需 Docker 即可运行，无需本地 Node 等环境
- **纯前端**：HTML/CSS/JS，无后端依赖，数据为静态 JSON
- **现代 UI**：莫兰迪配色、圆角与阴影、响应式布局
- **代码规范**：语义化 HTML、模块化 JS、分块 CSS

## 📁 项目结构

```
chimelongGo-1105/
├── README.md                 # 项目说明文档
├── docker-compose.yml        # Docker 编排
├── Dockerfile                # Nginx 镜像构建
├── nginx.conf                # Nginx 配置
├── index.html                # 首页
├── destinations.html         # 目的地列表
├── guide.html                # 攻略详情
├── analytics.html            # 数据可视化
├── css/
│   ├── base.css              # 变量、重置、字体
│   ├── layout.css            # 布局
│   └── components.css        # 组件样式
├── js/
│   ├── carousel.js           # 轮播
│   ├── nav.js                # 导航
│   ├── charts.js             # ECharts 图表
│   ├── search.js             # 搜索联想与列表筛选
│   ├── weather.js            # 天气 API
│   ├── dark-mode.js          # 暗黑模式
│   ├── back-to-top.js        # 回到顶部
│   ├── toast.js              # 轻提示
│   ├── lazy-load.js          # 图片懒加载
│   └── utils.js              # 防抖、节流、工具函数
├── assets/
│   ├── images/               # 图片资源
│   ├── data/                 # 模拟数据 JSON
│   │   ├── destinations.json
│   │   ├── guides.json
│   │   └── chart-data.json
│   └── icons/
└── doc/                      # 需求、设计、任务清单等文档
```

## 🔧 开发环境

### 本地预览（无需 Docker）

纯静态站点，可用任意 HTTP 服务器预览，例如：

```bash
# 使用 Python
python -m http.server 8080

# 或使用 npx serve
npx serve . -p 8080
```

浏览器访问 http://localhost:8080。注意：部分功能（如天气 API）依赖网络。

## 📋 问题修复说明摘要

以下为验收/测试反馈问题的修复说明简要汇总，完整说明见 `doc/问题修复说明汇总.md`。

| 序号 | 问题简述 | 修复要点 |
|------|----------|----------|
| 1 | 样式问题（间距、按钮悬停、暗黑密码按钮、图表文字、图表 Loading） | layout/components 间距与悬停色；charts.js 暗黑文字；analytics 加载遮罩与样式 |
| 2 | 页面间跳转无平滑过渡 | page-transition.js 离场/入场淡入淡出，四页均引入 |
| 3 | 图片懒加载未启用 | 首页/目的地/攻略页图片改 data-src，引入 lazy-load.js 并调用 |
| 4 | 滚动未节流 | nav.js、back-to-top.js 使用 Utils.throttle |
| 5 | 未使用 table 展示数据 | analytics 增加热门城市访问量表，chart-data 联动 |
| 6 | 音频/视频未出现 | guide 增加 video/audio 区块，components 样式，资源说明文档 |
| 7 | 页面内锚点导航未体现 | 首页与数据页增加本页导航及 id，anchor-nav 样式与 scroll-margin |
| 8 | 数据页图表 Loading 不明显 | 增强遮罩与 spinner 对比度、最短展示 400ms；后改为三点跳动图标+轻量遮罩 |
| 9 | 图表 Loading 样式优化 | 常用三点跳动图标替代圆环，轻量遮罩+backdrop-filter |
| 10 | 视频/语音与主题不符 | 使用符合长隆旅游主题的素材与文案，见视频与音频资源说明 |
| 11 | 导航下拉菜单缓动展开未实现 | 补全 .nav-dropdown 结构，CSS 缓动展开，nav.js 绑定展开/收起 |
| 12 | 省市县三级联动未实现（加分项） | 目的地页增加省/市/县 select、联动数据与脚本 |
| 13 | 目的地卡片文字渐显缺 translateY | components 中卡片文字增加自下而上位移+透明度过渡 |
| 14 | 搜索打字机效果未用 typewriter | search.js 用 typewriter() 逐字/逐词输出联想结果 |
| 15 | 天气图标无帧动画 | weather 展示改为可动画图标+CSS 帧动画（非仅 emoji） |
| 16 | 3D 相册非拖动、无翻页 | 改为 mousedown+mousemove+mouseup 拖动旋转；增加翻页结构与动画 |
| 17 | 暗黑模式缺全局过渡 | base.css/dark-mode 为主题切换增加 color/background 等 transition |
| 18 | HTML 模块注释覆盖不均 | destinations/guide/analytics 补全与首页一致的模块注释 |

## 🐳 Docker 配置

- **前端端口**: 3205
- **镜像**: nginx:alpine，静态文件托管于容器内

### 清理 Docker 缓存并重新构建

#### 方法一：清理构建缓存并重新构建（推荐）

```bash
docker compose down
docker compose build --no-cache
docker compose up -d
```

#### 方法二：完全清理后重建

```bash
docker compose down
docker rmi 22chimelonggo-1105-frontend
docker builder prune -f
docker compose up --build
```

## 📝 修订历史

| 版本 | 日期 | 作者 | 修改说明 |
|------|------|------|----------|
| v1 | 2025-02-15 | jiajing(jiajing@163.com) | 初版完成 |
| v2 | 2025-02-15 | jiajing(jiajing@163.com) | 参考 TabCardAdmin 格式补充 README |
| v3 | 2025-03-07 | jiajing(jiajing@163.com) | 新增「问题修复说明摘要」表，将 doc/问题修复说明汇总 中全部 18 条修复以简短形式纳入 README |
| v4 | 2025-03-10 | jiajing(jiajing@163.com) | 补充「详细代码说明与文档」索引，新增 doc/技术点说明.md 以应对答辩用技术点解释 |

## 📄 许可证

MIT

---

**项目作者**: jiajing(jiajing@163.com)  
**最后更新**: 2025-03-10
