/* SUAT RoboMaster 机械组 · 站点交互 v10
   新增：本地账号 / 学习进度 / 作业提交 / 评论区（数据保存在本机浏览器 localStorage） */
(function () {
  "use strict";

  /* 任务索引（搜索 + 导航 + 进度共用） */
  var TASKS = [
    { id: "f0", stage: "F", num: "F0", title: "阶段说明", file: "f/f0.html" },
    { id: "f1", stage: "F", num: "F1", title: "SW2026 安装与界面熟悉", file: "f/f1.html" },
    { id: "f2", stage: "F", num: "F2", title: "草图绘制基础", file: "f/f2.html" },
    { id: "f3", stage: "F", num: "F3", title: "草图约束与尺寸标注", file: "f/f3.html" },
    { id: "f4", stage: "F", num: "F4", title: "简单拉伸零件练习", file: "f/f4.html" },
    { id: "f5", stage: "F", num: "F5", title: "F 阶段考核任务", file: "f/f5.html" },
    { id: "ferr", stage: "F", num: "F!", title: "F 阶段常见错误合集", file: "f/err.html" },
    { id: "e0", stage: "E", num: "E0", title: "阶段说明", file: "e/e0.html" },
    { id: "e1", stage: "E", num: "E1", title: "特征树与基准", file: "e/e1.html" },
    { id: "e2", stage: "E", num: "E2", title: "旋转特征", file: "e/e2.html" },
    { id: "e3", stage: "E", num: "E3", title: "扫描与放样", file: "e/e3.html" },
    { id: "e4", stage: "E", num: "E4", title: "简单装配体", file: "e/e4.html" },
    { id: "e5", stage: "E", num: "E5", title: "爆炸视图与 BOM", file: "e/e5.html" },
    { id: "e6", stage: "E", num: "E6", title: "E 阶段考核任务", file: "e/e6.html" },
    { id: "eerr", stage: "E", num: "E!", title: "E 阶段常见错误合集", file: "e/err.html" },
    { id: "d0", stage: "D", num: "D0", title: "阶段说明与分轨", file: "d/d0.html" },
    { id: "dc1", stage: "D", num: "DC1", title: "底盘布局规划", file: "d/dc1.html" },
    { id: "dc2", stage: "D", num: "DC2", title: "底板与车架", file: "d/dc2.html" },
    { id: "dc3", stage: "D", num: "DC3", title: "轮系与悬挂", file: "d/dc3.html" },
    { id: "dc4", stage: "D", num: "DC4", title: "电池仓与内部布局", file: "d/dc4.html" },
    { id: "dc5", stage: "D", num: "DC5", title: "底盘总装与干涉检查", file: "d/dc5.html" },
    { id: "dy1", stage: "D", num: "DY1", title: "云台轴系", file: "d/dy1.html" },
    { id: "dy2", stage: "D", num: "DY2", title: "发射机构", file: "d/dy2.html" },
    { id: "dy3", stage: "D", num: "DY3", title: "弹仓与供弹", file: "d/dy3.html" },
    { id: "dy4", stage: "D", num: "DY4", title: "云台与发射集成", file: "d/dy4.html" },
    { id: "dy5", stage: "D", num: "DY5", title: "云台总装与干涉检查", file: "d/dy5.html" },
    { id: "derr", stage: "D", num: "D!", title: "D 阶段常见错误合集", file: "d/err.html" },
    { id: "c0", stage: "C", num: "C0", title: "阶段说明", file: "c/c0.html" },
    { id: "b0", stage: "B", num: "B0", title: "阶段说明", file: "b/b0.html" },
    { id: "a0", stage: "A", num: "A0", title: "阶段说明", file: "a/a0.html" }
  ];
  /* 有成品作业的任务（其余任务只自检、不提交） */
  var SUBMIT_TASKS = { f4: 1, f5: 1, e2: 1, e3: 1, e4: 1, e5: 1, e6: 1, dc5: 1, dy5: 1 };

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  /* 顶栏导航高亮 */
  var path = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".topbar nav a").forEach(function (a) {
    var href = a.getAttribute("href").split("/").pop();
    if (href === path) a.classList.add("active");
    else if (path.indexOf("f") === 0 && href === "f/") a.classList.add("active");
    else if (path.indexOf("e") === 0 && href === "e/") a.classList.add("active");
    else if (path.indexOf("d") === 0 && href === "d/") a.classList.add("active");
    else if (path.indexOf("c") === 0 && href === "c/") a.classList.add("active");
    else if (path.indexOf("b") === 0 && href === "b/") a.classList.add("active");
    else if (path.indexOf("a") === 0 && href === "a/") a.classList.add("active");
  });

  var scriptSrc = document.currentScript ? document.currentScript.getAttribute("src") : "";
  var PREFIX = (typeof window.SITE_PREFIX !== "undefined" && window.SITE_PREFIX !== null)
    ? window.SITE_PREFIX
    : (scriptSrc.indexOf("../") === 0 ? "../" : "");

  /* 任务内导航 */
  var jumpBox = document.getElementById("taskJump");
  if (jumpBox) {
    var cur = document.body.getAttribute("data-task");
    var stage = document.body.getAttribute("data-stage");
    var list = TASKS.filter(function (t) { return t.stage === stage; });
    var html = '<label>本阶段任务：</label><div class="task-nav">';
    list.forEach(function (t) {
      html += '<a href="' + PREFIX + t.file + '" title="' + t.num + " · " + t.title + '"' + (t.id === cur ? ' class="active"' : "") + ">" + t.num + "</a>";
    });
    html += "</div>";
    jumpBox.innerHTML = html;
  }

  /* 站点搜索 */
  var q = document.getElementById("q");
  var res = document.getElementById("searchResults");
  if (q && res) {
    var KEYWORDS = {
      f0: "阶段 目标 路线 提交 考核 零基础",
      f1: "安装 激活 界面 特征树 学生版 教育许可 破解 指引",
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
      eerr: "错误 特征 装配 文件 打包",
      d0: "阶段 分轨 底盘 云台 目标 路线",
      dc1: "底盘 布局 轮距 轴距 重心 坐标系",
      dc2: "底板 车架 板材 加强筋 减重孔",
      dc3: "轮系 悬挂 麦克纳姆轮 轴承座 全向轮",
      dc4: "电池仓 走线 重心 内部布局",
      dc5: "总装 装配 干涉检查 BOM 打包",
      dy1: "云台 轴系 Yaw Pitch 轴承座 电机座",
      dy2: "发射 摩擦轮 压紧 拨盘 供弹轮",
      dy3: "弹仓 供弹 弹道 进弹口",
      dy4: "云台 发射 集成 枪管 瞄具 限位",
      dy5: "云台总装 干涉 装配 BOM",
      derr: "错误 底盘 云台 装配 文件",
      c0: "工程图 视图 尺寸 公差 BOM 阶段",
      b0: "仿真 干涉 有限元 材料 阶段",
      a0: "整车 集成 步兵 全流程 阶段"
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
        return '<div class="hit"><a href="' + PREFIX + t.file + '">' + t.num + " · " + t.title + "</a><div style='font-size:12.5px;color:#6b7078'>" + t.stage + " 阶段</div></div>";
      }).join("");
    });
  }

  /* ============ 本地账号 ============ */
  var USER_KEY = "rm_user";
  function getUser() { try { return JSON.parse(localStorage.getItem(USER_KEY)) || null; } catch (e) { return null; } }
  function setUser(u) { localStorage.setItem(USER_KEY, JSON.stringify(u)); }

  var ub = document.getElementById("userBox");
  function renderUser() {
    if (!ub) return;
    var u = getUser();
    if (!u) {
      ub.innerHTML = '<a href="javascript:void(0)" class="u-login" id="loginBtn">登录</a>';
      document.getElementById("loginBtn").addEventListener("click", openLogin);
    } else {
      ub.innerHTML = '<span class="u-name" title="学习进度保存在本机浏览器">' + esc(u.name) + '<i>#' + esc(u.id4 || "----") + '</i></span>' +
        '<a href="javascript:void(0)" class="u-out" id="logoutBtn">退出</a>';
      document.getElementById("logoutBtn").addEventListener("click", function () {
        if (window.confirm("退出后本机保存的进度、提交、评论记录仍保留，重新登录同账号可继续查看。")) {
          setUser(null);
          renderUser(); refreshAll();
        }
      });
    }
  }

  function openLogin() {
    var m = document.createElement("div");
    m.className = "modal-mask";
    m.innerHTML = '<div class="modal">' +
      '<div class="m-title">登录（仅保存在本机浏览器）</div>' +
      '<label class="m-label">昵称（怎么称呼你，如：张三）</label>' +
      '<input id="mName" type="text" maxlength="12" placeholder="输入昵称">' +
      '<label class="m-label">学号后四位</label>' +
      '<input id="mId4" type="text" maxlength="4" placeholder="如 0007">' +
      '<div class="m-tip">账号信息、学习进度、作业提交与评论均只存在你自己电脑的浏览器里，不会上传服务器。换电脑需要重新登录。</div>' +
      '<div class="m-btns"><button class="btn-cancel" id="mCancel">取消</button><button class="btn-ok" id="mOk">登录</button></div>' +
      '</div>';
    document.body.appendChild(m);
    function close() { document.body.removeChild(m); }
    document.getElementById("mCancel").addEventListener("click", close);
    m.addEventListener("click", function (e) { if (e.target === m) close(); });
    document.getElementById("mOk").addEventListener("click", function () {
      var n = document.getElementById("mName").value.trim();
      var id4 = document.getElementById("mId4").value.trim();
      if (!n) { document.getElementById("mName").focus(); return; }
      setUser({ name: n, id4: id4 || "----" });
      close(); renderUser(); refreshAll();
    });
    document.getElementById("mName").focus();
  }

  /* ============ 学习进度 ============ */
  function progKey() { var u = getUser(); return "rm_prog_" + (u ? u.name : "guest"); }
  function loadProg() { try { return JSON.parse(localStorage.getItem(progKey())) || {}; } catch (e) { return {}; } }
  function saveProg(p) { localStorage.setItem(progKey(), JSON.stringify(p)); }

  var pb = document.getElementById("progressBox");
  function renderProgress() {
    if (!pb) return;
    var task = document.body.getAttribute("data-task");
    var u = getUser();
    if (!u) {
      pb.innerHTML = '<div class="p-head"><b>学习进度</b><span class="p-sub">登录后记录完成状态（本机保存）</span></div><div class="p-actions"><a href="javascript:void(0)" class="btn-mini" id="pLogin">先登录</a></div>';
      document.getElementById("pLogin").addEventListener("click", openLogin);
      return;
    }
    var prog = loadProg();
    var done = !!prog[task];
    var same = TASKS.filter(function (t) { return t.stage === document.body.getAttribute("data-stage"); });
    var cnt = 0; same.forEach(function (t) { if (prog[t.id]) cnt++; });
    var pct = Math.round(cnt / same.length * 100);
    var tinfo = null; TASKS.forEach(function (t) { if (t.id === task) tinfo = t; });
    pb.innerHTML = '<div class="p-head"><b>学习进度 · ' + esc(tinfo ? tinfo.num : task) + '</b><span class="p-sub">本阶段已完成 ' + cnt + " / " + same.length + "（" + pct + "%）</span></div>" +
      '<div class="p-bar"><div class="p-fill" style="width:' + pct + '%"></div></div>' +
      '<div class="p-actions"><a href="javascript:void(0)" class="btn-mini ' + (done ? "done" : "") + '" id="pToggle">' + (done ? "✓ 已完成（点击撤销）" : "标记本任务完成") + '</a></div>';
    document.getElementById("pToggle").addEventListener("click", function () {
      if (done) delete prog[task]; else prog[task] = 1;
      saveProg(prog); renderProgress();
    });
  }

  /* 首页进度总览 */
  var hp = document.getElementById("homeProgress");
  function renderHomeProgress() {
    if (!hp) return;
    var u = getUser();
    if (!u) {
      hp.innerHTML = '<div class="p-head"><b>我的学习进度</b><span class="p-sub">登录后各任务完成状态自动汇总（本机保存）</span></div><div class="p-actions"><a href="javascript:void(0)" class="btn-mini" id="hpLogin">登录</a></div>';
      document.getElementById("hpLogin").addEventListener("click", openLogin);
      return;
    }
    var prog = loadProg();
    var html = '<div class="p-head"><b>' + esc(u.name) + ' 的学习进度</b><span class="p-sub">本机保存 · 完成状态一览</span></div><div class="hp-grid">';
    ["F", "E", "D"].forEach(function (st) {
      var arr = TASKS.filter(function (t) { return t.stage === st && !/0$/.test(t.id) && t.id.indexOf("err") < 0; });
      var n = arr.length, c = 0; arr.forEach(function (t) { if (prog[t.id]) c++; });
      html += '<div class="hp-col"><div class="hp-stage">' + st + " 阶段</div><div class='p-bar'><div class='p-fill' style='width:" + Math.round(c / n * 100) + "%'></div></div><div class='hp-sub'>" + c + " / " + n + " 个任务完成</div>";
      arr.forEach(function (t) {
        html += '<div class="hp-task"><a href="' + PREFIX + t.file + '">' + t.num + " " + t.title + '</a><span class="hp-dot ' + (prog[t.id] ? "on" : "") + '"></span></div>';
      });
      html += "</div>";
    });
    html += "</div>";
    hp.innerHTML = html;
  }

  /* ============ 作业提交 ============ */
  function submitKey() { var u = getUser(); return "rm_submit_" + (u ? u.name : "guest"); }
  function loadSubs() { try { return JSON.parse(localStorage.getItem(submitKey())) || {}; } catch (e) { return {}; } }
  function saveSubs(s) { localStorage.setItem(submitKey(), JSON.stringify(s)); }

  var sb = document.getElementById("submitBox");
  function renderSubmit() {
    if (!sb) return;
    var task = document.body.getAttribute("data-task");
    var u = getUser();
    if (!SUBMIT_TASKS[task]) { sb.style.display = "none"; return; }
    if (!u) {
      sb.innerHTML = '<div class="p-head"><b>作业提交</b><span class="p-sub">本任务的成品作业有提交要求，登录后填写（本机保存，共享发微信群）</span></div><div class="p-actions"><a href="javascript:void(0)" class="btn-mini" id="sLogin">先登录</a></div>';
      document.getElementById("sLogin").addEventListener("click", openLogin);
      return;
    }
    var subs = loadSubs();
    var mine = subs[task] || [];
    var html = '<div class="p-head"><b>作业提交 · ' + esc(task.toUpperCase()) + '</b><span class="p-sub">记录保存在本机；需要组长/组员看到时，点「复制提交消息」发到微信群</span></div>';
    html += '<div class="s-form"><input id="sDesc" type="text" maxlength="60" placeholder="作品说明（一句话，如：连接板，孔径 10，圆角 3）"><div class="s-row">' +
      '<input id="sFile" type="text" maxlength="40" placeholder="文件名（按命名规范）"><input id="sLink" type="text" maxlength="80" placeholder="作品链接/网盘链接（可选）">' +
      '</div><div class="p-actions"><a href="javascript:void(0)" class="btn-mini" id="sSave">保存这条提交</a></div></div>';
    if (mine.length) {
      html += '<div class="s-list"><div class="s-title">我的提交（' + mine.length + "）</div>";
      mine.forEach(function (it, i) {
        var when = new Date(it.t).toLocaleString("zh-CN", { month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit" });
        html += '<div class="s-item"><div><b>' + esc(it.desc) + '</b><div class="s-meta">' + esc(it.file || "无文件名") + (it.link ? " · <a href='" + esc(it.link) + "' target='_blank' rel='noopener'>链接</a>" : "") + "</div></div>" +
          '<div class="s-right"><span class="s-time">' + when + '</span><a href="javascript:void(0)" class="s-del" data-i="' + i + '">删</a></div></div>';
      });
      html += '<div class="p-actions"><a href="javascript:void(0)" class="btn-mini" id="sCopy">复制提交消息（发微信群）</a></div></div>';
    }
    sb.innerHTML = html;
    document.getElementById("sSave").addEventListener("click", function () {
      var d = document.getElementById("sDesc").value.trim();
      if (!d) { document.getElementById("sDesc").focus(); return; }
      var f = document.getElementById("sFile").value.trim();
      var l = document.getElementById("sLink").value.trim();
      if (!subs[task]) subs[task] = [];
      subs[task].push({ t: Date.now(), desc: d, file: f, link: l });
      saveSubs(subs); renderSubmit();
    });
    var copyBtn = document.getElementById("sCopy");
    if (copyBtn) copyBtn.addEventListener("click", function () {
      var lines = ["【阶段作业提交】" + task.toUpperCase()];
      mine.forEach(function (it) {
        lines.push("- " + it.desc + (it.file ? "（文件：" + it.file + "）" : "") + (it.link ? " 链接：" + it.link : ""));
      });
      var text = lines.join("\n");
      function done() { copyBtn.textContent = "已复制 ✓"; }
      function fallback() {
        var ta = document.createElement("textarea");
        ta.value = text; document.body.appendChild(ta); ta.select();
        try { document.execCommand("copy"); done(); } catch (e) { window.prompt("复制失败，请手动复制：", text); }
        document.body.removeChild(ta);
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, fallback);
      } else fallback();
    });
    document.querySelectorAll(".s-del").forEach(function (el) {
      el.addEventListener("click", function () {
        subs[task].splice(Number(el.getAttribute("data-i")), 1);
        saveSubs(subs); renderSubmit();
      });
    });
  }

  /* ============ 评论区（本机保存） ============ */
  function cmtKey() { return "rm_cmt_" + document.body.getAttribute("data-task"); }
  function loadCmts() { try { return JSON.parse(localStorage.getItem(cmtKey())) || []; } catch (e) { return []; } }
  function saveCmts(c) { localStorage.setItem(cmtKey(), JSON.stringify(c)); }

  var cb = document.getElementById("commentsBox");
  function renderComments() {
    if (!cb) return;
    var u = getUser();
    var cmts = loadCmts();
    var html = '<div class="p-head"><b>评论区</b><span class="p-sub">提问 / 交流 / 补充错误。全组评论在下方（用 GitHub 账号登录即可留言，没有账号可免费注册）；上方本机评论仅自己可见，可作草稿备忘</span></div>';
    if (!u) {
      html += '<div class="p-actions"><a href="javascript:void(0)" class="btn-mini" id="cLogin">登录后留言</a></div>';
    } else {
      html += '<div class="c-form"><input id="cText" type="text" maxlength="200" placeholder="写下你的问题或补充…"><div class="p-actions"><a href="javascript:void(0)" class="btn-mini" id="cSend">发表（' + esc(u.name) + "）</a></div></div>";
    }
    if (cmts.length) {
      html += '<div class="c-list">';
      cmts.slice().reverse().forEach(function (it, idx) {
        var when = new Date(it.t).toLocaleString("zh-CN", { month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit" });
        html += '<div class="c-item"><b>' + esc(it.name) + "</b><span class='s-time'>" + when + '</span><div>' + esc(it.text) + "</div></div>";
      });
      html += "</div>";
    }
    cb.innerHTML = html;
    var send = document.getElementById("cSend");
    if (send) send.addEventListener("click", function () {
      var v = document.getElementById("cText").value.trim();
      if (!v) { document.getElementById("cText").focus(); return; }
      var uu = getUser();
      cmts.push({ name: uu ? uu.name : "访客", text: v, t: Date.now() });
      saveCmts(cmts); renderComments();
    });
    var cl = document.getElementById("cLogin");
    if (cl) cl.addEventListener("click", openLogin);
  }

  function refreshAll() {
    renderProgress(); renderHomeProgress(); renderSubmit(); renderComments();
  }

  renderUser();
  renderProgress();
  renderHomeProgress();
  renderSubmit();
  renderComments();
})();
