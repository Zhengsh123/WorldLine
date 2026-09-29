(() => {
  const data = window.SHOWCASE_DATA;
  const results = document.querySelector("#results");
  const nav = document.querySelector("#section-nav");
  document.querySelector("#page-title").textContent = data.title.replace(/\s+Video$/, "");
  document.querySelector("#page-subtitle").textContent = "Action-Driven Visual Simulation for Robotic Manipulation";

  const metrics = [
    ["10,000+", "hours of action-free robot video", "Dynamics pretraining"],
    ["2,000+", "hours of action trajectories", "Action grounding"],
    ["10+", "robot embodiments", "Shared control interface"],
    ["+0.1626", "robot-mask IoU on failures", "Gain over strongest baseline"],
    ["74%", "success-prediction accuracy", "Mean across RoboTwin and AgiBot"],
    ["+21.4 pp", "maximum task-success gain", "Out-of-domain RoboTwin planning"]
  ];

  const element = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };

  const metricGrid = document.querySelector("#performance-metrics");
  metrics.forEach(([value, label, note]) => {
    const metric = element("div", "metric");
    metric.append(element("strong", "", value), element("span", "", label), element("small", "", note));
    metricGrid.append(metric);
  });

  const videoCard = (item) => {
    const card = element("div", "video-card");
    const label = element("div", "video-label");
    const displayLabel = item.label === "WorldLine (Causal)" ? "WorldLine Rollout" : item.label;
    label.append(element("span", item.role, displayLabel));
    const link = element("a", "open-video", "open ↗");
    link.href = item.src;
    link.target = "_blank";
    link.rel = "noreferrer";
    link.setAttribute("aria-label", `Open ${displayLabel} video in a new tab`);
    label.append(link);
    const video = document.createElement("video");
    video.dataset.src = item.src;
    video.preload = "none";
    video.muted = true;
    video.playsInline = true;
    video.addEventListener("click", () => video.paused ? video.play() : video.pause());
    card.append(label, video);
    return card;
  };

  const ensureLoaded = (scope) => {
    scope.querySelectorAll("video[data-src]").forEach(video => {
      if (!video.src) {
        video.src = video.dataset.src;
        video.load();
      }
    });
  };

  const addControls = (body) => {
    const controls = element("div", "controls");
    const play = element("button", "play-button", "Play all");
    const pause = element("button", "", "Pause");
    const restart = element("button", "", "Restart");
    const slider = document.createElement("input");
    slider.type = "range"; slider.min = "0"; slider.max = "1000"; slider.value = "0";
    const time = element("span", "time", "0.0 / 0.0 s");
    controls.append(play, pause, restart, slider, time);
    body.prepend(controls);

    const videos = () => [...body.querySelectorAll("video")];
    const master = videos()[0];
    let scrubbing = false;
    let targetProgress = null;
    const duration = () => Math.max(...videos().map(v => v.duration).filter(Number.isFinite));
    const normalizePlaybackRates = () => {
      const d = duration();
      if (!Number.isFinite(d) || !d) return;
      videos().forEach(video => {
        if (Number.isFinite(video.duration) && video.duration) {
          video.playbackRate = video.duration / d;
        }
      });
    };
    videos().forEach(video => video.addEventListener("loadedmetadata", normalizePlaybackRates));
    play.addEventListener("click", () => {
      ensureLoaded(body);
      scrubbing = false;
      targetProgress = null;
      normalizePlaybackRates();
      videos().forEach(v => v.play());
    });
    pause.addEventListener("click", () => videos().forEach(v => v.pause()));
    restart.addEventListener("click", () => {
      videos().forEach(v => { v.currentTime = 0; });
      slider.value = "0";
      const d = duration();
      time.textContent = `0.0 / ${Number.isFinite(d) ? d.toFixed(1) : "0.0"} s`;
    });
    slider.addEventListener("pointerdown", () => {
      scrubbing = true;
      videos().forEach(video => video.pause());
    });
    slider.addEventListener("input", () => {
      ensureLoaded(body);
      const progress = slider.value / 1000;
      scrubbing = true;
      targetProgress = progress;
      videos().forEach(video => video.pause());
      videos().forEach(video => {
        if (Number.isFinite(video.duration)) video.currentTime = video.duration * progress;
      });
      const d = duration();
      if (Number.isFinite(d)) time.textContent = `${(progress * d).toFixed(1)} / ${d.toFixed(1)} s`;
    });
    master.addEventListener("seeked", () => {
      if (targetProgress === null) return;
      const progress = targetProgress;
      videos().forEach(video => {
        if (video !== master && Number.isFinite(video.duration)) {
          video.currentTime = video.duration * progress;
        }
      });
      targetProgress = null;
      scrubbing = false;
    });
    master.addEventListener("timeupdate", () => {
      if (scrubbing) return;
      const d = duration();
      if (!Number.isFinite(d) || !d || !Number.isFinite(master.duration)) return;
      const progress = master.currentTime / master.duration;
      slider.value = String(Math.round(progress * 1000));
      time.textContent = `${(progress * d).toFixed(1)} / ${d.toFixed(1)} s`;
      videos().forEach(v => {
        const otherProgress = v.currentTime / v.duration;
        if (v !== master && !v.paused && Number.isFinite(otherProgress) &&
            Math.abs(otherProgress - progress) * d > .18) {
          v.currentTime = progress * v.duration;
        }
      });
    });
  };

  const renderCase = (item) => {
    const details = element("details", "case");
    const summary = document.createElement("summary");
    const preview = element("span", "case-preview");
    const previewImage = document.createElement("img");
    previewImage.src = item.videos[0].src.replace(/^media\//, "media/posters/").replace(/\.mp4$/, ".jpg");
    previewImage.alt = "";
    previewImage.loading = "lazy";
    previewImage.decoding = "async";
    preview.append(previewImage, element("span", "case-preview-badge", "GROUND TRUTH"));
    const text = element("div", "summary-text");
    text.append(element("span", "case-title", item.title));
    const meta = element("span", "case-meta");
    if (item.comparison_type) meta.append(element("span", "tag secondary", item.comparison_type));
    if (item.note) meta.append(element("span", "", item.note));
    text.append(meta); summary.append(preview, text); details.append(summary);
    const body = element("div", "case-body");

    if (item.layout === "views") {
      const grid = element("div", "view-grid");
      const views = [...new Set(item.videos.map(video => video.view))];
      views.forEach(view => {
        const group = element("div", "view-group");
        group.append(element("h4", "view-title", view));
        const pair = element("div", "view-pair");
        item.videos.filter(video => video.view === view).forEach(video => pair.append(videoCard(video)));
        group.append(pair); grid.append(group);
      });
      body.append(grid);
    } else {
      const grid = element("div", `video-grid ${item.layout === "wide" ? "wide" : ""}`);
      item.videos.forEach(video => grid.append(videoCard(video)));
      body.append(grid);
    }
    addControls(body);
    details.append(body);
    details.addEventListener("toggle", () => { if (details.open) ensureLoaded(details); });
    return details;
  };

  data.sections.forEach((section, index) => {
    const sectionTitle = section.title === "WorldLine (Causal)"
      ? "Long-Horizon Rollouts"
      : section.title === "WorldLine Results"
        ? "WorldLine Qualitative Results"
        : section.title;
    const anchor = element("a", "", sectionTitle);
    anchor.href = `#${section.id}`; nav.append(anchor);
    const node = element("section", "section"); node.id = section.id;
    const heading = element("div", "section-heading");
    const headingCopy = element("div", "section-heading-copy");
    headingCopy.append(element("h2", "", sectionTitle), element("p", "", section.description));
    heading.append(headingCopy, element("span", "section-count", String(index + 1).padStart(2, "0")));
    node.append(heading);
    const datasets = [...new Set(section.cases.map(item => item.dataset))]
      .sort((left, right) => Number(left === "DROID") - Number(right === "DROID"));
    datasets.forEach(dataset => {
      const group = element("div", "dataset-group");
      const groupTitle = dataset === "DROID" ? "DROID · OOD" : "AgibotWorld";
      group.append(element("h3", `dataset-label ${dataset === "DROID" ? "ood" : ""}`, groupTitle));
      const cases = section.cases.filter(item => item.dataset === dataset);
      if (cases.length) {
        group.append(renderCase(cases[0]));
        if (cases.length > 1) {
          const more = element("details", "more-cases");
          const summary = document.createElement("summary");
          summary.append(element("span", "more-cases-label", `Show ${cases.length - 1} more examples`));
          summary.append(element("span", "more-cases-hint", "Expand to explore this collection"));
          more.append(summary);
          cases.slice(1).forEach(item => more.append(renderCase(item)));
          group.append(more);
        }
      }
      node.append(group);
    });
    results.append(node);
  });

  const navLinks = [...nav.querySelectorAll("a")];
  const observedSections = navLinks
    .map(link => ({ link, section: document.querySelector(link.getAttribute("href")) }))
    .filter(item => item.section);
  let activeFrame = 0;
  const updateActiveSection = () => {
    activeFrame = 0;
    const activationLine = nav.getBoundingClientRect().bottom + 30;
    const passed = observedSections.filter(({ section }) => section.getBoundingClientRect().top <= activationLine);
    const active = passed.at(-1) || observedSections[0];
    observedSections.forEach(({ link, section }) => {
      const isActive = section === active.section;
      if (isActive) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
  };
  const scheduleActiveSectionUpdate = () => {
    if (!activeFrame) activeFrame = requestAnimationFrame(updateActiveSection);
  };
  window.addEventListener("scroll", scheduleActiveSectionUpdate, { passive: true });
  window.addEventListener("resize", scheduleActiveSectionUpdate);
  window.addEventListener("hashchange", scheduleActiveSectionUpdate);
  scheduleActiveSectionUpdate();

})();
