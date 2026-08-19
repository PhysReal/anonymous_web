/* PhysReal project page — data-driven rendering and interaction.
   Plain script (no modules, no fetch) so the page works over file://. */

var QUALITATIVE_DIR = "static/videos/physreal/";

// Add future PhysReal qualitative videos here
var qualitativeVideos = [
    "0726_single_lift_sloth_03.mp4",
    "0726_single_pull_sloth_03.mp4",
    "0728_double_lift_panda_03.mp4",
    "0728_single_lift_panda_03.mp4",
    "0730_double_lift_cloth.mp4",
    "0730_single_clift_cloth.mp4",
    "double_lift_cloth_1.mp4",
    "double_lift_cloth_3.mp4",
    "double_lift_sloth.mp4",
    "double_lift_zebra.mp4",
    "double_stretch_sloth.mp4",
    "double_stretch_zebra.mp4",
    "rope_double_hand.mp4",
    "single_clift_cloth_1.mp4",
    "single_clift_cloth_3.mp4",
    "single_lift_cloth.mp4",
    "single_lift_cloth_1.mp4",
    "single_lift_cloth_3.mp4",
    "single_lift_cloth_4.mp4",
    "single_lift_dinosor.mp4",
    "single_lift_rope.mp4",
    "single_lift_sloth.mp4",
    "single_lift_zebra.mp4",
    "single_push_rope.mp4",
    "single_push_rope_1.mp4",
    "single_push_rope_4.mp4",
    "single_push_sloth.mp4",
    "weird_package.mp4"
];

var DATA_GEN_DIR = "static/videos/data_gen/";

// Add future embodied data generation videos here
var dataGenerationVideos = [
    "cloth_gen_1.mp4",
    "cloth_gen_2.mp4",
    "panda_gen_1.mp4",
    "panda_gen_2.mp4",
    "sloth_gen_1.mp4",
    "sloth_gen_2.mp4"
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

function renderQualitative() {
    var grid = document.getElementById("qualitative-grid");
    if (!grid) { return; }
    qualitativeVideos.forEach(function (filename) {
        grid.appendChild(createVideoCard(QUALITATIVE_DIR + filename, stripExtension(filename)));
    });
}

/* Embodied Data Generation carousel: manual paging with wrap-around.
   perPage = 2 on desktop, 1 on mobile. Only videos on the active page get a
   src (preload="metadata"); switching pages pauses the previous ones. */
var dataGenState = { pageIndex: 0 };

function dataGenPerPage() {
    return (window.matchMedia && window.matchMedia("(max-width: 600px)").matches) ? 1 : 2;
}

function dataGenPageCount() {
    return Math.max(1, Math.ceil(dataGenerationVideos.length / dataGenPerPage()));
}

function createDataGenCard(filename) {
    var card = document.createElement("div");
    card.className = "video-card data-gen-card";

    var video = document.createElement("video");
    video.dataset.carouselSrc = DATA_GEN_DIR + filename;
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
    return card;
}

function buildDataGenCarousel() {
    var track = document.getElementById("data-gen-track");
    if (!track) { return; }
    dataGenerationVideos.forEach(function (filename) {
        var slide = document.createElement("div");
        slide.className = "carousel-slide";
        slide.appendChild(createDataGenCard(filename));
        track.appendChild(slide);
    });

    var prev = document.getElementById("data-gen-prev");
    var next = document.getElementById("data-gen-next");
    if (prev) {
        prev.addEventListener("click", function () { moveDataGen(-1); });
    }
    if (next) {
        next.addEventListener("click", function () { moveDataGen(1); });
    }

    var resizeTimer = null;
    window.addEventListener("resize", function () {
        if (resizeTimer) { window.clearTimeout(resizeTimer); }
        resizeTimer = window.setTimeout(layoutDataGen, 120);
    });

    layoutDataGen();
}

function layoutDataGen() {
    var viewport = document.getElementById("data-gen-viewport");
    var track = document.getElementById("data-gen-track");
    if (!viewport || !track) { return; }

    var perPage = dataGenPerPage();
    var pages = dataGenPageCount();
    if (dataGenState.pageIndex >= pages) {
        dataGenState.pageIndex = pages - 1;
    }

    var gap = parseFloat(window.getComputedStyle(track).gap) || 24;
    var viewportW = viewport.clientWidth;
    var slideW = (viewportW - gap * (perPage - 1)) / perPage;
    Array.prototype.forEach.call(track.children, function (slide) {
        slide.style.width = slideW + "px";
    });
    track.style.transform = "translateX(" + (-dataGenState.pageIndex * viewportW) + "px)";

    activateDataGenPage();
    renderDataGenDots();
}

function activateDataGenPage() {
    var track = document.getElementById("data-gen-track");
    if (!track) { return; }
    var perPage = dataGenPerPage();
    var start = dataGenState.pageIndex * perPage;
    var end = Math.min(start + perPage, dataGenerationVideos.length);
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

function moveDataGen(direction) {
    var pages = dataGenPageCount();
    dataGenState.pageIndex = (dataGenState.pageIndex + direction + pages) % pages;
    layoutDataGen();
}

function renderDataGenDots() {
    var dots = document.getElementById("data-gen-dots");
    if (!dots) { return; }
    var pages = dataGenPageCount();
    if (dots.children.length !== pages) {
        dots.innerHTML = "";
        for (var i = 0; i < pages; i++) {
            var dot = document.createElement("button");
            dot.className = "carousel-dot";
            dot.setAttribute("type", "button");
            dot.setAttribute("aria-label", "Go to page " + (i + 1));
            (function (idx) {
                dot.addEventListener("click", function () {
                    dataGenState.pageIndex = idx;
                    layoutDataGen();
                });
            })(i);
            dots.appendChild(dot);
        }
    }
    Array.prototype.forEach.call(dots.children, function (dot, i) {
        dot.classList.toggle("active", i === dataGenState.pageIndex);
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

function init() {
    renderQualitative();
    buildDataGenCarousel();
    buildComparisonGrid();
    renderSceneSelect();
    switchComparisonScene(DEFAULT_SCENE, true);
    observeVideos();
    setupReveal();
    console.log("[PhysReal] qualitative videos: " + qualitativeVideos.length + "/28");
    console.log("[PhysReal] comparison scene mappings: " +
        (comparisonScenes.length * comparisonMethodOrder.length) + "/54");
    console.log("[PhysReal] data generation videos: " + dataGenerationVideos.length + "/6");
}

init();
