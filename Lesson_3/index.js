




// // управляющие операторы циклов break continue
// for (var i = 1; i <= 10; i++) {
//     if (i === 3) continue; // на 3м шаге продолжаем цикл, но пропускаем отображение
//     if (i === 10) break;   // на 10м шаге останавливаем цикл
//     console.log(i);
// }



// // оператор ++
// var num = 5;
// console.log(num++);
// console.log(num);

// var num2 = 5;
// console.log(++num2);


// // for of , for со счетчиками
// var numbers = [10, 20, 30];

// // for of
// for (var i of numbers) {
//     console.log(' Элементы: ', i);
// }
// // for со счетчиками
// for (var i = 0; i < numbers.length; i++) {
//     console.log('Индексы: ' + i + ' значение: ' + numbers[i]);
// }

// // Массивы
// var fruits = ["apple", "banana", "cherry"];
// // Индексация
// console.log(fruits[0]);
// console.log(fruits[2]);

// // Длина массива
// console.log(fruits.length + ' Количество элементов в массиве');

// // Добавление элемента в конец массива
// fruits.push("orange");
// console.log(fruits + ' Добавлен элемент в конец массива');

// // Добавление элемента в начало массива
// fruits.unshift("mango");
// console.log(fruits + ' Добавлен элемент в начало массива');

// // Изменение элемента по индексу
// fruits[2] = "strawberry";
// console.log(fruits + ' Изменен элемент по индексу 1');