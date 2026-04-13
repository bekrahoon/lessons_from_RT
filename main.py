import flet as ft
import sqlite3
import os
from datetime import datetime

DB_PATH = "employees.db"

# ─────────────────────────── DATABASE ────────────────────────────

def get_conn():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    with get_conn() as conn:
        conn.execute("""
            CREATE TABLE IF NOT EXISTS employees (
                id          INTEGER PRIMARY KEY AUTOINCREMENT,
                full_name   TEXT    NOT NULL,
                position    TEXT    NOT NULL,
                department  TEXT    NOT NULL,
                phone       TEXT,
                email       TEXT,
                salary      REAL,
                hire_date   TEXT
            )
        """)
        conn.commit()

def fetch_employees(search="", sort_col="id", sort_asc=True):
    order = "ASC" if sort_asc else "DESC"
    allowed = {"id","full_name","position","department","phone","email","salary","hire_date"}
    if sort_col not in allowed:
        sort_col = "id"
    q = f"%{search}%"
    with get_conn() as conn:
        rows = conn.execute(f"""
            SELECT * FROM employees
            WHERE full_name LIKE ? OR position LIKE ? OR department LIKE ?
               OR phone LIKE ? OR email LIKE ?
            ORDER BY {sort_col} {order}
        """, (q,q,q,q,q)).fetchall()
    return [dict(r) for r in rows]

def insert_employee(data):
    with get_conn() as conn:
        conn.execute("""
            INSERT INTO employees (full_name,position,department,phone,email,salary,hire_date)
            VALUES (:full_name,:position,:department,:phone,:email,:salary,:hire_date)
        """, data)
        conn.commit()

def update_employee(eid, data):
    with get_conn() as conn:
        conn.execute("""
            UPDATE employees SET full_name=:full_name, position=:position,
            department=:department, phone=:phone, email=:email,
            salary=:salary, hire_date=:hire_date WHERE id=:id
        """, {**data, "id": eid})
        conn.commit()

def delete_employee(eid):
    with get_conn() as conn:
        conn.execute("DELETE FROM employees WHERE id=?", (eid,))
        conn.commit()

def count_employees():
    with get_conn() as conn:
        total = conn.execute("SELECT COUNT(*) FROM employees").fetchone()[0]
        depts = conn.execute("SELECT COUNT(DISTINCT department) FROM employees").fetchone()[0]
        avg_s = conn.execute("SELECT AVG(salary) FROM employees").fetchone()[0]
    return total, depts, avg_s or 0

# ──────────────────────────── APP ────────────────────────────────

COLS = [
    ("id",         "#",           50),
    ("full_name",  "ФИО",         180),
    ("position",   "Должность",   150),
    ("department", "Отдел",       130),
    ("phone",      "Телефон",     130),
    ("email",      "Email",       170),
    ("salary",     "Зарплата",    110),
    ("hire_date",  "Дата найма",  120),
]

PRIMARY   = "#1A56DB"
PRIMARY_L = "#EBF2FF"
ACCENT    = "#0E9F6E"
DANGER    = "#E02424"
BG        = "#F9FAFB"
SURFACE   = "#FFFFFF"
BORDER    = "#E5E7EB"
TEXT      = "#111827"
SUBTEXT   = "#6B7280"

