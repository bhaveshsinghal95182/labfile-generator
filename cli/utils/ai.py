import getpass
import os
import json
from typing import List
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
from pydantic import BaseModel, Field

def get_api_key():
    """
    Checks for the Google AI API key in environment variables or prompts the user for it.
    """
    load_dotenv()
    if "GOOGLE_API_KEY" not in os.environ or not os.environ.get("GOOGLE_API_KEY"):
        os.environ["GOOGLE_API_KEY"] = getpass.getpass("🔑 Enter your Google AI API key: ")
    return os.environ.get("GOOGLE_API_KEY")

def get_flash_llm():
    """
    Initializes and returns the ChatGoogleGenerativeAI model.
    """
    get_api_key()
    return ChatGoogleGenerativeAI(
        model="gemini-flash-latest",
        temperature=0.5,
        max_tokens=None,
        timeout=None,
        max_retries=2,
    )

def get_llm():
    """
    Initializes and returns the ChatGoogleGenerativeAI model.
    """
    get_api_key()
    return ChatGoogleGenerativeAI(
        model="gemini-2.5-pro",
        temperature=1,
        max_tokens=None,
        timeout=None,
        max_retries=2,
    )

def deduce_aims_from_text(text: str, system_instruction: str, subject_name: str):
    """
    Deduces experiment aims and numbers from a blob of text using the AI.
    Returns a JSON object with an array of aims.
    """
    # Define structured output models for experiments
    class ExperimentItem(BaseModel):
        number: int = Field(..., description="Experiment number")
        aim: str = Field(..., description="Aim of the experiment")

    class ExperimentsModel(BaseModel):
        experiments: List[ExperimentItem] = Field(..., description="List of experiments")

    # Try the structured output API first (preferred)
    try:
        llm = get_flash_llm()
        structured = llm.with_structured_output(ExperimentsModel, method="json_mode")

        prompt = (
            f"You are an AI assistant for the subject '{subject_name}'. {system_instruction or ''}\n\n"
            "Analyze the following text and extract a list of experiments. For each experiment return the number (integer) and a concise aim (string). "
            "Return the result strictly in the structured JSON format defined by the schema.\n\n"
            "Text:\n" + text
        )

        result = structured.invoke(prompt)
        if isinstance(result, ExperimentsModel):
            return result.model_dump()
        elif isinstance(result, dict):
            # If it's already a dict (less likely but possible), just return it.
            return result
        else:
            # Handle unexpected type
            print(f"[yellow]AI returned an unexpected type: {type(result)}. Falling back.[/yellow]")
            # Raise an exception to trigger the fallback logic
            raise TypeError("Unexpected type returned from structured output.")

    except Exception as e:
        # Fall back to generic (less-structured) approach if structured output is not available or fails
        print(f"[yellow]Structured extraction failed ({e}). Falling back to heuristic JSON parsing.[/yellow]")

    # --- Fallback: previous behavior that asks the model for JSON and parses it ---
    try:
        llm = get_flash_llm()
        messages = [
            (
                "system",
                f"You are an AI assistant for the subject '{subject_name}'. Your task is to analyze the provided text and extract the aims for each experiment. {system_instruction}. You must return a JSON object with a single key 'experiments' which is an array of objects, where each object has 'number' and 'aim' keys.",
            ),
            ("human", text),
        ]
        ai_msg = llm.invoke(messages)
        # Clean the response to ensure it's valid JSON
        cleaned_content = getattr(ai_msg, "content", "").strip().replace("```json", "").replace("```", "").strip()
        return json.loads(cleaned_content)
    except (json.JSONDecodeError, TypeError, Exception) as e:
        print(f"❌ Error decoding AI response in fallback: {e}")
        return None
