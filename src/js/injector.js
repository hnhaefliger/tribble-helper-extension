sessionState = 'idle';

injectListener();

chrome.runtime.onMessage.addListener((e) => {
    if (e.receiver === 'tribble_helper_injector') {
        handleMessage(e);
    }
});

window.addEventListener('message', (e) => {
    if (e.data.receiver === 'tribble_helper_injector') {
        handleWindowMessage(e);
    }
});

function handleWindowMessage(message) {
    switch (message.data.action) {
        case 'hover':
            break;
    }
}

function handleMessage(message) {
    switch (message.action) {
        case 'update':
            updateListener();
    }
}

function updateListener() {
    chrome.storage.local.get(['sessionState'], (data) => {
        sessionState = data.sessionState;

        switch (sessionState) {
            case 'idle':
                window.postMessage({
                    action: 'stop',
                    receiver: 'tribble_helper_listener',
                    sender: 'tribble_helper_injector',
                });
                break;

            case 'running':
                window.postMessage({
                    action: 'start',
                    receiver: 'tribble_helper_listener',
                    sender: 'tribble_helper_injector',
                });
                break
        }
    });
}

function injectListener() {
    listener = document.createElement('script');
    listener.src = chrome.runtime.getURL('js/listener.js');
    listener.onload = () => {
        updateListener();
        //listener.remove();
    };

    (document.head || document.documentElement).appendChild(listener);
}