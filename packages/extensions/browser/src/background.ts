browser.runtime.onMessage.addListener(
  (message: { action: string; url: string }) => {
    console.log('[IG Downloader BG] Received message:', message);

    if (message.action === 'download') {
      console.log(
        '[IG Downloader BG] Initiating download for URL:',
        message.url
      );

      browser.downloads
        .download({
          url: message.url,
          filename: 'instagram_image.jpg',
          saveAs: true,
        })
        .then((downloadId) => {
          console.log(
            `[IG Downloader BG] Download started (ID: ${downloadId})`
          );
        })
        .catch((err) => {
          console.error('[IG Downloader BG] Download failed:', err);
        });
    } else {
      console.log(
        '[IG Downloader BG] Ignored message with unknown action:',
        message.action
      );
    }
  }
);
