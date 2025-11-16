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

let currentIndex = 0; // Первая вкладка
let intervalId; // Переменная для хранения интервала

// Функция для автоматического переключения
const startAutoSlider = () => {
    intervalId = setInterval(() => {
        hideTabsContentCards();
        showTabsContentCards(currentIndex);
        currentIndex = (currentIndex + 1) % tabsItems.length;
    }, 2000); // 2 сек
};
// Запуск автослайдера
startAutoSlider();

// Остановка слайдера при клике на вкладку
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