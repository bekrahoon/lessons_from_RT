"""
Модуль для работы с базой данных SQLite3
Содержит классы для управления студентами
"""
import sqlite3
from datetime import datetime
from typing import Optional, List, Dict


class DatabaseConnection:
    """Класс для управления подключением к базе данных"""
    
    def __init__(self, db_name: str = "students.db"):
        self.db_name = db_name
        self.connection = None
        self.cursor = None
    
    def __enter__(self):
        """Контекстный менеджер для автоматического открытия соединения"""
        self.connection = sqlite3.connect(self.db_name)
        self.connection.row_factory = sqlite3.Row
        self.cursor = self.connection.cursor()
        return self
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        """Контекстный менеджер для автоматического закрытия соединения"""
        if self.connection:
            if exc_type is None:
                self.connection.commit()
            else:
                self.connection.rollback()
            self.connection.close()


class Student:
    """Класс для представления студента"""
    
    def __init__(
        self,
        telegram_id: int,
        first_name: str,
        last_name: str,
        patronymic: str,
        birth_date: str,
        group_number: str,
        student_id: str,
        phone_number: str,
        email: str,
        specialty: str,
        course: int,
        address: str = "",
        emergency_contact: str = "",
        registration_date: str = None
    ):
        self.telegram_id = telegram_id
        self.first_name = first_name
        self.last_name = last_name
        self.patronymic = patronymic
        self.birth_date = birth_date
        self.group_number = group_number
        self.student_id = student_id
        self.phone_number = phone_number
        self.email = email
        self.specialty = specialty
        self.course = course
        self.address = address
        self.emergency_contact = emergency_contact
        self.registration_date = registration_date or datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    
    def to_dict(self) -> Dict:
        """Преобразование объекта студента в словарь"""
        return {
            'telegram_id': self.telegram_id,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'patronymic': self.patronymic,
            'birth_date': self.birth_date,
            'group_number': self.group_number,
            'student_id': self.student_id,
            'phone_number': self.phone_number,
            'email': self.email,
            'specialty': self.specialty,
            'course': self.course,
            'address': self.address,
            'emergency_contact': self.emergency_contact,
            'registration_date': self.registration_date
        }
    
    @classmethod
    def from_dict(cls, data: Dict) -> 'Student':
        """Создание объекта студента из словаря"""
        return cls(**data)
    
    def __str__(self) -> str:
        """Строковое представление студента"""
        return (
            f"👤 {self.last_name} {self.first_name} {self.patronymic}\n"
            f"🎓 Группа: {self.group_number}\n"
            f"📚 Специальность: {self.specialty}\n"
            f"📊 Курс: {self.course}\n"
            f"🎂 Дата рождения: {self.birth_date}\n"
            f"📧 Email: {self.email}\n"
            f"📱 Телефон: {self.phone_number}\n"
            f"🆔 Студенческий билет: {self.student_id}\n"
            f"🏠 Адрес: {self.address}\n"
            f"📞 Экстренный контакт: {self.emergency_contact}\n"
            f"📅 Дата регистрации: {self.registration_date}"
        )


