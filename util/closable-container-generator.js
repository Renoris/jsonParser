export function createClosableContainer($dom, text) {
    const $hideBtn = document.createElement('div');
    $hideBtn.innerText = text;
    $hideBtn.classList.add('font-bold');
    $hideBtn.addEventListener('click', () => {
        $contentWrapper.classList.toggle('hide');
    })

    const $contentWrapper = document.createElement('div');
    $contentWrapper.appendChild($dom);

    const $container = document.createElement('div');
    $container.appendChild($hideBtn);
    $container.appendChild($contentWrapper);

    return $container;
}