from pathlib import Path
import tkinter as tk
from tkinter import ttk
from PIL import Image, ImageTk
import pygame


ASSETS_DIR = Path(__file__).parent / "assets"


class SoundImageButton(ttk.Frame):
    """Компонент: кнопка, которая при клике показывает картинку и/или воспроизводит звук.

    Параметры:
        parent - родительский tkinter widget
        title - текст на кнопке
        image_path - путь к картинке (может быть None)
        sound_path - путь к звуку (может быть None)
        display_label - QLabel/Label куда показывать картинку (если нужен)
    """

    def __init__(self, parent, title, image_path=None, sound_path=None, display_label=None, *args, **kwargs):
        super().__init__(parent, *args, **kwargs)
        self.image_path = Path(image_path) if image_path else None
        self.sound_path = Path(sound_path) if sound_path else None
        self.display_label = display_label

        self.button = ttk.Button(self, text=title, command=self.on_click)
        self.button.pack(fill="both", expand=True)

        self._thumbnail = None
        if self.image_path and self.image_path.exists():
            self._thumbnail = self._load_thumbnail(self.image_path, (120, 80))
            self.icon_label = ttk.Label(self, image=self._thumbnail)
            self.icon_label.image = self._thumbnail
            self.icon_label.pack(side="bottom", pady=4)

    def _load_thumbnail(self, path, size):
        im = Image.open(path)
        im.thumbnail(size)
        return ImageTk.PhotoImage(im)

    def on_click(self):
        if self.image_path and self.image_path.exists() and self.display_label:
            img = Image.open(self.image_path)
            img.thumbnail((400, 400))
            tk_img = ImageTk.PhotoImage(img)
            self.display_label.configure(image=tk_img)
            self.display_label.image = tk_img

        if self.sound_path and self.sound_path.exists():
            try:
                sound = pygame.mixer.Sound(str(self.sound_path))
                sound.play()
            except Exception as e:
                print("Ошибка воспроизведения звука:", e)


class App(tk.Tk):
    def __init__(self):
        super().__init__()
        self.title("Мемы — звук + картинка (OOP)")
        self.geometry("900x520")

        pygame.mixer.init()

        self.columnconfigure(0, weight=0)
        self.columnconfigure(1, weight=1)
        self.rowconfigure(0, weight=1)

        left_frame = ttk.Frame(self)
        left_frame.grid(row=0, column=0, sticky="ns", padx=10, pady=10)

        right_frame = ttk.Frame(self)
        right_frame.grid(row=0, column=1, sticky="nsew", padx=10, pady=10)
        right_frame.columnconfigure(0, weight=1)
        right_frame.rowconfigure(0, weight=1)

        self.display_label = ttk.Label(right_frame)
        self.display_label.grid(row=0, column=0, sticky="nsew")

        buttons_info = [
            ("Мем 1", ASSETS_DIR / "meme1.png", ASSETS_DIR / "meme1.wav"),
            ("Мем 2", ASSETS_DIR / "meme2.png", ASSETS_DIR / "meme2.wav"),
            ("Мем 3", ASSETS_DIR / "meme3.png", ASSETS_DIR / "meme3.wav"),
            ("Только картинка", ASSETS_DIR / "image_only.png", None),
            ("Только звук", None, ASSETS_DIR / "sound_only.wav"),
        ]

        for i, (title, img, snd) in enumerate(buttons_info):
            sib = SoundImageButton(left_frame, title, image_path=img, sound_path=snd, display_label=self.display_label)
            sib.grid(row=i, column=0, pady=6, sticky="ew")

        control_frame = ttk.Frame(left_frame)
        control_frame.grid(row=6, column=0, pady=(20, 0), sticky="ew")
        stop_btn = ttk.Button(control_frame, text="Остановить звук", command=self.stop_all_sounds)
        stop_btn.pack(fill="x")

    def stop_all_sounds(self):
        pygame.mixer.stop()


if __name__ == '__main__':
    if not ASSETS_DIR.exists():
        print("Создайте папку 'assets' рядом с main.py и поместите туда изображения/аудио как в README.")
    app = App()
    app.mainloop()

