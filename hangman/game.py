import random
from words import WORDS

def draw_hangman(mistakes):
    # сюда вставляем функцию draw_hangman из твоего кода
    pass

def choose_word():
    return random.choice(WORDS)

def display_word(word, guessed_letters):
    display = ""
    for letter in word:
        display += letter + " " if letter in guessed_letters else "_ "
    return display.strip()

def get_letter_input(guessed_letters):
    while True:
        letter = input("Введите букву: ").upper()
        if len(letter) != 1 or not letter.isalpha() or letter in guessed_letters:
            print("Ошибка! Попробуйте снова.")
        else:
            return letter

def check_letter(word, letter):
    return letter in word

def check_win(word, guessed_letters):
    return all(letter in guessed_letters for letter in word)

def play_game():
    global total_games, total_wins, total_losses
    word = choose_word()
    guessed_letters = set()
    mistakes = 0
    max_mistakes = 6
    while mistakes < max_mistakes:
        print(display_word(word, guessed_letters))
        letter = get_letter_input(guessed_letters)
        guessed_letters.add(letter)
        if check_letter(word, letter):
            if check_win(word, guessed_letters):
                print(f"Вы выиграли! Слово: {word}")
                return
        else:
            mistakes += 1
    print(f"Вы проиграли! Слово было: {word}")