def main(page: ft.Page):
    page.title = "Управление сотрудниками"
    page.bgcolor = BG
    page.window_width  = 1200
    page.window_height = 780
    page.window_min_width  = 900
    page.window_min_height = 600
    page.fonts = {}
    page.theme = ft.Theme(color_scheme_seed=PRIMARY)

    init_db()

    state = {"search": "", "sort_col": "id", "sort_asc": True, "selected": None}

    # ── helpers ──────────────────────────────────────────────────
    def card(content, padding=16, expand=False, width=None):
        return ft.Container(
            content=content,
            bgcolor=SURFACE,
            border_radius=12,
            padding=padding,
            border=ft.border.all(1, BORDER),
            expand=expand,
            width=width,
            shadow=ft.BoxShadow(blur_radius=4, color="#0000000A", offset=ft.Offset(0,1))
        )

    def badge(label, color, bg):
        return ft.Container(
            content=ft.Text(label, size=11, color=color, weight=ft.FontWeight.W_600),
            bgcolor=bg, border_radius=20,
            padding=ft.padding.symmetric(horizontal=8, vertical=2),
        )

    # ── stat cards ───────────────────────────────────────────────
    stat_total = ft.Text("0", size=28, weight=ft.FontWeight.BOLD, color=TEXT)
    stat_depts = ft.Text("0", size=28, weight=ft.FontWeight.BOLD, color=TEXT)
    stat_avg   = ft.Text("0 ₽", size=28, weight=ft.FontWeight.BOLD, color=TEXT)

    def stat_card(icon, label, value_ctrl, icon_color, icon_bg):
        return card(
            ft.Row([
                ft.Container(
                    ft.Icon(icon, color=icon_color, size=22),
                    bgcolor=icon_bg, border_radius=10,
                    padding=10, width=44, height=44,
                    alignment=ft.alignment.center,
                ),
                ft.Column([
                    ft.Text(label, size=12, color=SUBTEXT),
                    value_ctrl,
                ], spacing=0, tight=True),
            ], spacing=14),
            expand=True,
        )

    stats_row = ft.Row([
        stat_card(ft.icons.PEOPLE, "Всего сотрудников", stat_total, PRIMARY, PRIMARY_L),
        stat_card(ft.icons.BUSINESS, "Отделов",          stat_depts, ACCENT,  "#D1FAE5"),
        stat_card(ft.icons.PAYMENTS, "Средняя зарплата", stat_avg,   "#7C3AED","#EDE9FE"),
    ], spacing=12, expand=False)

    def refresh_stats():
        total, depts, avg = count_employees()
        stat_total.value = str(total)
        stat_depts.value = str(depts)
        stat_avg.value   = f"{avg:,.0f} ₽"

    # ── table ────────────────────────────────────────────────────
    table_rows = ft.Column(spacing=0, scroll=ft.ScrollMode.AUTO, expand=True)

    def sort_header(col_key, label, width):
        is_active = state["sort_col"] == col_key
        arrow = ""
        if is_active:
            arrow = " ↑" if state["sort_asc"] else " ↓"
        def on_click(_):
            if state["sort_col"] == col_key:
                state["sort_asc"] = not state["sort_asc"]
            else:
                state["sort_col"] = col_key
                state["sort_asc"] = True
            refresh_table()
        return ft.Container(
            content=ft.Text(label + arrow, size=12, weight=ft.FontWeight.W_600,
                            color=PRIMARY if is_active else SUBTEXT),
            width=width, on_click=on_click,
            tooltip=f"Сортировать по: {label}",
        )

    def table_header():
        cells = [sort_header(k, lbl, w) for k,lbl,w in COLS]
        cells.append(ft.Container(ft.Text("Действия", size=12, weight=ft.FontWeight.W_600,
                                          color=SUBTEXT), width=100))
        return ft.Container(
            content=ft.Row(cells, spacing=4),
            bgcolor="#F3F4F6", border_radius=ft.border_radius.only(8,8,0,0),
            padding=ft.padding.symmetric(horizontal=12, vertical=10),
            border=ft.border.only(bottom=ft.BorderSide(1, BORDER)),
        )

    def build_row(emp, idx):
        bg = SURFACE if idx % 2 == 0 else "#FAFAFA"

        def on_edit(_):   open_dialog(emp)
        def on_delete(_): confirm_delete(emp)

        cells = []
        for col_key, _, width in COLS:
            val = emp.get(col_key, "") or ""
            if col_key == "salary" and val:
                try:    display = f"{float(val):,.0f} ₽"
                except: display = str(val)
            else:
                display = str(val)
            cells.append(
                ft.Container(
                    ft.Text(display, size=13, color=TEXT,
                            overflow=ft.TextOverflow.ELLIPSIS, max_lines=1),
                    width=width,
                )
            )
        action_cell = ft.Container(
            ft.Row([
                ft.IconButton(ft.icons.EDIT, icon_color=PRIMARY,
                              icon_size=18, tooltip="Редактировать",
                              on_click=on_edit,
                              style=ft.ButtonStyle(padding=4)),
                ft.IconButton(ft.icons.DELETE, icon_color=DANGER,
                              icon_size=18, tooltip="Удалить",
                              on_click=on_delete,
                              style=ft.ButtonStyle(padding=4)),
            ], spacing=0),
            width=100,
        )
        cells.append(action_cell)

        return ft.Container(
            content=ft.Row(cells, spacing=4),
            bgcolor=bg, padding=ft.padding.symmetric(horizontal=12, vertical=8),
            border=ft.border.only(bottom=ft.BorderSide(1, BORDER)),
        )

    empty_state = ft.Container(
        content=ft.Column([
            ft.Icon(ft.icons.PEOPLE_OUTLINE, size=56, color=BORDER),
            ft.Text("Нет сотрудников", size=16, color=SUBTEXT, weight=ft.FontWeight.W_500),
            ft.Text("Добавьте первого сотрудника кнопкой выше", size=13, color=SUBTEXT),
        ], horizontal_alignment=ft.CrossAxisAlignment.CENTER, spacing=8),
        alignment=ft.alignment.center, padding=40, visible=False,
    )

    def refresh_table():
        rows = fetch_employees(state["search"], state["sort_col"], state["sort_asc"])
        table_rows.controls.clear()
        table_rows.controls.append(table_header())
        if not rows:
            empty_state.visible = True
            table_rows.controls.append(empty_state)
        else:
            empty_state.visible = False
            for i, emp in enumerate(rows):
                table_rows.controls.append(build_row(emp, i))
        refresh_stats()
        page.update()

    # ── search ───────────────────────────────────────────────────
    def on_search(e):
        state["search"] = e.control.value.strip()
        refresh_table()

    search_field = ft.TextField(
        hint_text="Поиск по ФИО, должности, отделу, телефону…",
        prefix_icon=ft.icons.SEARCH,
        border_color=BORDER,
        focused_border_color=PRIMARY,
        border_radius=10,
        height=44,
        text_size=13,
        on_change=on_search,
        expand=True,
    )

    # ── add / edit dialog ────────────────────────────────────────
    dlg_title   = ft.Text("", size=18, weight=ft.FontWeight.BOLD, color=TEXT)
    f_name      = ft.TextField(label="ФИО *", border_color=BORDER,
                               focused_border_color=PRIMARY, text_size=13)
    f_position  = ft.TextField(label="Должность *", border_color=BORDER,
                               focused_border_color=PRIMARY, text_size=13)
    f_dept      = ft.TextField(label="Отдел *", border_color=BORDER,
                               focused_border_color=PRIMARY, text_size=13)
    f_phone     = ft.TextField(label="Телефон", border_color=BORDER,
                               focused_border_color=PRIMARY, text_size=13)
    f_email     = ft.TextField(label="Email", border_color=BORDER,
                               focused_border_color=PRIMARY, text_size=13)
    f_salary    = ft.TextField(label="Зарплата (₽)", border_color=BORDER,
                               focused_border_color=PRIMARY, text_size=13,
                               keyboard_type=ft.KeyboardType.NUMBER)
    f_hire      = ft.TextField(label="Дата найма (ГГГГ-ММ-ДД)", border_color=BORDER,
                               focused_border_color=PRIMARY, text_size=13,
                               hint_text=datetime.today().strftime("%Y-%m-%d"))
    dlg_error   = ft.Text("", color=DANGER, size=12)
    dlg_edit_id = {"id": None}

    def clear_dlg():
        for f in (f_name,f_position,f_dept,f_phone,f_email,f_salary,f_hire):
            f.value = ""
            f.error_text = ""
        dlg_error.value = ""
        dlg_edit_id["id"] = None

    def save_employee(_):
        # validate
        ok = True
        for f, name in [(f_name,"ФИО"),(f_position,"Должность"),(f_dept,"Отдел")]:
            if not (f.value or "").strip():
                f.error_text = f"Поле обязательно"
                ok = False
            else:
                f.error_text = ""
        salary_val = None
        if f_salary.value:
            try:
                salary_val = float(f_salary.value.replace(",",".").replace(" ",""))
                f_salary.error_text = ""
            except:
                f_salary.error_text = "Введите число"
                ok = False
        if not ok:
            page.update()
            return
        data = {
            "full_name":  f_name.value.strip(),
            "position":   f_position.value.strip(),
            "department": f_dept.value.strip(),
            "phone":      f_phone.value.strip(),
            "email":      f_email.value.strip(),
            "salary":     salary_val,
            "hire_date":  f_hire.value.strip(),
        }
        if dlg_edit_id["id"]:
            update_employee(dlg_edit_id["id"], data)
        else:
            insert_employee(data)
        page.dialog.open = False
        page.update()
        refresh_table()

    def close_dlg(_):
        page.dialog.open = False
        page.update()

    dlg = ft.AlertDialog(
        modal=True,
        shape=ft.RoundedRectangleBorder(radius=14),
        title=dlg_title,
        content=ft.Container(
            content=ft.Column([
                ft.Row([f_name, f_position], spacing=12),
                ft.Row([f_dept, f_phone],    spacing=12),
                ft.Row([f_email, f_salary],  spacing=12),
                f_hire,
                dlg_error,
            ], spacing=14, tight=True),
            width=560,
        ),
        actions=[
            ft.TextButton("Отмена", on_click=close_dlg,
                          style=ft.ButtonStyle(color=SUBTEXT)),
            ft.ElevatedButton("Сохранить", on_click=save_employee,
                              bgcolor=PRIMARY, color="white",
                              style=ft.ButtonStyle(shape=ft.RoundedRectangleBorder(radius=8))),
        ],
        actions_alignment=ft.MainAxisAlignment.END,
    )
    page.dialog = dlg

    def open_dialog(emp=None):
        clear_dlg()
        if emp:
            dlg_title.value   = "✏️  Редактировать сотрудника"
            dlg_edit_id["id"] = emp["id"]
            f_name.value      = emp.get("full_name","")
            f_position.value  = emp.get("position","")
            f_dept.value      = emp.get("department","")
            f_phone.value     = emp.get("phone","") or ""
            f_email.value     = emp.get("email","") or ""
            f_salary.value    = str(emp["salary"]) if emp.get("salary") else ""
            f_hire.value      = emp.get("hire_date","") or ""
        else:
            dlg_title.value = "➕  Добавить сотрудника"
        page.dialog.open = True
        page.update()

    # ── delete confirm ───────────────────────────────────────────
    del_dlg = ft.AlertDialog(
        modal=True,
        shape=ft.RoundedRectangleBorder(radius=14),
        title=ft.Text("Удалить сотрудника?", size=18, weight=ft.FontWeight.BOLD, color=TEXT),
        content=ft.Text("Это действие нельзя отменить.", color=SUBTEXT),
        actions_alignment=ft.MainAxisAlignment.END,
    )

    def confirm_delete(emp):
        def do_delete(_):
            delete_employee(emp["id"])
            del_dlg.open = False
            page.update()
            refresh_table()
        def cancel(_):
            del_dlg.open = False
            page.update()
        del_dlg.content = ft.Text(
            f'Удалить «{emp["full_name"]}» из базы данных?', color=SUBTEXT
        )
        del_dlg.actions = [
            ft.TextButton("Отмена", on_click=cancel,
                          style=ft.ButtonStyle(color=SUBTEXT)),
            ft.ElevatedButton("Удалить", on_click=do_delete,
                              bgcolor=DANGER, color="white",
                              style=ft.ButtonStyle(shape=ft.RoundedRectangleBorder(radius=8))),
        ]
        page.dialog = del_dlg
        del_dlg.open = True
        page.update()

    # ── layout ───────────────────────────────────────────────────
    add_btn = ft.ElevatedButton(
        "＋  Добавить сотрудника",
        bgcolor=PRIMARY, color="white",
        height=44,
        on_click=lambda _: open_dialog(),
        style=ft.ButtonStyle(shape=ft.RoundedRectangleBorder(radius=10)),
    )

    toolbar = ft.Row([search_field, add_btn], spacing=12)

    table_container = card(
        ft.Column([table_rows], expand=True, scroll=ft.ScrollMode.AUTO),
        padding=0, expand=True
    )

    page.add(
        ft.Column([
            # header
            ft.Container(
                ft.Row([
                    ft.Column([
                        ft.Text("👥 Сотрудники", size=24,
                                weight=ft.FontWeight.BOLD, color=TEXT),
                        ft.Text("Управление базой данных сотрудников",
                                size=13, color=SUBTEXT),
                    ], spacing=2),
                ]),
                padding=ft.padding.only(bottom=4),
            ),
            stats_row,
            toolbar,
            table_container,
        ],
        spacing=16, expand=True,
        )
    )

    refresh_table()

ft.app(target=main)