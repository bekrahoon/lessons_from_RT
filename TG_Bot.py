import asyncio
from aiogram import Bot, Dispatcher, types, F
from aiogram.filters import Command
from aiogram.types import ReplyKeyboardMarkup, KeyboardButton, InlineKeyboardMarkup, InlineKeyboardButton
from aiogram.fsm.context import FSMContext
from aiogram.fsm.state import State, StatesGroup
from aiogram.fsm.storage.memory import MemoryStorage

API_TOKEN = '8407687545:AAEv0HJ7SGZ_WdHsr9oPfCwBHjr_cscy2i4'

bot = Bot(token=API_TOKEN)
storage = MemoryStorage()
dp = Dispatcher(storage=storage)

# Хранилище заказов: {user_id: [список заказов]}
orders = {}
order_counter = 0  # Глобальный счетчик для ID заказов


# FSM States для добавления заказа
class OrderStates(StatesGroup):
    waiting_for_name = State()
    waiting_for_item = State()
    waiting_for_time = State()


# FSM States для изменения заказа
class EditOrderStates(StatesGroup):
    waiting_for_order_id = State()
    waiting_for_field = State()
    waiting_for_new_value = State()


# Главная клавиатура
main_keyboard = ReplyKeyboardMarkup(
    keyboard=[
        [KeyboardButton(text='➕ Добавить заказ')],
        [KeyboardButton(text='📋 Посмотреть заказы')],
        [KeyboardButton(text='🗑 Удалить заказ')],
        [KeyboardButton(text='✏️ Изменить данные')]
    ],
    resize_keyboard=True
)


@dp.message(Command('start'))
async def start(message: types.Message):
    await message.answer(
        "👋 Привет! Я бот для управления заказами.\n"
        "Используй команду /basket для начала работы",
        reply_markup=main_keyboard
    )


@dp.message(Command('basket'))
async def basket(message: types.Message):
    await message.answer(
        "🛒 Корзина заказов\n\n"
        "Выбери действие:",
        reply_markup=main_keyboard
    )


# ============= СОЗДАНИЕ (CREATE) =============
@dp.message(F.text == '➕ Добавить заказ')
async def add_order_start(message: types.Message, state: FSMContext):
    await state.set_state(OrderStates.waiting_for_name)
    await message.answer("Шаг 1/3: Как вас зовут?")


@dp.message(OrderStates.waiting_for_name)
async def process_name(message: types.Message, state: FSMContext):
    await state.update_data(name=message.text)
    await state.set_state(OrderStates.waiting_for_item)
    await message.answer("Шаг 2/3: Что вы хотите заказать?")


@dp.message(OrderStates.waiting_for_item)
async def process_item(message: types.Message, state: FSMContext):
    await state.update_data(item=message.text)
    await state.set_state(OrderStates.waiting_for_time)
    await message.answer("Шаг 3/3: К какому времени вам привезти заказ?")


@dp.message(OrderStates.waiting_for_time)
async def process_time(message: types.Message, state: FSMContext):
    global order_counter
    
    await state.update_data(time=message.text)
    data = await state.get_data()
    
    user_id = message.from_user.id
    order_counter += 1
    
    order = {
        'id': order_counter,
        'name': data['name'],
        'item': data['item'],
        'time': data['time']
    }
    
    orders.setdefault(user_id, [])
    orders[user_id].append(order)
    
    await message.answer(
        f"✅ Заказ #{order['id']} успешно создан!\n\n"
        f"👤 Имя: {order['name']}\n"
        f"📦 Заказ: {order['item']}\n"
        f"🕐 Время доставки: {order['time']}",
        reply_markup=main_keyboard
    )
    
    await state.clear()


# ============= ЧТЕНИЕ (READ) =============
@dp.message(F.text == '📋 Посмотреть заказы')
async def show_orders(message: types.Message):
    user_id = message.from_user.id
    user_orders = orders.get(user_id, [])
    
    if not user_orders:
        await message.answer("У вас нет заказов 📭")
        return
    
    text = "📋 Ваши заказы:\n\n"
    for order in user_orders:
        text += (
            f"🆔 Заказ #{order['id']}\n"
            f"👤 Имя: {order['name']}\n"
            f"📦 Заказ: {order['item']}\n"
            f"🕐 Время: {order['time']}\n"
            f"{'-' * 30}\n\n"
        )
    
    await message.answer(text)


# ============= УДАЛЕНИЕ (DELETE) =============
@dp.message(F.text == '🗑 Удалить заказ')
async def delete_order_request(message: types.Message):
    user_id = message.from_user.id
    user_orders = orders.get(user_id, [])
    
    if not user_orders:
        await message.answer("У вас нет заказов для удаления 📭")
        return
    
    # Создаем inline кнопки для каждого заказа
    keyboard = InlineKeyboardMarkup(inline_keyboard=[
        [InlineKeyboardButton(
            text=f"Удалить #{order['id']}: {order['item']}", 
            callback_data=f"delete_{order['id']}"
        )]
        for order in user_orders
    ])
    
    await message.answer("Выберите заказ для удаления:", reply_markup=keyboard)


