// напишите игру где нужно угадать число которое загадал компьютер
// компьютер загадывает число от 1 до 100
do {
    let computerNumber = Math.floor(Math.random() * 100) + 1;
    let userGuess = 0;

    while (userGuess !== computerNumber) {
        userGuess = parseInt(prompt("Угадайте число от 1 до 100:"));
        if (userGuess < computerNumber) {
            alert("Слишком маленькое число!");
        } else if (userGuess > computerNumber) {
            alert("Слишком большое число!");
        } else {
            alert("Поздравляю! Вы угадали число.");
        }
    }
} while (confirm("Хотите сыграть еще раз?"));