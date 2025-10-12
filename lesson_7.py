# Домашка по ООП - Зоопарк

# Суперкласс для всех животных
class Animal:
    def __init__(self, name, age, weight):
        self.name = name
        self.age = age
        self.weight = weight
    
    def sound(self):
        return "какой-то звук"
    
    def info(self):
        return f"Имя: {self.name}, Возраст: {self.age}, Вес: {self.weight}"


# Млекопитающие
class Mammal(Animal):
    def __init__(self, name, age, weight, fur_color):
        super().__init__(name, age, weight)
        self.fur_color = fur_color
    
    def feed_baby(self):
        return f"{self.name} кормит детеныша молоком"


# Пресмыкающиеся
class Reptile(Animal):
    def __init__(self, name, age, weight, scale_type):
        super().__init__(name, age, weight)
        self.scale_type = scale_type
    
    def is_cold_blooded(self):
        return f"{self.name} - холоднокровное животное"


# Птицы
class Bird(Animal):
    def __init__(self, name, age, weight, wingspan):
        super().__init__(name, age, weight)
        self.wingspan = wingspan
    
    def fly(self):
        return f"{self.name} летит в небе"


# Конкретные животные - млекопитающие

class Lion(Mammal):
    def sound(self):
        return f"{self.name} издает рык: РРРР!!!"


class Elephant(Mammal):
    def sound(self):
        return f"{self.name} трубит: ТУУУУ!"


class Bear(Mammal):
    def sound(self):
        return f"{self.name} рычит: РРРММ!"


# Конкретные животные - пресмыкающиеся

class Snake(Reptile):
    def sound(self):
        return f"{self.name} шипит: ШШШ!"


class Turtle(Reptile):
    def sound(self):
        return f"{self.name} молчит"


# Конкретные животные - птицы

class Eagle(Bird):
    def sound(self):
        return f"{self.name} кричит: КРРРР!"


class Penguin(Bird):
    def sound(self):
        return f"{self.name} кричит: ИИИ-ИИИ!"


# Класс для шоу в зоопарке
class Zoo_Show:
    def __init__(self):
        self.shows = {
            1: {
                "name": "Шоу львов",
                "price": 500,
                "info": "Зрелищное представление с царями зверей. Они прыгают, рычат и показывают свою мощь",
                "duration": "20 минут"
            },
            2: {
                "name": "Полеты орлов",
                "price": 600,
                "info": "Орлы летают над аренойй, ловят приманку и совершают трюки в воздухе",
                "duration": "15 минут"
            },
            3: {
                "name": "Танец медведей",
                "price": 400,
                "info": "Забавное представление с медведями. Они ходят, прыгают и взаимодействуют с тренером",
                "duration": "18 минут"
            },
            4: {
                "name": "Змеиное шоу",
                "price": 350,
                "info": "Интересное и опасное шоу со змеями. Тренер показывает разные виды змей",
                "duration": "12 минут"
            },
            5: {
                "name": "Парад пингвинов",
                "price": 450,
                "info": "Смешное шоу с пингвинами. Они ходят вразвалку, плывут и играют друг с другом",
                "duration": "16 минут"
            }
        }
        self.cart = []
    
    def show_all(self):
        print("\n=== ВСЕ ДОСТУПНЫЕ ШОУ ===\n")
        for num, show in self.shows.items():
            print(f"{num}. {show['name']}")
            print(f"   Цена: {show['price']} руб")
            print(f"   {show['duration']}")
            print()
    
    def show_info(self, show_num):
        if show_num in self.shows:
            show = self.shows[show_num]
            print(f"\n========== {show['name'].upper()} ==========")
            print(f"Цена: {show['price']} руб")
            print(f"Время: {show['duration']}")
            print(f"\nОписание:")
            print(show['info'])
            print("=" * 40 + "\n")
        else:
            print("Такого шоу нет!")
    
    def buy_ticket(self, show_num, count=1):
        if show_num not in self.shows:
            print("Ошибка! Такого шоу нет")
            return False
        
        show = self.shows[show_num]
        total = show['price'] * count
        
        print(f"\n--- ПОКУПКА БИЛЕТА ---")
        print(f"Шоу: {show['name']}")
        print(f"Цена за билет: {show['price']} руб")
        print(f"Количество: {count}")
        print(f"ИТОГО: {total} руб")
        print("-------------------\n")
        
        self.cart.append({
            "name": show['name'],
            "price": show['price'],
            "count": count,
            "total": total
        })
        
        print("✓ Билет куплен!\n")
        return True
    
    def show_tickets(self):
        if len(self.cart) == 0:
            print("Билетов не куплено\n")
            return
        
        print("\n=== МОИ БИЛЕТЫ ===\n")
        all_sum = 0
        for i, ticket in enumerate(self.cart, 1):
            print(f"{i}. {ticket['name']}")
            print(f"   Кол-во: {ticket['count']}")
            print(f"   Сумма: {ticket['total']} руб\n")
            all_sum += ticket['total']
        
        print(f"ВСЕГО: {all_sum} руб\n")


# Основная программа
print("==== ЗООПАРК - СИСТЕМА ЖИВОТНЫХ И БИЛЕТОВ ====\n")

# Создаем животных
print("--- ЖИВОТНЫЕ В ЗООПАРКЕ ---\n")

lion = Lion("Лео", 5, 190, "коричневый")
elephant = Elephant("Петя", 8, 5000, "серый")
bear = Bear("Миша", 6, 400, "черный")

snake = Snake("Узик", 3, 2, "гладкая")
turtle = Turtle("Черепаха Альфа", 20, 10, "рубчатая")

eagle = Eagle("Беркут", 7, 4, 200)
penguin = Penguin("Коля", 4, 30, 100)

animals_list = [lion, elephant, bear, snake, turtle, eagle, penguin]

# Показываем информацию о животных
for animal in animals_list:
    print(f"• {animal.info()}")
    print(f"  └ {animal.sound()}")

# Работа с билетами
print("\n\n==== ПОКУПКА БИЛЕТОВ НА ШОУ ====")

zoo = Zoo_Show()

# Показываем все шоу
zoo.show_all()

# Пример выбора первого шоу
print("Выбираем шоу номер 1...")
zoo.show_info(1)

# Покупаем билет
print("Покупаем 2 билета на первое шоу")
zoo.buy_ticket(1, 2)

# Показываем другое шоу
print("Выбираем шоу номер 3...")
zoo.show_info(3)

# Покупаем еще билет
print("Покупаем 1 билет на третье шоу")
zoo.buy_ticket(3, 1)

# Показываем купленные билеты
zoo.show_tickets()