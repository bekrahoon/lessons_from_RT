// === Проверка Gmail ===
    const gmailInput = document.getElementById('gmail_input');
    const gmailButton = document.getElementById('gmail_button');
    const gmailResult = document.getElementById('gmail_result');

    const gmailRegExp = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

    gmailButton.addEventListener('click', () => {
      const value = gmailInput.value.trim();
      if (gmailRegExp.test(value)) {
        gmailResult.textContent = 'Почта верна';
        gmailResult.style.color = 'green';
      } else {
        gmailResult.textContent = 'Почта не верна';
        gmailResult.style.color = 'red';
      }
    });

    // === Проверка ИИН ===
    const iinInput = document.getElementById('iin_input');
    const iinButton = document.getElementById('iin_button');
    const iinResult = document.getElementById('iin_result');

    const iinRegExp = /^\d{12}$/; // ИИН должен состоять из 12 цифр

    iinButton.addEventListener('click', () => {
      const iin = iinInput.value.trim();

      if (!iinRegExp.test(iin)) {
        iinResult.textContent = 'ИИН должен содержать 12 цифр';
        iinResult.style.color = 'red';
        return;
      }

      const year = parseInt(iin.slice(0, 2));
      const month = parseInt(iin.slice(2, 4));
      const day = parseInt(iin.slice(4, 6));
      const centuryCode = parseInt(iin[6]);

      // Определяем век по коду (1–6)
      let fullYear;
      if (centuryCode === 1 || centuryCode === 2) fullYear = 1800 + year;
      else if (centuryCode === 3 || centuryCode === 4) fullYear = 1900 + year;
      else if (centuryCode === 5 || centuryCode === 6) fullYear = 2000 + year;
      else fullYear = NaN;

      // Проверяем дату рождения
      const date = new Date(fullYear, month - 1, day);
      const isValidDate =
        date.getFullYear() === fullYear &&
        date.getMonth() === month - 1 &&
        date.getDate() === day;

      if (!isValidDate) {
        iinResult.textContent = 'Некорректная дата рождения в ИИН';
        iinResult.style.color = 'red';
        return;
      }

      iinResult.textContent = 'ИИН корректен';
      iinResult.style.color = 'green';
    });



    // move_block
const parent = document.querySelector('.parent_block');
const child = document.querySelector('.child_block');

let isDragging = false;
let offsetX = 0;
let offsetY = 0;

child.addEventListener('mousedown', (e) => {
    isDragging = true;

    const rect = child.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;

    document.body.style.userSelect = 'none';
});

document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;

    const parentRect = parent.getBoundingClientRect();

    let x = e.clientX - parentRect.left - offsetX;
    let y = e.clientY - parentRect.top - offsetY;

    x = Math.max(0, Math.min(x, parentRect.width - child.offsetWidth));
    y = Math.max(0, Math.min(y, parentRect.height - child.offsetHeight));

    child.style.left = `${x}px`;
    child.style.top = `${y}px`;
});

document.addEventListener('mouseup', () => {
    isDragging = false;
    document.body.style.userSelect = '';
});



// stopwatch


let minutes = 0;
let seconds = 0;
let milliseconds = 0;

let interval = null;

const minutesEl = document.getElementById('minutesS');
const secondsEl = document.getElementById('secondsS');
const msEl = document.getElementById('ml-secondsS');

const startBtn = document.getElementById('start');
const stopBtn = document.getElementById('stop');
const resetBtn = document.getElementById('reset');

function updateDisplay() {
    minutesEl.textContent = minutes.toString().padStart(2, '0');
    secondsEl.textContent = seconds.toString().padStart(2, '0');
    msEl.textContent = milliseconds.toString().padStart(2, '0');
}

function startTimer() {
    if (interval) return; // не запускаем заново если уже идёт
    interval = setInterval(() => {
        milliseconds += 1;
        if (milliseconds >= 100) { // считаем сотые доли секунды
            milliseconds = 0;
            seconds += 1;
        }
        if (seconds >= 60) {
            seconds = 0;
            minutes += 1;
        }
        updateDisplay();
    }, 10); // каждые 10 мс
}

function stopTimer() {
    clearInterval(interval);
    interval = null;
}

function resetTimer() {
    stopTimer();
    minutes = 0;
    seconds = 0;
    milliseconds = 0;
    updateDisplay();
}

// События кнопок
startBtn.addEventListener('click', startTimer);
stopBtn.addEventListener('click', stopTimer);
resetBtn.addEventListener('click', resetTimer);
