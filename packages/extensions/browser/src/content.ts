document.addEventListener('dblclick', (e: MouseEvent) => {
  const maxLevels = 3; // Change this number for how far to go up
  let target = e.target as HTMLElement;
  let currentLevel = 0;

  console.log('[IG Downloader] Initial double-clicked element:', target);

  let img: HTMLImageElement | null = null;

  while (target && currentLevel <= maxLevels) {
    if (target.tagName.toLowerCase() === 'img') {
      img = target as HTMLImageElement;
      break;
    }

    const foundImg = target.querySelector('img');
    if (foundImg) {
      img = foundImg;
      break;
    }

    target = target.parentElement as HTMLElement;
    currentLevel++;
  }

  if (!img) {
    console.log(
      '[IG Downloader] No <img> element found after traversing upward.'
    );
    return;
  }

  const url = img.src;
  console.log('[IG Downloader] Image URL detected:', url);

  // Send message to background script
  browser.runtime
    .sendMessage({ action: 'download', url })
    .then(() => {
      console.log('[IG Downloader] Message sent to background for download.');
    })
    .catch((err) => {
      console.error('[IG Downloader] Failed to send message:', err);
    });
});
