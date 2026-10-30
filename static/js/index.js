/* PhysReal project page — data-driven rendering and interaction.
   Plain script (no modules, no fetch) so the page works over file://. */

var QUALITATIVE_PHYSTWIN_DIR = "static/videos/physreal/";
var QUALITATIVE_SELF_DIR = "static/videos/新视频/";

/* 32 PhysReal qualitative results: 22 PhysTwin (original public order) then
   10 self-collected (Rope -> Cloth -> Panda -> Sloth). Directory names are
   used as-is; encodeURI is applied when assigning video src. */
var qualitativeVideos = [
    { dir: QUALITATIVE_PHYSTWIN_DIR, file: "double_lift_cloth_1.mp4" },
    { dir: QUALITATIVE_PHYSTWIN_DIR, file: "double_lift_cloth_3.mp4" },
    { dir: QUALITATIVE_PHYSTWIN_DIR, file: "double_lift_sloth.mp4" },
    { dir: QUALITATIVE_PHYSTWIN_DIR, file: "double_lift_zebra.mp4" },
    { dir: QUALITATIVE_PHYSTWIN_DIR, file: "double_stretch_sloth.mp4" },
    { dir: QUALITATIVE_PHYSTWIN_DIR, file: "double_stretch_zebra.mp4" },
    { dir: QUALITATIVE_PHYSTWIN_DIR, file: "rope_double_hand.mp4" },
    { dir: QUALITATIVE_PHYSTWIN_DIR, file: "single_clift_cloth_1.mp4" },
    { dir: QUALITATIVE_PHYSTWIN_DIR, file: "single_clift_cloth_3.mp4" },
    { dir: QUALITATIVE_PHYSTWIN_DIR, file: "single_lift_cloth.mp4" },
    { dir: QUALITATIVE_PHYSTWIN_DIR, file: "single_lift_cloth_1.mp4" },
    { dir: QUALITATIVE_PHYSTWIN_DIR, file: "single_lift_cloth_3.mp4" },
    { dir: QUALITATIVE_PHYSTWIN_DIR, file: "single_lift_cloth_4.mp4" },
    { dir: QUALITATIVE_PHYSTWIN_DIR, file: "single_lift_dinosor.mp4" },
    { dir: QUALITATIVE_PHYSTWIN_DIR, file: "single_lift_rope.mp4" },
    { dir: QUALITATIVE_PHYSTWIN_DIR, file: "single_lift_sloth.mp4" },
    { dir: QUALITATIVE_PHYSTWIN_DIR, file: "single_lift_zebra.mp4" },
    { dir: QUALITATIVE_PHYSTWIN_DIR, file: "single_push_rope.mp4" },
    { dir: QUALITATIVE_PHYSTWIN_DIR, file: "single_push_rope_1.mp4" },
    { dir: QUALITATIVE_PHYSTWIN_DIR, file: "single_push_rope_4.mp4" },
    { dir: QUALITATIVE_PHYSTWIN_DIR, file: "single_push_sloth.mp4" },
    { dir: QUALITATIVE_PHYSTWIN_DIR, file: "weird_package.mp4" },
    { dir: QUALITATIVE_SELF_DIR, file: "single_lift_rope.mp4" },
    { dir: QUALITATIVE_SELF_DIR, file: "single_push_rope.mp4" },
    { dir: QUALITATIVE_SELF_DIR, file: "double_lift_cloth.mp4" },
    { dir: QUALITATIVE_SELF_DIR, file: "single_lift_cloth.mp4" },
    { dir: QUALITATIVE_SELF_DIR, file: "double_lift_panda.mp4" },
    { dir: QUALITATIVE_SELF_DIR, file: "single_lift_panda_arm.mp4" },
    { dir: QUALITATIVE_SELF_DIR, file: "single_lift_panda_leg.mp4" },
    { dir: QUALITATIVE_SELF_DIR, file: "double_lift_sloth.mp4" },
    { dir: QUALITATIVE_SELF_DIR, file: "single_lift_sloth_arm.mp4" },
    { dir: QUALITATIVE_SELF_DIR, file: "single_pull_sloth_leg.mp4" }
];

