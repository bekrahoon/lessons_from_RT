import re
import flet as ft

from ui import UI, THEMES
from email_sender import send_notification


class ProfileApp:
    def __init__(self, page: ft.Page):
        self.page = page
        self.page.title = "Анкеты"
        self.page.window_width  = 500
        self.page.window_height = 700
        self.page.padding = 20
        self.page.scroll = ft.ScrollMode.AUTO

        self.ui = UI()

        # FilePicker — ТОЛЬКО в overlay, до page.add()
        self.page.overlay.append(self.ui.file_picker)
        self.page.update()

        self._apply_theme("Синяя")
        self._bind_events()
        self.page.add(*self.ui.build())

    def _bind_events(self):
        self.ui.button.on_click          = self.create_profile
        self.ui.age.on_change            = self.update_age
        self.ui.theme_dropdown.on_change = self.change_theme
        self.ui.photo_btn.on_click       = self.pick_photo
        self.ui.file_picker.on_result    = self.photo_picked

    def update_age(self, e):
        self.ui.age_text.value = f"Возраст: {int(self.ui.age.value)}"
        self.page.update()

    def change_theme(self, e):
        self._apply_theme(self.ui.theme_dropdown.value)

    def _apply_theme(self, theme_name: str):
        t = THEMES.get(theme_name, THEMES["Синяя"])
        self.page.bgcolor      = t["bg"]
        self.ui.button.bgcolor = t["accent"]
        self.page.update()

    def pick_photo(self, e):
        self.ui.file_picker.pick_files(
            allow_multiple=False,
            allowed_extensions=["png", "jpg", "jpeg", "webp"],
        )

    def photo_picked(self, e):
        if e.files:
            path = e.files[0].path
            self.ui.photo_img.src = path
            self.page.update()

    def _validate(self):
        if not (self.ui.name.value or "").strip():
            self.ui.name.error_text = "Поле обязательно"
            self.page.update()
            return "Введите имя"
        self.ui.name.error_text = None

        email_val = (self.ui.email.value or "").strip()
        if not email_val:
            self.ui.email.error_text = "Поле обязательно"
            self.page.update()
            return "Введите email"
        if not re.match(r"^[\w\.-]+@[\w\.-]+\.\w{2,}$", email_val):
            self.ui.email.error_text = "Неверный формат"
            self.page.update()
            return "Неверный формат email"
        self.ui.email.error_text = None

        if not self.ui.city.value:
            return "Выберите город"
        if not (self.ui.skill1.value or self.ui.skill2.value or self.ui.skill3.value):
            return "Выберите хотя бы один навык"
        if not self.ui.level.value:
            return "Выберите уровень"
        return None

    def create_profile(self, e):
        self.ui.clear_error()

        error = self._validate()
        if error:
            self.ui.show_error(error)
            self.page.update()
            return

        skills = []
        if self.ui.skill1.value: skills.append("Python")
        if self.ui.skill2.value: skills.append("Django")
        if self.ui.skill3.value: skills.append("Flet")

        resume_text = (
            f"Имя:      {self.ui.name.value.strip()}\n"
            f"Email:    {self.ui.email.value.strip()}\n"
            f"Город:    {self.ui.city.value}\n"
            f"Возраст:  {int(self.ui.age.value)}\n"
            f"Навыки:   {', '.join(skills)}\n"
            f"Уровень:  {self.ui.level.value}\n"
            f"К работе: {'Да' if self.ui.active.value else 'Нет'}"
        )

        self.ui.result.value = "Анкета создана!\n\n" + resume_text
        self.page.update()

        name  = self.ui.name.value.strip()
        email = self.ui.email.value.strip()
        ok = send_notification(to_email=email, name=name, resume_text=resume_text)

        snack_msg   = f"Уведомление отправлено на {email}" if ok else "Письмо не отправлено (проверьте email_sender.py)"
        snack_color = "#43a047" if ok else "#e53935"

        self.page.snack_bar = ft.SnackBar(
            content=ft.Text(snack_msg, color="white"),
            bgcolor=snack_color,
            duration=4000,
        )
        self.page.snack_bar.open = True
        self.page.update()