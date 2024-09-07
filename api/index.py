from fastapi import FastAPI
from openai import OpenAI
import os
# from api.utils.constants import OPENAI_API_KEY
from api.jokeSystem.openai_create_joke import generate_joke
from pydantic import BaseModel, Field
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List

class Settings(BaseSettings):
    app_name: str = "Awesome API"
    admin_email: str
    items_per_user: int = 50
    model_config = SettingsConfigDict(env_file=".env")

settings = Settings()
app = FastAPI()

class GenerateRequest(BaseModel):
    theme: str
    things: List[str]
    prompt: str
    num_jokes: int = Field(default=1, ge=1, le=5)

class GenerateResponse(BaseModel):
    
    client = OpenAI(api_key= settings.model_config["OPENAI_API_KEY"])

    def create_joke(things: List[str]):
        joke_prompt = f"Create a small punch line joke using {','.join([thing for thing in things])} object."
        print("Joke Prompt: ", joke_prompt)
        joke = generate_joke(GenerateResponse.client, joke_prompt)
        print("Created Joke: ", joke)
        return joke
    

@app.post("/api/v1/generate", response_model=GenerateResponse)
def generate_jokes(request: GenerateRequest) -> GenerateResponse:
    things = []
    if request.things:
        things = request.things
    if things == [] or things is None:
        return GenerateResponse().create_joke(["spoon"])
    return GenerateResponse().create_joke(things)