/* Downstream Applications: one entry per application subsection.
   Videos inside each section are listed in display order: object priority
   Panda -> Cloth -> Sloth, then natural numeric order within the same object.
   File names verified on disk; never rename real files. Add future videos here. */
var applicationSections = [
    {
        id: "interactive-simulation",
        title: "Interactive Simulation",
        dir: "static/videos/applications/interactive/",
        videos: [
            "panda_inter_1.mp4",
            "panda_inter_2.mp4",
            "cloth_inter_1.mp4",
            "cloth_inter_2.mp4",
            "sloth_inter_1.mp4",
            "sloth_inter_2.mp4"
        ]
    },
    {
        id: "embodied-data-generation",
        title: "Embodied Data Generation",
        dir: "static/videos/data_gen/",
        videos: [
            "panda_gen_1.mp4",
            "panda_gen_2.mp4",
            "cloth_gen_1.mp4",
            "cloth_gen_2.mp4",
            "sloth_gen_1.mp4",
            "sloth_gen_2.mp4"
        ]
    },
    {
        id: "physical-digital-twin",
        title: "Real-time Physical Digital Twin",
        dir: "static/videos/applications/twin/",
        videos: [
            "panda_twin_1.mp4",
            "panda_twin_2.mp4",
            "cloth_twin_1.mp4",
            "cloth_twin_2.mp4",
            "sloth_twin_1.mp4",
            "sloth_twin_2.mp4"
        ]
    },
    {
        id: "model-based-manipulation",
        title: "Model-based Manipulation",
        dir: "static/videos/applications/MPC/",
        videos: [
            "panda_mpc_1.mp4",
            "panda_mpc_2.mp4",
            "cloth_mpc_1.mp4",
            "cloth_mpc_2.mp4",
            "sloth_mpc_1.mp4",
            "sloth_mpc_2.mp4"
        ]
    }
];

/* Comparison: fixed display order of the six methods. */
var comparisonMethodOrder = [
    { key: "gt", label: "Ground Truth", isOurs: false },
    { key: "physReal", label: "PhysReal", isOurs: true },
    { key: "physTwin", label: "PhysTwin", isOurs: false },
    { key: "physFlow", label: "PhysFlow", isOurs: false },
    { key: "springGaus", label: "Spring-Gaus", isOurs: false },
    { key: "gsDynamics", label: "GS-Dynamics", isOurs: false }
];

/* Real directory names verified on disk. Do not rename directories.
   gt / springGaus sources originally shipped as MPEG-4 Part 2 (mp4v), which
   browsers cannot decode; they have been transcoded in place to H.264
   (avc1, yuv420p, faststart) under the same file names. */
var comparisonDirs = {
    gt: "static/videos/gt_video/",
    physReal: "static/videos/physreal_video/",
    physTwin: "static/videos/phystwin_video/",
    physFlow: "static/videos/phsflow_video/",
    springGaus: "static/videos/spring-gaus_video/",
    gsDynamics: "static/videos/GSD_video/"
};

/* Explicit overrides for files whose real names differ from the canonical scene stem
   (verified against the real directories; files are never renamed). */
var comparisonPathOverrides = {
    "weird_package": {
        springGaus: "static/videos/spring-gaus_video/weird_package_comparison.mp4"
    }
};

/* Canonical comparison scenes in UI order (flat list, no categories). Add future scenes here. */
var comparisonScenes = [
    "rope_double_hand",
    "single_lift_rope",
    "single_push_rope_1",
    "single_clift_cloth_5",
    "single_lift_cloth_3",
    "weird_package",
    "single_lift_zebra",
    "single_pull_sloth_1",
    "single_push_sloth"
];

var DEFAULT_SCENE = "rope_double_hand";

function stripExtension(filename) {
    return filename.replace(/\.mp4$/i, "");
}

