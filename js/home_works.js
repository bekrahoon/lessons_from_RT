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