class StudentDatabase:
    """Класс для управления базой данных студентов"""
    
    def __init__(self, db_name: str = "students.db"):
        self.db_name = db_name
        self._create_table()
    
    def _create_table(self):
        """Создание таблицы студентов, если она не существует"""
        with DatabaseConnection(self.db_name) as db:
            db.cursor.execute("""
                CREATE TABLE IF NOT EXISTS students (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    telegram_id INTEGER UNIQUE NOT NULL,
                    first_name TEXT NOT NULL,
                    last_name TEXT NOT NULL,
                    patronymic TEXT NOT NULL,
                    birth_date TEXT NOT NULL,
                    group_number TEXT NOT NULL,
                    student_id TEXT UNIQUE NOT NULL,
                    phone_number TEXT NOT NULL,
                    email TEXT NOT NULL,
                    specialty TEXT NOT NULL,
                    course INTEGER NOT NULL,
                    address TEXT,
                    emergency_contact TEXT,
                    registration_date TEXT NOT NULL
                )
            """)
    
    def add_student(self, student: Student) -> bool:
        """Добавление нового студента в базу данных"""
        try:
            with DatabaseConnection(self.db_name) as db:
                db.cursor.execute("""
                    INSERT INTO students (
                        telegram_id, first_name, last_name, patronymic,
                        birth_date, group_number, student_id, phone_number,
                        email, specialty, course, address, emergency_contact,
                        registration_date
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """, (
                    student.telegram_id,
                    student.first_name,
                    student.last_name,
                    student.patronymic,
                    student.birth_date,
                    student.group_number,
                    student.student_id,
                    student.phone_number,
                    student.email,
                    student.specialty,
                    student.course,
                    student.address,
                    student.emergency_contact,
                    student.registration_date
                ))
            return True
        except sqlite3.IntegrityError:
            return False
    
    def get_student_by_telegram_id(self, telegram_id: int) -> Optional[Student]:
        """Получение студента по Telegram ID"""
        with DatabaseConnection(self.db_name) as db:
            db.cursor.execute(
                "SELECT * FROM students WHERE telegram_id = ?",
                (telegram_id,)
            )
            row = db.cursor.fetchone()
            if row:
                return Student(
                    telegram_id=row['telegram_id'],
                    first_name=row['first_name'],
                    last_name=row['last_name'],
                    patronymic=row['patronymic'],
                    birth_date=row['birth_date'],
                    group_number=row['group_number'],
                    student_id=row['student_id'],
                    phone_number=row['phone_number'],
                    email=row['email'],
                    specialty=row['specialty'],
                    course=row['course'],
                    address=row['address'],
                    emergency_contact=row['emergency_contact'],
                    registration_date=row['registration_date']
                )
        return None
    
    def get_all_students(self) -> List[Student]:
        """Получение списка всех студентов"""
        students = []
        with DatabaseConnection(self.db_name) as db:
            db.cursor.execute("SELECT * FROM students ORDER BY last_name, first_name")
            rows = db.cursor.fetchall()
            for row in rows:
                students.append(Student(
                    telegram_id=row['telegram_id'],
                    first_name=row['first_name'],
                    last_name=row['last_name'],
                    patronymic=row['patronymic'],
                    birth_date=row['birth_date'],
                    group_number=row['group_number'],
                    student_id=row['student_id'],
                    phone_number=row['phone_number'],
                    email=row['email'],
                    specialty=row['specialty'],
                    course=row['course'],
                    address=row['address'],
                    emergency_contact=row['emergency_contact'],
                    registration_date=row['registration_date']
                ))
        return students
    
    def get_students_by_group(self, group_number: str) -> List[Student]:
        """Получение студентов по номеру группы"""
        students = []
        with DatabaseConnection(self.db_name) as db:
            db.cursor.execute(
                "SELECT * FROM students WHERE group_number = ? ORDER BY last_name, first_name",
                (group_number,)
            )
            rows = db.cursor.fetchall()
            for row in rows:
                students.append(Student(
                    telegram_id=row['telegram_id'],
                    first_name=row['first_name'],
                    last_name=row['last_name'],
                    patronymic=row['patronymic'],
                    birth_date=row['birth_date'],
                    group_number=row['group_number'],
                    student_id=row['student_id'],
                    phone_number=row['phone_number'],
                    email=row['email'],
                    specialty=row['specialty'],
                    course=row['course'],
                    address=row['address'],
                    emergency_contact=row['emergency_contact'],
                    registration_date=row['registration_date']
                ))
        return students
    
    def update_student(self, student: Student) -> bool:
        """Обновление данных студента"""
        try:
            with DatabaseConnection(self.db_name) as db:
                db.cursor.execute("""
                    UPDATE students SET
                        first_name = ?,
                        last_name = ?,
                        patronymic = ?,
                        birth_date = ?,
                        group_number = ?,
                        student_id = ?,
                        phone_number = ?,
                        email = ?,
                        specialty = ?,
                        course = ?,
                        address = ?,
                        emergency_contact = ?
                    WHERE telegram_id = ?
                """, (
                    student.first_name,
                    student.last_name,
                    student.patronymic,
                    student.birth_date,
                    student.group_number,
                    student.student_id,
                    student.phone_number,
                    student.email,
                    student.specialty,
                    student.course,
                    student.address,
                    student.emergency_contact,
                    student.telegram_id
                ))
            return True
        except sqlite3.IntegrityError:
            return False
    
    def delete_student(self, telegram_id: int) -> bool:
        """Удаление студента из базы данных"""
        with DatabaseConnection(self.db_name) as db:
            db.cursor.execute("DELETE FROM students WHERE telegram_id = ?", (telegram_id,))
            return db.cursor.rowcount > 0
    
    def get_statistics(self) -> Dict:
        """Получение статистики по студентам"""
        with DatabaseConnection(self.db_name) as db:
            # Общее количество студентов
            db.cursor.execute("SELECT COUNT(*) as total FROM students")
            total = db.cursor.fetchone()['total']
            
            # Количество студентов по группам
            db.cursor.execute("""
                SELECT group_number, COUNT(*) as count 
                FROM students 
                GROUP BY group_number
                ORDER BY group_number
            """)
            by_group = {row['group_number']: row['count'] for row in db.cursor.fetchall()}
            
            # Количество студентов по курсам
            db.cursor.execute("""
                SELECT course, COUNT(*) as count 
                FROM students 
                GROUP BY course
                ORDER BY course
            """)
            by_course = {row['course']: row['count'] for row in db.cursor.fetchall()}
            
            return {
                'total': total,
                'by_group': by_group,
                'by_course': by_course
            }