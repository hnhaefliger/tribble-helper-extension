sessionState = 'idle';
selection = null;

initListeners(document.body);

window.addEventListener('message', (e) => {
    if (e.data.receiver === 'tribble_helper_listener') {
        handleMessage(e);
    }
});

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
            selection = element;
            createPopup(element);
        }
    }
}

function handleElementMouseOut(element, event) {
    if (sessionState === 'running') {
        newElement = document.elementFromPoint(event.clientX, event.clientY);

        if (!element.contains(newElement) && !newElement.id.includes('tribble-helper-box-')) {
            selection = null;
            destroyPopup(element);
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

function createPopup(element) {
    displayBox(element);
    element.style.backgroundColor = 'green';

    /*
    fetch('http://localhost:8000/api/text_analysis/keywords/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            text: element.innerText
        })
    })
    .then((response) => {
        response.json();
    })
    .then((data) => {
        // box will be displayed here later
        // console.log(data);
    });
    */
}

function destroyPopup(element) {
    document.body.removeChild(document.getElementById(element.dataset.infobox_id));
    element.style.backgroundColor = '';
}

function displayBox(element) {
    box = document.createElement('div');
    box.id = 'tribble-helper-box-' + createId('10');
    element.dataset.infobox_id = box.id
    box.style.position = 'absolute';
    box.style.backgroundColor = 'red';
    box.style.zIndex = 1000;

    dims = element.getBoundingClientRect();
    placement = Math.max(dims.left, dims.top, window.innerWidth - dims.right, window.innerHeight - dims.bottom);

    switch (placement) {
        case dims.left:
            box.style.width = dims.left + 'px';
            box.style.height = dims.height + 'px';
            box.style.top = window.scrollY + dims.top + 'px';
            box.style.left = window.scrollX + 'px';
            box.dataset.placement = 'left';
            break;

        case dims.top:
            box.style.width = dims.width + 'px';
            box.style.height = dims.top + 'px';
            box.style.top = window.scrollY + 'px';
            box.style.left = window.scrollX + dims.left + 'px';
            box.dataset.placement = 'top';
            break;

        case window.innerWidth - dims.right:
            box.style.width = window.innerWidth - dims.right + 'px';
            box.style.height = dims.height + 'px';
            box.style.top = window.scrollY + dims.top + 'px';
            box.style.left = window.scrollX + dims.left + dims.width + 'px';
            box.dataset.placement = 'right';
            break;

        case window.innerHeight - dims.bottom:
            box.style.width = dims.width + 'px';
            box.style.height = window.innerHeight - dims.bottom + 'px';
            box.style.top = window.scrollY + dims.top + dims.height  + 'px';
            box.style.left = window.scrollX + dims.left + 'px';
            box.dataset.placement = 'bottom';
            break;
    }
    
    document.body.appendChild(box);
    
    box.addEventListener('mouseover', (e) => {
        handleElementMouseOver(element, e);
    });

    box.addEventListener('mouseout', (e) => {
        handleElementMouseOut(element, e);
    });
}

function createId(length) {
    result = '';
    characters = 'abcdefghijklmnopqrstuvwxyz';

    for (var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
   }
   return result;
}