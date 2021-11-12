sessionState = 'idle';
selection = null;

function initListeners(element) {
    text = getNodeText(element);

    if (text === '' || text === ' ') {
        Array.from(element.children).forEach((child) => {
            initListeners(child)
        });

    } else {
        addListeners(element);
    }
}

function addListeners(element) {
    element.addEventListener('mouseover', (e) => {
        handleElementMouseOver(element, e);
    });

    element.addEventListener('mouseout', (e) => {
        handleElementMouseOut(element, e);
    });
}

function handleElementMouseOver(element, event) {
    if (sessionState === 'running') {
        if (selection !== element) {
            console.log('mouseover');

            selection = element;

            window.postMessage({
                action: 'hover',
                data: element.innerText,
                receiver: 'tribble_helper_injector',
                sender: 'tribble_helper_listener',
            });

            element.style.backgroundColor = 'green';
        }
    }
}

function handleElementMouseOut(element, event) {
    if (sessionState === 'running') {
        if (!element.contains(document.elementFromPoint(event.clientX, event.clientY))) {
            console.log('mouseout');

            selection = null;

            element.style.backgroundColor = '';
        }
    }
}

function getNodeText(element) {
    element = element.cloneNode(true);

    Array.from(element.children).forEach((child) => {
        element.removeChild(child);
    })

    if (element.innerText) {
        text = element.innerText;

        text = text.replaceAll('\n', '');
        text = text.replaceAll('\t', '');
        text = text.replaceAll(new RegExp('( {2,})', 'g'), '');

    } else {
        text = '';
    }

    return text;
}

function handleMessage(message) {
    switch (message.data.action) {
        case 'start':
            sessionState = 'running';
            break;

        case 'stop':
            sessionState = 'idle';
            break;
    }

}

initListeners(document.body);

window.addEventListener('message', (e) => {
    if (e.data.receiver === 'tribble_helper_listener') {
        handleMessage(e);
    }
});
