from telethon import TelegramClient
from asgiref.sync import async_to_sync
from rest_framework import serializers
from dotenv import load_dotenv
import os

load_dotenv()

def send_telegram_message(target_phone: str, message: str):
    
    async def main():
        client = TelegramClient('telegram_session', os.getenv('TELEGRAM_API_ID'), os.getenv('TELEGRAM_API_HASH'))
        await client.start(phone=os.getenv('TELEGRAM_PHONE_NUMBER'))
        try:
            entity = await client.get_entity(target_phone)
        except Exception:
            raise ValueError("The entered number is not linked to a Telegram account.")
        await client.send_message(entity, message)
        await client.disconnect()
    
    try:
        async_to_sync(main)()
    except ValueError as ve:
        raise serializers.ValidationError(str(ve))
    except Exception as e:
        raise serializers.ValidationError("An error occurred while sending the message: " + str(e))