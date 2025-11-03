from abc import ABC, abstractmethod

class Payment(ABC):
    @abstractmethod
    def pay(self, amount):
        pass

    @abstractmethod
    def refund(self, amount):
        pass

class CreditCardPayment(Payment):
    def pay(self, amount):
        print(f"Оплата {amount} руб. с помощью кредитной карты.")

    def refund(self, amount):
        print(f"Возврат {amount} руб. на кредитную карту.")

class CryptoPayment(Payment):
    def pay(self, amount):
        print(f"Оплата {amount} руб. с помощью криптовалюты.")

    def refund(self, amount):
        print(f"Возврат {amount} руб. криптовалютой.")

payment_methods = [CreditCardPayment(), CryptoPayment()]
print("=== Пример использования Payment ===")
for method in payment_methods:
    method.pay(1000)
    method.refund(1000)

class Course(ABC):
    @abstractmethod
    def start(self):
        pass

    @abstractmethod
    def get_materials(self):
        pass

    @abstractmethod
    def end(self):
        pass

class PythonCourse(Course):
    def start(self):
        print("Запуск курса по Python.")
    def get_materials(self):
        print("Материалы для курса по Python: видеолекции и скрипты.")
    def end(self):
        print("Курс по Python завершен.")

class MathCourse(Course):
    def start(self):
        print("Запуск курса по математике.")
    def get_materials(self):
        print("Материалы для курса по математике: теоретические главы и задачи.")
    def end(self):
        print("Курс по математике завершен.")

print("\n=== Пример использования Course ===")
python_course = PythonCourse()
math_course = MathCourse()
python_course.start()
python_course.get_materials()
python_course.end()
math_course.start()
math_course.get_materials()
math_course.end()

class Delivery(ABC):
    @abstractmethod
    def calculate_cost(self, distance):
        pass

    @abstractmethod
    def deliver(self):
        pass

class AirDelivery(Delivery):
    def calculate_cost(self, distance):
        return distance * 5
    def deliver(self):
        print("Доставка выполнена по воздуху.")

class GroundDelivery(Delivery):
    def calculate_cost(self, distance):
        return distance * 2  
    def deliver(self):
        print("Доставка выполнена наземным транспортом.")

class SeaDelivery(Delivery):
    def calculate_cost(self, distance):
        return distance * 3  
    def deliver(self):
        print("Доставка выполнена морским путём.")

print("\n=== Пример использования Delivery ===")
air = AirDelivery()
ground = GroundDelivery()
sea = SeaDelivery()
for dist in [100, 200]:
    print(f"Стоимость авиадоставки на {dist} км: {air.calculate_cost(dist)} руб.")
    print(f"Стоимость наземной доставки на {dist} км: {ground.calculate_cost(dist)} руб.")
    print(f"Стоимость морской доставки на {dist} км: {sea.calculate_cost(dist)} руб.")
air.deliver()
ground.deliver()
sea.deliver()

class BankAccount:
    def __init__(self, owner, balance, pin):
        self.__owner = owner
        self.__balance = balance
        self.__pin = pin

    def deposit(self, amount, pin):
        if pin != self.__pin:
            print("Неверный PIN-код. Депозит отменен.")
        elif amount <= 0:
            print("Сумма депозита должна быть положительной.")
        else:
            self.__balance += amount
            print(f"Внесено {amount} руб. Новый баланс: {self.__balance} руб.")

    def withdraw(self, amount, pin):
        if pin != self.__pin:
            print("Неверный PIN-код. Снятие отменено.")
        elif amount <= 0:
            print("Сумма снятия должна быть положительной.")
        elif amount > self.__balance:
            print("Недостаточно средств.")
        else:
            self.__balance -= amount
            print(f"Снято {amount} руб. Остаток: {self.__balance} руб.")

    def change_pin(self, old_pin, new_pin):
        if old_pin != self.__pin:
            print("Старый PIN-код неверен.")
        else:
            self.__pin = new_pin
            print("PIN-код успешно изменен.")

