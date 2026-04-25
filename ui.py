import flet as ft


THEMES = {
    "Синяя":   {"bg": "#0d1b2a", "accent": "#1e88e5"},
    "Тёмная":  {"bg": "#121212", "accent": "#bb86fc"},
    "Зелёная": {"bg": "#0a1f0a", "accent": "#43a047"},
}


class UI:
    def __init__(self):
        self.current_theme = "Синяя"

        # ── Фото ────────────────────────────────────────────────────────────
        self.photo_img = ft.Image(
            src="https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f464.png",
            width=100, height=100, border_radius=50,
        )
        self.photo_btn = ft.ElevatedButton("Загрузить фото")

        # FilePicker добавляется в page.overlay в app.py, НЕ в build()
        self.file_picker = ft.FilePicker()

        # ── Поля ────────────────────────────────────────────────────────────
        self.title = ft.Text("Создание резюме", size=24, weight="bold")
        self.name  = ft.TextField(label="Имя *", width=300)
        self.email = ft.TextField(label="Email для уведомления *", width=300)
        self.city  = ft.Dropdown(
            label="Город *", width=300,
            options=[
                ft.dropdown.Option("Бишкек"),
                ft.dropdown.Option("Ош"),
                ft.dropdown.Option("Токмок"),
            ],
        )

        self.age_text = ft.Text("Возраст: 10")
        self.age = ft.Slider(min=10, max=60, divisions=50, value=10, label="{value}")

        self.skill1 = ft.Checkbox(label="Python")
        self.skill2 = ft.Checkbox(label="Django")
        self.skill3 = ft.Checkbox(label="Flet")

        self.level = ft.RadioGroup(
            content=ft.Column([
                ft.Radio(value="Jun", label="Junior"),
                ft.Radio(value="Mid", label="Middle"),
                ft.Radio(value="Sen", label="Senior"),
            ])
        )

        self.active = ft.Switch(label="Готов к работе")

        self.theme_dropdown = ft.Dropdown(
            label="Тема интерфейса", width=200,
            options=[ft.dropdown.Option(t) for t in THEMES],
            value="Синяя",
        )

        self.button = ft.ElevatedButton(
            "Отправить резюме",
            bgcolor="#1e88e5", color="white", height=48,
        )
        self.result     = ft.Text(selectable=True)
        self.error_text = ft.Text(color="red", size=13, visible=False)

    def show_error(self, msg: str):
        self.error_text.value   = f"Ошибка: {msg}"
        self.error_text.visible = True

    def clear_error(self):
        self.error_text.visible = False

    def build(self):
        # FilePicker здесь НЕТ — он уже в page.overlay
        return [
            ft.Column(
                scroll=ft.ScrollMode.AUTO,
                spacing=14,
                controls=[
                    ft.Container(height=10),
                    self.title,
                    ft.Divider(),

                    ft.Text("Фото профиля", weight="bold"),
                    self.photo_img,
                    self.photo_btn,
                    ft.Divider(height=4),

                    self.name,
                    self.email,
                    self.city,
                    self.age_text,
                    self.age,

                    ft.Text("Навыки:", weight="bold"),
                    self.skill1, self.skill2, self.skill3,

                    ft.Text("Уровень:", weight="bold"),
                    self.level,

                    self.active,
                    ft.Divider(),

                    ft.Text("Цвет интерфейса:", weight="bold"),
                    self.theme_dropdown,
                    ft.Divider(),

                    self.error_text,
                    self.button,
                    ft.Container(height=4),
                    self.result,
                    ft.Container(height=20),
                ],
            )
        ]