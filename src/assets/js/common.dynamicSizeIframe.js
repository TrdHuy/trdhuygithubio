const iframeMap = new Map();
document.querySelectorAll('iframe').forEach(iframe => {
  iframeMap.set(iframe.id, iframe);
  iframe.onload = function () {
    const iframeDocument = iframe.contentDocument;
    if (iframe.documentContentResizeObserver) {
      iframe.documentContentResizeObserver.disconnect();
      iframe.documentContentResizeObserver.observe(iframeDocument.documentElement);
    } else {
      iframe.documentContentResizeObserver = new ResizeObserver(entries => {
        for (let entry of entries) {
          iframe.style.height = entry.target.scrollHeight + 'px';
          const observingWidthValue = iframe.getAttribute('observingWidth');
          if (observingWidthValue === 'true') {
            iframe.style.width = entry.target.scrollWidth + 'px';
          }
        }
      });
      iframe.documentContentResizeObserver.observe(iframeDocument.documentElement);
    }
  };
});

window.loadFormToIFrame = function loadForm(url, container) {
  const iframeId = container.id;
  const newUrl = url + '?iframeId=' + iframeId + '&shouldNotifyWidth=1';
  container.src = newUrl;
}

function getQueryParams() {
     const params = {};
     const queryString = window.location.search.substring(1);
     const regex = /([^&=]+)=([^&]*)/g;
     let m;
     while (m = regex.exec(queryString)) {
          params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
     }
     return params;
}
const params = getQueryParams();
const frameId = params.iframeId;
const shouldNotifyWidth = params.shouldNotifyWidth == '1';
window.frameId = frameId;