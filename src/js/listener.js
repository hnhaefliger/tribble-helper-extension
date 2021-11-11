
Array.from(document.getElementsByTagName('p')).forEach((element) => {
    element.addEventListener('mouseover', (e) => {
        handleElementMouseOver(element, e);
    });

    element.addEventListener('mouseout', (e) => {
        handleElementMouseOut(element, e);
    });
});

function handleElementMouseOver(element, event) {
    element.style.backgroundColor = 'green';
}

function handleElementMouseOut(element, event) {
    element.style.backgroundColor = '';
}