# backend/console_mail.py
"""Console Email Backend für lokale Entwicklung"""
import sys


class ConsoleMailBackend:
    """
    Email-Backend das Emails in die Console schreibt statt sie zu versenden.
    Nützlich für lokale Entwicklung ohne SMTP-Server.
    """

    def __init__(self, app=None):
        self.app = app

    def send(self, message):
        """Email in Console ausgeben"""
        print("\n" + "="*80)
        print("📧 EMAIL WÜRDE GESENDET WERDEN")
        print("="*80)
        print(f"Von: {message.sender}")
        print(f"An: {', '.join(message.recipients)}")
        print(f"Betreff: {message.subject}")
        print("-"*80)
        print(message.body)
        print("="*80 + "\n")
        sys.stdout.flush()
        return True

    def send_messages(self, messages):
        """Mehrere Emails senden"""
        for message in messages:
            self.send(message)
        return len(messages)
