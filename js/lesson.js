// Регулярки для Кыргызстана и России
const kgRegExp = /^\+996\s[2579]\d{2}\s\d{2}-\d{2}-\d{2}$/; // пример: +996 550 64-47-72
const ruRegExp = /^\+7\s?\d{3}\s?\d{3}-\d{2}-\d{2}$/; // пример: +7 999 123-45-67

const phoneButtons = document.querySelectorAll('.phone_button');
const phoneInputs = document.querySelectorAll('.phone_input');
const phoneSpans = document.querySelectorAll('.phone_result');

phoneButtons.forEach((button, index) => {
    button.addEventListener('click', () => {
        const value = phoneInputs[index].value.trim(); 
        const span = phoneSpans[index]; 

        let regExpToUse;
        if (index === 0) {
            regExpToUse = kgRegExp; 
        } else {
            regExpToUse = ruRegExp; 
        }

        if (regExpToUse.test(value)) {
            span.innerHTML = 'Этот номер существует';
            span.style.color = 'green';
        } else {
            span.innerHTML = 'Этот номер не существует';
            span.style.color = 'red';
        }
    });
});

// TAB SLIDER
const tabsContentCards = document.querySelectorAll('.tab_content_block');
const tabsItems = document.querySelectorAll('.tab_content_item');
const tabsItemsParents = document.querySelector('.tab_content_items');

const hideTabsContentCards = () => {
    tabsContentCards.forEach((tabsContentCard) => {
        tabsContentCard.style.display = 'none';
    });
    tabsItems.forEach((tabItem) => {
        tabItem.classList.remove('tab_content_item_active');
    });
};

const showTabsContentCards = (indexElement = 0) => {
    tabsContentCards[indexElement].style.display = 'block';
    tabsItems[indexElement].classList.add('tab_content_item_active');
};

hideTabsContentCards();
showTabsContentCards();

tabsItemsParents.onclick = (event) => {
    if (event.target.classList.contains('tab_content_item')) {
        tabsItems.forEach((tabItem, tabItemIndex) => {
            if (event.target === tabItem) {
                hideTabsContentCards();
                showTabsContentCards(tabItemIndex);
            }
        });
    }
};

let currentIndex = 0; 
let intervalId; 

const startAutoSlider = () => {
    intervalId = setInterval(() => {
        hideTabsContentCards();
        showTabsContentCards(currentIndex);
        currentIndex = (currentIndex + 1) % tabsItems.length;
    }, 2000);
};
startAutoSlider();

tabsItemsParents.onclick = (event) => {
    clearInterval(intervalId);
    if (event.target.classList.contains('tab_content_item')) {
        tabsItems.forEach((tabItem, tabItemIndex) => {
            if (event.target === tabItem) {
                hideTabsContentCards();
                showTabsContentCards(tabItemIndex);
                currentIndex = tabItemIndex;
                startAutoSlider();
            }
        });
    }
};


// CONVERTER
const somInput = document.querySelector('#som');
const usdInput = document.querySelector('#usd');
const eurInput = document.querySelector('#eur');

const eurRate = 103.01; 

let isUpdating = false;

function updateFromSom() {
    if (!somInput.value) {
        usdInput.value = '';
        eurInput.value = '';
        return;
    }
    usdInput.value = (parseFloat(somInput.value) / usdRate).toFixed(2);
    eurInput.value = (parseFloat(somInput.value) / eurRate).toFixed(2);
}

function updateFromUsd() {
    if (!usdInput.value) {
        somInput.value = '';
        eurInput.value = '';
        return;
    }
    somInput.value = (parseFloat(usdInput.value) * usdRate).toFixed(2);
    eurInput.value = (parseFloat(somInput.value) / eurRate).toFixed(2);
}

function updateFromEur() {
    if (!eurInput.value) {
        somInput.value = '';
        usdInput.value = '';
        return;
    }
    somInput.value = (parseFloat(eurInput.value) * eurRate).toFixed(2);
    usdInput.value = (parseFloat(somInput.value) / usdRate).toFixed(2);
}

somInput.addEventListener('input', () => {
    if (isUpdating) return;
    isUpdating = true;
    updateFromSom();
    isUpdating = false;
});

usdInput.addEventListener('input', () => {
    if (isUpdating) return;
    isUpdating = true;
    updateFromUsd();
    isUpdating = false;
});

eurInput.addEventListener('input', () => {
    if (isUpdating) return;
    isUpdating = true;
    updateFromEur();
    isUpdating = false;
});


// Card Switcher
document.addEventListener('DOMContentLoaded', () => {
    let currentIndex = 0;

    const prevBtn = document.querySelector('#btn-prev');
    const nextBtn = document.querySelector('#btn-next');
    const cards = document.querySelectorAll('.cards-container .card');

    if (!prevBtn || !nextBtn || cards.length === 0) {
        console.error('Card Switcher elements not found.');
        return;
    }

    function updateCard() {
        cards.forEach((card, index) => {
            if (index === currentIndex) {
                card.classList.add('active');
            } else {
                card.classList.remove('active');
            }
        });
    }

    // Показываем первую карточку
    updateCard();

    nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % cards.length;
        updateCard();
    });

    prevBtn.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + cards.length) % cards.length;
        updateCard();
    });
});
