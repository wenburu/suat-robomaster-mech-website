<head-bottom>
  <link rel="stylesheet" href="{{baseUrl}}/stylesheets/main.css">
</head-bottom>

<header sticky>
  <navbar type="dark">
    <a slot="brand" href="{{baseUrl}}/index.html" title="Home" class="navbar-brand">RM 机械组</a>
    <li><a href="{{baseUrl}}/index.html" title="Home" class="nav-link">首页</a></li>
    <li><a href="{{baseUrl}}/src/weekly/index.html" class="nav-link">每周任务卡</a></li>
    <li><a href="{{baseUrl}}/src/stages/F.html" class="nav-link">F阶段</a></li>
    <li><a href="{{baseUrl}}/src/stages/E.html" class="nav-link">E阶段</a></li>
    <li><a href="{{baseUrl}}/src/stages/D.html" class="nav-link">D阶段</a></li>
    <dropdown header="更多" class="nav-link">
      <li><a href="{{baseUrl}}/src/stages/C.html" class="dropdown-item">C阶段</a></li>
      <li><a href="{{baseUrl}}/src/stages/B.html" class="dropdown-item">B阶段</a></li>
      <li><a href="{{baseUrl}}/src/stages/A.html" class="dropdown-item">A阶段</a></li>
      <li><hr class="dropdown-divider"></li>
      <li><a href="{{baseUrl}}/src/resources/links.html" class="dropdown-item">外部资源</a></li>
    </dropdown>
    <li slot="right">
      <form class="navbar-form">
        <searchbar :data="searchData" placeholder="搜索" :on-hit="searchCallback" menu-align-right></searchbar>
      </form>
    </li>
  </navbar>
</header>

<div id="flex-body">
  <nav id="site-nav">
    <div class="site-nav-top">
      <div class="fw-bold mb-2" style="font-size: 1.25rem;">学习路线</div>
    </div>
    <div class="nav-component slim-scroll">
      <site-nav>
* [首页 :house:]({{ baseUrl }}/index.html)
* **每周节奏**
  * [每周任务卡]({{ baseUrl }}/src/weekly/index.html)
* **阶段学习**
  * [F · 基础草图]({{ baseUrl }}/src/stages/F.html)
  * [E · 零件与装配]({{ baseUrl }}/src/stages/E.html)
  * [D · 分方向入门]({{ baseUrl }}/src/stages/D.html)
  * [C · 子系统设计]({{ baseUrl }}/src/stages/C.html)
  * [B · 整机集成]({{ baseUrl }}/src/stages/B.html)
  * [A · 对抗优化]({{ baseUrl }}/src/stages/A.html)
* **资源**
  * [外部学习链接]({{ baseUrl }}/src/resources/links.html)
* **组务**
  * [飞书知识库](https://fcnlbauc1qr0.feishu.cn/wiki/space/7696115844933274552)
  * [多维表格](https://fcnlbauc1qr0.feishu.cn/base/DiGCbJSHga8HBqsQuw1cVF5qn3c)
      </site-nav>
    </div>
  </nav>
  <div id="content-wrapper">
    <breadcrumb />
    {{ content }}
  </div>
  <nav id="page-nav">
    <div class="nav-component slim-scroll">
      <page-nav />
    </div>
  </nav>
  <scroll-top-button></scroll-top-button>
</div>

<footer>
  <div class="text-center">
    <small>© 2026 深理工 RM 机械组 · SolidWorks 2026 教育许可 · 仅供教学使用</small>
  </div>
</footer>
