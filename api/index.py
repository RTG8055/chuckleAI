from fastapi import FastAPI
from openai import OpenAI
import os
# from api.utils.constants import OPENAI_API_KEY
from api.jokeSystem.openai_create_joke import create_joke
from pydantic import BaseModel, Field
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List

class Settings(BaseSettings):
    openai_api_key: str 
    deepgram_api_key: str
    model_config = SettingsConfigDict(env_file=".env")

settings = Settings()
app = FastAPI()

class GenerateRequest(BaseModel):
    theme: str
    things: List[str]
    prompt: str
    num_jokes: int = Field(default=1, ge=1, le=5)

class GenerateResponse(BaseModel):
    jokes : str
    

@app.post("/api/v1/generate", response_model=GenerateResponse)
def generate_jokes(request: GenerateRequest) -> GenerateResponse:
    print("Request: ", request)
    return GenerateResponse(jokes=create_joke(request.things, settings.openai_api_key))
