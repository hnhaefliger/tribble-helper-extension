chrome.runtime.onInstalled.addListener((e) => {
    resetSession();
});

chrome.runtime.onMessage.addListener((e) => {
    if (e.receiver === 'tribble_helper_background'){
        handleMessage(e);
    }
});

function handleMessage(message) {
  switch (message.action) {
    case 'start':
      chrome.storage.local.set({sessionState: 'running'}, () => {
        updatePopup();
        updateTabs();
      });
      break;

    case 'stop':
      chrome.storage.local.set({sessionState: 'idle'}, () => {
        updatePopup();
        updateTabs();
      });
      break;
  }
}

function resetSession() {
  chrome.storage.local.set({sessionState: 'idle'});
}

function updatePopup() {
  chrome.runtime.sendMessage({
    action: 'update',
    receiver: 'tribble_helper_popup',
    sender: 'tribble_helper_background',
  });
}

function updateTabs() {
  chrome.tabs.query({}, (tabs) => {
    tabs.forEach((tab) => {
      chrome.tabs.sendMessage(tab.id, {
        action: 'update',
        receiver: 'tribble_helper_injector',
        sender: 'tribble_helper_background',
      });
    });
  });
}