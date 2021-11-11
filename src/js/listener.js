function initListeners(element) {
    if (getNodeText(element) === '') {
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
    element.style.backgroundColor = 'green';
}

function handleElementMouseOut(element, event) {
    element.style.backgroundColor = '';
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

initListeners(document.body);