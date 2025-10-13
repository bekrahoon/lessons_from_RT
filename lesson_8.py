from abc import ABC, abstractmethod

# Account
class Account:
    def __init__(self, number, balance, pin):
        self.__number = number
        self.__balance = balance
        self.__pin = pin

    def deposit(self, amount, pin):
        if pin == self.__pin:
            self.__balance += amount
            return f"Пополнено {amount}, баланс {self.__balance}"
        return "Неверный PIN"

    def withdraw(self, amount, pin):
        if pin != self.__pin:
            return "Неверный PIN"
        if amount > self.__balance:
            return "Недостаточно средств"
        self.__balance -= amount
        return f"Снято {amount}, баланс {self.__balance}"

    def get_balance(self, pin):
        if pin == self.__pin:
            return self.__balance
        return "Неверный PIN"


# Product
class Product:
    def __init__(self, price):
        self.__price = price

    def set_discount(self, percent):
        new_price = self.__price * (1 - percent/100)
        self.__price = max(0, new_price)

    def final_price(self):
        return self.__price


# Course
class Course:
    def __init__(self, name, max_students):
        self.__name = name
        self.__students = []
        self.__max_students = max_students

    def add_student(self, name):
        if len(self.__students) < self.__max_students:
            self.__students.append(name)
            return True
        return False

    def remove_student(self, name):
        if name in self.__students:
            self.__students.remove(name)
            return True
        return False

    def get_students(self):
        return tuple(self.__students)


# SmartWatch
class SmartWatch:
    def __init__(self):
        self.__battery = 100

    def use(self, minutes):
        self.__battery = max(0, self.__battery - minutes/10)

    def charge(self, percent):
        self.__battery = min(100, self.__battery + percent)

    def get_battery(self):
        return self.__battery


# Transport
class Transport:
    def __init__(self, speed, capacity):
        self.speed = speed
        self.capacity = capacity

    def travel_time(self, distance):
        return distance / self.speed


class Bus(Transport):
    pass


class Train(Transport):
    pass


class Airplane(Transport):
    def travel_time(self, distance):
        return super().travel_time(distance) * 0.8


# Order
class Order(ABC):
    @abstractmethod
    def calculate_total(self, amount):
        pass


class DineInOrder(Order):
    def calculate_total(self, amount):
        return amount * 1.05


class TakeAwayOrder(Order):
    def calculate_total(self, amount):
        return amount


class DeliveryOrder(Order):
    def calculate_total(self, amount):
        return amount * 1.10


# Character
class Character(ABC):
    def __init__(self, name, health, attack):
        self.name = name
        self.health = health
        self.attack_power = attack

    @abstractmethod
    def attack(self):
        pass


class Warrior(Character):
    def attack(self):
        return f"{self.name} бьет мечом на {self.attack_power}"


class Mage(Character):
    def attack(self):
        return f"{self.name} колдует на {self.attack_power}"


class Archer(Character):
    def attack(self):
        return f"{self.name} стреляет на {self.attack_power}"


# MediaFile
class MediaFile(ABC):
    def __init__(self, name, duration):
        self.name = name
        self.duration = duration

    @abstractmethod
    def play(self):
        pass


class AudioFile(MediaFile):
    def play(self):
        return f"Аудио {self.name} играет"


class VideoFile(MediaFile):
    def play(self):
        return f"Видео {self.name} воспроизводится с изображением"


class Podcast(MediaFile):
    def play(self):
        return f"Подкаст {self.name} воспроизводится"


# PaymentSystem
class PaymentSystem(ABC):
    @abstractmethod
    def process_payment(self, amount):
        pass


class CreditCardPayment(PaymentSystem):
    def process_payment(self, amount):
        return f"Оплата картой {amount}"


class CryptoPayment(PaymentSystem):
    def process_payment(self, amount):
        return f"Оплата криптой {amount}"


class BankTransfer(PaymentSystem):
    def process_payment(self, amount):
        return f"Банковский перевод {amount}"


# Animal
class Animal(ABC):
    @abstractmethod
    def eat(self):
        pass

    @abstractmethod
    def sleep(self):
        pass


class Lion(Animal):
    def eat(self):
        return "Лев ест мясо"

    def sleep(self):
        return "Лев спит"


class Elephant(Animal):
    def eat(self):
        return "Слон ест траву"

    def sleep(self):
        return "Слон спит стоя"


class Snake(Animal):
    def eat(self):
        return "Змея ест"

    def sleep(self):
        return "Змея свернулась и спит"


# Document
class Document(ABC):
    @abstractmethod
    def open(self): pass

    @abstractmethod
    def edit(self): pass

    @abstractmethod
    def save(self): pass


class WordDocument(Document):
    def open(self): return "Word открыт"

    def edit(self): return "Word редактирован"

    def save(self): return "Word сохранен"


class PdfDocument(Document):
    def open(self): return "PDF открыт"

    def edit(self): return "PDF нельзя редактировать"

    def save(self): return "PDF сохранен"


class SpreadsheetDocument(Document):
    def open(self): return "Таблица открыта"

    def edit(self): return "Таблица изменена"

    def save(self): return "Таблица сохранена"


# Lesson
class Lesson(ABC):
    @abstractmethod
    def start(self): pass


class VideoLesson(Lesson):
    def start(self): return "Видео урок запущен"


class QuizLesson(Lesson):
    def start(self): return "Тест начат"


class TextLesson(Lesson):
    def start(self): return "Текстовый урок открыт"


# Notification
class EmailNotification:
    def send(self, message):
        return f"Email: {message}"


class SMSNotification:
    def send(self, message):
        return f"SMS: {message}"


class PushNotification:
    def send(self, message):
        return f"Push: {message}"


# Shapes
class Square:
    def __init__(self, side):
        self.side = side

    def perimeter(self):
        return self.side * 4


class Circle:
    def __init__(self, radius):
        self.radius = radius

    def perimeter(self):
        return 2 * 3.14 * self.radius


class Triangle:
    def __init__(self, a, b, c):
        self.a, self.b, self.c = a, b, c

    def perimeter(self):
        return self.a + self.b + self.c


# Employees
class Manager:
    def work(self): return "Управляет проектами"


class Developer:
    def work(self): return "Пишет код"


class Designer:
    def work(self): return "Создает дизайн"


# Spells
class FireSpell:
    def cast(self, target): return f"{target} получает урон огнем"


class IceSpell:
    def cast(self, target): return f"{target} заморожен"


class HealingSpell:
    def cast(self, target): return f"{target} восстановил здоровье"
