import flet as ft

class WeatherApp:
    def __init__(self, page: ft.Page):
        self.page = page
        self.page.title = "Температура областей КР"
        self.page.window_width = 500
        self.page.window_height = 600

        self.regions = [
            "Чуйская область",
            "Ошская область",
            "Баткенская область",
            "Нарынская область",
            "Иссык-Кульская область",
            "Таласская область",
            "Джалал-Абадская область"
        ]

        self.inputs = []
        self.result_text = ft.Text(size=18, weight="bold")

        self.build_ui()
    def build_ui(self):
        self.page.add(ft.Text("Введите температуру по областям", size=20))
        for region in self.regions:
            field = ft.TextField(
                label=region,
                width=400,
                keyboard_type=ft.KeyboardType.NUMBER
            )
            self.inputs.append(field)
            self.page.add(field)
        
        calc_button = ft.ElevatedButton(
            "Рассчитать среднюю температуру",
            on_click=self.calculate_average
        )
        self.page.add(calc_button)
        self.page.add(self.result_text)
    
    def calculate_average(self, e):
        temperatures = []

        try:
            for field in self.inputs:
                value = float(field.value)
                temperatures.append(value)
            
            average = sum(temperatures) / len(temperatures)
            max_temp = max(temperatures)
            min_temp = min(temperatures)
            
            if average > 20:
                color = "green"
            elif 10 <= average <= 20:
                color = "blue"
            else:
                color = "red"
            
            self.result_text.value = (
                f'Средняя температура: {average:.2f}°C\n'
                f'Самая высокая температура: {max_temp:.2f}°C\n'
                f'Самая низкая температура: {min_temp:.2f}°C'
            )
            self.result_text.color = color
            
        except ValueError:
            self.result_text.value = 'Ошибка: введите корректные числа'
            self.result_text.color = "black"
        
        self.page.update()

def main(page: ft.Page):
    WeatherApp(page)


if __name__ == "__main__":
    ft.app(target=main)