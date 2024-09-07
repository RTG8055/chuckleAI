from fastapi import FastAPI
from openai import OpenAI
from api.utils.constants import OPENAI_API_KEY
from api.jokeSystem.openai_create_joke import generate_joke
from pydantic import BaseModel, Field
from typing import List

app = FastAPI()

class GenerateRequest(BaseModel):
    theme: str
    things: List[str]
    prompt: str
    num_jokes: int = Field(default=1, ge=1, le=5)

class GenerateResponse(BaseModel):
    jokes: List[str]

@app.post("/api/v1/generate", response_model=GenerateResponse)
def generate_jokes(request: GenerateRequest) -> GenerateResponse:
    # This is a placeholder. In a real application, you'd generate actual jokes here.
    jokes: List[str] = [f"Joke {i+1} about {request.theme}" for i in range(request.num_jokes)]
    
    return GenerateResponse(jokes=jokes)

@app.post("/api/createjoke")
def create_joke():
    client = OpenAI(api_key=OPENAI_API_KEY)
    joke_prompt = "Create a small punch line joke using 'spoon'."
    joke = generate_joke(client, joke_prompt)
    print("Joke: ", joke)