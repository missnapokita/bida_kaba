const fallbackConfig = {
  app_name: "Bida Reels",
  version: "1.1",
  size: "13 MB",
  downloads: "10K+",
  last_updated: "September 24, 2026",
  apk_url: "",
  whats_new: [
    "Added smoother episode unlocking with rewarded ads.",
    "Improved player controls, bottom sheets, and episode navigation.",
    "Enhanced provider loading, search, subtitles, and streaming stability."
  ]
};

const screenshotSources = Array.from({ length: 5 }, (_, index) =>
  `assets/screenshots/${index + 1}.webp`
);
let activeScreenshot = 0;
let toastTimer;

function byId(id) { return document.getElementById(id); }

function showToast(message) {
  const toast = byId("toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2800);
}

function applyConfig(config) {
  const data = { ...fallbackConfig, ...config };
  byId("appName").textContent = data.app_name;
  byId("appVersion").textContent = data.version;
  byId("appSize").textContent = data.size;
  byId("appDownloads").textContent = data.downloads;
  byId("lastUpdated").textContent = data.last_updated;

  const updateList = byId("whatsNew");
  updateList.replaceChildren();
  (data.whats_new || fallbackConfig.whats_new).forEach(item => {
    const li = document.createElement("li");
    li.textContent = item;
    updateList.appendChild(li);
  });

  const downloadButton = byId("downloadButton");
  const hasDownload = typeof data.apk_url === "string" && data.apk_url.trim().length > 0;
  downloadButton.href = hasDownload ? data.apk_url.trim() : "#";
  downloadButton.toggleAttribute("download", Boolean(hasDownload && !/^https?:/i.test(data.apk_url)));
  downloadButton.classList.toggle("is-disabled", !hasDownload);
  downloadButton.setAttribute("aria-disabled", String(!hasDownload));

  const structuredData = JSON.parse(byId("appStructuredData").textContent);
  structuredData.name = data.app_name;
  structuredData.softwareVersion = data.version;
  structuredData.fileSize = data.size;
  if (hasDownload) structuredData.downloadUrl = data.apk_url;
  byId("appStructuredData").textContent = JSON.stringify(structuredData);
}

async function loadConfig() {
  try {
    const response = await fetch("app-config.json", { cache: "no-store" });
    if (!response.ok) throw new Error("Config unavailable");
    applyConfig(await response.json());
  } catch (_) {
    applyConfig(fallbackConfig);
  }
}

function setModalState(modal, open) {
  modal.hidden = !open;
  document.body.classList.toggle("modal-open", open);
}

function openScreenshot(index) {
  activeScreenshot = (index + screenshotSources.length) % screenshotSources.length;
  byId("lightboxImage").src = screenshotSources[activeScreenshot];
  byId("lightboxImage").alt = `Bida Reels screenshot ${activeScreenshot + 1}`;
  byId("lightboxCount").textContent = `${activeScreenshot + 1} / ${screenshotSources.length}`;
  setModalState(byId("lightbox"), true);
}

byId("downloadButton").addEventListener("click", event => {
  if (event.currentTarget.getAttribute("aria-disabled") === "true") {
    event.preventDefault();
    showToast("Add your APK link in app-config.json first.");
  }
});

byId("termsButton").addEventListener("click", () => setModalState(byId("termsModal"), true));
document.querySelectorAll("[data-close-modal]").forEach(element =>
  element.addEventListener("click", () => setModalState(byId("termsModal"), false))
);

document.querySelectorAll(".shot").forEach(button =>
  button.addEventListener("click", () => openScreenshot(Number(button.dataset.index)))
);
document.querySelectorAll("[data-close-lightbox]").forEach(element =>
  element.addEventListener("click", () => setModalState(byId("lightbox"), false))
);
byId("previousScreenshot").addEventListener("click", () => openScreenshot(activeScreenshot - 1));
byId("nextScreenshot").addEventListener("click", () => openScreenshot(activeScreenshot + 1));

document.addEventListener("keydown", event => {
  if (!byId("lightbox").hidden) {
    if (event.key === "ArrowLeft") openScreenshot(activeScreenshot - 1);
    if (event.key === "ArrowRight") openScreenshot(activeScreenshot + 1);
    if (event.key === "Escape") setModalState(byId("lightbox"), false);
  } else if (!byId("termsModal").hidden && event.key === "Escape") {
    setModalState(byId("termsModal"), false);
  }
});

let touchStartX = 0;
byId("lightbox").addEventListener("touchstart", event => {
  touchStartX = event.changedTouches[0].clientX;
}, { passive: true });
byId("lightbox").addEventListener("touchend", event => {
  const distance = event.changedTouches[0].clientX - touchStartX;
  if (Math.abs(distance) > 50) openScreenshot(activeScreenshot + (distance < 0 ? 1 : -1));
}, { passive: true });

loadConfig();
