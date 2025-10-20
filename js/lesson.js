// Проверка номера
const phoneInput = document.querySelector('#phone_input');
const phoneButton = document.querySelector('#phone_button');
const phoneSpan = document.querySelector('#phone_result');

// Регулярки для Кыргызстана и России
const kgRegExp = /^\+996[2579]\d{7}$/;                  // пример: +996550644772
const ruRegExp = /^\+7\s?\d{3}\s?\d{3}-\d{2}-\d{2}$/;   // пример: +7 999 123-45-67

phoneButton.addEventListener('click', () => {
    const value = phoneInput.value.trim();

    if (kgRegExp.test(value) || ruRegExp.test(value)) {
        phoneSpan.innerHTML = 'Этот номер существует';
        phoneSpan.style.color = 'green';
    } else {
        phoneSpan.innerHTML = 'Этот номер не существует';
        phoneSpan.style.color = 'red';
    }
});
