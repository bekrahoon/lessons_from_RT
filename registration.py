"""
Модуль для управления процессом регистрации студентов
"""
from typing import Dict, Optional
from enum import Enum


class RegistrationState(Enum):
    """Состояния процесса регистрации"""
    IDLE = 0
    FIRST_NAME = 1
    LAST_NAME = 2
    PATRONYMIC = 3
    BIRTH_DATE = 4
    GROUP_NUMBER = 5
    STUDENT_ID = 6
    PHONE_NUMBER = 7
    EMAIL = 8
    SPECIALTY = 9
    COURSE = 10
    ADDRESS = 11
    EMERGENCY_CONTACT = 12
    CONFIRMATION = 13


class RegistrationSession:
    """Класс для управления сессией регистрации пользователя"""
    
    def __init__(self, telegram_id: int):
        self.telegram_id = telegram_id
        self.state = RegistrationState.IDLE
        self.data: Dict[str, str] = {}
    
    def start(self):
        """Начать процесс регистрации"""
        self.state = RegistrationState.FIRST_NAME
        self.data = {}
    
    def set_data(self, key: str, value: str):
        """Сохранить данные регистрации"""
        self.data[key] = value
    
    def get_data(self, key: str) -> Optional[str]:
        """Получить данные регистрации"""
        return self.data.get(key)
    
    def next_state(self):
        """Перейти к следующему состоянию"""
        states_order = [
            RegistrationState.FIRST_NAME,
            RegistrationState.LAST_NAME,
            RegistrationState.PATRONYMIC,
            RegistrationState.BIRTH_DATE,
            RegistrationState.GROUP_NUMBER,
            RegistrationState.STUDENT_ID,
            RegistrationState.PHONE_NUMBER,
            RegistrationState.EMAIL,
            RegistrationState.SPECIALTY,
            RegistrationState.COURSE,
            RegistrationState.ADDRESS,
            RegistrationState.EMERGENCY_CONTACT,
            RegistrationState.CONFIRMATION
        ]
        
        current_index = states_order.index(self.state)
        if current_index < len(states_order) - 1:
            self.state = states_order[current_index + 1]
            return True
        return False
    
    def reset(self):
        """Сбросить сессию регистрации"""
        self.state = RegistrationState.IDLE
        self.data = {}
    
    def is_complete(self) -> bool:
        """Проверить, завершена ли регистрация"""
        return self.state == RegistrationState.CONFIRMATION
    
    def get_summary(self) -> str:
        """Получить сводку данных регистрации"""
        return (
            f"📋 <b>Проверьте ваши данные:</b>\n\n"
            f"👤 Фамилия: {self.data.get('last_name', 'Не указано')}\n"
            f"👤 Имя: {self.data.get('first_name', 'Не указано')}\n"
            f"👤 Отчество: {self.data.get('patronymic', 'Не указано')}\n"
            f"🎂 Дата рождения: {self.data.get('birth_date', 'Не указано')}\n"
            f"🎓 Группа: {self.data.get('group_number', 'Не указано')}\n"
            f"🆔 Студенческий билет: {self.data.get('student_id', 'Не указано')}\n"
            f"📱 Телефон: {self.data.get('phone_number', 'Не указано')}\n"
            f"📧 Email: {self.data.get('email', 'Не указано')}\n"
            f"📚 Специальность: {self.data.get('specialty', 'Не указано')}\n"
            f"📊 Курс: {self.data.get('course', 'Не указано')}\n"
            f"🏠 Адрес: {self.data.get('address', 'Не указано')}\n"
            f"📞 Экстренный контакт: {self.data.get('emergency_contact', 'Не указано')}\n\n"
            f"✅ Всё верно?\n"
            f"Нажмите <b>Подтвердить</b> для завершения регистрации или <b>Отмена</b> для начала заново."
        )


class RegistrationManager:
    """Класс для управления всеми сессиями регистрации"""
    
    def __init__(self):
        self.sessions: Dict[int, RegistrationSession] = {}
    
    def get_session(self, telegram_id: int) -> RegistrationSession:
        """Получить или создать сессию регистрации для пользователя"""
        if telegram_id not in self.sessions:
            self.sessions[telegram_id] = RegistrationSession(telegram_id)
        return self.sessions[telegram_id]
    
    def delete_session(self, telegram_id: int):
        """Удалить сессию регистрации"""
        if telegram_id in self.sessions:
            del self.sessions[telegram_id]
    
    def has_active_session(self, telegram_id: int) -> bool:
        """Проверить, есть ли активная сессия регистрации"""
        return telegram_id in self.sessions and self.sessions[telegram_id].state != RegistrationState.IDLE
    
    def get_prompt_for_state(self, state: RegistrationState) -> str:
        """Получить текст запроса для текущего состояния"""
        prompts = {
            RegistrationState.FIRST_NAME: "👤 Введите ваше <b>имя</b>:",
            RegistrationState.LAST_NAME: "👤 Введите вашу <b>фамилию</b>:",
            RegistrationState.PATRONYMIC: "👤 Введите ваше <b>отчество</b>:",
            RegistrationState.BIRTH_DATE: "🎂 Введите вашу <b>дату рождения</b> в формате ДД.ММ.ГГГГ (например, 15.03.2000):",
            RegistrationState.GROUP_NUMBER: "🎓 Введите <b>номер группы</b> (например, ИС-21-1):",
            RegistrationState.STUDENT_ID: "🆔 Введите <b>номер студенческого билета</b>:",
            RegistrationState.PHONE_NUMBER: "📱 Введите ваш <b>номер телефона</b> (например, +7 900 123-45-67):",
            RegistrationState.EMAIL: "📧 Введите ваш <b>email</b>:",
            RegistrationState.SPECIALTY: "📚 Введите вашу <b>специальность</b> (например, Информационные системы и технологии):",
            RegistrationState.COURSE: "📊 Введите <b>номер курса</b> (1, 2, 3 или 4):",
            RegistrationState.ADDRESS: "🏠 Введите ваш <b>адрес проживания</b> (можно пропустить, написав '-'):",
            RegistrationState.EMERGENCY_CONTACT: "📞 Введите <b>контакт для экстренной связи</b> (ФИО и телефон родственника):",
        }
        return prompts.get(state, "")