@dp.callback_query(F.data.startswith('delete_'))
async def delete_order_confirm(callback: types.CallbackQuery):
    order_id = int(callback.data.split('_')[1])
    user_id = callback.from_user.id
    user_orders = orders.get(user_id, [])
    
    # Находим и удаляем заказ
    for i, order in enumerate(user_orders):
        if order['id'] == order_id:
            deleted_order = user_orders.pop(i)
            await callback.message.edit_text(
                f"✅ Заказ #{order_id} удален!\n\n"
                f"👤 Имя: {deleted_order['name']}\n"
                f"📦 Заказ: {deleted_order['item']}\n"
                f"🕐 Время: {deleted_order['time']}"
            )
            await callback.answer("Заказ удален")
            return
    
    await callback.answer("Заказ не найден", show_alert=True)


# ============= ОБНОВЛЕНИЕ (UPDATE) =============
@dp.message(F.text == '✏️ Изменить данные')
async def edit_order_request(message: types.Message, state: FSMContext):
    user_id = message.from_user.id
    user_orders = orders.get(user_id, [])
    
    if not user_orders:
        await message.answer("У вас нет заказов для изменения 📭")
        return
    
    # Показываем список заказов
    text = "📋 Ваши заказы:\n\n"
    for order in user_orders:
        text += f"🆔 #{order['id']}: {order['item']}\n"
    
    text += "\n💬 Введите ID заказа, который хотите изменить:"
    
    await state.set_state(EditOrderStates.waiting_for_order_id)
    await message.answer(text)


@dp.message(EditOrderStates.waiting_for_order_id)
async def process_order_id_for_edit(message: types.Message, state: FSMContext):
    try:
        order_id = int(message.text)
        user_id = message.from_user.id
        user_orders = orders.get(user_id, [])
        
        # Проверяем, существует ли заказ
        order_found = False
        for order in user_orders:
            if order['id'] == order_id:
                order_found = True
                await state.update_data(order_id=order_id)
                
                # Создаем кнопки для выбора поля
                keyboard = InlineKeyboardMarkup(inline_keyboard=[
                    [InlineKeyboardButton(text="👤 Имя", callback_data="edit_name")],
                    [InlineKeyboardButton(text="📦 Заказ", callback_data="edit_item")],
                    [InlineKeyboardButton(text="🕐 Время", callback_data="edit_time")]
                ])
                
                await state.set_state(EditOrderStates.waiting_for_field)
                await message.answer(
                    f"Заказ #{order_id} найден!\n\n"
                    f"👤 Имя: {order['name']}\n"
                    f"📦 Заказ: {order['item']}\n"
                    f"🕐 Время: {order['time']}\n\n"
                    "Что хотите изменить?",
                    reply_markup=keyboard
                )
                break
        
        if not order_found:
            await message.answer("❌ Заказ с таким ID не найден. Попробуйте снова:")
            
    except ValueError:
        await message.answer("❌ Пожалуйста, введите число (ID заказа):")


@dp.callback_query(EditOrderStates.waiting_for_field, F.data.startswith('edit_'))
async def process_field_choice(callback: types.CallbackQuery, state: FSMContext):
    field = callback.data.split('_')[1]
    await state.update_data(field=field)
    
    field_names = {
        'name': 'имя',
        'item': 'заказ',
        'time': 'время доставки'
    }
    
    await state.set_state(EditOrderStates.waiting_for_new_value)
    await callback.message.edit_text(f"💬 Введите новое значение для поля '{field_names[field]}':")
    await callback.answer()


@dp.message(EditOrderStates.waiting_for_new_value)
async def process_new_value(message: types.Message, state: FSMContext):
    data = await state.get_data()
    order_id = data['order_id']
    field = data['field']
    new_value = message.text
    
    user_id = message.from_user.id
    user_orders = orders.get(user_id, [])
    
    # Находим и обновляем заказ
    for order in user_orders:
        if order['id'] == order_id:
            order[field] = new_value
            
            await message.answer(
                f"✅ Заказ #{order_id} обновлен!\n\n"
                f"👤 Имя: {order['name']}\n"
                f"📦 Заказ: {order['item']}\n"
                f"🕐 Время: {order['time']}",
                reply_markup=main_keyboard
            )
            break
    
    await state.clear()


# Отмена операции
@dp.message(Command('cancel'))
async def cancel_operation(message: types.Message, state: FSMContext):
    await state.clear()
    await message.answer("❌ Операция отменена", reply_markup=main_keyboard)


async def main():
    print("🤖 Бот запущен!")
    await dp.start_polling(bot)


if __name__ == "__main__":
    asyncio.run(main())