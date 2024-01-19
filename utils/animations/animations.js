import gsap from 'gsap';

const ANIMATE_ON_SHOW_SEARCH = 0.5;
const ANIMATE_ON_HIDE_SEARCH = 0.2;
const ANIMATE_LOADING = 0.5;
const DELAY_TO_HIDE_ALERT = 1;

let searchBarIsOpened = false;
let isLoading = false;

export function animateShowSearchBar() {
    if (searchBarIsOpened) return;
    searchBarIsOpened = true;
    gsap.fromTo('.search', {
        y: '-100%',
    }, {
        y: '0%',
        duration: ANIMATE_ON_SHOW_SEARCH
    });
    gsap.fromTo('.back-drop-search', {
        opacity: 0,
        pointerEvents: 'none'
    }, {
        opacity: 1,
        pointerEvents: 'all',
        duration: ANIMATE_ON_SHOW_SEARCH
    });
}

export function animateHideSearchBar() {
    if (!searchBarIsOpened) return;
    searchBarIsOpened = false;
    gsap.fromTo('.search', {
        y: '0%',
    }, {
        y: '-100%',
        duration: ANIMATE_ON_HIDE_SEARCH
    });
    gsap.fromTo('.back-drop-search', {
        opacity: 1,
        pointerEvents: 'none'
    }, {
        opacity: 0,
        pointerEvents: 'none',
        duration: ANIMATE_ON_HIDE_SEARCH
    });
}

export function animateShowLoading() {
    if (isLoading) return;
    isLoading = true;
    gsap.fromTo('.back-drop-loading', {
        opacity: 0,
        pointerEvents: 'none'
    }, {
        opacity: 1,
        pointerEvents: 'all',
        duration: ANIMATE_LOADING
    });
}

export function animateHideLoading() {
    if (!isLoading) return;
    isLoading = false;
    gsap.fromTo('.back-drop-loading', {
        opacity: 1,
        pointerEvents: 'none'
    }, {
        opacity: 0,
        pointerEvents: 'none',
        duration: ANIMATE_LOADING
    });
}

export function animateShowAlert() {
    gsap.fromTo('.alert', {
        opacity: 0,
        y: 20
    }, {
        opacity: 1,
        y: -20,
        duration: ANIMATE_ON_SHOW_SEARCH
    }).then(e => {
        animateHideAlert();
    });
}

function animateHideAlert() {
    gsap.fromTo('.alert', {
        opacity: 1,
        y: -20,
    }, {
        opacity: 0,
        y: 20,
        duration: ANIMATE_ON_SHOW_SEARCH,
        delay: DELAY_TO_HIDE_ALERT
    });
}