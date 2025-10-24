import getpass
import os
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI

# Load environment variables from a .env file in the project root (if present).
# This lets you store your API key in a .env file instead of entering it each run.
load_dotenv()

# Ensure GOOGLE_API_KEY is available; if not, prompt the user securely.
if "GOOGLE_API_KEY" not in os.environ or not os.environ.get("GOOGLE_API_KEY"):
    os.environ["GOOGLE_API_KEY"] = getpass.getpass("Enter your Google AI API key: ")


llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-pro",
    temperature=1,
    max_tokens=None,
    timeout=None,
    max_retries=2,
    # other params...
)

messages = [
    (
        "system",
        "You are a helpful assistant that translates English to French. Translate the user sentence.",
    ),
    ("human", "I love programming."),
]
ai_msg = llm.invoke(messages)
print(ai_msg.content)
