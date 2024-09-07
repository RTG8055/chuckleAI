from fastapi import FastAPI
from openai import OpenAI
from api.utils.constants import OPENAI_API_KEY
from api.jokeSystem.openai_create_joke import generate_joke

app = FastAPI()

@app.get("/api/python")
def hello_world():
    return {"message": "Hello World"}

@app.post("/api/createjoke")
def create_joke():
    client = OpenAI(api_key=OPENAI_API_KEY)
    joke_prompt = "Create a small punch line joke using 'spoon'."
    joke = generate_joke(client, joke_prompt)
    print("Joke: ", joke)