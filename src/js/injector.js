listener = document.createElement('script');
listener.src = chrome.runtime.getURL('js/listener.js');
listener.onload = function() {
    this.remove();
};

(document.head || document.documentElement).appendChild(listener);

window.addEventListener('message', (e) => {
    console.log(e);
});