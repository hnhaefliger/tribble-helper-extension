sessionIcon = document.getElementById('session-icon');
sessionState = 'idle';

sessionIcon.addEventListener('click', (e) => {
    e.preventDefault();

    switch (sessionState) {
        case 'idle':
            chrome.runtime.sendMessage({
                action: 'start',
                receiver: 'tribble_helper_background',
                sender: 'tribble_helper_popup',
            });
            break;

        case 'running':
            chrome.runtime.sendMessage({
                action: 'stop',
                receiver: 'tribble_helper_background',
                sender: 'tribble_helper_popup',
            });
            break
    }
});

chrome.runtime.onMessage.addListener((e) => {
    if (e.receiver === 'tribble_helper_popup') {
        handleMessage(e);
    }
});

function handleMessage(message) {
  switch (message.action) {
    case 'update':
        updateDisplay();
        break;
  }
}

function updateDisplay() {
    chrome.storage.local.get(['sessionState'], (data) => {
        sessionState = data.sessionState;

        switch (sessionState) {
            case 'idle':
                sessionIcon.classList.add('ion-ios-barcode-outline');
                sessionIcon.classList.remove('ion-ios-eye-outline');
                break;

            case 'running':
                sessionIcon.classList.remove('ion-ios-barcode-outline');
                sessionIcon.classList.add('ion-ios-eye-outline');
                break;
        }
    });
}

updateDisplay();