class Validator:
    """Класс для валидации данных регистрации"""
    
    @staticmethod
    def validate_name(name: str) -> tuple[bool, str]:
        """Валидация имени/фамилии/отчества"""
        if not name or len(name.strip()) < 2:
            return False, "❌ Имя должно содержать минимум 2 символа."
        if not all(c.isalpha() or c.isspace() or c == '-' for c in name):
            return False, "❌ Имя должно содержать только буквы."
        return True, ""
    
    @staticmethod
    def validate_birth_date(date: str) -> tuple[bool, str]:
        """Валидация даты рождения"""
        import re
        from datetime import datetime
        
        pattern = r'^\d{2}\.\d{2}\.\d{4}$'
        if not re.match(pattern, date):
            return False, "❌ Неверный формат даты. Используйте ДД.ММ.ГГГГ (например, 15.03.2000)."
        
        try:
            day, month, year = map(int, date.split('.'))
            birth_date = datetime(year, month, day)
            
            # Проверка возраста (от 16 до 60 лет)
            today = datetime.now()
            age = today.year - birth_date.year - ((today.month, today.day) < (birth_date.month, birth_date.day))
            
            if age < 16 or age > 60:
                return False, "❌ Возраст должен быть от 16 до 60 лет."
            
            return True, ""
        except ValueError:
            return False, "❌ Некорректная дата. Проверьте правильность ввода."
    
    @staticmethod
    def validate_group_number(group: str) -> tuple[bool, str]:
        """Валидация номера группы"""
        if not group or len(group.strip()) < 3:
            return False, "❌ Номер группы слишком короткий."
        return True, ""
    
    @staticmethod
    def validate_student_id(student_id: str) -> tuple[bool, str]:
        """Валидация номера студенческого билета"""
        if not student_id or len(student_id.strip()) < 4:
            return False, "❌ Номер студенческого билета слишком короткий."
        return True, ""
    
    @staticmethod
    def validate_phone_number(phone: str) -> tuple[bool, str]:
        """Валидация номера телефона"""
        import re
        
        # Удаляем все символы кроме цифр и +
        cleaned = re.sub(r'[^\d+]', '', phone)
        
        if not cleaned:
            return False, "❌ Введите корректный номер телефона."
        
        # Проверяем длину (должно быть 11-12 цифр)
        digits = re.sub(r'[^\d]', '', cleaned)
        if len(digits) < 10 or len(digits) > 12:
            return False, "❌ Номер телефона должен содержать 10-12 цифр."
        
        return True, ""
    
    @staticmethod
    def validate_email(email: str) -> tuple[bool, str]:
        """Валидация email"""
        import re
        
        pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        if not re.match(pattern, email):
            return False, "❌ Некорректный формат email."
        return True, ""
    
    @staticmethod
    def validate_specialty(specialty: str) -> tuple[bool, str]:
        """Валидация специальности"""
        if not specialty or len(specialty.strip()) < 5:
            return False, "❌ Название специальности слишком короткое."
        return True, ""
    
    @staticmethod
    def validate_course(course: str) -> tuple[bool, str]:
        """Валидация курса"""
        try:
            course_num = int(course)
            if course_num < 1 or course_num > 4:
                return False, "❌ Курс должен быть от 1 до 4."
            return True, ""
        except ValueError:
            return False, "❌ Введите номер курса цифрой (1, 2, 3 или 4)."
    
    @staticmethod
    def validate_address(address: str) -> tuple[bool, str]:
        """Валидация адреса (необязательное поле)"""
        if address.strip() == '-':
            return True, ""
        if not address or len(address.strip()) < 5:
            return False, "❌ Адрес слишком короткий или введите '-' для пропуска."
        return True, ""
    
    @staticmethod
    def validate_emergency_contact(contact: str) -> tuple[bool, str]:
        """Валидация экстренного контакта"""
        if not contact or len(contact.strip()) < 5:
            return False, "❌ Контакт для экстренной связи слишком короткий."
        return True, ""