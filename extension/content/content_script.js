'use strict';

// Get all image ID's from 'onmouseover' attribute.
function getAllImages(elem) {
    return Array.from(elem.querySelectorAll('span.javascript_show')).map(s => {
        return s.getAttribute('onmouseover').split(',')[1].trim();
    });
}

// Searches all image switcers and adds a new link before them.
function addLinksToPopup() {
    const switchers = document.querySelectorAll('small.javascript_hide');
    switchers.forEach(s => {
        const link = document.createElement('a');
        link.classList.add('mnet-lightbox-link');
        link.href = '#allImages';
        link.textContent = 'Kaikki kuvat';
        link.addEventListener('click', openPopup);

        s.parentElement.appendChild(link);
    });
}

function getPrevIndex(imageIds, index) {
    return index === 0 ? imageIds.length - 1 : index - 1;
}

function getNextIndex(imageIds, index) {
    return index + 1 >= imageIds.length ? 0 : index + 1;
}

function setImage(imageIds, index) {
    return `https://muusikoiden.net/dyn/tori/${imageIds[index]}.jpg`;
}

// Destroys all old popups.
function destroyPopups() {
    const currentPopups = document.querySelectorAll('.mnet-lightbox');
    for (const currentPopup of currentPopups) {
        document.body.removeChild(currentPopup);
    }

    document.removeEventListener('keydown', keyDown);
}

function keyDown(e) {
    if (e.key === 'Escape') {
       destroyPopups();
    }
}

function openPopup(e) {
    destroyPopups();

    let index = 0;
    const currentId = e.currentTarget.parentElement.children[0].id;
    const imageIds = getAllImages(e.currentTarget.parentElement);

    // Construct the div
    const div = document.createElement('div');
    div.classList.add('mnet-lightbox');
    div.id = currentId;

    const imageLink = document.createElement('a');
    imageLink.classList.add('mnet-light-box-img-link');
    imageLink.href = setImage(imageIds, index);

    const image = document.createElement('img');
    image.classList.add('mnet-lightbox-img');
    image.src = setImage(imageIds, index);

    const prevButton = document.createElement('a');
    prevButton.classList.add('mnet-lightbox-next-prev-button');
    prevButton.textContent = '<';
    prevButton.addEventListener('click', e => {
        index = getPrevIndex(imageIds, index);
        image.src = setImage(imageIds, index);
    });

    const nextButton = document.createElement('a');
    nextButton.classList.add('mnet-lightbox-next-prev-button');
    nextButton.textContent = '>';
    nextButton.addEventListener('click', e => {
        index = getNextIndex(imageIds, index);
        image.src = setImage(imageIds, index);
    });

    imageLink.appendChild(image);

    div.appendChild(prevButton);
    div.appendChild(imageLink);
    div.appendChild(nextButton);

    document.body.appendChild(div);
    document.addEventListener('keydown', keyDown);
}

async function initPage() {
    addLinksToPopup();

    // Detect click outside autocomplete
    document.addEventListener('click', e => {
        if (e.target && e.target.classList.value.includes('mnet-lightbox')) {
            return;
        }

        destroyPopups();
    });
};

(async () => {
    if (document.readyState === 'complete' || (document.readyState !== 'loading' && !document.documentElement.doScroll)) {
        await initPage();
    } else {
        document.addEventListener('DOMContentLoaded', initPage);
    }
})();
