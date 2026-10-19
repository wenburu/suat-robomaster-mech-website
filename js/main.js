/* SUAT RoboMaster 机械组 · 站点交互 */
(function () {
  "use strict";

  /* 任务索引（供搜索 + 首页/阶段页导航复用） */
  var TASKS = [
    { id: "f0", stage: "F", num: "F0", title: "阶段说明与学习目标", file: "f/f0.html" },
    { id: "f1", stage: "F", num: "F1", title: "SW2026 安装与界面熟悉", file: "f/f1.html" },
    { id: "f2", stage: "F", num: "F2", title: "草图绘制基础", file: "f/f2.html" },
    { id: "f3", stage: "F", num: "F3", title: "草图约束与尺寸标注", file: "f/f3.html" },
    { id: "f4", stage: "F", num: "F4", title: "简单拉伸零件练习", file: "f/f4.html" },
    { id: "f5", stage: "F", num: "F5", title: "F 阶段考核任务", file: "f/f5.html" },
    { id: "ferr", stage: "F", num: "F!", title: "F 阶段常见错误合集", file: "f/err.html" },
    { id: "e0", stage: "E", num: "E0", title: "阶段说明与学习目标", file: "e/e0.html" },
    { id: "e1", stage: "E", num: "E1", title: "特征树与基准", file: "e/e1.html" },
    { id: "e2", stage: "E", num: "E2", title: "旋转特征", file: "e/e2.html" },
    { id: "e3", stage: "E", num: "E3", title: "扫描与放样", file: "e/e3.html" },
    { id: "e4", stage: "E", num: "E4", title: "简单装配体", file: "e/e4.html" },
    { id: "e5", stage: "E", num: "E5", title: "爆炸视图与 BOM", file: "e/e5.html" },
    { id: "e6", stage: "E", num: "E6", title: "E 阶段考核任务", file: "e/e6.html" },
    { id: "eerr", stage: "E", num: "E!", title: "E 阶段常见错误合集", file: "e/err.html" }
  ];

  /* 顶栏导航高亮 */
  var path = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".topbar nav a").forEach(function (a) {
    var href = a.getAttribute("href").split("/").pop();
    if (href === path) a.classList.add("active");
    else if (path.indexOf("f") === 0 && href === "f/") a.classList.add("active");
    else if (path.indexOf("e") === 0 && href === "e/") a.classList.add("active");
  });

  /* 任务内导航（讲义页顶部跳转条） */
  var jumpBox = document.getElementById("taskJump");
  if (jumpBox) {
    var cur = document.body.getAttribute("data-task");
    var stage = document.body.getAttribute("data-stage");
    var list = TASKS.filter(function (t) { return t.stage === stage; });
    var html = '<label>本阶段任务：</label><select onchange="location.href=this.value">';
    list.forEach(function (t) {
      html += '<option value="' + t.file + '"' + (t.id === cur ? " selected" : "") + ">" + t.num + " · " + t.title + "</option>";
    });
    html += "</select>";
    jumpBox.innerHTML = html;
  }

  /* 站点搜索（任务标题 + 关键词） */
  var q = document.getElementById("q");
  var res = document.getElementById("searchResults");
  if (q && res) {
    var KEYWORDS = {
      f0: "阶段 目标 路线 提交 考核 零基础",
      f1: "安装 激活 界面 特征树 学生版 教育许可 破解",
      f2: "草图 直线 矩形 圆 圆弧 修剪 延伸",
      f3: "约束 尺寸 完全定义 欠定义 过定义 几何关系",
      f4: "拉伸 凸台 切除 打孔 倒圆角 零件",
      f5: "考核 评分 自检 补考",
      ferr: "错误 常见问题 版本 草图 建模",
      e0: "阶段 特征 装配 目标 路线",
      e1: "特征树 基准面 建模历史 重命名",
      e2: "旋转 中心线 阶梯轴 轴类",
      e3: "扫描 放样 路径 轮廓 弯管 过渡接头",
      e4: "装配 配合 重合 同轴心 干涉 打包",
      e5: "爆炸视图 BOM 材料明细表 工程图",
      e6: "考核 评分 自检 摇臂组件",
      eerr: "错误 特征 装配 文件 打包"
    };
    q.addEventListener("input", function () {
      var v = q.value.trim().toLowerCase();
      if (!v) { res.style.display = "none"; res.innerHTML = ""; return; }
      var hits = [];
      TASKS.forEach(function (t) {
        var hay = (t.num + " " + t.title + " " + (KEYWORDS[t.id] || "")).toLowerCase();
        if (hay.indexOf(v) > -1) hits.push(t);
      });
      if (!hits.length) { res.style.display = "block"; res.innerHTML = '<div class="hit">没有找到匹配任务，换个关键词试试（如：草图 / 装配 / 旋转）。</div>'; return; }
      res.style.display = "block";
      res.innerHTML = hits.map(function (t) {
        return '<div class="hit"><a href="' + t.file + '">' + t.num + " · " + t.title + "</a><div style='font-size:12.5px;color:#6b7078'>" + t.stage + " 阶段</div></div>";
      }).join("");
    });
  }
})();
