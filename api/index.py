from fastapi import FastAPI
from pydantic import BaseModel, Field
from typing import List

app = FastAPI()

class GenerateRequest(BaseModel):
    theme: str
    things: List[str]
    prompt: str
    num_jokes: int = Field(default=1, ge=1, le=5)

@app.post("/api/v1/generate")
def generate_jokes(request: GenerateRequest):
    return {
        "message": "Jokes generated",
        "theme": request.theme,
        "things": request.things,
        "prompt": request.prompt,
        "num_jokes": request.num_jokes
    }