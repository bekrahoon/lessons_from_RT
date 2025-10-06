# Игра "Виселица" (Hangman)
# Лаб 6 - Функции

import random

# Глобальные переменные для статистики
total_games = 0
total_wins = 0
total_losses = 0

# Список слов для игры
WORDS = [
    'ФУНКЦИЯ', 'ПРОГРАММА', 'КОМПЬЮТЕР', 'КЛАВИАТУРА',
    'МОНИТОР', 'ИНТЕРНЕТ', 'АЛГОРИТМ', 'ПЕРЕМЕННАЯ', 'ЦИКЛ',
    'МАССИВ', 'СТРОКА', 'СЛОВАРЬ', 'СПИСОК', 'ПИТОН'
    ]

def draw_hangman(mistakes):
    """Рисует виселицу в зависимости от количества ошибок"""
    stages = [
        """
           --------
           |      |
           |      
           |     
           |      
           |     
        --------
        """,
        """
           --------
           |      |
           |      O
           |     
           |      
           |     
        --------
        """,
        """
           --------
           |      |
           |      O
           |      |
           |      
           |     
        --------
        """,
        """
           --------
           |      |
           |      O
           |     /|
           |      
           |     
        --------
        """,
        """
           --------
           |      |
           |      O
           |     /|\\
           |      
           |     
        --------
        """,
        """
           --------
           |      |
           |      O
           |     /|\\
           |     / 
           |     
        --------
        """,
        """
           --------
           |      |
           |      O
           |     /|\\
           |     / \\
           |     
        --------
        GAME OVER!
        """
    ]
    print(stages[mistakes])

def choose_word():
    """Выбирает случайное слово из списка"""
    return random.choice(WORDS)

def display_word(word, guessed_letters):
    """Отображает слово с угаданными буквами"""
    display = ""
    for letter in word:
        if letter in guessed_letters:
            display += letter + " "
        else:
            display += "_ "
    return display.strip()

def get_letter_input(guessed_letters):
    """Получает букву от игрока с проверкой"""
    while True:
        letter = input("\n🔤 Введите букву: ").upper()
        
        if len(letter) != 1:
            print("❌ Введите только ОДНУ букву!")
        elif not letter.isalpha():
            print("❌ Это не буква! Попробуйте еще раз")
        elif letter in guessed_letters:
            print(f"❌ Вы уже использовали букву '{letter}'!")
        else:
            return letter

def check_letter(word, letter):
    """Проверяет есть ли буква в слове"""
    return letter in word

def show_game_info(word, guessed_letters, mistakes, max_mistakes):
    """Показывает текущее состояние игры"""
    print("\n" + "="*50)
    draw_hangman(mistakes)
    print("="*50)
    print(f"\n📝 Слово: {display_word(word, guessed_letters)}")
    print(f"\n💚 Использованные буквы: {', '.join(sorted(guessed_letters)) if guessed_letters else 'нет'}")
    print(f"❤️  Осталось попыток: {max_mistakes - mistakes}")
    print("="*50)

def check_win(word, guessed_letters):
    """Проверяет угадано ли все слово"""
    for letter in word:
        if letter not in guessed_letters:
            return False
    return True

def play_game():
    """Основная функция игры"""
    global total_games, total_wins, total_losses
    
    print("\n" + "🎮" * 25)
    print("ИГРА 'ВИСЕЛИЦА' НАЧАЛАСЬ!")
    print("🎮" * 25)
    
    word = choose_word()
    guessed_letters = set()
    mistakes = 0
    max_mistakes = 6
    
    print(f"\n💡 Подсказка: Слово из {len(word)} букв")
    
    while mistakes < max_mistakes:
        show_game_info(word, guessed_letters, mistakes, max_mistakes)
        
        letter = get_letter_input(guessed_letters)
        guessed_letters.add(letter)
        
        if check_letter(word, letter):
            print(f"\n✅ Отлично! Буква '{letter}' есть в слове!")
            
            if check_win(word, guessed_letters):
                print("\n" + "🎉" * 25)
                print(f"🏆 ПОЗДРАВЛЯЮ! ВЫ ВЫИГРАЛИ! 🏆")
                print(f"Слово было: {word}")
                print(f"Ошибок сделано: {mistakes} из {max_mistakes}")
                print("🎉" * 25)
                total_games += 1
                total_wins += 1
                return
        else:
            mistakes += 1
            print(f"\n❌ Неверно! Буквы '{letter}' нет в слове")
    
    # Если закончились попытки
    show_game_info(word, guessed_letters, mistakes, max_mistakes)
    print("\n" + "💔" * 25)
    print(f"😢 ВЫ ПРОИГРАЛИ!")
    print(f"Правильное слово было: {word}")
    print("💔" * 25)
    total_games += 1
    total_losses += 1

def show_rules():
    """Показывает правила игры"""
    print("\n" + "="*50)
    print("📖 ПРАВИЛА ИГРЫ 'ВИСЕЛИЦА'")
    print("="*50)
    print("1. Компьютер загадывает слово")
    print("2. Вы видите количество букв: _ _ _")
    print("3. Нужно угадывать буквы по одной")
    print("4. Если буква есть - она открывается")
    print("5. Если буквы нет - рисуется часть виселицы")
    print("6. У вас есть 6 попыток на ошибки")
    print("7. Цель: угадать слово до того как нарисуется виселица")
    print("="*50)

def show_statistics():
    """Показывает статистику игр"""
    print("\n" + "="*50)
    print("📊 СТАТИСТИКА")
    print("="*50)
    print(f"🎮 Всего игр: {total_games}")
    print(f"🏆 Побед: {total_wins}")
    print(f"💔 Поражений: {total_losses}")
    if total_games > 0:
        win_rate = (total_wins / total_games) * 100
        print(f"📈 Процент побед: {win_rate:.1f}%")
    print("="*50)

def show_menu():
    """Показывает главное меню"""
    print("\n" + "="*50)
    print("🎮 ИГРА 'ВИСЕЛИЦА' (HANGMAN) 🎮")
    print("="*50)
    print("1. 🎯 Начать игру")
    print("2. 📖 Правила")
    print("3. 📊 Статистика")
    print("4. 🚪 Выход")
    print("="*50)

def main():
    """Главная функция программы"""
    print("\n" + "🎮" * 25)
    print("Добро пожаловать в игру 'ВИСЕЛИЦА'!")
    print("🎮" * 25)
    
    while True:
        show_menu()
        choice = input("\n👉 Выберите пункт меню (1-4): ")
        
        if choice == "1":
            play_game()
        elif choice == "2":
            show_rules()
        elif choice == "3":
            show_statistics()
        elif choice == "4":
            print("\n👋 Спасибо за игру! До встречи!")
            print(f"Итого сыграно игр: {total_games}")
            break
        else:
            print("❌ Ошибка! Выберите пункт от 1 до 4")

# Запуск программы
if __name__ == "__main__":
    main()