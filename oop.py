# словарь флагов
flags = {
    'ru': ['red', 'blue', 'white'],
    'kg': ['red', 'yellow'],
    'ua': ['red', 'blue'],
    'uk': ['yellow', 'blue'],
    'kz': ['blue', 'yellow'],
    # добавил еще 3
    'us': ['red', 'white', 'blue'],
    'de': ['black', 'red', 'yellow'],
    'fr': ['blue', 'white', 'red']
}

while True:
    colors = input("Введите цвета (через пробел), либо 'exit' чтобы выйти: ").lower()
    if colors == "exit":
        break

    input_colors = set(colors.split())
    result = []

    for country, fl_colors in flags.items():
        if input_colors.issubset(set(fl_colors)):
            result.append(country)

    if result:
        print("Найдены домены:", result)
    else:
        print("Ничего не найдено")
