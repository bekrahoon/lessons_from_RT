"""
Главный модуль Telegram бота для регистрации студентов
"""
import logging
from telegram import Update, ReplyKeyboardMarkup, ReplyKeyboardRemove, KeyboardButton
from telegram.ext import (
    Application,
    CommandHandler,
    MessageHandler,
    filters,
    ContextTypes,
    ConversationHandler
)
from database import Student, StudentDatabase
from registration import (
    RegistrationManager,
    RegistrationState,
    Validator
)

# Настройка логирования
logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    level=logging.INFO
)
logger = logging.getLogger(__name__)


class StudentRegistrationBot:
    """Основной класс Telegram бота для регистрации студентов"""
    
    def __init__(self, token: str):
        self.token = token
        self.db = StudentDatabase()
        self.registration_manager = RegistrationManager()
        self.validator = Validator()
        self.application = None
    
    async def start_command(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        """Обработчик команды /start"""
        user = update.effective_user
        telegram_id = user.id
        
        # Проверяем, зарегистрирован ли пользователь
        student = self.db.get_student_by_telegram_id(telegram_id)
        
        if student:
            await update.message.reply_text(
                f"👋 Привет, {student.first_name}!\n\n"
                f"Вы уже зарегистрированы в системе.\n\n"
                f"Доступные команды:\n"
                f"/myinfo - Просмотр ваших данных\n"
                f"/group - Просмотр одногруппников\n"
                f"/stats - Статистика по студентам\n"
                f"/help - Помощь",
                parse_mode='HTML'
            )
        else:
            keyboard = [
                [KeyboardButton("✅ Начать регистрацию")],
                [KeyboardButton("ℹ️ Помощь")]
            ]
            reply_markup = ReplyKeyboardMarkup(keyboard, resize_keyboard=True)
            
            await update.message.reply_text(
                f"👋 Привет, {user.first_name}!\n\n"
                f"🎓 Добро пожаловать в систему регистрации студентов!\n\n"
                f"Для использования бота вам необходимо пройти регистрацию.\n"
                f"Нажмите <b>\"✅ Начать регистрацию\"</b> для начала.\n\n"
                f"Команды:\n"
                f"/register - Начать регистрацию\n"
                f"/help - Помощь",
                reply_markup=reply_markup,
                parse_mode='HTML'
            )
    
    async def help_command(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        """Обработчик команды /help"""
        telegram_id = update.effective_user.id
        student = self.db.get_student_by_telegram_id(telegram_id)
        
        if student:
            help_text = (
                "📚 <b>Доступные команды:</b>\n\n"
                "/myinfo - Просмотр ваших данных\n"
                "/group - Просмотр списка одногруппников\n"
                "/stats - Статистика по студентам\n"
                "/help - Показать это сообщение\n\n"
                "❓ <b>Возникли вопросы?</b>\n"
                "Обратитесь к администратору группы."
            )
        else:
            help_text = (
                "📚 <b>Помощь по боту</b>\n\n"
                "Этот бот предназначен для регистрации студентов.\n\n"
                "<b>Процесс регистрации:</b>\n"
                "1. Нажмите /register или кнопку \"✅ Начать регистрацию\"\n"
                "2. Последовательно введите все запрашиваемые данные\n"
                "3. Проверьте введенные данные\n"
                "4. Подтвердите регистрацию\n\n"
                "<b>Что вам потребуется:</b>\n"
                "• ФИО (полностью)\n"
                "• Дата рождения\n"
                "• Номер группы\n"
                "• Номер студенческого билета\n"
                "• Телефон и email\n"
                "• Специальность и курс\n"
                "• Адрес проживания\n"
                "• Контакт для экстренной связи\n\n"
                "Команды:\n"
                "/register - Начать регистрацию\n"
                "/cancel - Отменить регистрацию"
            )
        
        await update.message.reply_text(help_text, parse_mode='HTML')
    
    async def register_command(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        """Обработчик команды /register - начало регистрации"""
        telegram_id = update.effective_user.id
        
        # Проверяем, зарегистрирован ли пользователь
        student = self.db.get_student_by_telegram_id(telegram_id)
        if student:
            await update.message.reply_text(
                "❌ Вы уже зарегистрированы!\n\n"
                "Используйте /myinfo для просмотра ваших данных."
            )
            return
        
        # Начинаем регистрацию
        session = self.registration_manager.get_session(telegram_id)
        session.start()
        
        keyboard = [[KeyboardButton("❌ Отмена")]]
        reply_markup = ReplyKeyboardMarkup(keyboard, resize_keyboard=True)
        
        prompt = self.registration_manager.get_prompt_for_state(session.state)
        await update.message.reply_text(
            f"📝 <b>Начинаем регистрацию!</b>\n\n{prompt}",
            reply_markup=reply_markup,
            parse_mode='HTML'
        )
    
    async def cancel_command(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        """Обработчик команды /cancel - отмена регистрации"""
        telegram_id = update.effective_user.id
        
        if self.registration_manager.has_active_session(telegram_id):
            self.registration_manager.delete_session(telegram_id)
            await update.message.reply_text(
                "❌ Регистрация отменена.\n\n"
                "Используйте /register для повторной регистрации.",
                reply_markup=ReplyKeyboardRemove()
            )
        else:
            await update.message.reply_text("Нет активной регистрации для отмены.")
    
    async def myinfo_command(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        """Обработчик команды /myinfo - просмотр информации о пользователе"""
        telegram_id = update.effective_user.id
        student = self.db.get_student_by_telegram_id(telegram_id)
        
        if not student:
            await update.message.reply_text(
                "❌ Вы не зарегистрированы!\n\n"
                "Используйте /register для регистрации."
            )
            return
        
        await update.message.reply_text(
            f"📋 <b>Ваша информация:</b>\n\n{student}",
            parse_mode='HTML'
        )
    
    async def group_command(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        """Обработчик команды /group - просмотр одногруппников"""
        telegram_id = update.effective_user.id
        student = self.db.get_student_by_telegram_id(telegram_id)
        
        if not student:
            await update.message.reply_text(
                "❌ Вы не зарегистрированы!\n\n"
                "Используйте /register для регистрации."
            )
            return
        
        groupmates = self.db.get_students_by_group(student.group_number)
        
        if len(groupmates) <= 1:
            await update.message.reply_text(
                f"👥 Группа <b>{student.group_number}</b>\n\n"
                f"Вы пока единственный зарегистрированный студент в этой группе.",
                parse_mode='HTML'
            )
            return
        
        message = f"👥 <b>Группа {student.group_number}</b>\n\n"
        message += f"Всего зарегистрировано: {len(groupmates)} студентов\n\n"
        
        for i, mate in enumerate(groupmates, 1):
            message += f"{i}. {mate.last_name} {mate.first_name} {mate.patronymic}\n"
            message += f"   📧 {mate.email}\n"
            message += f"   📱 {mate.phone_number}\n\n"
        
        await update.message.reply_text(message, parse_mode='HTML')
    
    async def stats_command(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        """Обработчик команды /stats - статистика"""
        telegram_id = update.effective_user.id
        student = self.db.get_student_by_telegram_id(telegram_id)
        
        if not student:
            await update.message.reply_text(
                "❌ Вы не зарегистрированы!\n\n"
                "Используйте /register для регистрации."
            )
            return
        
        stats = self.db.get_statistics()
        
        message = "📊 <b>Статистика по студентам</b>\n\n"
        message += f"👥 Всего зарегистрировано: {stats['total']} студентов\n\n"
        
        if stats['by_course']:
            message += "<b>По курсам:</b>\n"
            for course, count in sorted(stats['by_course'].items()):
                message += f"  {course} курс: {count} студентов\n"
            message += "\n"
        
        if stats['by_group']:
            message += "<b>По группам:</b>\n"
            for group, count in sorted(stats['by_group'].items()):
                message += f"  {group}: {count} студентов\n"
        
        await update.message.reply_text(message, parse_mode='HTML')
    
    async def handle_message(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        """Обработчик текстовых сообщений"""
        telegram_id = update.effective_user.id
        text = update.message.text.strip()
        
        # Обработка кнопок меню
        if text == "✅ Начать регистрацию":
            await self.register_command(update, context)
            return
        elif text == "ℹ️ Помощь":
            await self.help_command(update, context)
            return
        elif text == "❌ Отмена":
            await self.cancel_command(update, context)
            return
        
        # Проверяем, есть ли активная сессия регистрации
        if not self.registration_manager.has_active_session(telegram_id):
            await update.message.reply_text(
                "Используйте /start для начала работы с ботом."
            )
            return
        
        session = self.registration_manager.get_session(telegram_id)
        
        # Обработка состояния подтверждения
        if session.state == RegistrationState.CONFIRMATION:
            await self.handle_confirmation(update, context, session)
            return
        
        # Валидация и сохранение данных в зависимости от состояния
        await self.process_registration_step(update, context, session, text)
    
    async def process_registration_step(
        self, 
        update: Update, 
        context: ContextTypes.DEFAULT_TYPE,
        session,
        text: str
    ):
        """Обработка шага регистрации"""
        state = session.state
        is_valid = False
        error_message = ""
        
        # Валидация в зависимости от состояния
        if state == RegistrationState.FIRST_NAME:
            is_valid, error_message = self.validator.validate_name(text)
            if is_valid:
                session.set_data('first_name', text.strip().title())
        
        elif state == RegistrationState.LAST_NAME:
            is_valid, error_message = self.validator.validate_name(text)
            if is_valid:
                session.set_data('last_name', text.strip().title())
        
        elif state == RegistrationState.PATRONYMIC:
            is_valid, error_message = self.validator.validate_name(text)
            if is_valid:
                session.set_data('patronymic', text.strip().title())
        
        elif state == RegistrationState.BIRTH_DATE:
            is_valid, error_message = self.validator.validate_birth_date(text)
            if is_valid:
                session.set_data('birth_date', text.strip())
        
        elif state == RegistrationState.GROUP_NUMBER:
            is_valid, error_message = self.validator.validate_group_number(text)
            if is_valid:
                session.set_data('group_number', text.strip().upper())
        
        elif state == RegistrationState.STUDENT_ID:
            is_valid, error_message = self.validator.validate_student_id(text)
            if is_valid:
                session.set_data('student_id', text.strip())
        
        elif state == RegistrationState.PHONE_NUMBER:
            is_valid, error_message = self.validator.validate_phone_number(text)
            if is_valid:
                session.set_data('phone_number', text.strip())
        
        elif state == RegistrationState.EMAIL:
            is_valid, error_message = self.validator.validate_email(text)
            if is_valid:
                session.set_data('email', text.strip().lower())
        
        elif state == RegistrationState.SPECIALTY:
            is_valid, error_message = self.validator.validate_specialty(text)
            if is_valid:
                session.set_data('specialty', text.strip())
        
        elif state == RegistrationState.COURSE:
            is_valid, error_message = self.validator.validate_course(text)
            if is_valid:
                session.set_data('course', text.strip())
        
        elif state == RegistrationState.ADDRESS:
            is_valid, error_message = self.validator.validate_address(text)
            if is_valid:
                if text.strip() == '-':
                    session.set_data('address', 'Не указано')
                else:
                    session.set_data('address', text.strip())
        
        elif state == RegistrationState.EMERGENCY_CONTACT:
            is_valid, error_message = self.validator.validate_emergency_contact(text)
            if is_valid:
                session.set_data('emergency_contact', text.strip())
        
        # Если данные невалидны, отправляем сообщение об ошибке
        if not is_valid:
            await update.message.reply_text(
                f"{error_message}\n\nПопробуйте еще раз:",
                parse_mode='HTML'
            )
            return
        
        # Переходим к следующему состоянию
        if session.next_state():
            if session.state == RegistrationState.CONFIRMATION:
                # Показываем сводку для подтверждения
                keyboard = [
                    [KeyboardButton("✅ Подтвердить"), KeyboardButton("❌ Отмена")]
                ]
                reply_markup = ReplyKeyboardMarkup(keyboard, resize_keyboard=True)
                
                await update.message.reply_text(
                    session.get_summary(),
                    reply_markup=reply_markup,
                    parse_mode='HTML'
                )
            else:
                # Запрашиваем следующее поле
                prompt = self.registration_manager.get_prompt_for_state(session.state)
                await update.message.reply_text(prompt, parse_mode='HTML')
    
    async def handle_confirmation(
        self, 
        update: Update, 
        context: ContextTypes.DEFAULT_TYPE,
        session
    ):
        """Обработка подтверждения регистрации"""
        text = update.message.text.strip()
        telegram_id = update.effective_user.id
        
        if text == "✅ Подтвердить":
            # Создаем объект студента
            try:
                student = Student(
                    telegram_id=telegram_id,
                    first_name=session.get_data('first_name'),
                    last_name=session.get_data('last_name'),
                    patronymic=session.get_data('patronymic'),
                    birth_date=session.get_data('birth_date'),
                    group_number=session.get_data('group_number'),
                    student_id=session.get_data('student_id'),
                    phone_number=session.get_data('phone_number'),
                    email=session.get_data('email'),
                    specialty=session.get_data('specialty'),
                    course=int(session.get_data('course')),
                    address=session.get_data('address'),
                    emergency_contact=session.get_data('emergency_contact')
                )
                
                # Сохраняем в базу данных
                if self.db.add_student(student):
                    await update.message.reply_text(
                        "✅ <b>Регистрация успешно завершена!</b>\n\n"
                        "Теперь вы можете использовать все функции бота:\n"
                        "/myinfo - Просмотр ваших данных\n"
                        "/group - Просмотр одногруппников\n"
                        "/stats - Статистика\n"
                        "/help - Помощь",
                        reply_markup=ReplyKeyboardRemove(),
                        parse_mode='HTML'
                    )
                    # Удаляем сессию
                    self.registration_manager.delete_session(telegram_id)
                else:
                    await update.message.reply_text(
                        "❌ Ошибка при сохранении данных!\n\n"
                        "Возможно, пользователь с таким студенческим билетом уже существует.\n"
                        "Используйте /register для повторной регистрации.",
                        reply_markup=ReplyKeyboardRemove()
                    )
                    self.registration_manager.delete_session(telegram_id)
            
            except Exception as e:
                logger.error(f"Error during registration: {e}")
                await update.message.reply_text(
                    "❌ Произошла ошибка при регистрации.\n\n"
                    "Попробуйте еще раз: /register",
                    reply_markup=ReplyKeyboardRemove()
                )
                self.registration_manager.delete_session(telegram_id)
        
        elif text == "❌ Отмена":
            await self.cancel_command(update, context)
        else:
            await update.message.reply_text(
                "Используйте кнопки для подтверждения или отмены регистрации."
            )
    
    async def error_handler(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        """Обработчик ошибок"""
        logger.error(f"Update {update} caused error {context.error}")
        
        if update and update.effective_message:
            await update.effective_message.reply_text(
                "❌ Произошла ошибка при обработке вашего запроса.\n"
                "Попробуйте еще раз или используйте /start"
            )
    
    def run(self):
        """Запуск бота"""
        # Создаем приложение
        self.application = Application.builder().token(self.token).build()
        
        # Регистрируем обработчики команд
        self.application.add_handler(CommandHandler("start", self.start_command))
        self.application.add_handler(CommandHandler("help", self.help_command))
        self.application.add_handler(CommandHandler("register", self.register_command))
        self.application.add_handler(CommandHandler("cancel", self.cancel_command))
        self.application.add_handler(CommandHandler("myinfo", self.myinfo_command))
        self.application.add_handler(CommandHandler("group", self.group_command))
        self.application.add_handler(CommandHandler("stats", self.stats_command))
        
        # Регистрируем обработчик текстовых сообщений
        self.application.add_handler(
            MessageHandler(filters.TEXT & ~filters.COMMAND, self.handle_message)
        )
        
        # Регистрируем обработчик ошибок
        self.application.add_error_handler(self.error_handler)
        
        # Запускаем бота
        logger.info("Бот запущен...")
        self.application.run_polling(allowed_updates=Update.ALL_TYPES)


if __name__ == "__main__":
    
    BOT_TOKEN = "8006695056:AAGQlqYBpLJYBRued-u__wQq_Ny60uAY1_E"
    
    if BOT_TOKEN == "YOUR_BOT_TOKEN_HERE":
        print("❌ ОШИБКА: Укажите токен вашего бота!")
        print("Получите токен у @BotFather в Telegram")
        print("И замените YOUR_BOT_TOKEN_HERE в файле bot.py")
    else:
        bot = StudentRegistrationBot(BOT_TOKEN)
        bot.run()