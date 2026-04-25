import flet as ft
from app import ProfileApp


def main(page: ft.Page):
    ProfileApp(page)


if __name__ == "__main__":
    ft.app(target=main)