function createVideoElement(src) {
    var video = document.createElement("video");
    video.dataset.src = src;
    video.muted = true;
    video.setAttribute("muted", "");
    video.setAttribute("autoplay", "");
    video.setAttribute("loop", "");
    video.setAttribute("playsinline", "");
    video.setAttribute("preload", "metadata");
    return video;
}

function createVideoCard(src, caption) {
    var card = document.createElement("div");
    card.className = "video-card";
    card.appendChild(createVideoElement(src));
    var label = document.createElement("p");
    label.className = "video-caption";
    label.textContent = caption;
    card.appendChild(label);
    return card;
}

function qualitativeSrc(entry) {
    return encodeURI(entry.dir + entry.file);
}

function renderQualitative() {
    var grid = document.getElementById("qualitative-grid");
    if (!grid) { return; }
    qualitativeVideos.forEach(function (entry) {
        grid.appendChild(createVideoCard(qualitativeSrc(entry), stripExtension(entry.file)));
    });
}

/* Application carousels: one shared implementation, independent state per section.
   perPage = 2 on desktop, 1 on mobile. Only videos on the active page get a
   src (preload="metadata"); switching pages pauses the previous ones. */
var APP_OBJECT_PRIORITY = { panda: 0, cloth: 1, sloth: 2 };

function appObjectPriority(filename) {
    var m = filename.toLowerCase().match(/panda|cloth|sloth/);
    return m ? APP_OBJECT_PRIORITY[m[0]] : 99;
}

function appObjectNumber(filename) {
    var m = filename.match(/(\d+)\.mp4$/i);
    return m ? parseInt(m[1], 10) : 0;
}

/* Re-asserts Panda -> Cloth -> Sloth, then natural numeric order (1, 2, ... 10). */
function sortApplicationVideos(videos) {
    return videos.slice().sort(function (a, b) {
        var pa = appObjectPriority(a);
        var pb = appObjectPriority(b);
        if (pa !== pb) { return pa - pb; }
        var na = appObjectNumber(a);
        var nb = appObjectNumber(b);
        if (na !== nb) { return na - nb; }
        return a < b ? -1 : (a > b ? 1 : 0);
    });
}

function appCarouselPerPage() {
    return (window.matchMedia && window.matchMedia("(max-width: 600px)").matches) ? 1 : 2;
}

function createAppSlide(dir, filename) {
    var slide = document.createElement("div");
    slide.className = "carousel-slide";

    var card = document.createElement("div");
    card.className = "video-card data-gen-card";

    var video = document.createElement("video");
    video.dataset.carouselSrc = dir + filename;
    video.muted = true;
    video.setAttribute("muted", "");
    video.setAttribute("autoplay", "");
    video.setAttribute("loop", "");
    video.setAttribute("playsinline", "");
    video.setAttribute("preload", "metadata");
    card.appendChild(video);

    var label = document.createElement("p");
    label.className = "video-caption";
    label.textContent = stripExtension(filename);
    card.appendChild(label);

    slide.appendChild(card);
    return slide;
}

function buildAppCarousels() {
    applicationSections.forEach(function (section) {
        var root = document.getElementById("carousel-" + section.id);
        if (!root) { return; }
        var track = root.querySelector(".carousel-track");
        if (!track) { return; }

        root._videos = sortApplicationVideos(section.videos);
        root._pageIndex = 0;
        root._videos.forEach(function (filename) {
            track.appendChild(createAppSlide(section.dir, filename));
        });

        var prev = root.querySelector(".carousel-prev");
        var next = root.querySelector(".carousel-next");
        if (prev) {
            prev.addEventListener("click", function () { moveAppCarousel(root, -1); });
        }
        if (next) {
            next.addEventListener("click", function () { moveAppCarousel(root, 1); });
        }

        layoutAppCarousel(root);
    });

    var resizeTimer = null;
    window.addEventListener("resize", function () {
        if (resizeTimer) { window.clearTimeout(resizeTimer); }
        resizeTimer = window.setTimeout(function () {
            document.querySelectorAll(".app-carousel").forEach(layoutAppCarousel);
        }, 120);
    });
}

