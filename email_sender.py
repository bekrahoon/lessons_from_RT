import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

# ── Настройки отправителя ────────────────────────────────────────────────────
# Замените на свою Gmail-почту и App Password
# App Password: myaccount.google.com → Безопасность → Пароли приложений
SENDER_EMAIL    = "accaunt@iuca.kg"
SENDER_PASSWORD = "XXXX XXXX XXXX"   # App Password (не основной пароль!)


def send_notification(to_email: str, name: str, resume_text: str) -> bool:
    """
    Отправляет письмо на to_email с подтверждением создания анкеты.
    Возвращает True при успехе, False при ошибке.
    """
    try:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = "✅ Ваша анкета успешно создана!"
        msg["From"]    = SENDER_EMAIL
        msg["To"]      = to_email

        html = f"""
        <html><body style="font-family:Arial,sans-serif;background:#f4f4f4;padding:20px">
          <div style="max-width:500px;margin:auto;background:white;border-radius:10px;padding:24px">
            <h2 style="color:#1e88e5">Привет, {name}! 👋</h2>
            <p>Твоя анкета успешно создана. Вот что мы сохранили:</p>
            <pre style="background:#f0f0f0;padding:12px;border-radius:6px;font-size:14px">{resume_text}</pre>
            <p style="color:#888;font-size:12px;margin-top:20px">
              Это автоматическое письмо — отвечать на него не нужно.
            </p>
          </div>
        </body></html>
        """

        part = MIMEText(html, "html", "utf-8")
        msg.attach(part)

        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
            server.login(SENDER_EMAIL, SENDER_PASSWORD)
            server.sendmail(SENDER_EMAIL, to_email, msg.as_string())

        return True

    except smtplib.SMTPAuthenticationError:
        print("[email] Ошибка авторизации — проверьте SENDER_EMAIL и SENDER_PASSWORD")
        return False
    except Exception as ex:
        print(f"[email] Ошибка отправки: {ex}")
        return False