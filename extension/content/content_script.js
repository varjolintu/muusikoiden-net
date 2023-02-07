'use strict';

const ImageBox = {
    index: 0,
    indexText: '',
    image: undefined,
    imageIds: [],

    create(parentElement) {
        this.index = 0;
        this.imageIds = getAllImages(parentElement);
    
        this.image = document.createElement('img');
        this.image.classList.add('mnet-lightbox-img');
        this.image.src = this.getCurrentImage();
    
        this.indexText = document.createElement('div');
        this.indexText.classList.add('mnet-lightbox-index-text');
        this.indexText.textContent = this.getIndexText();
    },

    getCurrentImage() {
        return `https://muusikoiden.net/dyn/tori/${this.imageIds[this.index]}.jpg`;
    },

    getIndexText() {
        return `${this.index+1}/${this.imageIds.length}`;
    },

    getNextIndex() {
        return this.index + 1 >= this.imageIds.length ? 0 : this.index + 1;
    },

    getPrevIndex() {
        return this.index === 0 ? this.imageIds.length - 1 : this.index - 1;
    },

    selectNext() {
        this.index = this.getNextIndex();
        this.image.src = this.getCurrentImage();
        this.indexText.textContent = this.getIndexText();
    },
    
    selectPrev() {
        this.index = this.getPrevIndex();
        this.image.src = this.getCurrentImage();
        this.indexText.textContent = this.getIndexText();
    },
}

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
    } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        ImageBox.selectPrev();
    } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        ImageBox.selectNext();
    }
}

function openPopup(e) {
    destroyPopups();
    ImageBox.create(e.currentTarget.parentElement);

    const prevButton = document.createElement('a');
    prevButton.classList.add('mnet-lightbox-next-prev-button');
    prevButton.textContent = '<';
    prevButton.addEventListener('click', e => {
        ImageBox.selectPrev();
    });

    const nextButton = document.createElement('a');
    nextButton.classList.add('mnet-lightbox-next-prev-button');
    nextButton.textContent = '>';
    nextButton.addEventListener('click', e => {
        ImageBox.selectNext();
    });

    // Construct the div
    const div = document.createElement('div');
    div.classList.add('mnet-lightbox');
    div.appendChild(prevButton);
    div.appendChild(ImageBox.image);
    div.appendChild(nextButton);
    div.appendChild(ImageBox.indexText);

    document.body.appendChild(div);
    document.addEventListener('keydown', keyDown);
}

(async () => {
    addLinksToPopup();

    // Detect click outside autocomplete
    document.addEventListener('click', e => {
        if (e.target && e.target.classList.value.includes('mnet-lightbox')) {
            return;
        }

        destroyPopups();
    });
})();