function appCarouselPageCount(root) {
    return Math.max(1, Math.ceil(root._videos.length / appCarouselPerPage()));
}

function layoutAppCarousel(root) {
    var viewport = root.querySelector(".carousel-viewport");
    var track = root.querySelector(".carousel-track");
    if (!viewport || !track) { return; }

    var perPage = appCarouselPerPage();
    var pages = appCarouselPageCount(root);
    if (root._pageIndex >= pages) {
        root._pageIndex = pages - 1;
    }
    root.classList.toggle("is-single-page", pages <= 1);

    var gap = parseFloat(window.getComputedStyle(track).gap) || 24;
    var viewportW = viewport.clientWidth;
    var slideW = (viewportW - gap * (perPage - 1)) / perPage;
    Array.prototype.forEach.call(track.children, function (slide) {
        slide.style.width = slideW + "px";
    });
    track.style.transform = "translateX(" + (-root._pageIndex * viewportW) + "px)";

    activateAppCarouselPage(root);
    renderAppCarouselDots(root);
}

function activateAppCarouselPage(root) {
    var track = root.querySelector(".carousel-track");
    var perPage = appCarouselPerPage();
    var start = root._pageIndex * perPage;
    var end = Math.min(start + perPage, root._videos.length);
    Array.prototype.forEach.call(track.children, function (slide, i) {
        var video = slide.querySelector("video");
        if (!video) { return; }
        if (i >= start && i < end) {
            if (!video.getAttribute("src") && video.dataset.carouselSrc) {
                video.src = video.dataset.carouselSrc;
                video.load();
            }
            var playPromise = video.play();
            if (playPromise && typeof playPromise.catch === "function") {
                playPromise.catch(function () { /* muted autoplay retried on next activation */ });
            }
        } else {
            video.pause();
        }
    });
}

function moveAppCarousel(root, direction) {
    var pages = appCarouselPageCount(root);
    root._pageIndex = (root._pageIndex + direction + pages) % pages;
    layoutAppCarousel(root);
}

function renderAppCarouselDots(root) {
    var dots = root.querySelector(".carousel-dots");
    if (!dots) { return; }
    var pages = appCarouselPageCount(root);
    if (dots.children.length !== pages) {
        dots.innerHTML = "";
        for (var i = 0; i < pages; i++) {
            var dot = document.createElement("button");
            dot.className = "carousel-dot";
            dot.setAttribute("type", "button");
            dot.setAttribute("aria-label", "Go to page " + (i + 1));
            (function (idx) {
                dot.addEventListener("click", function () {
                    root._pageIndex = idx;
                    layoutAppCarousel(root);
                });
            })(i);
            dots.appendChild(dot);
        }
    }
    Array.prototype.forEach.call(dots.children, function (dot, i) {
        dot.classList.toggle("active", i === root._pageIndex);
    });
}

function comparisonVideoPath(sceneId, methodKey) {
    var overrides = comparisonPathOverrides[sceneId];
    if (overrides && overrides[methodKey]) {
        return overrides[methodKey];
    }
    return comparisonDirs[methodKey] + sceneId + ".mp4";
}

/* Only the six videos of the active scene exist in the DOM at any time. */
var comparisonCards = [];

function buildComparisonGrid() {
    var grid = document.getElementById("comparison-grid");
    if (!grid) { return; }
    comparisonMethodOrder.forEach(function (method) {
        var card = document.createElement("div");
        card.className = "video-card comparison-card" + (method.isOurs ? " ours-card" : "");

        var header = document.createElement("div");
        header.className = "comparison-method-header";
        header.textContent = method.label;
        if (method.isOurs) {
            var badge = document.createElement("span");
            badge.className = "ours-badge";
            badge.textContent = "Ours";
            header.appendChild(badge);
        }
        card.appendChild(header);

        var video = createVideoElement("");
        card.appendChild(video);
        grid.appendChild(card);
        comparisonCards.push({ key: method.key, video: video });
    });
}

