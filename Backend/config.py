# config.py
# This file reads your .env file and makes settings available everywhere
import os
from dotenv import load_dotenv

load_dotenv() # reads the .env file

class Settings:
    ANTHROPIC_API_KEY: str = os.getenv('ANTHROPIC_API_KEY', '')
    MODEL: str = os.getenv('MODEL', 'claude-sonnet-4-6')
    MAX_TOKENS: int = int(os.getenv('MAX_TOKENS', '4096'))
    MAX_DEBUG_LOOPS: int = int(os.getenv('MAX_DEBUG_LOOPS', '3'))

    def validate(self):
        if not self.ANTHROPIC_API_KEY:
            raise ValueError('ANTHROPIC_API_KEY is not set in .env file!')
        if not self.ANTHROPIC_API_KEY.startswith('sk-ant'):
            raise ValueError('ANTHROPIC_API_KEY looks wrong — check your .env')
        return True

settings = Settings()