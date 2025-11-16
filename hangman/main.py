from menu import show_menu
from game import play_game
from stats import show_statistics

total_games = 0
total_wins = 0
total_losses = 0

def main():
    while True:
        show_menu()
        choice = input("Выберите пункт меню (1-4): ")
        if choice == "1":
            play_game()
        elif choice == "2":
            from menu import show_rules
            show_rules()
        elif choice == "3":
            show_statistics()
        elif choice == "4":
            print("Выход из игры")
            break
        else:
            print("Выберите пункт от 1 до 4")

if __name__ == "__main__":
    main()