function applyComparisonScene(sceneId) {
    var grid = document.getElementById("comparison-grid");
    var titleEl = document.getElementById("comparison-scene-title");
    comparisonCards.forEach(function (entry) {
        var video = entry.video;
        video.pause();
        var src = comparisonVideoPath(sceneId, entry.key);
        video.dataset.src = src;
        video.src = src;
        video.load();
        var playPromise = video.play();
        if (playPromise && typeof playPromise.catch === "function") {
            playPromise.catch(function () { /* muted autoplay retried by the observer below */ });
        }
    });
    if (titleEl) { titleEl.textContent = sceneId; }
    if (grid) { grid.classList.remove("scene-switching"); }
}

function switchComparisonScene(sceneId, instant) {
    var grid = document.getElementById("comparison-grid");
    var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (instant || !grid || reduceMotion) {
        applyComparisonScene(sceneId);
        return;
    }
    grid.classList.add("scene-switching");
    window.setTimeout(function () {
        applyComparisonScene(sceneId);
    }, 180);
}

function renderSceneSelect() {
    var select = document.getElementById("comparison-scene-select");
    if (!select) { return; }
    comparisonScenes.forEach(function (sceneId) {
        var option = document.createElement("option");
        option.value = sceneId;
        option.textContent = sceneId;
        select.appendChild(option);
    });
    select.value = DEFAULT_SCENE;
    select.addEventListener("change", function () {
        switchComparisonScene(this.value, false);
    });
}

/* Load qualitative videos near the viewport; play visible ones and pause off-screen ones. */
function observeVideos() {
    var videos = document.querySelectorAll("video[data-src]");
    if (!("IntersectionObserver" in window)) {
        videos.forEach(function (video) {
            if (!video.getAttribute("src") && video.dataset.src) {
                video.src = video.dataset.src;
            }
        });
        return;
    }
    var videoObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            var video = entry.target;
            if (entry.isIntersecting) {
                if (!video.getAttribute("src") && video.dataset.src) {
                    video.src = video.dataset.src;
                    video.load();
                }
                var playPromise = video.play();
                if (playPromise && typeof playPromise.catch === "function") {
                    playPromise.catch(function () { /* autoplay may be blocked; muted play retried on next intersection */ });
                }
            } else {
                video.pause();
            }
        });
    }, { rootMargin: "240px 0px", threshold: 0.05 });
    videos.forEach(function (video) { videoObserver.observe(video); });
}

function setupReveal() {
    var revealEls = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) {
        revealEls.forEach(function (el) { el.classList.add("revealed"); });
        return;
    }
    document.body.classList.add("js-enabled");
    var revealObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add("revealed");
                revealObserver.unobserve(entry.target);
            }
        });
    }, { rootMargin: "0px 0px -40px 0px", threshold: 0.05 });
    revealEls.forEach(function (el) { revealObserver.observe(el); });
}

var METRIC_COLUMNS = [
    { key: "iou", label: "IoU \u2191", title: "Intersection over Union (%), higher is better" },
    { key: "cd", label: "CD \u2193", title: "Chamfer Distance (m), lower is better" },
    { key: "track", label: "Track \u2193", title: "Tracking error (m), lower is better" },
    { key: "psnr", label: "PSNR \u2191", title: "Peak Signal-to-Noise Ratio (dB), higher is better" },
    { key: "ssim", label: "SSIM \u2191", title: "Structural Similarity, higher is better" },
    { key: "lpips", label: "LPIPS \u2193", title: "Learned Perceptual Image Patch Similarity, lower is better" }
];

function formatMetricDisplay(value) {
    if (typeof value !== "number" || !isFinite(value)) { return "\u2014"; }
    return value.toFixed(3);
}

function appendMetricCells(tr, group, phaseClass) {
    METRIC_COLUMNS.forEach(function (col) {
        var td = document.createElement("td");
        td.className = "metrics-num " + phaseClass;
        var value = group[col.key];
        td.textContent = formatMetricDisplay(value);
        if (typeof value === "number" && isFinite(value)) {
            td.title = String(value);
        }
        tr.appendChild(td);
    });
}

