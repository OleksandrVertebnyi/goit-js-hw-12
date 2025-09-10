import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import { getImagesByQuery } from './js/pixabay-api.js';
import {
    createGallery,
    clearGallery,
    showLoader,
    hideLoader,
    showLoadMoreButton,
    hideLoadMoreButton,
} from './js/render-functions.js';

const form = document.querySelector('.form');
const loadMoreBtn = document.querySelector('.load-more');

let currentQuery = '';
let currentPage = 1;
let totalHits = 0;

form.addEventListener('submit', async e => {
    e.preventDefault();
    currentQuery = e.target.elements['search-text'].value.trim();

    if (!currentQuery) {
        iziToast.warning({
            title: 'Warning',
            message: 'Please enter a search query!',
            position: 'topRight',
        });
        return;
    }

    clearGallery();
    hideLoadMoreButton();
    currentPage = 1;

    await fetchAndRenderImages();
});

loadMoreBtn.addEventListener('click', async () => {
    currentPage += 1;
    await fetchAndRenderImages();
});

async function fetchAndRenderImages() {
    showLoader();
    try {
        const data = await getImagesByQuery(currentQuery, currentPage);

        if (data.hits.length === 0) {
            iziToast.info({
                title: 'No results',
                message: 'No images found for your query.',
                position: 'topRight',
            });
            hideLoadMoreButton();
            return;
        }

        createGallery(data.hits);
        totalHits = data.totalHits;

        if (currentPage * 15 >= totalHits) {
            hideLoadMoreButton();
            iziToast.info({
                title: 'End of results',
                message: "We're sorry, but you've reached the end of search results.",
                position: 'topRight',
            });
        } else {
            showLoadMoreButton();
        }

        if (currentPage > 1) {
            const { height: cardHeight } =
                document.querySelector('.gallery').firstElementChild.getBoundingClientRect();
            window.scrollBy({ top: cardHeight * 2, behavior: 'smooth' });
        }
    } catch (error) {
        iziToast.error({
            title: 'Error',
            message: 'Something went wrong. Please try again.',
            position: 'topRight',
        });
        console.error(error);
    } finally {
        hideLoader();
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const query = params.get('search-text');

    if (query) {
        document.querySelector('input[name="search-text"]').value = query;
        currentQuery = query;
        currentPage = 1;
        clearGallery();

        showLoader();
        try {
            const data = await getImagesByQuery(currentQuery, currentPage);
            createGallery(data.hits);

            if (data.totalHits > 15) {
                showLoadMoreButton();
            }
        } catch (error) {
            iziToast.error({ message: 'Error fetching images' });
        } finally {
            hideLoader();
        }
    }
});