print("\n=== Пример использования BankAccount ===")
account = BankAccount("Иван Иванов", 1000, "1234")
account.deposit(500, "1234")
account.withdraw(200, "1234")
account.change_pin("1234", "4321")
account.withdraw(100, "0000")  

class UserProfile:
    def __init__(self, email, password):
        self.__email = email
        self.__password = password
        self._status = "free"

    def login(self, email, password):
        if email == self.__email and password == self.__password:
            print("Успешный вход в систему.")
        else:
            print("Неверный логин или пароль.")

    def upgrade_to_premium(self):
        if self._status != "premium":
            self._status = "premium"
            print("Пользователь переведен на премиум.")
        else:
            print("У пользователя уже премиум статус.")

    def get_info(self):
        print(f"Email: {self.__email}, Статус: {self._status}")

print("\n=== Пример использования UserProfile ===")
user = UserProfile("user@example.com", "пароль123")
user.login("user@example.com", "пароль123")
user.get_info()
user.upgrade_to_premium()
user.get_info()
user.login("user@example.com", "неверный")

class Product:
    def __init__(self, name, price):
        self.name = name
        self.price = price
        self.__discount = 0

    def get_price(self):
        return self.price * (1 - self.__discount / 100)

    def set_discount(self, discount, is_admin=False):
        if is_admin:
            self.__discount = discount
            print(f"Скидка для {self.name} установлена на {self.__discount}%.")
        else:
            print("Недостаточно прав для установки скидки.")

print("\n=== Пример использования Product ===")
product = Product("Ноутбук", 50000)
print("Цена без скидки:", product.get_price())
product.set_discount(10, is_admin=False)
product.set_discount(10, is_admin=True)
print("Цена со скидкой:", product.get_price())

class TextFile:
    def __init__(self, name):
        self.name = name
    def open(self):
        print(f"Открыть текстовый файл: {self.name}")

class ImageFile:
    def __init__(self, name):
        self.name = name
    def open(self):
        print(f"Открыть изображение: {self.name}")

class AudioFile:
    def __init__(self, name):
        self.name = name
    def open(self):
        print(f"Открыть аудиофайл: {self.name}")

def open_all(files):
    for f in files:
        f.open()

print("\n=== Пример использования файлов ===")
files = [TextFile("document.txt"), ImageFile("photo.jpg"), AudioFile("song.mp3")]
open_all(files)

class Car:
    def __init__(self):
        self.speed = 60
        self.fuel_consumption = 0.1
    def move(self, distance):
        time = distance / self.speed
        fuel = distance * self.fuel_consumption
        print(f"Машина проехала {distance} км за {time:.2f} ч и израсходовала {fuel:.2f} л топлива.")

class Truck:
    def __init__(self):
        self.speed = 40
        self.fuel_consumption = 0.3
    def move(self, distance):
        time = distance / self.speed
        fuel = distance * self.fuel_consumption
        print(f"Грузовик проехал {distance} км за {time:.2f} ч и израсходовал {fuel:.2f} л топлива.")

class Bicycle:
    def __init__(self):
        self.speed = 15
        self.fuel_consumption = 0  
    def move(self, distance):
        time = distance / self.speed
        print(f"Велосипед проехал {distance} км за {time:.2f} ч.")

def simulate_transport(transport_list, distance):
    for transport in transport_list:
        transport.move(distance)

print("\n=== Пример использования транспорта ===")
transports = [Car(), Truck(), Bicycle()]
simulate_transport(transports, 100)

class Student:
    def access_portal(self):
        print("Студент: просмотр расписания и домашних заданий.")

class Teacher:
    def access_portal(self):
        print("Преподаватель: просмотр расписания, выставление оценок.")

class Administrator:
    def access_portal(self):
        print("Администратор: управление пользователями и настройками системы.")

print("\n=== Пример использования доступа к порталу ===")
users = [Student(), Teacher(), Administrator()]
for user in users:
    user.access_portal()
