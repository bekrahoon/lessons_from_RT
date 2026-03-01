import flet


class EmployeeCatalogApp:
    def __init__(self, page: flet.Page):
        self.page = page
        self.page.title = 'Каталог сотрудников компании'
        self.page.window_width = 600
        self.page.window_height = 700
        self.page.scroll = 'auto'
        
        self.employees = []
        self.build_ui()
    
    def build_ui(self):
        self.page.add(flet.Text("Форма ввода сотрудника", size=22, weight='bold'))
        
        self.first_name = flet.TextField(label="Имя сотрудника", width=500)
        self.last_name = flet.TextField(label='Фамилия', width=500)
        self.age = flet.TextField(
            label='Возраст', 
            width=500, 
            keyboard_type=flet.KeyboardType.NUMBER
        )
        
        self.position = flet.Dropdown(
            label='Должность',
            width=500,
            options=[
                flet.dropdown.Option("Разработчик"),
                flet.dropdown.Option("Дизайнер"),
                flet.dropdown.Option("Менеджер"),
                flet.dropdown.Option("Тестировщик"),
            ]
        )
        
        self.salary = flet.TextField(
            label='Зарплата', 
            width=500, 
            keyboard_type=flet.KeyboardType.NUMBER
        )
        
        self.error_text = flet.Text(color='red')
        
        add_button = flet.ElevatedButton(
            'Добавить сотрудника', 
            on_click=self.add_employee
        )
        clear_button = flet.OutlinedButton(
            'Очистить форму', 
            on_click=self.clear_form
        )
        
        self.employees_list = flet.Column(spacing=10)
        
        self.page.add(
            self.first_name,
            self.last_name,
            self.age,
            self.position,
            self.salary,
            flet.Row([add_button, clear_button], spacing=10),
            self.error_text,
            flet.Divider(height=20, thickness=2),
            flet.Text("Список сотрудников", size=20, weight='bold'),
            self.employees_list
        )
    
    def validate_data(self):
        """Валидация введенных данных"""
        if not all([
            self.first_name.value,
            self.last_name.value,
            self.age.value,
            self.position.value,
            self.salary.value
        ]):
            return "Не все поля заполнены!"
        
        try:
            age = int(self.age.value)
            if age < 18 or age > 100:
                return "Возраст должен быть от 18 до 100 лет!"
        except ValueError:
            return "Возраст должен быть числом!"
        
        try:
            salary = int(self.salary.value)
            if salary < 0:
                return "Зарплата не может быть отрицательной!"
        except ValueError:
            return "Зарплата должна быть числом!"
        
        return None
    
    def add_employee(self, e):
        """Добавление сотрудника"""
        error = self.validate_data()
        
        if error:
            self.error_text.value = error
            self.page.update()
            return
        
        employee = {
            'first_name': self.first_name.value,
            'last_name': self.last_name.value,
            'age': int(self.age.value),
            'position': self.position.value,
            'salary': int(self.salary.value)
        }
        
        self.employees.append(employee)
        self.error_text.value = ""
        self.clear_form(None)
        self.update_employees_list()
    
    def delete_employee(self, employee):
        """Удаление сотрудника из списка"""
        def delete_handler(e):
            self.employees.remove(employee)
            self.update_employees_list()
        return delete_handler
    
    def update_employees_list(self):
        """Обновление списка сотрудников с сортировкой"""
        self.employees_list.controls.clear()
        
        if not self.employees:
            self.employees_list.controls.append(
                flet.Text("Пока нет сотрудников", color='gray', italic=True)
            )
        else:
            sorted_employees = sorted(self.employees, key=lambda x: x['salary'])
            
            for employee in sorted_employees:
                salary_color = 'green' if employee['salary'] > 50000 else 'grey'
                salary_weight = 'bold' if employee['salary'] > 50000 else 'normal'
                
                employee_card = flet.Container(
                    content=flet.Row(
                        controls=[
                            flet.Column(
                                controls=[
                                    flet.Text(
                                        f"{employee['first_name']} {employee['last_name']}", 
                                        size=16, 
                                        weight='bold'
                                    ),
                                    flet.Text(
                                        f"Должность: {employee['position']}", 
                                        size=14
                                    ),
                                    flet.Text(
                                        f"Возраст: {employee['age']} лет", 
                                        size=14
                                    ),
                                    flet.Text(
                                        f"Зарплата: {employee['salary']} руб.", 
                                        size=14,
                                        color=salary_color,
                                        weight=salary_weight
                                    ),
                                ],
                                spacing=5,
                                expand=True
                            ),
                            flet.ElevatedButton(
                                "Удалить",
                                color='white',
                                bgcolor='red',
                                on_click=self.delete_employee(employee)
                            )
                        ],
                        alignment=flet.MainAxisAlignment.SPACE_BETWEEN
                    ),
                    bgcolor='lightblue' if employee['salary'] > 100000 else 'lightgray',
                    border_radius=10,
                    padding=15,
                    border=flet.border.all(1, 'gray')
                )
                
                self.employees_list.controls.append(employee_card)
        
        self.page.update()
    
    def clear_form(self, e):
        """Очистка формы"""
        self.first_name.value = ""
        self.last_name.value = ""
        self.age.value = ""
        self.position.value = None
        self.salary.value = ""
        self.error_text.value = ""
        self.page.update()


def main(page: flet.Page):
    EmployeeCatalogApp(page)


if __name__ == '__main__':
    flet.app(target=main)