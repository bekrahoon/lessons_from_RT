// 1) Функция getRange
function getRange(start, end, step) {
    if (step === undefined) {
        step = 1; // шаг по умолчанию
    }
    let arr = [];
    if (start < end) {
        for (let i = start; i <= end; i += step) {
            arr.push(i);
        }
    } else {
        for (let i = start; i >= end; i -= step) {
            arr.push(i);
        }
    }
    return arr;
}

// 2) Функция переворота строки
function myReverse(str) {
    let res = "";
    for (let i = str.length - 1; i >= 0; i--) {
        res = res + str[i];
    }
    return res;
}

// 3) Маскирование карты
function maskCard(card, mask) {
    if (mask === undefined) {
        mask = "X";
    }
    let first = card.slice(0, 6);
    let last = card.slice(-4);
    let middle = "";
    for (let i = 0; i < card.length - 10; i++) {
        middle = middle + mask;
    }
    return first + middle + last;
}

// Примеры
console.log(getRange(1, 10));       // [1,2,3,4,5,6,7,8,9,10]
console.log(getRange(10, 30, 5));   // [10,15,20,25,30]
console.log(myReverse("123456"));   // "654321"
console.log(maskCard("4815154823541789"));     // "481515XXXXXX1789"
console.log(maskCard("4815154823541789", "*"));// "481515******1789"