function appendGroupLabelRow(tbody, label, count) {
    var tr = document.createElement("tr");
    tr.className = "metrics-group-row";
    var td = document.createElement("td");
    td.colSpan = 13;
    td.textContent = label + " (" + count + " sequences)";
    tr.appendChild(td);
    tbody.appendChild(tr);
}

function renderPerSequenceTable() {
    var table = document.getElementById("per-sequence-table");
    if (!table || typeof perSequenceMetrics === "undefined") { return; }

    var thead = document.createElement("thead");
    var groupRow = document.createElement("tr");
    var taskHead = document.createElement("th");
    taskHead.rowSpan = 2;
    taskHead.scope = "col";
    taskHead.className = "metrics-task-head";
    taskHead.textContent = "Task";
    groupRow.appendChild(taskHead);

    var trainHead = document.createElement("th");
    trainHead.colSpan = 6;
    trainHead.scope = "colgroup";
    trainHead.className = "metrics-phase-head metrics-train-head";
    trainHead.textContent = "Training";
    groupRow.appendChild(trainHead);

    var testHead = document.createElement("th");
    testHead.colSpan = 6;
    testHead.scope = "colgroup";
    testHead.className = "metrics-phase-head metrics-test-head";
    testHead.textContent = "Testing";
    groupRow.appendChild(testHead);
    thead.appendChild(groupRow);

    var metricRow = document.createElement("tr");
    function appendMetricHeads(phaseClass) {
        METRIC_COLUMNS.forEach(function (col) {
            var th = document.createElement("th");
            th.scope = "col";
            th.className = "metrics-metric-head " + phaseClass;
            th.textContent = col.label;
            th.title = col.title;
            metricRow.appendChild(th);
        });
    }
    appendMetricHeads("metrics-train-head");
    appendMetricHeads("metrics-test-head");
    thead.appendChild(metricRow);

    var tbody = document.createElement("tbody");
    var lastDataset = null;
    var datasetLabels = {
        "PhysTwin": "PhysTwin Dataset",
        "Self-collected": "Self-collected Dataset"
    };

    perSequenceMetrics.forEach(function (row) {
        if (row.dataset !== lastDataset) {
            var groupRows = perSequenceMetrics.filter(function (item) {
                return item.dataset === row.dataset;
            });
            appendGroupLabelRow(tbody, datasetLabels[row.dataset] || row.dataset, groupRows.length);
            lastDataset = row.dataset;
        }
        var tr = document.createElement("tr");
        tr.dataset.dataset = row.dataset;
        tr.dataset.task = row.task;
        var taskCell = document.createElement("th");
        taskCell.scope = "row";
        taskCell.className = "metrics-task";
        taskCell.textContent = row.task;
        tr.appendChild(taskCell);
        appendMetricCells(tr, row.training, "metrics-train");
        appendMetricCells(tr, row.testing, "metrics-test");
        tbody.appendChild(tr);
    });

    table.appendChild(thead);
    table.appendChild(tbody);
}

function init() {
    renderQualitative();
    renderPerSequenceTable();
    buildAppCarousels();
    buildComparisonGrid();
    renderSceneSelect();
    switchComparisonScene(DEFAULT_SCENE, true);
    observeVideos();
    setupReveal();
    console.log("[PhysReal] qualitative videos: " + qualitativeVideos.length + "/32");
    console.log("[PhysReal] comparison scene mappings: " +
        (comparisonScenes.length * comparisonMethodOrder.length) + "/54");
    var appVideoTotal = applicationSections.reduce(function (sum, s) { return sum + s.videos.length; }, 0);
    console.log("[PhysReal] application videos: " + appVideoTotal + "/24 across " +
        applicationSections.length + " sections");
    if (typeof perSequenceMetrics !== "undefined") {
        console.log("[PhysReal] per-sequence metrics: " + perSequenceMetrics.length + "/32");
    }
}

init();
