const toggle = document.getElementById("toggleCopy");

chrome.storage.sync.get(["copyEnabled"], (data) => {
  toggle.checked = data.copyEnabled !== false;
});

toggle.addEventListener("change", () => {
  chrome.storage.sync.set({ copyEnabled: toggle.checked });
});