(() => {
    'use strict'

    // * Configs
    const ACCESS_KEY = 'PnvTKflLI3Gdc3aYRMLw2lCitl932jeTYMpuKZrBXqk';
    const photosUrl = 'https://api.unsplash.com/photos/random';
    const optionsRequest = {
        headers: {
            'Authorization': `Client-ID ${ACCESS_KEY}`,
        }
    }

    let actualSection = '#all-btn';
    let queryInitial = 'all';
    // * Elements
    const searchBtn = document.querySelector('#search-btn');
    const searchInputBtn = document.querySelector('#search-input-btn');
    const showMoreBtn = document.querySelector('#show-more');
    const divFloatMenu = document.querySelector('.menu-btns');
    const divPopupSearch = document.querySelector('#popup-search');
    const divClosePopup = document.querySelector('.close-popup');
    const divMenuNavbar = document.querySelector('.menu-navbar');
    const divContentMenu = document.querySelector('.content-menu');
    const divError = document.querySelector('.error-message');
    const divPhotos = document.querySelector('.grid-container');
    const searchInput = document.querySelector('#search-input');

    // * Functions 
    const getRandomPhotos = async (count, query = 'all') => {
        try {
            const response = await fetch(`${photosUrl}?count=${count}&query=${query}`, optionsRequest);
            const data = await response.json();
            return data;
        } catch (error) {
            alert(error)
        }
    }

    const addPhotos = (photosArray) => {
        if (document.querySelector('#error-message')) {
            document.querySelector('#error-message').remove();
        }
        showMoreBtn.classList.remove('hidden');
        photosArray.forEach((img) => {
            const image = document.createElement('img');
            image.src = img.urls.regular;
            image.alt = img.alt_description;
            image.classList.add('grid-item');
            const figure = document.createElement('figure');
            figure.append(image);

            divPhotos.append(figure);
        });
    }

    const init = async () => {
        const photos = await getRandomPhotos(9);
        addPhotos(photos)
    }

    const getPhotosBy = async (query) => {
        const photos = await getRandomPhotos(9, query);
        if (photos.errors) {
            if (document.querySelector('#error-message')) {
                document.querySelector('#error-message').remove();
            }
            divPhotos.innerHTML = '';
            const errorElement = document.createElement('h1');
            errorElement.id = 'error-message';
            errorElement.classList.add('error-message');
            errorElement.innerHTML = `${photos.errors[0]} <br> With query: <span class="text-bold">${query}</span.`;
            showMoreBtn.classList.add('hidden');
            divError.classList.remove('hidden');
            divError.appendChild(errorElement);
        } else {
            divError.classList.add('hidden');
            divPhotos.innerHTML = '';
            addPhotos(photos);
        }
    }

    const showMore = async () => {
        const photos = await getRandomPhotos(6, queryInitial);
        addPhotos(photos);
    }

    const navigationMenu = (event) => {
        const btn = event.target;

        if (btn.tagName != 'A') return
        if (btn.classList.contains('active')) {
            actualSection = `#${btn.id}`;
            return
        }

        const beforeBtns = document.querySelectorAll(actualSection);
        beforeBtns.forEach(btn => {
            btn.classList.toggle('active');

        })
        const afterBtns = document.querySelectorAll(`#${btn.id}`);
        afterBtns.forEach(btn => {
            btn.classList.toggle('active');
        })
        actualSection = `#${btn.id}`;

        divPhotos.innerHTML = '';

        queryInitial = btn.id.split('-')[0];
        getPhotosBy(queryInitial);


    }

    // * Events 
    searchBtn.addEventListener('click', () => {
        divPopupSearch.classList.add('active');
    })
    showMoreBtn.addEventListener('click', () => {
        showMore();
    })

    searchInputBtn.addEventListener('click', () => {
        let input = searchInput.value;
        let value = input.replace(/\s+/g, '+');
        getPhotosBy(value);
        divPopupSearch.classList.remove('active');
    })

    divClosePopup.addEventListener('click', () => {
        divPopupSearch.classList.remove('active')
    })

    searchInput.addEventListener('keydown', (e) => {
        const letter = e.wich || e.keyCode || 0;
        if (letter === 13) {
            let input = searchInput.value;
            let value = input.replace(/\s+/g, '+');
            getPhotosBy(value);
            divPopupSearch.classList.remove('active');
        }
    })

    divFloatMenu.addEventListener('click', (e) => {
        navigationMenu(e);
    })

    divMenuNavbar.addEventListener('click', (e) => {
        navigationMenu(e);
    })

    divContentMenu.addEventListener('click', (e) => {
        navigationMenu(e);
    })



    init();
})();