import flet as ft
import json
import os
import threading
import time
from datetime import datetime, date

TASKS_FILE = "tasks.json"


def load_tasks():
    if os.path.exists(TASKS_FILE):
        with open(TASKS_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    return []


def save_tasks(tasks):
    with open(TASKS_FILE, "w", encoding="utf-8") as f:
        json.dump(tasks, f, ensure_ascii=False, indent=2)


def main(page: ft.Page):
    page.title = "Task Manager"
    page.theme_mode = ft.ThemeMode.DARK
    page.bgcolor = "#0D1117"
    page.window_width = 820
    page.window_height = 720
    page.padding = 0

    tasks = load_tasks()
    search_query = {"value": ""}
    filter_value = {"value": "all"}

    # ─── DEADLINE POPUP ─────────────────────────────────────────────
    def show_deadline_popup(title, deadline_str):
        try:
            deadline_fmt = datetime.strptime(deadline_str, "%Y-%m-%d").strftime("%d.%m.%Y")
        except Exception:
            deadline_fmt = deadline_str

        def close_popup(e):
            popup_dialog.open = False
            page.update()

        popup_dialog = ft.AlertDialog(
            modal=True,
            title=ft.Row([
                ft.Icon(ft.Icons.WARNING_AMBER, color="#FF6B6B", size=28),
                ft.Text(" Дедлайн просрочен!", color="#FF6B6B", size=18, weight=ft.FontWeight.BOLD),
            ]),
            content=ft.Column([
                ft.Text("Задача:", color="#8B949E", size=13),
                ft.Text(f'"{title}"', color="#E6EDF3", size=15, weight=ft.FontWeight.W_600),
                ft.Container(height=8),
                ft.Text(f"Дедлайн был: {deadline_fmt}", color="#FF6B6B", size=14),
                ft.Text("Задача не выполнена вовремя!", color="#8B949E", size=13),
            ], tight=True, spacing=4),
            actions=[ft.TextButton("Понял, исправлюсь", on_click=close_popup, style=ft.ButtonStyle(color="#58A6FF"))],
            bgcolor="#161B22",
            shape=ft.RoundedRectangleBorder(radius=12),
        )
        page.dialog = popup_dialog
        popup_dialog.open = True
        page.update()

    # ─── DEADLINE CHECKER ───────────────────────────────────────────
    def check_deadlines_loop():
        time.sleep(2)
        while True:
            now = datetime.now()
            changed = False
            for task in tasks:
                if task.get("done"):
                    continue
                dl = task.get("deadline")
                if not dl:
                    continue
                try:
                    deadline_dt = datetime.strptime(dl, "%Y-%m-%d")
                    if deadline_dt.date() < now.date() and not task.get("notified"):
                        task["notified"] = True
                        changed = True
                        page.run_thread(lambda t=task: show_deadline_popup(t["title"], t["deadline"]))
                        time.sleep(0.5)
                except Exception:
                    pass
            if changed:
                save_tasks(tasks)
            time.sleep(60)

    threading.Thread(target=check_deadlines_loop, daemon=True).start()

    # ─── STATS ──────────────────────────────────────────────────────
    stat_total = ft.Text("0", size=26, weight=ft.FontWeight.BOLD, color="#58A6FF")
    stat_done = ft.Text("0", size=26, weight=ft.FontWeight.BOLD, color="#3FB950")
    stat_pending = ft.Text("0", size=26, weight=ft.FontWeight.BOLD, color="#F0883E")
    stat_overdue = ft.Text("0", size=26, weight=ft.FontWeight.BOLD, color="#FF6B6B")
    progress_bar = ft.ProgressBar(value=0, bgcolor="#21262D", color="#58A6FF", height=6)

    def update_stats():
        total = len(tasks)
        done_count = sum(1 for t in tasks if t.get("done"))
        pending = total - done_count
        now_date = date.today()
        overdue = sum(
            1 for t in tasks
            if not t.get("done") and t.get("deadline")
            and datetime.strptime(t["deadline"], "%Y-%m-%d").date() < now_date
        )

        stat_total.value = str(total)
        stat_done.value = str(done_count)
        stat_pending.value = str(pending)
        stat_overdue.value = str(overdue)
        progress_bar.value = (done_count / total) if total > 0 else 0
        page.update()

    # ─── TASK CARDS ─────────────────────────────────────────────────
    tasks_column = ft.Column(spacing=8, scroll=ft.ScrollMode.AUTO, expand=True)

    def get_deadline_color(deadline_str, done):
        if not deadline_str:
            return "#8B949E"
        try:
            dl = datetime.strptime(deadline_str, "%Y-%m-%d").date()
            today = date.today()
            if done: return "#3FB950"
            if dl < today: return "#FF6B6B"
            if (dl - today).days <= 2: return "#F0883E"
            return "#58A6FF"
        except Exception:
            return "#8B949E"

    def build_task_card(task, index):
        done = task.get("done", False)
        dl = task.get("deadline", "")
        dl_color = get_deadline_color(dl, done)
        try:
            dl_display = datetime.strptime(dl, "%Y-%m-%d").strftime("%d.%m.%Y") if dl else "Без дедлайна"
        except Exception:
            dl_display = "Без дедлайна"

        overdue = dl and not done and datetime.strptime(dl, "%Y-%m-%d").date() < date.today()

        def toggle_done(e, idx=index):
            tasks[idx]["done"] = not tasks[idx]["done"]
            if tasks[idx]["done"]:
                tasks[idx]["notified"] = False
            save_tasks(tasks)
            refresh_tasks()

        def delete_task(e, idx=index):
            def confirm_delete(e2):
                del tasks[idx]
                save_tasks(tasks)
                confirm_dialog.open = False
                refresh_tasks()

            def cancel_delete(e2):
                confirm_dialog.open = False
                page.update()

            confirm_dialog = ft.AlertDialog(
                modal=True,
                title=ft.Text("Удалить задачу?", color="#E6EDF3"),
                content=ft.Text(f'"{tasks[idx]["title"]}"', color="#8B949E"),
                actions=[
                    ft.TextButton("Отмена", on_click=cancel_delete, style=ft.ButtonStyle(color="#8B949E")),
                    ft.TextButton("Удалить", on_click=confirm_delete, style=ft.ButtonStyle(color="#FF6B6B")),
                ],
                bgcolor="#161B22",
                shape=ft.RoundedRectangleBorder(radius=12),
            )
            page.dialog = confirm_dialog
            confirm_dialog.open = True
            page.update()

        priority = task.get("priority", "medium")
        priority_colors = {"high": "#FF6B6B", "medium": "#F0883E", "low": "#3FB950"}
        priority_labels = {"high": "Высокий", "medium": "Средний", "low": "Низкий"}
        p_color = priority_colors.get(priority, "#8B949E")

        title_color = "#8B949E" if done else "#E6EDF3"
        title_decoration = ft.TextDecoration.LINE_THROUGH if done else None
        dl_icon = ft.Icons.TIMER_OFF if overdue else ft.Icons.ACCESS_TIME

        return ft.Container(
            content=ft.Row([
                ft.Checkbox(
                    value=done,
                    on_change=toggle_done,
                    # ←←←←←←←←←← ИСПРАВЛЕНИЕ ЗДЕСЬ
                    fill_color={
                        ft.ControlState.SELECTED: "#58A6FF",
                        ft.ControlState.DEFAULT: "#30363D",
                    },
                    check_color="#0D1117",
                ),
                ft.Column([
                    ft.Text(task["title"], size=14, weight=ft.FontWeight.W_500, color=title_color,
                            style=ft.TextStyle(decoration=title_decoration), overflow=ft.TextOverflow.ELLIPSIS),
                    ft.Row([
                        ft.Container(
                            content=ft.Text(priority_labels.get(priority, ""), size=10, color=p_color, weight=ft.FontWeight.BOLD),
                            bgcolor=f"{p_color}22", border_radius=4,
                            padding=ft.padding.symmetric(horizontal=6, vertical=2),
                        ),
                        ft.Icon(dl_icon, size=13, color=dl_color),
                        ft.Text(dl_display, size=12, color=dl_color),
                    ], spacing=6),
                ], spacing=4, expand=True),
                ft.IconButton(icon=ft.Icons.DELETE_OUTLINE, icon_color="#FF6B6B", icon_size=18,
                              tooltip="Удалить", on_click=delete_task),
            ]),
            bgcolor="#0D1117" if done else "#161B22",
            border=ft.border.all(1, "#FF6B6B44" if overdue else "#21262D"),
            border_radius=10,
            padding=ft.padding.symmetric(horizontal=12, vertical=8),
        )

    # ─── FILTER & REFRESH ───────────────────────────────────────────
    filter_row = ft.Row(spacing=4)

    def make_filter_btn(label, value, icon):
        is_active = filter_value["value"] == value
        def on_click(e):
            filter_value["value"] = value
            apply_filter()
        return ft.TextButton(
            content=ft.Row([ft.Icon(icon, size=13),
                            ft.Text(label, size=12, weight=ft.FontWeight.W_600 if is_active else ft.FontWeight.NORMAL)],
                           spacing=4, tight=True),
            on_click=on_click,
            style=ft.ButtonStyle(
                color={"": "#58A6FF" if is_active else "#8B949E"},
                bgcolor={"": "#1F6FEB22" if is_active else "transparent"},
                shape=ft.RoundedRectangleBorder(radius=8),
            ),
        )

    def apply_filter():
        filter_row.controls = [
            make_filter_btn("Все", "all", ft.Icons.LIST),
            make_filter_btn("Активные", "active", ft.Icons.RADIO_BUTTON_UNCHECKED),
            make_filter_btn("Выполненные", "done", ft.Icons.CHECK_CIRCLE_OUTLINE),
            make_filter_btn("Просроченные", "overdue", ft.Icons.TIMER_OFF),
        ]

        q = search_query["value"].lower()
        today = date.today()
        tasks_column.controls.clear()
        filtered = []

        for i, t in enumerate(tasks):
            if q and q not in t["title"].lower():
                continue
            fv = filter_value["value"]
            if fv == "done" and not t.get("done"): continue
            if fv == "active" and t.get("done"): continue
            if fv == "overdue":
                dl = t.get("deadline")
                if not dl or t.get("done"):
                    continue
                try:
                    if datetime.strptime(dl, "%Y-%m-%d").date() >= today:
                        continue
                except Exception:
                    continue
            filtered.append((i, t))

        if not filtered:
            tasks_column.controls.append(
                ft.Container(
                    content=ft.Column([
                        ft.Icon(ft.Icons.INBOX, size=48, color="#21262D"),
                        ft.Text("Нет задач", color="#484F58", size=15),
                    ], horizontal_alignment=ft.CrossAxisAlignment.CENTER, spacing=8),
                    alignment=ft.Alignment(0, 0),
                    expand=True,
                    padding=60,
                )
            )
        else:
            for i, task in filtered:
                tasks_column.controls.append(build_task_card(task, i))
        page.update()

    def refresh_tasks():
        apply_filter()
        update_stats()

    # ─── ADD TASK FORM ──────────────────────────────────────────────
    new_task_field = ft.TextField(
        hint_text="Введите название задачи...",
        bgcolor="#161B22",
        border_color="#30363D",
        focused_border_color="#58A6FF",
        color="#E6EDF3",
        hint_style=ft.TextStyle(color="#484F58"),
        border_radius=10,
        content_padding=ft.padding.symmetric(horizontal=14, vertical=12),
        expand=True,
    )

    selected_deadline = {"value": None}
    deadline_label = ft.Text("Выбрать дедлайн", color="#8B949E", size=13)

    deadline_picker = ft.DatePicker(first_date=datetime.now(), last_date=datetime(2030, 12, 31))
    page.overlay.append(deadline_picker)

    def on_date_change(e):
        if deadline_picker.value:
            selected_deadline["value"] = deadline_picker.value.strftime("%Y-%m-%d")
            deadline_label.value = deadline_picker.value.strftime("📅 %d.%m.%Y")
            deadline_label.color = "#58A6FF"
        page.update()

    deadline_picker.on_change = on_date_change

    def open_date_picker(e):
        deadline_picker.open = True
        page.update()

    deadline_btn = ft.Button(
        content=ft.Row([
            ft.Icon(ft.Icons.CALENDAR_MONTH, size=15, color="#8B949E"),
            deadline_label,
        ], spacing=6, tight=True),
        on_click=open_date_picker,
        bgcolor="#21262D",
        color="#E6EDF3",
        style=ft.ButtonStyle(shape=ft.RoundedRectangleBorder(radius=10)),
    )

    priority_value = {"value": "medium"}

    priority_dd = ft.Dropdown(
        options=[
            ft.dropdown.Option("high", "🔴 Высокий"),
            ft.dropdown.Option("medium", "🟡 Средний"),
            ft.dropdown.Option("low", "🟢 Низкий"),
        ],
        value="medium",
        bgcolor="#161B22",
        border_color="#30363D",
        focused_border_color="#58A6FF",
        color="#E6EDF3",
        border_radius=10,
        content_padding=ft.padding.symmetric(horizontal=12, vertical=8),
        width=145,
    )
    priority_dd.on_change = lambda e: priority_value.update({"value": e.control.value})

    def add_task(e):
        title = new_task_field.value.strip()
        if not title:
            new_task_field.error_text = "Введите название задачи"
            page.update()
            return
        new_task_field.error_text = None

        tasks.append({
            "title": title,
            "done": False,
            "deadline": selected_deadline["value"],
            "priority": priority_value["value"],
            "created": datetime.now().strftime("%Y-%m-%d %H:%M"),
            "notified": False,
        })
        save_tasks(tasks)
        new_task_field.value = ""
        selected_deadline["value"] = None
        deadline_label.value = "Выбрать дедлайн"
        deadline_label.color = "#8B949E"
        refresh_tasks()

    new_task_field.on_submit = add_task

    add_btn = ft.Button(
        content=ft.Row([ft.Icon(ft.Icons.ADD, size=18), ft.Text("Добавить", size=13, weight=ft.FontWeight.W_600)], spacing=6, tight=True),
        on_click=add_task,
        bgcolor="#1F6FEB",
        color="#FFFFFF",
        style=ft.ButtonStyle(shape=ft.RoundedRectangleBorder(radius=10)),
    )

    search_field = ft.TextField(
        hint_text="🔍 Поиск задач...",
        bgcolor="#161B22",
        border_color="#30363D",
        focused_border_color="#58A6FF",
        color="#E6EDF3",
        hint_style=ft.TextStyle(color="#484F58"),
        border_radius=10,
        content_padding=ft.padding.symmetric(horizontal=14, vertical=10),
        on_change=lambda e: (search_query.update({"value": e.control.value}), refresh_tasks()),
    )

    # ─── LAYOUT ─────────────────────────────────────────────────────
    header = ft.Container(
        content=ft.Row([
            ft.Row([ft.Icon(ft.Icons.CHECK_BOX, color="#58A6FF", size=22),
                    ft.Text("Task Manager", size=20, weight=ft.FontWeight.BOLD, color="#E6EDF3")], spacing=10),
            ft.Text("сохранено в tasks.json", size=11, color="#484F58"),
        ], alignment=ft.MainAxisAlignment.SPACE_BETWEEN),
        bgcolor="#161B22",
        padding=ft.padding.symmetric(horizontal=20, vertical=14),
        border=ft.border.only(bottom=ft.border.BorderSide(1, "#21262D")),
    )

    stats_section = ft.Container(
        content=ft.Column([
            ft.Text("Статистика", size=12, color="#8B949E", weight=ft.FontWeight.W_600),
            ft.Row([
                ft.Container(content=ft.Column([stat_total, ft.Text("Всего", size=11, color="#8B949E")],
                                               horizontal_alignment=ft.CrossAxisAlignment.CENTER, spacing=2),
                             expand=True, bgcolor="#161B22", border_radius=10, padding=12,
                             border=ft.border.all(1, "#21262D")),
                ft.Container(content=ft.Column([stat_done, ft.Text("Готово", size=11, color="#8B949E")],
                                               horizontal_alignment=ft.CrossAxisAlignment.CENTER, spacing=2),
                             expand=True, bgcolor="#161B22", border_radius=10, padding=12,
                             border=ft.border.all(1, "#21262D")),
                ft.Container(content=ft.Column([stat_pending, ft.Text("Осталось", size=11, color="#8B949E")],
                                               horizontal_alignment=ft.CrossAxisAlignment.CENTER, spacing=2),
                             expand=True, bgcolor="#161B22", border_radius=10, padding=12,
                             border=ft.border.all(1, "#21262D")),
                ft.Container(content=ft.Column([stat_overdue, ft.Text("Просрочено", size=11, color="#8B949E")],
                                               horizontal_alignment=ft.CrossAxisAlignment.CENTER, spacing=2),
                             expand=True, bgcolor="#161B22", border_radius=10, padding=12,
                             border=ft.border.all(1, "#21262D")),
            ], spacing=8),
            ft.Text("Прогресс выполнения", size=11, color="#8B949E"),
            progress_bar,
        ], spacing=8),
        bgcolor="#0D1117",
        padding=ft.padding.all(16),
        border=ft.border.only(bottom=ft.border.BorderSide(1, "#21262D")),
    )

    add_form = ft.Container(
        content=ft.Column([
            ft.Text("Новая задача", size=12, color="#8B949E", weight=ft.FontWeight.W_600),
            ft.Row([new_task_field, add_btn], spacing=8),
            ft.Row([deadline_btn, priority_dd], spacing=8),
        ], spacing=10),
        bgcolor="#0D1117",
        padding=ft.padding.all(16),
        border=ft.border.only(bottom=ft.border.BorderSide(1, "#21262D")),
    )

    filter_search = ft.Container(
        content=ft.Column([search_field, filter_row], spacing=8),
        bgcolor="#0D1117",
        padding=ft.padding.symmetric(horizontal=16, vertical=12),
        border=ft.border.only(bottom=ft.border.BorderSide(1, "#21262D")),
    )

    page.add(
        ft.Column([
            header, stats_section, add_form, filter_search,
            ft.Container(content=tasks_column, expand=True, padding=ft.padding.symmetric(horizontal=16, vertical=8)),
        ], spacing=0, expand=True)
    )

    refresh_tasks()


# ─── ЗАПУСК ─────────────────────────────────────────────────────
if __name__ == "__main__":
    ft.run(main)