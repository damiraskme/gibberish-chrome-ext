chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "convertToRussian",
    title: "Convert to Russian Keyboard Text",
    contexts: ["selection"]
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "convertToRussian") {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: convertSelectionToRussian
    });
  }
});

function convertSelectionToRussian() {
  const enToRuMap = {
    'q': 'й', 'w': 'ц', 'e': 'у', 'r': 'к', 't': 'е',
    'y': 'н', 'u': 'г', 'i': 'ш', 'o': 'щ', 'p': 'з',
    'a': 'ф', 's': 'ы', 'd': 'в', 'f': 'а', 'g': 'п',
    'h': 'р', 'j': 'о', 'k': 'л', 'l': 'д',
    'z': 'я', 'x': 'ч', 'c': 'с', 'v': 'м', 'b': 'и',
    'n': 'т', 'm': 'ь',

    'Q': 'Й', 'W': 'Ц', 'E': 'У', 'R': 'К', 'T': 'Е',
    'Y': 'Н', 'U': 'Г', 'I': 'Ш', 'O': 'Щ', 'P': 'З',
    'A': 'Ф', 'S': 'Ы', 'D': 'В', 'F': 'А', 'G': 'П',
    'H': 'Р', 'J': 'О', 'K': 'Л', 'L': 'Д',
    'Z': 'Я', 'X': 'Ч', 'C': 'С', 'V': 'М', 'B': 'И',
    'N': 'Т', 'M': 'Ь',

    '`': 'ё', '~': 'Ё', '@': '"', '#': '№', '$': ';',
    '^': ':', '&': '?', '?': ',', '[': 'х', ']': 'ъ',
    '{': 'Х', '}': 'Ъ', ';': 'ж', ':': 'Ж', '\'': 'э',
    '"': 'Э', ',': 'б', '.': 'ю', '/': '.', '|': '/'
  };

  chrome.storage.sync.get(["copyEnabled"], (data) => {
    const selection = window.getSelection();
    const text = selection.toString();
    const converted = text.split('').map(c => enToRuMap[c] || c).join('');

    if (!converted) return;

    if (data.copyEnabled !== false) {
      navigator.clipboard.writeText(converted).catch(console.error);
    }

    const existing = document.getElementById("ru-converter-popup");
    if (existing) existing.remove();

    const rect = selection.getRangeAt(0).getBoundingClientRect();
    const dialog = document.createElement("div");
    dialog.id = "ru-converter-popup";
    dialog.textContent = converted;
    Object.assign(dialog.style, {
      position: "fixed",
      left: `${rect.left + window.scrollX}px`,
      top: `${rect.top + window.scrollY - 30}px`,
      padding: "6px 12px",
      background: "#222",
      color: "#fff",
      borderRadius: "8px",
      fontSize: "14px",
      zIndex: "9999",
      boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
      transition: "opacity 0.4s ease",
      opacity: "1"
    });

    document.body.appendChild(dialog);

    const fadeOut = () => {
      dialog.style.opacity = "0";
      setTimeout(() => dialog.remove(), 400);
      document.removeEventListener("click", fadeOut);
    };

    setTimeout(fadeOut, 3000);
    document.addEventListener("click", fadeOut);
  });
}