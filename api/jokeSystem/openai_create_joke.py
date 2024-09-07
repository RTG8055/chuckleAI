from openai import OpenAI
import os
from api.utils.constants import constants

# Set your OpenAI API key here or using an environment variable
#os.getenv("OPENAI_API_KEY")  # Alternatively, replace with your API key

# Function to generate a joke using GPT-4
def generate_joke(client: OpenAI,prompt: str, max_tokens=100):
    try:
        response =  client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a comic that creates small 2 sentence punchline jokes on useless objects like in a home/office."},
                {"role": "user", "content": prompt}
            ],
            # temperature=0.7,  # Creativity setting
        )
        print(response)
        joke = response.choices[0].message.content.strip()
        # joke = response['choices'][0]['message']['content'].strip()
        return joke
    
    except Exception as e:
        return f"Error generating joke: {str(e)}"

# Example usage
if __name__ == "__main__":
    client = OpenAI(api_key=constants.OPENAI_API_KEY)

    joke_prompt = "Create a small punch line joke using 'spoon'."
    joke = generate_joke(client, joke_prompt)
    print("Joke: ", joke)
